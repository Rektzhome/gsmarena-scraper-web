const playwright = require('playwright');



const { chromium } = require("playwright");

async function scrapeGsmarena(query) {
    let browser = null;
    console.log(`Starting scrape for query: ${query}`);
    try {
        // Launch Playwright browser
        // Note: Vercel might require specific buildpacks or configurations for Playwright.
        // Using chromium.launch() directly might work on some plans or require adjustments.
        // Consider using community packages like @sparticuz/chromium if issues arise on Vercel.
        browser = await chromium.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"] // Common args for server environments
        });
        const context = await browser.newContext({
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" // Set a common user agent
        });
        const page = await context.newPage();

        // --- Search for the phone ---
        const searchUrl = `https://www.gsmarena.com/res.php3?sSearch=${encodeURIComponent(query)}`;
        console.log(`Navigating to search URL: ${searchUrl}`);
        await page.goto(searchUrl, { waitUntil: "load", timeout: 60000 });

        // Wait for the search results container and find the first result link
        console.log("Waiting for search results...");
        try {
            await page.waitForSelector("#review-body div.makers ul li a", { timeout: 15000 }); // Updated selector based on potential site changes
        } catch (err) {
             console.log("Could not find primary search result selector, trying alternative...");
             // Fallback or alternative selector if the primary one fails
             await page.waitForSelector(".general-menu.search ul li a", { timeout: 10000 });
        }


        console.log("Extracting first search result link...");
        const firstResult = await page.evaluate(() => {
            // Try multiple selectors
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
            console.log(`No phone found or link extraction failed for query: ${query}`);
            await browser.close();
            return { error: `No phone found or link extraction failed for query: ${query}` };
        }

        console.log(`Found first result: ${firstResult.title} - ${firstResult.link}`);

        // --- Get phone details ---
        console.log(`Navigating to phone details page: ${firstResult.link}`);
        await page.goto(firstResult.link, { waitUntil: "load", timeout: 60000 });

        // Wait for the specs list to be present
        console.log("Waiting for specs list...");
        await page.waitForSelector("#specs-list", { timeout: 10000 });

        // Extract details using page.evaluate
        console.log("Extracting phone details...");
        const phoneDetails = await page.evaluate(() => {
            const specs = {};

            // Extract phone name
            const phoneNameElement = document.querySelector("h1.specs-phone-name-title");
            if (phoneNameElement) {
                specs["Phone Name"] = phoneNameElement.innerText.trim();
            }

            // Extract image URL
            const imageElement = document.querySelector(".specs-photo-main a img");
            if (imageElement) {
                specs["Image URL"] = imageElement.src;
            }

            // Extract specs from tables
            const tables = document.querySelectorAll("#specs-list table");
            tables.forEach(table => {
                const categoryElement = table.querySelector("th");
                if (!categoryElement) return;
                const category = categoryElement.innerText.trim();
                if (!category) return;

                specs[category] = {};
                const rows = table.querySelectorAll("tr");
                rows.forEach(tr => {
                    const keyElement = tr.querySelector("td.ttl"); // Corrected selector
                    const valueElement = tr.querySelector("td.nfo"); // Corrected selector
                    if (keyElement && valueElement) {
                        // Clean up key and value text
                        const key = keyElement.innerText.trim().replace(/\s+/g, ' ');
                        let value = valueElement.innerText.trim().replace(/\s+/g, ' ');
                        // Handle potential multi-line values or elements within .nfo
                        const valueLinks = valueElement.querySelectorAll('a');
                        if (valueLinks.length > 0) {
                           value = Array.from(valueLinks).map(a => a.innerText.trim()).join(', ');
                        } else if (valueElement.querySelector('br')) {
                           value = valueElement.innerHTML.split('<br>').map(line => line.replace(/<[^>]*>/g, '').trim()).filter(line => line).join('; ');
                        }

                        if (key && value) {
                            specs[category][key] = value;
                        }
                    }
                });
                // Remove empty categories
                if (Object.keys(specs[category]).length === 0) {
                    delete specs[category];
                }
            });

            return specs;
        });

        console.log("Scraping successful.");
        await browser.close();
        return phoneDetails;

    } catch (error) {
        console.error(`Playwright scraping error: ${error}`);
        if (browser) {
            await browser.close();
        }
        // Return a structured error
        return { error: `Scraping failed: ${error.message}` };
    } 
}

// Export the function for use in other modules (like an Express route)
module.exports = { scrapeGsmarena };

// Example usage (optional, for testing directly)
/*
async function main() {
    const query = "Xiaomi Redmi 9";
    const details = await scrapeGsmarena(query);
    console.log("\n--- Results ---");
    console.log(JSON.stringify(details, null, 2));
}

if (require.main === module) {
    main();
}
*/

