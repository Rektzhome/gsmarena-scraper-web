#!/usr/bin/env node

const axios = require("axios");
const cheerio = require("cheerio");

// --- Configuration ---
const CRAWLBASE_API_TOKEN = "JVQkq9LLyulShydkElsbSQ"; // Replace with your actual token if different
const CRAWLBASE_API_URL = "https://api.crawlbase.com/";
const GSMARENA_BASE_URL = "https://www.gsmarena.com/";

// --- Helper Functions ---
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchViaCrawlbase(targetUrl, retries = 3, delayMs = 1000) {
  const fullTargetUrl = targetUrl.startsWith("http") ? targetUrl : `${GSMARENA_BASE_URL}${targetUrl}`;
  const crawlbaseUrl = `${CRAWLBASE_API_URL}?token=${CRAWLBASE_API_TOKEN}&url=${encodeURIComponent(fullTargetUrl)}`;
  console.log(`[Crawlbase] Fetching: ${fullTargetUrl} (Attempt ${4 - retries})`);
  try {
    const response = await axios.get(crawlbaseUrl, { timeout: 90000 });
    const originalStatus = response.headers["original_status"];
    console.log(`[Crawlbase] Fetched ${fullTargetUrl}. Original Status: ${originalStatus}`);
    if (response.status === 200 && response.data) {
      if (originalStatus && parseInt(originalStatus, 10) >= 400) {
        console.warn(`[Crawlbase] Original request to ${fullTargetUrl} failed with status ${originalStatus}. Body might contain error page.`);
      }
      return response.data;
    } else {
      throw new Error(`Crawlbase request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(`[Crawlbase] Error fetching ${fullTargetUrl}:`, error.message);
    if (error.response && error.response.status === 429 && retries > 0) {
      console.warn(`[Crawlbase] Rate limit hit (429). Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
      await delay(delayMs);
      return fetchViaCrawlbase(targetUrl, retries - 1, delayMs * 2);
    } else if (error.code === 'ECONNABORTED') {
      console.error(`[Crawlbase] Timeout fetching ${fullTargetUrl}`);
      throw new Error(`Timeout fetching URL via Crawlbase: ${fullTargetUrl}`);
    }
    throw error;
  }
}

async function searchDevices(query) {
  console.log(`[Scraper] Starting custom scrape for query: ${query}`);
  try {
    const searchUrl = `results.php3?sQuickSearch=yes&sName=${encodeURIComponent(query)}`;
    const searchHtml = await fetchViaCrawlbase(searchUrl);
    const $search = cheerio.load(searchHtml);
    const devices = [];
    $search(".makers ul li a").each((i, el) => {
      const deviceLink = $search(el);
      const devicePageUrl = deviceLink.attr("href");
      const deviceName = deviceLink.find("span").text().trim();
      if (devicePageUrl && deviceName) {
        devices.push({ name: deviceName, url: devicePageUrl });
      }
    });
    if (devices.length === 0) {
      console.log(`[Scraper] No devices found in search results for query: ${query}`);
      return { error: `No devices found for query: ${query}` };
    }
    console.log(`[Scraper] Found ${devices.length} devices for query: ${query}`);
    return { devices };
  } catch (error) {
    console.error(`[Scraper] Custom scraping failed for query "${query}":`, error.message);
    return { error: `Scraping failed: ${error.message || 'Unknown error'}` };
  }
}

async function getDeviceDetails(devicePageUrl) {
  console.log(`[Scraper] Fetching details for: ${devicePageUrl}`);
  try {
    const detailHtml = await fetchViaCrawlbase(devicePageUrl);
    const $detail = cheerio.load(detailHtml);
    const deviceName = $detail("h1.specs-phone-name-title").text().trim();
    const imageUrl = $detail(".specs-photo-main a img").attr("src");
    const detailSpec = [];
    
    $detail("#specs-list table").each((i, table) => {
      const category = $detail(table).find("th").first().text().trim();
      const specifications = [];
      
      $detail(table).find("tr").each((j, row) => {
        const specName = $detail(row).find("td.ttl").text().trim();
        const specValueElement = $detail(row).find("td.nfo");
        
        if (category === "Misc") {
          console.log(`[Scraper DEBUG - Misc Row] Raw specName: "${$detail(row).find("td.ttl").text()}", Trimmed specName: "${specName}"`);
          if (specValueElement.length > 0) {
            console.log(`[Scraper DEBUG - Misc Row] Raw specValue HTML: "${specValueElement.html()}"`);
          } else {
            console.log(`[Scraper DEBUG - Misc Row] specValueElement (td.nfo) NOT FOUND for specName: "${specName}"`);
          }
        }
        
        if (specName && specValueElement.length > 0) {
          const value = specValueElement.html().replace(/<br\s*\/?>/gi, "\n").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
          if (category === "Misc") {
            console.log(`[Scraper DEBUG - Misc Row] Processed value: "${value}" (is it empty? ${!value})`);
          }
          if (value) {
            specifications.push({ name: specName, value });
            if (category === "Misc") {
              console.log(`[Scraper DEBUG - Misc Row] Pushed to specifications: { name: "${specName}", value: "${value}" }`);
            }
          } else {
            if (category === "Misc") {
              console.log(`[Scraper DEBUG - Misc Row] Processed value was EMPTY for specName: "${specName}". NOT PUSHED.`);
            }
          }
        } else {
          if (category === "Misc") {
            if (!specName) console.log(`[Scraper DEBUG - Misc Row] specName was EMPTY. SKIPPED.`);
            if (specValueElement.length === 0) console.log(`[Scraper DEBUG - Misc Row] specValueElement (td.nfo) not found. SKIPPED for specName: "${specName}" (if specName existed).`);
          }
        }
      });
      
      console.log(`[Scraper DEBUG] Processing category: "${category}", Found ${specifications.length} specifications.`);
      if (category === "Misc" && specifications.length === 0) {
        console.warn(`[Scraper DEBUG] Category "Misc" was found on page ${devicePageUrl}, but no specifications were extracted from it. This might be normal if GSMArena lists the category header with no items, or it could indicate a parsing issue for this specific device's Misc section.`);
      }
      
      if (category && specifications.length > 0) {
        detailSpec.push({ category, specifications });
      }
    });
    
    if (!deviceName && detailSpec.length === 0) {
      console.warn(`[Scraper] Could not extract any details for ${devicePageUrl}. Page might be different or an error page.`);
      return { error: `Failed to extract details from ${devicePageUrl}` };
    }
    
    console.log(`[Scraper] Successfully scraped details for ${deviceName || devicePageUrl}`);
    return {
      name: deviceName,
      img: imageUrl ? (imageUrl.startsWith("http") ? imageUrl : GSMARENA_BASE_URL + imageUrl) : null,
      detailSpec: detailSpec
    };
  } catch (error) {
    console.error(`[Scraper] Detail scraping failed for URL "${devicePageUrl}":`, error.message);
    return { error: `Detail scraping failed: ${error.message || 'Unknown error'}` };
  }
}

module.exports = { searchDevices, getDeviceDetails };