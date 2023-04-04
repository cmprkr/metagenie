const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const startTime = Date.now();
const emaildomain = "https://www.guerrillamail.com/#";
const namedomain = "https://www.behindthename.com/random/random.php?gender=u&number=2&sets=1&surname=&norare=yes&nodiminutives=yes&usage_eng=1"
const instagramdomain = "https://www.instagram.com/";
const usernamedomain = "https://instausername.com/";
const screenshotpath = "screenshot.png";

const password = "Hq7Un34e";

let emailAddress;
let fullname;
let username;
let instagramCode;

let lastEndTime = startTime;

async function runtime(title) {
  const endTime = Date.now();
  const runtime = endTime - lastEndTime;
  const totalRuntime = endTime - startTime;
  console.log(`${title} runtime: ${runtime}ms (${totalRuntime}ms)`);
  lastEndTime = endTime;
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

	await page.goto(emaildomain);
	runtime("load");

	await page.screenshot({ path: screenshotpath, fullPage: true });

	emailAddress = await page.$eval("#email-widget", (span) =>
		span.textContent.trim()
		);
	runtime("gather address");

	const namePage = await browser.newPage();
	await namePage.goto(namedomain);

	fullname = await namePage.$eval(".random-results", (div) =>
		div.textContent.trim().replace(/\s+/g, " ")
		);
	runtime("gather name");

	const usernamePage = await browser.newPage();
	await usernamePage.goto(usernamedomain);

	await usernamePage.waitForSelector('input[id="IGU_name"]');
	await usernamePage.focus('input[id="IGU_name"]');
	await usernamePage.keyboard.type(fullname);
	//await usernamePage.waitForTimeout(2000);
	
	await usernamePage.keyboard.press("Enter")
	await usernamePage.waitForTimeout(1500);
	await usernamePage.waitForTimeout(50);

	username = await usernamePage.$eval(
		`li:nth-child(9) a[href*="/availability"]`,
		(a) => a.textContent.trim()
		);

	runtime("gather username");

	//username = "jlsakdjfhalsdgfakdjyfgalk"

	const instagramPage = await browser.newPage();
	await instagramPage.goto(instagramdomain);


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

	await page.bringToFront();

	console.log("\nEMAILSTATUS--")
	const tickDiv = await page.$('#tick');

	let i = 0;
	while (i < 1) {

	  	const tickDiv = await page.$('#tick');
	  	let innerHTML = await page.evaluate(div => div.innerHTML, tickDiv);

	  	if (innerHTML === '<img src="/img/checking-mail.gif" align="top" border="0" alt="Hold on...">Checking...') {
	  		console.log("Done.");

	  		const senderElement = await page.$('.td2');
			const sender = await page.evaluate(element => element.innerHTML.trim(), senderElement);
	  		if (sender === 'no-reply@mail.instagram.com') {
	  			i = 1;
	  		}

	  	} else if (innerHTML === "Done.") {
	  		console.log(innerHTML);

	  		const senderElement = await page.$('.td2');
			const sender = await page.evaluate(element => element.innerHTML.trim(), senderElement);
	  		if (sender === 'no-reply@mail.instagram.com') {
	  			i = 1;
	  		}

	  	} else {
	  		console.log(innerHTML);
	  	}

	  	await page.waitForTimeout(1000);

	}

	instagramCode = await page.evaluate(() => {
        const emailRows = Array.from(document.querySelectorAll('#email_list tr'));
        for (const row of emailRows) {
            const sender = row.querySelector('.td2').innerText;
            if (sender === 'no-reply@mail.instagram.com') {
                const content = row.querySelector('.td3').innerText;
                const codeMatch = content.match(/\d{6}/);
                if (codeMatch) {
                    return codeMatch[0];
                }
            }
        }
        return null;
    });

	console.log("\nRUNTIME--")
	runtime("signup");

	async function appendToCSV(filename, data) {

	  	const csvString = `${data.username},"${data.status}"\n`;
	  	try {
	    	await fs.access(filename, fs.constants.F_OK);
	  	} catch (err) {
	    	// File doesn't exist yet, so add header row
	    	await fs.writeFile(filename, "username,status\n");
	  	}
	  	await fs.appendFile(filename, csvString);
	}

	// TODO: Append account to CSV file
	const account = { username, status: "active, suspended" };
	await appendToCSV("accounts.csv", account);

	await instagramPage.bringToFront();
	await instagramPage.waitForSelector('input[name="email_confirmation_code"]');
	await instagramPage.focus('input[name="email_confirmation_code"]');
	await instagramPage.keyboard.type(instagramCode);
	await instagramPage.keyboard.press("Enter")

	await instagramPage.waitForTimeout(1000);
	await browser.close();

	runtime("final");
}

async function start(number) {

	let i = 0;
	while (i < number) {
		console.log("\nRUNTIME--")
		await load()
		console.log("\nDATA--")
		console.log(emailAddress)
		console.log(fullname)
		console.log(username)
		console.log(password)

		i++
	}
}

start(1);