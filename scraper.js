const chromium = require("@sparticuz/chromium");
const playwright = require("playwright-core"); // Use playwright-core

async function scrapeGsmarena(query) {
    let browser = null;
    console.log(`[Scraper] Starting scrape for query: ${query}`);
    try {
        console.log("[Scraper] Getting Chromium executable path...");
        const executablePath = await chromium.executablePath();
        console.log(`[Scraper] Chromium executable path: ${executablePath}`);

        if (!executablePath) {
            throw new Error("Chromium executable path could not be determined.");
        }

        console.log("[Scraper] Launching Playwright browser...");
        browser = await playwright.chromium.launch({
            args: chromium.args,
            executablePath: executablePath,
            headless: true, // Ensure this is a boolean
            timeout: 60000 // Add a launch timeout
        });
        console.log("[Scraper] Browser launched successfully.");

        console.log("[Scraper] Creating new browser context...");
        const context = await browser.newContext({
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        });
        console.log("[Scraper] Browser context created.");

        console.log("[Scraper] Creating new page...");
        const page = await context.newPage();
        console.log("[Scraper] New page created.");

        // --- Search for the phone ---
        const searchUrl = `https://www.gsmarena.com/res.php3?sSearch=${encodeURIComponent(query)}`;
        console.log(`[Scraper] Navigating to search URL: ${searchUrl}`);
        await page.goto(searchUrl, { waitUntil: "load", timeout: 90000 });
        console.log("[Scraper] Navigation to search URL complete.");

        // Wait for the search results container and find the first result link
        console.log("[Scraper] Waiting for search results...");
        try {
            await page.waitForSelector("#review-body div.makers ul li a", { timeout: 20000 });
            console.log("[Scraper] Primary search result selector found.");
        } catch (err) {
             console.log("[Scraper] Could not find primary search result selector, trying alternative...");
             await page.waitForSelector(".general-menu.search ul li a", { timeout: 15000 });
             console.log("[Scraper] Alternative search result selector found.");
        }

        console.log("[Scraper] Extracting first search result link...");
        const firstResult = await page.evaluate(() => {
            let firstLink = document.querySelector("#review-body div.makers ul li a");
            if (!firstLink) {
                 firstLink = document.querySelector(".general-menu.search ul li a");
            }
            if (!firstLink) return null;
            return {
                title: firstLink.innerText.trim().replace(/\s+/g, ' '),
                link: firstLink.href
            };
        });

        if (!firstResult || !firstResult.link) {
            console.log(`[Scraper] No phone found or link extraction failed for query: ${query}`);
            await browser.close();
            return { error: `No phone found or link extraction failed for query: ${query}` };
        }
        console.log(`[Scraper] Found first result: ${firstResult.title} - ${firstResult.link}`);

        // --- Get phone details ---
        console.log(`[Scraper] Navigating to phone details page: ${firstResult.link}`);
        await page.goto(firstResult.link, { waitUntil: "load", timeout: 90000 });
        console.log("[Scraper] Navigation to details page complete.");

        console.log("[Scraper] Waiting for specs list...");
        await page.waitForSelector("#specs-list", { timeout: 15000 });
        console.log("[Scraper] Specs list found.");

        console.log("[Scraper] Extracting phone details...");
        const phoneDetails = await page.evaluate(() => {
            const specs = {};
            const phoneNameElement = document.querySelector("h1.specs-phone-name-title");
            if (phoneNameElement) specs["Phone Name"] = phoneNameElement.innerText.trim();
            const imageElement = document.querySelector(".specs-photo-main a img");
            if (imageElement) specs["Image URL"] = imageElement.src;
            const tables = document.querySelectorAll("#specs-list table");
            tables.forEach(table => {
                const categoryElement = table.querySelector("th");
                if (!categoryElement) return;
                const category = categoryElement.innerText.trim();
                if (!category) return;
                specs[category] = {};
                const rows = table.querySelectorAll("tr");
                rows.forEach(tr => {
                    const keyElement = tr.querySelector("td.ttl");
                    const valueElement = tr.querySelector("td.nfo");
                    if (keyElement && valueElement) {
                        const key = keyElement.innerText.trim().replace(/\s+/g, ' ');
                        let value = valueElement.innerText.trim().replace(/\s+/g, ' ');
                        const valueLinks = valueElement.querySelectorAll('a');
                        if (valueLinks.length > 0) {
                           value = Array.from(valueLinks).map(a => a.innerText.trim()).join(', ');
                        } else if (valueElement.querySelector('br')) {
                           value = valueElement.innerHTML.split('<br>').map(line => line.replace(/<[^>]*>/g, '').trim()).filter(line => line).join('; ');
                        }
                        if (key && value) specs[category][key] = value;
                    }
                });
                if (Object.keys(specs[category]).length === 0) delete specs[category];
            });
            return specs;
        });
        console.log("[Scraper] Details extraction complete.");

        console.log("[Scraper] Closing browser...");
        await browser.close();
        console.log("[Scraper] Browser closed. Scraping successful.");
        return phoneDetails;

    } catch (error) {
        console.error(`[Scraper] Playwright scraping error: ${error}`);
        console.error(`[Scraper] Error stack: ${error.stack}`); // Log the full stack trace
        if (browser) {
            try {
                console.log("[Scraper] Attempting to close browser after error...");
                await browser.close();
                console.log("[Scraper] Browser closed after error.");
            } catch (closeError) {
                console.error("[Scraper] Error closing browser after failure:", closeError);
            }
        }
        return { error: `Scraping failed: ${error.message}` };
    } 
}

module.exports = { scrapeGsmarena };

