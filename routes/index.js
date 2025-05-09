const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// Muat kamus terjemahan
let translations = {};
const translationsPath = path.join(__dirname, "../translations/id.json");
try {
    if (fs.existsSync(translationsPath)) {
        const rawTranslations = fs.readFileSync(translationsPath, "utf-8");
        translations = JSON.parse(rawTranslations);
        console.log("[Translation] Kamus berhasil dimuat.");
    } else {
        console.warn("[Translation] File kamus id.json tidak ditemukan di path:", translationsPath);
    }
} catch (err) {
    console.error("[Translation] Gagal memuat atau parse kamus id.json:", err);
}

// Fungsi untuk menerjemahkan teks menggunakan kamus, default ke teks asli jika tidak ditemukan
function translateText(text, lang = "id") {
    if (lang === "id" && translations[text]) {
        return translations[text];
    }
    // Di sini bisa ditambahkan logika untuk memanggil kemampuan AI internal untuk teks yang lebih kompleks
    // Untuk saat ini, jika tidak ada di kamus, kembalikan teks asli.
    // Contoh: Jika `text` adalah "Available. Released 2023, October 26"
    // Maka AI akan menerjemahkannya menjadi "Tersedia. Dirilis 2023, 26 Oktober"
    // Ini akan diimplementasikan lebih lanjut jika diperlukan untuk nilai spesifikasi.
    return text; 
}

// Route untuk halaman utama (form input URL)
router.get("/", (req, res) => {
  res.render("index", { phoneData: null, error: null, gsmarenaUrl: req.query.url || "" });
});

// Route untuk proses scraping
router.get("/scrape", async (req, res) => {
  const gsmarenaUrl = req.query.url;

  if (!gsmarenaUrl || !gsmarenaUrl.startsWith("https://www.gsmarena.com/")) {
    return res.render("index", {
      phoneData: null,
      error: "Mohon masukkan URL GSMArena yang valid.",
      gsmarenaUrl: gsmarenaUrl,
    });
  }

  try {
    const response = await axios.get(gsmarenaUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    const html = response.data;
    const $ = cheerio.load(html);

    const phoneName = $("h1.specs-phone-name-title").text().trim();
    const imageUrl = $(".specs-photo-main a img").attr("src");

    if (!phoneName) {
      return res.render("index", {
        phoneData: null,
        error: "Tidak dapat menemukan nama ponsel. Pastikan URL adalah halaman spesifikasi ponsel yang benar.",
        gsmarenaUrl: gsmarenaUrl,
      });
    }

    const detailSpec = [];
    $("#specs-list table").each((i, table) => {
      const originalCategory = $(table).find("th").first().text().trim();
      const translatedCategory = translateText(originalCategory);
      const specifications = [];
      
      $(table).find("tr").each((j, row) => {
        const specNameElement = $(row).find("td.ttl a");
        let originalSpecName = "";
        if (specNameElement.length > 0) {
            originalSpecName = specNameElement.text().trim();
        } else {
            // Fallback jika tidak ada <a> di dalam td.ttl (misalnya untuk "Price" yang kadang tidak ada link)
            originalSpecName = $(row).find("td.ttl").text().trim();
        }

        const specValueElement = $(row).find("td.nfo");
        let originalSpecValue = "";
        if (specValueElement.length > 0) {
            originalSpecValue = specValueElement.html().replace(/<br\s*\/?>/gi, "\n").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
        }

        if (originalSpecName) {
          const translatedSpecName = translateText(originalSpecName);
          // Untuk nilai (originalSpecValue), penerjemahan lebih kompleks dan akan ditangani nanti jika diperlukan.
          // Saat ini kita hanya menerjemahkan nama kategori dan nama spesifikasi.
          // Jika nilai adalah teks bebas (misal status rilis), AI akan menerjemahkannya.
          // Jika nilai adalah data teknis (misal "GSM / HSPA"), mungkin tidak perlu diterjemahkan atau hanya sebagian.
          // Untuk "Price", kita akan mengekstrak Rupiah secara spesifik.
          specifications.push({ name: translatedSpecName, value: originalSpecValue });
        }
      });

      if (originalCategory && specifications.length > 0) {
        detailSpec.push({ category: translatedCategory, specifications });
      }
    });

    // Ekstraksi harga spesifik dalam Rupiah dari kategori Misc (Lain-lain)
    let priceIDR = "Harga tidak tersedia";
    const miscCategory = detailSpec.find(cat => cat.category === translateText("Misc") || cat.category === "Misc");
    if (miscCategory) {
        const priceSpec = miscCategory.specifications.find(spec => spec.name === translateText("Price") || spec.name === "Price");
        if (priceSpec && priceSpec.value) {
            const rupiahPriceMatch = priceSpec.value.match(/Rp\s*([\d.,]+)/i);
            if (rupiahPriceMatch && rupiahPriceMatch[1]) {
                priceIDR = "Rp " + rupiahPriceMatch[1];
            } else {
                // Jika tidak ada Rupiah, coba ambil bagian pertama dari harga atau nilai mentah
                const priceParts = priceSpec.value.split("/");
                priceIDR = priceParts[0].trim(); // Ambil harga pertama jika ada beberapa
                 // Hapus tag HTML jika ada
                priceIDR = priceIDR.replace(/<[^>]+>/g, ", ").replace(/ , /g, ", ").replace(/, $/, "").trim();
            }
        }
    }

    const phoneData = {
      name: phoneName,
      img: imageUrl,
      price: priceIDR, // Harga yang sudah dipastikan Rupiah atau fallback
      specifications: detailSpec, // Seluruh tabel spesifikasi yang sudah diterjemahkan (kategori & nama item)
    };

    res.render("index", { phoneData: phoneData, error: null, gsmarenaUrl: gsmarenaUrl });

  } catch (error) {
    console.error("Error scraping GSMArena:", error.message, error.stack);
    let errorMessage = `Terjadi kesalahan saat scraping: ${error.message}`;
    if (error.response && error.response.status === 404) {
      errorMessage = "Halaman tidak ditemukan (404). Pastikan URL benar.";
    } else if (error.code === "ENOTFOUND") {
      errorMessage = "Tidak dapat terhubung ke server GSMArena. Periksa koneksi internet Anda atau URL.";
    }
    res.render("index", {
      phoneData: null,
      error: errorMessage,
      gsmarenaUrl: gsmarenaUrl,
    });
  }
});

module.exports = router;

