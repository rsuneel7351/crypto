
# 💸 Crypto Tracker Web App

A production-ready **React cryptocurrency tracker** web application built to deliver real-time crypto market data using the [CoinGecko API](https://www.coingecko.com/en/api). The app features an intuitive UI, dynamic charts, and key market metrics to help users stay updated with digital assets.

---

## 🖥️ Platform Compatibility

| Platform | Support Status     |
|----------|--------------------|
| Web      | ✅ Fully Supported |

---

## 🚀 Key Features

- 🔍 Real-time coin data via CoinGecko API  
- 📈 Dynamic charts for historical prices  
- 📊 Display of market cap, volume, and percentage changes  
- 🔎 Search and filter crypto assets  
- 🧩 Reusable, component-based structure  
- ⚡ Fast and responsive design using Ant Design


## 🧰 Technology Stack

- **React**  
- **JavaScript (ES6+)**  
- **React Router DOM** – client-side routing  
- **Chart.js** or **Recharts** – for data visualizations  
- **CoinGecko API** – market data source  
- **Ant Design** – for styling and UI components

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/rsuneel7351/crypto.git
cd react-crypto-tracker
````

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the Development Server

```bash
npm start
# or
yarn start
```

> App will run on `http://localhost:5173`

---

## 🚀 Build for Production

```bash
npm run build
# or
yarn build
```

The production-ready files will be available in the `build/` folder.

---

## 🔐 Environment Variables

* Optional `.env` example if future APIs are added:

```
REACT_APP_API_BASE=https://api.coingecko.com/api/v3
```

Use it like:

```js
const url = `${process.env.REACT_APP_API_BASE}/coins/markets?...`;
```

---

## 📈 Potential Enhancements

* [ ] Add a user-authenticated portfolio tracker
* [ ] Create coin watchlist functionality
* [ ] Enable dark/light theme toggle
* [ ] Add news integration or social sentiment data
* [ ] Add pagination for large datasets

---

## 👤 Author

**Suneel Kumar**
Frontend Developer (React)
GitHub1: [rsuneel7351](https://github.com/rsuneel7351)
GitHub2: [suneel7351](https://github.com/suneel7351)
LinkedIn: [suneel7351](https://www.linkedin.com/in/suneel7351/)

---

## 📢 Acknowledgments

* [CoinGecko](https://coingecko.com) for open access to crypto market data
* React.js and its global developer community
* Design inspiration from leading crypto dashboards and trackers

---

