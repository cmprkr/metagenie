const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const startTime = Date.now();
const domain = "https://cryptogmail.com/";
const screenshotpath = "screenshot.png";

const password = "Hq7Un34e";

let emailAddress;
let fullname;
let username;

async function runtime(title) {
	var endTime = Date.now();
	var runtime = endTime - startTime;
	console.log(`${title} runtime: ${runtime}ms`);
}

async function load() {
	const browser = await puppeteer.launch({
		headless: false,
		args: ["--incognito"],
	});
	const page = await browser.newPage();

	await page.setUserAgent(
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36"
		);

	await page.goto(domain);
	runtime("load");

	await page.screenshot({ path: screenshotpath, fullPage: true });

	emailAddress = await page.$eval(".js-email", (div) =>
		div.textContent.trim()
		);
	runtime("gather address");

	const namePage = await browser.newPage();
	await namePage.goto("https://www.behindthename.com/random/random.php?gender=u&number=2&sets=1&surname=&norare=yes&nodiminutives=yes&usage_eng=1");

	fullname = await namePage.$eval(".random-results", (div) =>
		div.textContent.trim().replace(/\s+/g, " ")
		);
	runtime("gather name");

	const usernamePage = await browser.newPage();
	await usernamePage.goto("https://instausername.com/");

	await usernamePage.waitForSelector('input[id="IGU_name"]');
	await usernamePage.focus('input[id="IGU_name"]');
	await usernamePage.keyboard.type(fullname);
	await usernamePage.click('input[type="submit"]');
	await usernamePage.waitForTimeout(50);

	username = await usernamePage.$eval(
		`li:nth-child(9) a[href*="/availability"]`,
		(a) => a.textContent.trim()
		);

	runtime("gather username");

	const instagramPage = await browser.newPage();
	await instagramPage.goto("https://www.instagram.com/");


	await instagramPage.waitForSelector('a[href="/accounts/emailsignup/"]');
	await instagramPage.click('a[href="/accounts/emailsignup/"]');


	await instagramPage.waitForSelector('input[name="emailOrPhone"]');
	await instagramPage.focus('input[name="emailOrPhone"]');
	await instagramPage.keyboard.type(emailAddress);

	await instagramPage.waitForSelector('input[name="fullName"]');
	await instagramPage.focus('input[name="fullName"]');
	await instagramPage.keyboard.type(fullname);

	await instagramPage.waitForSelector('input[name="username"]');
	await instagramPage.focus('input[name="username"]');
	await instagramPage.keyboard.type(username);

	await instagramPage.waitForSelector('input[name="password"]');
	await instagramPage.focus('input[name="password"]');
	await instagramPage.keyboard.type(password);
	await instagramPage.waitForTimeout(100);

	await instagramPage.waitForSelector('button[type="submit"]');
	await instagramPage.click('button[type="submit"]');

	runtime("basic info");

	await instagramPage.waitForSelector('select[title="Month:"]');
	await instagramPage.click('select[title="Month:"]');
	await instagramPage.keyboard.type("February");

	await instagramPage.waitForSelector('select[title="Day:"]');
	await instagramPage.click('select[title="Day:"]');
	await instagramPage.keyboard.type("2");

	await instagramPage.waitForSelector('select[title="Year:"]');
	await instagramPage.click('select[title="Year:"]');
	await instagramPage.keyboard.type("2000");
	await instagramPage.keyboard.press("Enter")

	await instagramPage.keyboard.press('Tab');
	await instagramPage.keyboard.press('Space');

	runtime("birthday");

	runtime("signup");


	await instagramPage.waitForTimeout(1000000);
	await page.bringToFront();

	const subjectElement = await page.waitForSelector('.subject--text');
	const subjectText = await page.evaluate(subjectElement => subjectElement.textContent, subjectElement);
	const codeMatch = subjectText.match(/\d{6}/);
	const code = codeMatch ? codeMatch[0] : null;
	console.log(code);

	//await browser.close();

	runtime("final");
}

async function start() {
	console.log("\nRUNTIME--")
	await load()
	console.log("\nDATA--")
	console.log(emailAddress)
	console.log(fullname)
	console.log(username)
	console.log(password)
}

start();