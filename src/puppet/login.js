const fs = require('fs')

const SELECTORS = require('./selectors')

const handleLoginGuard = async (page) => {
    const url = await page.url()
    let promises = []

    promises.push(page.waitForSelector(SELECTORS.LOGIN_GUARD.ACCEPT)
                      .then(button => button.click()))
    promises.push(page.waitForSelector(SELECTORS.MAIN.BLUE_BAR))
    return Promise.race(promises)
}

const fillPassword = async (config, page, passwordField) => {
    await passwordField.type(config.password)
    await page.tap(SELECTORS.LOGIN.BUTTON)
}

const webLogin = async(page, argConfig) => {
    const config = Object.assign({country: 'argentina', url: 'https://web.telegram.org'}, argConfig)
    console.error('config', config)
    await page.goto(config.url);

    await page.waitForSelector(SELECTORS.LOGIN.COUNTRY)
    await page.tap(SELECTORS.LOGIN.COUNTRY)
    await page.type(SELECTORS.LOGIN.COUNTRY_SEARCH, config.country)
    await page.tap(SELECTORS.LOGIN.COUNTRY_ITEM)
    await page.tap(SELECTORS.LOGIN.PHONE)
    await page.type(SELECTORS.LOGIN.PHONE, config.phone.replace(/^\+[0-9][0-9]/, ''))
    await page.tap(SELECTORS.LOGIN.NEXT)
    await page.tap(SELECTORS.BTN_PRIMARY)

    return page.waitForSelector(SELECTORS.MAIN.HAMBURGER)}

module.exports = webLogin
