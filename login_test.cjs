const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    console.log('Navigating to login...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });

    console.log('Typing credentials...');
    await page.type('input[type="email"]', '24r11a0535@gcet.edu.in');
    await page.type('input[type="password"]', 'password'); // Assuming default password

    console.log('Clicking login...');
    await page.keyboard.press('Enter');

    console.log('Waiting for login redirect...');
    // Wait up to 5 seconds for navigation
    await new Promise(r => setTimeout(r, 5000));

    console.log('Going to admin...');
    await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle2' });

    console.log('Waiting a bit on admin...');
    await new Promise(r => setTimeout(r, 3000));

    await browser.close();
    console.log('Done.');
})();
