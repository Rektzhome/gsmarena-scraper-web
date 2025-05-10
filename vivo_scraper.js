// Script ini mengambil data harga sparepart Vivo dari API publik mereka.
// Daftar perangkat diperbarui secara hardcoded berdasarkan file hasil_ekstraksi_perangkat_vivo.csv

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { URLSearchParams } = require("url");

// --- Konfigurasi ---
const API_URL = "https://www.vivo.com/id/support/queryPriceByProductId";
const OUTPUT_JSON_FILENAME = "vivo_spareparts_data_full.json"; // Nama file output JSON baru
const OUTPUT_CSV_FILENAME = "vivo_spareparts_data_full.csv";   // Nama file output CSV baru
const DELAY_SECONDS = 1; // Jeda antar permintaan API (penting!)

// Header untuk Meniru Browser
const API_HEADERS = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
    "X-Requested-With": "XMLHttpRequest",
    "Origin": "https://www.vivo.com",
    "Referer": "https://www.vivo.com/id/support/service-price",
};

// --- Daftar Perangkat (Data Hardcoded) ---
// Diperbarui berdasarkan hasil_ekstraksi_perangkat_vivo.csv
const deviceList = [
    {'id': 3045, 'name': 'X200 Pro', 'series': 'Seri X'},
    {'id': 3044, 'name': 'X200', 'series': 'Seri X'},
    {'id': 2842, 'name': 'X Fold3 Pro', 'series': 'Seri X'},
    {'id': 2841, 'name': 'X100 Pro', 'series': 'Seri X'},
    {'id': 2840, 'name': 'X100', 'series': 'Seri X'},
    {'id': 1882, 'name': 'X80', 'series': 'Seri X'},
    {'id': 1860, 'name': 'X80 Pro', 'series': 'Seri X'},
    {'id': 1449, 'name': 'X70 Pro', 'series': 'Seri X'},
    {'id': 1204, 'name': 'X60 Pro', 'series': 'Seri X'},
    {'id': 1203, 'name': 'X60', 'series': 'Seri X'},
    {'id': 844, 'name': 'X50 Pro', 'series': 'Seri X'},
    {'id': 843, 'name': 'X50', 'series': 'Seri X'},
    {'id': 25, 'name': 'X5 Max', 'series': 'Seri X'},
    {'id': 24, 'name': 'X5 Pro', 'series': 'Seri X'},
    {'id': 3116, 'name': 'V50 Lite', 'series': 'Seri V'},
    {'id': 3115, 'name': 'V50 Lite 5G', 'series': 'Seri V'},
    {'id': 3054, 'name': 'V50', 'series': 'Seri V'},
    {'id': 2941, 'name': 'V40 Lite 5G', 'series': 'Seri V'},
    {'id': 2940, 'name': 'V40 Lite', 'series': 'Seri V'},
    {'id': 2920, 'name': 'V40', 'series': 'Seri V'},
    {'id': 2722, 'name': 'V30e', 'series': 'Seri V'},
    {'id': 2649, 'name': 'V30 Pro', 'series': 'Seri V'},
    {'id': 2648, 'name': 'V30', 'series': 'Seri V'},
    {'id': 2491, 'name': 'V27', 'series': 'Seri V'},
    {'id': 2417, 'name': 'V29e', 'series': 'Seri V'},
    {'id': 2398, 'name': 'V29', 'series': 'Seri V'},
    {'id': 2202, 'name': 'V27e', 'series': 'Seri V'},
    {'id': 1897, 'name': 'V25 Pro', 'series': 'Seri V'},
    {'id': 1896, 'name': 'V25', 'series': 'Seri V'},
    {'id': 1895, 'name': 'V25e', 'series': 'Seri V'},
    {'id': 1658, 'name': 'V23 5G', 'series': 'Seri V'},
    {'id': 1537, 'name': 'V23e', 'series': 'Seri V'},
    {'id': 1261, 'name': 'V21 5G', 'series': 'Seri V'},
    {'id': 1246, 'name': 'V21', 'series': 'Seri V'},
    {'id': 927, 'name': 'V20 SE', 'series': 'Seri V'},
    {'id': 926, 'name': 'V20', 'series': 'Seri V'},
    {'id': 758, 'name': 'V19', 'series': 'Seri V'},
    {'id': 576, 'name': 'V17 Pro', 'series': 'Seri V'},
    {'id': 447, 'name': 'V15 Pro（6+128）', 'series': 'Seri V'},
    {'id': 429, 'name': 'V15', 'series': 'Seri V'},
    {'id': 388, 'name': 'V9', 'series': 'Seri V'},
    {'id': 1, 'name': 'V11 Pro', 'series': 'Seri V'},
    {'id': 2, 'name': 'V11', 'series': 'Seri V'},
    {'id': 3, 'name': 'V9 6GB', 'series': 'Seri V'},
    {'id': 6, 'name': 'V7+', 'series': 'Seri V'},
    {'id': 5, 'name': 'V7', 'series': 'Seri V'},
    {'id': 164, 'name': 'V5Plus', 'series': 'Seri V'},
    {'id': 7, 'name': 'V5s', 'series': 'Seri V'},
    {'id': 8, 'name': 'V5', 'series': 'Seri V'},
    {'id': 9, 'name': 'V5 lite', 'series': 'Seri V'},
    {'id': 10, 'name': 'V3 Max', 'series': 'Seri V'},
    {'id': 1739, 'name': 'T1Pro 5G', 'series': 'Seri T'},
    {'id': 1738, 'name': 'T1 5G', 'series': 'Seri T'},
    {'id': 3046, 'name': 'Y29', 'series': 'Seri Y'},
    {'id': 2945, 'name': 'Y19s', 'series': 'Seri Y'},
    {'id': 2919, 'name': 'Y03t', 'series': 'Seri Y'},
    {'id': 2839, 'name': 'Y28', 'series': 'Seri Y'},
    {'id': 2838, 'name': 'Y18', 'series': 'Seri Y'},
    {'id': 2652, 'name': 'Y03', 'series': 'Seri Y'},
    {'id': 2651, 'name': 'Y100 5G', 'series': 'Seri Y'},
    {'id': 2650, 'name': 'Y100', 'series': 'Seri Y'},
    {'id': 2492, 'name': 'Y27s', 'series': 'Seri Y'},
    {'id': 2403, 'name': 'Y17s', 'series': 'Seri Y'},
    {'id': 2308, 'name': 'Y27 5G', 'series': 'Seri Y'},
    {'id': 2307, 'name': 'Y27', 'series': 'Seri Y'},
    {'id': 2268, 'name': 'Y36 5G', 'series': 'Seri Y'},
    {'id': 2267, 'name': 'Y36', 'series': 'Seri Y'},
    {'id': 2230, 'name': 'Y02t', 'series': 'Seri Y'},
    {'id': 2160, 'name': 'Y81i', 'series': 'Seri Y'},
    {'id': 2071, 'name': 'Y02', 'series': 'Seri Y'},
    {'id': 1925, 'name': 'Y01A', 'series': 'Seri Y'},
    {'id': 1894, 'name': 'Y22', 'series': 'Seri Y'},
    {'id': 1893, 'name': 'Y16', 'series': 'Seri Y'},
    {'id': 1889, 'name': 'Y35 2022', 'series': 'Seri Y'},
    {'id': 1808, 'name': 'Y53C', 'series': 'Seri Y'},
    {'id': 1807, 'name': 'Y93 2019', 'series': 'Seri Y'},
    {'id': 1740, 'name': 'Y01', 'series': 'Seri Y'},
    {'id': 1737, 'name': 'Y33T', 'series': 'Seri Y'},
    {'id': 1677, 'name': 'Y21A', 'series': 'Seri Y'},
    {'id': 1676, 'name': 'Y75 5G', 'series': 'Seri Y'},
    {'id': 1628, 'name': 'Y21T', 'series': 'Seri Y'},
    {'id': 1531, 'name': 'Y51A', 'series': 'Seri Y'},
    {'id': 1530, 'name': 'Y15s', 'series': 'Seri Y'},
    {'id': 1380, 'name': 'Y33s', 'series': 'Seri Y'},
    {'id': 1379, 'name': 'Y21s', 'series': 'Seri Y'},
    {'id': 1378, 'name': 'Y21 (2021)', 'series': 'Seri Y'},
    {'id': 1328, 'name': 'Y53s', 'series': 'Seri Y'},
    {'id': 1278, 'name': 'Y20A', 'series': 'Seri Y'},
    {'id': 1233, 'name': 'Y12s 2021', 'series': 'Seri Y'},
    {'id': 1232, 'name': 'Y51', 'series': 'Seri Y'},
    {'id': 1157, 'name': 'Y20 2021', 'series': 'Seri Y'},
    {'id': 1156, 'name': 'Y20s【G】', 'series': 'Seri Y'},
    {'id': 1066, 'name': 'Y1s', 'series': 'Seri Y'},
    {'id': 1061, 'name': 'Y51（8+128G）', 'series': 'Seri Y'},
    {'id': 1049, 'name': 'Y20s', 'series': 'Seri Y'},
    {'id': 1048, 'name': 'Y12s', 'series': 'Seri Y'},
    {'id': 917, 'name': 'Y20', 'series': 'Seri Y'},
    {'id': 898, 'name': 'Y30（6+128G）', 'series': 'Seri Y'},
    {'id': 897, 'name': 'Y12i', 'series': 'Seri Y'},
    {'id': 896, 'name': 'Y30i', 'series': 'Seri Y'},
    {'id': 826, 'name': 'Y50', 'series': 'Seri Y'},
    {'id': 825, 'name': 'Y30', 'series': 'Seri Y'},
    {'id': 824, 'name': 'Y11', 'series': 'Seri Y'},
    {'id': 683, 'name': 'Y19', 'series': 'Seri Y'},
    {'id': 527, 'name': 'Y15', 'series': 'Seri Y'},
    {'id': 526, 'name': 'Y12', 'series': 'Seri Y'},
    {'id': 493, 'name': 'Y91C', 'series': 'Seri Y'},
    {'id': 492, 'name': 'Y17', 'series': 'Seri Y'},
    {'id': 411, 'name': 'Y91 2019', 'series': 'Seri Y'},
    {'id': 392, 'name': 'Y93', 'series': 'Seri Y'},
    {'id': 317, 'name': 'Y95', 'series': 'Seri Y'},
    {'id': 315, 'name': 'Y91', 'series': 'Seri Y'},
    {'id': 13, 'name': 'Y81', 'series': 'Seri Y'},
    {'id': 14, 'name': 'Y81D', 'series': 'Seri Y'},
    {'id': 12, 'name': 'Y83', 'series': 'Seri Y'},
    {'id': 15, 'name': 'Y71', 'series': 'Seri Y'},
    {'id': 16, 'name': 'Y65', 'series': 'Seri Y'},
    {'id': 17, 'name': 'Y69', 'series': 'Seri Y'},
    {'id': 18, 'name': 'Y53', 'series': 'Seri Y'},
    {'id': 19, 'name': 'Y55s', 'series': 'Seri Y'},
    {'id': 20, 'name': 'Y55', 'series': 'Seri Y'},
    {'id': 22, 'name': 'Y51 (Tipe Lama)', 'series': 'Seri Y'},
    {'id': 26, 'name': 'Y35', 'series': 'Seri Y'},
    {'id': 23, 'name': 'Y21', 'series': 'Seri Y'},
    {'id': 637, 'name': 'S1 Pro', 'series': 'Seri S'},
    {'id': 529, 'name': 'S1', 'series': 'Seri S'},
    {'id': 528, 'name': 'Z1 Pro', 'series': 'Seri Z'},
    {'id': 2914, 'name': 'TWS 3e', 'series': 'TWS'},
    {'id': 2913, 'name': 'TWS Air 2', 'series': 'TWS'},
    {'id': 2912, 'name': 'TWS Air', 'series': 'TWS'},
    {'id': 2911, 'name': 'TWS 2 ANC', 'series': 'TWS'},
    {'id': 2910, 'name': 'TWS 2e', 'series': 'TWS'},
    {'id': 2909, 'name': 'TWS Neo', 'series': 'TWS'}
];

