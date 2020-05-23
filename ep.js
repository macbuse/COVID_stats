const puppeteer = require('puppeteer');
const fs = require('fs');


//This isn't mine I probably got autoscroll here
//https://stackoverflow.com/questions/51529332/puppeteer-scroll-down-until-you-cant-anymore
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}


(async () => {
    
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('https://www.euromomo.eu/graphs-and-maps#z-scores-by-country');
    
  //scroll through everything - this is more superstition than science
  await autoScroll(page);
    
  
    
  //I should really loop over the children of some element 
  //but I couldn't get it to work :(
    
  var cc = '#z-scores-by-country > div.Section-module--right--2U45R.grid-module--column6--1SiC8 > div.shared-module--graphsContainer--1k359 > div:nth-child('
  
  var graph_cont = ''

  for (var i = 1; i < 25; i++) {   
      
      graph_cont =  cc + i + ')'
      console.log('Fetching ' + i);
      
      //funny they look the same don't they
      //https://stackoverflow.com/questions/55664420/page-evaluate-vs-puppeteer-methods/55665084
      
      //scroll to see the element
      await page.$eval(graph_cont, (el) => el.scrollIntoView())
      //get the html
      let svg = await page.evaluate((id) => document.querySelector(id).innerHTML, graph_cont);
      //write to a file
      fs.writeFileSync('./graph'+ i + '.html', svg);
      
    }
    
  browser.close();
})();
