const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const { getDeviceDetails } = require('../scraper'); // Menggunakan scraper.js yang sudah ada

// Route untuk halaman utama (form input URL)
router.get('/', (req, res) => {
  res.render('index', { phoneData: null, error: null, gsmarenaUrl: req.query.url || '' });
});

// Route untuk proses scraping
router.get('/scrape', async (req, res) => {
  const gsmarenaUrl = req.query.url;

  if (!gsmarenaUrl || !gsmarenaUrl.startsWith('https://www.gsmarena.com/')) {
    return res.render('index', {
      phoneData: null,
      error: 'Mohon masukkan URL GSMArena yang valid.',
      gsmarenaUrl: gsmarenaUrl
    });
  }

  try {
    // Menggunakan fungsi getDeviceDetails dari scraper.js yang sudah ada dan dimodifikasi
    // untuk mengambil HTML dan mem-parsingnya.
    // Kita perlu memastikan getDeviceDetails bisa diadaptasi atau kita ambil logikanya.
    // Untuk sekarang, kita akan coba implementasi langsung parsing harga dari Misc di sini
    // sesuai saran pengguna, dan juga mengambil gambar.

    const response = await axios.get(gsmarenaUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });
    const html = response.data;
    const $ = cheerio.load(html);

    const phoneName = $('h1.specs-phone-name-title').text().trim();
    const imageUrl = $('.specs-photo-main a img').attr('src');

    if (!phoneName) {
        return res.render('index', {
            phoneData: null,
            error: 'Tidak dapat menemukan nama ponsel. Pastikan URL adalah halaman spesifikasi ponsel yang benar.',
            gsmarenaUrl: gsmarenaUrl
        });
    }

    let price = 'Harga tidak ditemukan di bagian spesifikasi Misc.';
    let rawPriceValue = '';

    // Mencari harga di tabel spesifikasi
    $('#specs-list table').each((i, table) => {
        const category = $(table).find('th').first().text().trim();
        if (category.toLowerCase() === 'misc') {
            $(table).find('tr').each((j, row) => {
                const specName = $(row).find('td.ttl a').text().trim();
                if (specName.toLowerCase() === 'price') {
                    rawPriceValue = $(row).find('td.nfo').text().trim(); // Ambil teks mentah dulu
                    // Ekstrak harga dalam Rupiah jika ada
                    const rupiahPriceMatch = rawPriceValue.match(/Rp\s*([\d.,]+)/i);
                    if (rupiahPriceMatch && rupiahPriceMatch[1]) {
                        price = "Rp " + rupiahPriceMatch[1];
                    } else {
                        // Jika tidak ada Rupiah, tampilkan nilai mentah atau bagian pertama jika ada multiple currencies
                        price = rawPriceValue.split('/')[0].trim(); 
                    }
                    return false; // Keluar dari loop .each tr
                }
            });
            return false; // Keluar dari loop .each table
        }
    });
    
    // Jika harga masih default dan rawPriceValue punya isi (misal formatnya beda dari yg diharapkan)
    if (price === 'Harga tidak ditemukan di bagian spesifikasi Misc.' && rawPriceValue) {
        price = rawPriceValue; // Tampilkan saja nilai mentahnya
    }

    const phoneData = {
      name: phoneName,
      img: imageUrl,
      price: price
    };

    res.render('index', { phoneData: phoneData, error: null, gsmarenaUrl: gsmarenaUrl });

  } catch (error) {
    console.error('Error scraping GSMArena:', error.message);
    let errorMessage = `Terjadi kesalahan saat scraping: ${error.message}`;
    if (error.response && error.response.status === 404) {
        errorMessage = 'Halaman tidak ditemukan (404). Pastikan URL benar.';
    } else if (error.code === 'ENOTFOUND') {
        errorMessage = 'Tidak dapat terhubung ke server GSMArena. Periksa koneksi internet Anda atau URL.';
    }
    res.render('index', {
      phoneData: null,
      error: errorMessage,
      gsmarenaUrl: gsmarenaUrl
    });
  }
});

module.exports = router;
