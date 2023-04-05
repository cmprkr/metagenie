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
let error = 0;

let lastEndTime = startTime;

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let numrep = null;

const askUser = () => {
  rl.question('Number of iterations: ', (userInput) => {
    const inputAsNumber = parseInt(userInput);

    if (isNaN(inputAsNumber) || inputAsNumber < 1 || inputAsNumber > 50) {
      console.log('Please enter a valid number between 1 and 50');
      askUser();
    } else {
      numrep = inputAsNumber;
      rl.close();
      start(numrep);
    }
  });
};

askUser();

async function runtime(title) {
  const endTime = Date.now();
  const runtime = endTime - lastEndTime;
  const totalRuntime = endTime - startTime;
  console.log(`${title} runtime: ${runtime}ms (${totalRuntime}ms)`);
  lastEndTime = endTime;
}

async function load() {

	const browser1 = await puppeteer.launch({
		headless: false,
		args: ["--incognito"],
	});

	const browser2 = await puppeteer.launch({ 
	    headless: false,
	    args: ["--incognito"],
	});

	const page = await browser1.newPage();
	const page2 = await browser2.newPage();

	await page.setUserAgent(
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36"
		);

	await page.goto(emaildomain);
	runtime("load");

	await page2.setUserAgent(
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36"
		);

	await page2.goto(emaildomain);
	runtime("load 2");

	//await page.screenshot({ path: screenshotpath, fullPage: true });

	emailAddress = await page.$eval("#email-widget", (span) =>
		span.textContent.trim()
		);
	runtime("gather address");

	const namePage = await browser1.newPage();
	await namePage.goto(namedomain);

	fullname = await namePage.$eval(".random-results", (div) =>
		div.textContent.trim().replace(/\s+/g, " ")
		);
	runtime("gather name");

	const usernamePage = await browser1.newPage();
	await usernamePage.goto(usernamedomain);

	await usernamePage.waitForSelector('input[id="IGU_name"]');
	await usernamePage.focus('input[id="IGU_name"]');
	await usernamePage.keyboard.type(fullname);
	
	await usernamePage.keyboard.press("Enter")
	await usernamePage.waitForTimeout(1500);
	await usernamePage.waitForTimeout(50);

	username = await usernamePage.$eval(
		`li:nth-child(9) a[href*="/availability"]`,
		(a) => a.textContent.trim()
		);

	runtime("gather username");

	const instagramPage = await browser1.newPage();
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

	// SWITCH TO BROWSER 2

	await page2.bringToFront();

	emailAddress2 = await page2.$eval("#email-widget", (span) =>
		span.textContent.trim()
		);
	runtime("gather address 2");

	const namePage2 = await browser2.newPage();
	await namePage2.goto(namedomain);

	fullname2 = await namePage2.$eval(".random-results", (div) =>
		div.textContent.trim().replace(/\s+/g, " ")
		);
	runtime("gather name 2");

	const usernamePage2 = await browser2.newPage();
	await usernamePage2.goto(usernamedomain);

	await usernamePage2.waitForSelector('input[id="IGU_name"]');
	await usernamePage2.focus('input[id="IGU_name"]');
	await usernamePage2.keyboard.type(fullname);
	
	await usernamePage2.keyboard.press("Enter")
	await usernamePage2.waitForTimeout(1500);
	await usernamePage2.waitForTimeout(50);

	username2 = await usernamePage2.$eval(
		`li:nth-child(9) a[href*="/availability"]`,
		(a) => a.textContent.trim()
		);

	runtime("gather username 2");

	const instagramPage2 = await browser2.newPage();
	await instagramPage2.goto(instagramdomain);

	await instagramPage2.waitForSelector('a[href="/accounts/emailsignup/"]');
	await instagramPage2.click('a[href="/accounts/emailsignup/"]');


	await instagramPage2.waitForSelector('input[name="emailOrPhone"]');
	await instagramPage2.focus('input[name="emailOrPhone"]');
	await instagramPage2.keyboard.type(emailAddress2);

	await instagramPage2.waitForSelector('input[name="fullName"]');
	await instagramPage2.focus('input[name="fullName"]');
	await instagramPage2.keyboard.type(fullname2);

	await instagramPage2.waitForSelector('input[name="username"]');
	await instagramPage2.focus('input[name="username"]');
	await instagramPage2.keyboard.type(username2);

	await instagramPage2.waitForSelector('input[name="password"]');
	await instagramPage2.focus('input[name="password"]');
	await instagramPage2.keyboard.type(password);
	await instagramPage2.waitForTimeout(100);

	await instagramPage2.waitForSelector('button[type="submit"]');
	await instagramPage2.click('button[type="submit"]');

	runtime("basic info 2");

	await instagramPage2.waitForSelector('select[title="Month:"]');
	await instagramPage2.click('select[title="Month:"]');
	await instagramPage2.keyboard.type("February");

	await instagramPage2.waitForSelector('select[title="Day:"]');
	await instagramPage2.click('select[title="Day:"]');
	await instagramPage2.keyboard.type("2");

	await instagramPage2.waitForSelector('select[title="Year:"]');
	await instagramPage2.click('select[title="Year:"]');
	await instagramPage2.keyboard.type("2000");
	await instagramPage2.keyboard.press("Enter")

	await instagramPage2.keyboard.press('Tab');
	await instagramPage2.keyboard.press('Space');

	runtime("birthday 2");

	// SWITCH TO BROWSER 1

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

	await instagramPage.bringToFront();
	await instagramPage.waitForSelector('input[name="email_confirmation_code"]');
	await instagramPage.focus('input[name="email_confirmation_code"]');
	await instagramPage.keyboard.type(instagramCode);
	await instagramPage.keyboard.press("Enter")

	runtime("signup");

	// SWITCH TO BROWSER 2

	await page2.bringToFront();

	console.log("\nEMAILSTATUS--")
	const tickDiv2 = await page2.$('#tick');

	let k = 0;
	while (k < 1) {

	  	const tickDiv2 = await page2.$('#tick');
	  	let innerHTML2 = await page2.evaluate(div => div.innerHTML, tickDiv2);

	  	if (innerHTML2 === '<img src="/img/checking-mail.gif" align="top" border="0" alt="Hold on...">Checking...') {
	  		console.log("Done.");

	  		const senderElement = await page2.$('.td2');
			const sender = await page2.evaluate(element => element.innerHTML.trim(), senderElement);
	  		if (sender === 'no-reply@mail.instagram.com') {
	  			k = 1;
	  		}

	  	} else if (innerHTML2 === "Done.") {
	  		console.log(innerHTML2);

	  		const senderElement = await page2.$('.td2');
			const sender = await page2.evaluate(element => element.innerHTML.trim(), senderElement);
	  		if (sender === 'no-reply@mail.instagram.com') {
	  			k = 1;
	  		}

	  	} else {
	  		console.log(innerHTML2);
	  	}

	  	await page2.waitForTimeout(1000);

	}

	instagramCode2 = await page2.evaluate(() => {
        const emailRows = Array.from(document.querySelectorAll('#email_list tr'));
        for (const row of emailRows) {
            const sender = row.querySelector('.td2').innerText;
            if (sender === 'no-reply@mail.instagram.com') {
                const content = row.querySelector('.td3').innerText;
                const codeMatch2 = content.match(/\d{6}/);
                if (codeMatch2) {
                    return codeMatch2[0];
                }
            }
        }
        return null;
    });

	console.log("\nRUNTIME--")

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

	await instagramPage2.bringToFront();
	await instagramPage2.waitForSelector('input[name="email_confirmation_code"]');
	await instagramPage2.focus('input[name="email_confirmation_code"]');
	await instagramPage2.keyboard.type(instagramCode2);
	await instagramPage2.keyboard.press("Enter")

	runtime("signup 2");

	// SWITCH TO BROWSER 1

	await instagramPage.bringToFront();

	await instagramPage.waitForTimeout(1000);
	while (instagramPage.url().includes('instagram.com/accounts/emailsignup')) {
	    await instagramPage.waitForNavigation({ waitUntil: 'networkidle0' });
	}

	if (instagramPage.url().includes('suspended')) {

	  	const accountsuspended = { username, status: "active, suspended" };
	  	await appendToCSV("accounts.csv", accountsuspended);

	} else {

	  	const accountcreated = { username, status: "active, live" };
	  	await appendToCSV("accounts.csv", accountcreated);

	  	await instagramPage.keyboard.press("Tab")
	  	await instagramPage.keyboard.press("Enter")
	}

	await browser1.close();

	// SWITCH TO BROWSER 2

	await instagramPage2.bringToFront();

	await instagramPage2.waitForTimeout(1000);
	while (instagramPage2.url().includes('instagram.com/accounts/emailsignup')) {
	    await instagramPage2.waitForNavigation({ waitUntil: 'networkidle0' });
	}

	if (instagramPage2.url().includes('suspended')) {

	  	const accountsuspended = { username2, status: "active, suspended" };
	  	await appendToCSV("accounts.csv", accountsuspended);

	} else {

	  	const accountcreated = { username2, status: "active, live" };
	  	await appendToCSV("accounts.csv", accountcreated);

	  	await instagramPage2.keyboard.press("Tab")
	  	await instagramPage2.keyboard.press("Enter")
	}

	await browser2.close();

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
		console.log("\nDATA--")
		console.log(emailAddress2)
		console.log(fullname2)
		console.log(username2)
		console.log(password)

		i++
	}
}

start(numrep);