// List untuk menyimpan semua data sparepart yang terkumpul
const allSparePartsData = [];

// Fungsi helper untuk introduce delay menggunakan Promise dan setTimeout
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mengambil dan mengurai data sparepart untuk satu ID perangkat.
 * @param {object} device - Objek perangkat { id, name, series }.
 * @returns {Promise<Array<object>>} - Array objek sparepart untuk perangkat ini.
 */
async function fetchAndParseSpareParts(device) {
    const { id: deviceId, name: deviceName, series: deviceSeries } = device;
    console.log(`Processing Device: ${deviceName} (${deviceSeries}, ID: ${deviceId})`);

    const postData = new URLSearchParams();
    postData.append("id", deviceId);

    try {
        const response = await axios.post(API_URL, postData.toString(), { headers: API_HEADERS });

        if (response.status === 200) {
            const sparePartsResponse = response.data;
            const sparePartVO = sparePartsResponse?.data?.sparePartVO;
            const partList = sparePartVO?.sparePartsVoList;
            const extractedParts = [];

            if (sparePartsResponse.success === true && Array.isArray(partList)) {
                if (partList.length > 0) {
                     for (const part of partList) {
                        if (typeof part === "object" && part !== null) {
                            extractedParts.push({
                                device_id: deviceId,
                                device_name: deviceName,
                                device_series: deviceSeries,
                                part_name: part.name || "Nama Tidak Diketahui",
                                part_price: part.price || "Harga Tidak Diketahui",
                                promotion_price: part.promotionPrice || "",
                                promotion_title: (part.promotionTitle || "").trim()
                            });
                        } else {
                            console.warn(`  Warning: Item sparepart bukan objek untuk ID ${deviceId}:`, part);
                        }
                     }
                     console.log(`  Successfully got ${extractedParts.length} spare parts.`);
                } else {
                    console.log(`  API returned empty spare parts list for ${deviceName} (ID: ${deviceId}).`);
                }
            } else {
                console.warn(`  API response structure unexpected for ${deviceName} (ID: ${deviceId}).`);
                // console.warn(`  Raw response:`, sparePartsResponse); // Hapus komentar untuk debug jika perlu
            }
            return extractedParts;
        } else {
            console.error(`  API request failed for ${deviceName} (ID: ${deviceId}). Status: ${response.status}`);
            // console.error(`  Response body:`, response.data); // Hapus komentar untuk debug jika perlu
            return [];
        }
    } catch (error) {
        console.error(`  Error fetching spare parts for ${deviceName} (ID: ${deviceId}):`, error.message);
        if (error.response) {
            // console.error("  Response data (on error):", error.response.data);
            // console.error("  Response status (on error):", error.response.status);
        }
        return [];
    }
}

