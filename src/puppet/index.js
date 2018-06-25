const puppeteer = require('puppeteer')
const login = require('./login')
const SELECTORS = require('./selectors')

const loadCookies = (page, cookies) => {
    if (! cookies.length) {
        throw new Error(`empty cookies file: ${FILES.COOKIES}`)
    }
    return Promise.all(cookies.map(cookie => page.setCookie(cookie)))
}

const saveCookies = async (page) => {
    const cookies = await page.cookies()

    /*    return new Promise((accept, reject) => fs.writeFile(
       FILES.COOKIES, JSON.stringify(cookies, null, 2),
       err => err ? reject(err) : accept()))*/
}

module.exports = async (config) => {
    const browserFetcher = puppeteer.createBrowserFetcher();
    const localChromiums = await browserFetcher.localRevisions();

    if(!localChromiums.length) return console.error('Can\'t find installed Chromium');

    const { executablePath } = await browserFetcher.revisionInfo(localChromiums[0]);

    console.error('path', executablePath)

    const browser = await puppeteer.launch({
        executablePath: '/usr/lib/chromium/chromium',
        headless: false
    });

    const pages = await browser.pages();
    const page = pages.pop()

    //    page.setViewport({isMobile: true, hasTouch: true, width: 400, height: 1200})

    try {
        return loadCookies(page)
    } catch (e) {
        console.error(e)
    }

    Promise.race([
        login(page, config),
        page.waitForSelector(SELECTORS.MAIN.HAMBURGER)
    ]).then(saveCookies.bind(null, page))

    //    await browser.close();
}
