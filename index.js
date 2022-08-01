const puppeteer = require('puppeteer')
const fs = require('fs/promises')
const cron =  require('node-cron')


async function start(){
    const browser = await puppeteer.launch()

    const page = await browser.newPage()

    await page.goto("https://learnwebcode.github.io/practice-requests/")
    // await page.screenshot({path:"screenshotPage.png" , fullPage:true})

    const webdata = await page.evaluate(()=>{
       return Array.from(document.querySelectorAll("body  section.our-products.section-pad.bg-color.py-xl-5 div  div.row.mt-3  div  div  div  p")).map(x=>x.textContent)
    })
    await fs.writeFile("data/data.txt", webdata.join("\r\n"))

    await page.click("#clickme")
    const clickedData = await page.$eval("#data",el=>el.textContent)
    console.log(clickedData)


    await page.type("#ourfield","blue")
    await Promise.all([
        page.click("#ourform  button"),
        page.waitForNavigation()
    ])
    const info = await page.$eval("#message",el =>el.textContent)
    console.log("Secret Data : ",info)




    const photos = await page.$$eval("img",imgs=>{
        return imgs.map(x=>x.src)
    })
    for(const photo of photos){
        if(photo){
            const imagePage = await page.goto(photo)
            await fs.writeFile("images/"+photo.split("/").pop(),await imagePage.buffer())
        }else{
            console.log("error")
        }
       
    }

    await browser.close()
}

start()
// setInterval(start,5000)
// cron.schedule("*/5*****",start)