// Fungsi utama async untuk menjalankan proses scraping
async function scrapeAllDevices() {
    console.log(`Starting scraping data sparepart API for ${deviceList.length} devices...`);

    for (const device of deviceList) {
        const deviceParts = await fetchAndParseSpareParts(device);
        allSparePartsData.push(...deviceParts);
        await delay(DELAY_SECONDS * 1000);
    }

    console.log("\n--- Menyimpan Hasil ---");

    if (allSparePartsData.length > 0) {
        // Menyimpan ke file JSON
        try {
            const jsonString = JSON.stringify(allSparePartsData, null, 4);
            fs.writeFileSync(OUTPUT_JSON_FILENAME, jsonString, "utf8");
            console.log(`Data sparepart berhasil disimpan ke ${OUTPUT_JSON_FILENAME}`);
        } catch (e) {
            console.error(`Error saat menyimpan data ke JSON: ${e.message}`);
        }

        // Menyimpan ke file CSV
        try {
            const allKeys = new Set();
            allSparePartsData.forEach(item => {
                Object.keys(item).forEach(key => allKeys.add(key));
            });
            const fieldnames = Array.from(allKeys).sort();
            let csvString = fieldnames.join(",") + "\n";
            allSparePartsData.forEach(item => {
                const row = fieldnames.map(fieldName => {
                    const value = item[fieldName] !== undefined && item[fieldName] !== null ? item[fieldName] : "";
                    if (typeof value === "string" && (value.includes(",") || value.includes("\"") || value.includes("\n"))) {
                         return `"${value.replace(/\"/g, "\"\"")}"`; // Corrected CSV escape
                    }
                    return value;
                }).join(",");
                csvString += row + "\n";
            });
            fs.writeFileSync(OUTPUT_CSV_FILENAME, csvString, "utf8");
            console.log(`Data sparepart berhasil disimpan ke ${OUTPUT_CSV_FILENAME}`);
        } catch (e) {
            console.error(`Error saat menyimpan data ke CSV: ${e.message}`);
        }
    } else {
        console.log("Tidak ada data sparepart terkumpul untuk disimpan ke JSON atau CSV.");
    }

    console.log(`\nProses scraping selesai.`);
    console.log(`Total data sparepart terkumpul: ${allSparePartsData.length}`);
}

// Jalankan fungsi scraping
scrapeAllDevices().catch(error => {
    console.error("An unhandled error occurred during scraping:", error);
});

