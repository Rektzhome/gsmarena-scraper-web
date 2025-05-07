# <img src="https://raw.githubusercontent.com/Rektzhome/gsmarena-scraper-web/master/public/img/hpgaul_logo_navbar.svg" width="50"/> HpGaul - GSM Arena Scraper Web

<p align="center">
  <img src="https://raw.githubusercontent.com/Rektzhome/gsmarena-scraper-web/master/public/img/hpgaul_banner_readme.png" alt="HpGaul Banner" width="700"/>
</p>

<p align="center">
  <strong>🔍 Your Ultimate Mobile Specs Detective! 🕵️‍♂️</strong>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#technologies-used">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <!-- Placeholder Badges - Replace with actual badges -->
  <img src="https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge" alt="Build Status">
  <img src="https://img.shields.io/github/stars/Rektzhome/gsmarena-scraper-web?style=for-the-badge&logo=github&color=gold" alt="GitHub Stars">
  <img src="https://img.shields.io/github/forks/Rektzhome/gsmarena-scraper-web?style=for-the-badge&logo=github&color=blue" alt="GitHub Forks">
  <img src="https://img.shields.io/github/license/Rektzhome/gsmarena-scraper-web?style=for-the-badge&color=lightgrey" alt="License">
  <img src="https://img.shields.io/github/last-commit/Rektzhome/gsmarena-scraper-web?style=for-the-badge&logo=github&color=orange" alt="Last Commit">
</p>

---

**HpGaul** is a sleek and powerful web application that scrapes mobile phone specifications from GSMArena.com. Search for any phone and get detailed specs, images, and prices (where available) in a user-friendly interface. Built with Node.js, Express, and Playwright for robust scraping, and a clean HTML/Tailwind CSS frontend.

➡️ **Live Demo (Temporary):** [Access HpGaul](http://3000-ih1f9rggnk0mrmv623b3e-853b7697.manus.computer) (Note: This is a temporary link and may change or become inactive.)

---

## ✨ Key Features

*   📱 **Instant Device Search:** Quickly find any mobile phone by name.
*   📊 **Detailed Specifications:** Get comprehensive specs categorized for easy reading (Network, Launch, Body, Display, Platform, Memory, Camera, Sound, Comms, Features, Battery, Misc).
*   🖼️ **Device Images:** View high-quality images of the searched device.
*   💰 **Price Information:** Displays price in IDR when available (Note: Prices are indicative and may not be official Indonesian prices).
*   🌓 **Dark Mode:** Comfortable viewing experience in low-light conditions.
*   🚀 **Fast & Responsive:** Built for speed and works smoothly on desktop and mobile devices.
*   ℹ️ **Info Page:** Learn more about HpGaul and its purpose.
*   🎨 **Modern UI:** Clean and intuitive interface built with Tailwind CSS.
*   🔔 **User Notifications:** Toast notifications for search success and loading spinners for better UX.

---

## 🛠️ Technologies Used

<p align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm">
  <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
</p>

---

## 🚀 Installation

To get a local copy up and running, follow these simple steps.

**Prerequisites:**
*   Node.js (v16 or higher recommended)
*   npm (comes with Node.js)

**Steps:**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Rektzhome/gsmarena-scraper-web.git
    cd gsmarena-scraper-web
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Install Playwright browsers:**
    The application uses Playwright for scraping. Ensure its browsers are installed:
    ```bash
    npx playwright install --with-deps
    ```

---

## 💨 Usage

Once the installation is complete, you can start the application:

```bash
npm start
```

This will typically start the server on `http://localhost:3000`.
Open your browser and navigate to this address to use HpGaul.

---

## ⚙️ API Endpoints

The application exposes a few API endpoints used by the frontend:

*   `GET /api/search?query=<device_name>`: Searches for devices based on the query.
*   `GET /api/details?url=<device_gsmarena_url>`: Fetches detailed specifications for a given GSMArena device URL.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again! ⭐

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` file (if it exists, otherwise assume MIT) for more information.

---

## 📞 Contact

Project Link: [https://github.com/Rektzhome/gsmarena-scraper-web](https://github.com/Rektzhome/gsmarena-scraper-web)

<p align="center">
  Made with ❤️ by Muh Amin
</p>

