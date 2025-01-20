const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./config/db"); // Pastikan path ini benar
const logger = require("./utils/logger"); // Import logger yang telah Anda buat
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import routes dan middleware
const authRoutes = require("./routes/authRoute");
const transactionRoute = require("./routes/transactionRoute");
const budgetRoute = require("./routes/budgetRoute");
const reportRoute = require("./routes/reportRoute");
const { authenticate } = require("./middlewares/authMiddleware");
const helmet = require("helmet");

// Load environment variables
dotenv.config();

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Mengizinkan sumber daya dari server Anda
      imgSrc: ["'self'", "https://financial-tracker-app-backend.vercel.app"], // Mengizinkan gambar dari server Anda dan URL favicon
      scriptSrc: ["'self'"], // Sesuaikan jika ada skrip eksternal
      styleSrc: ["'self'"], // Sesuaikan jika ada CSS eksternal
    },
  })
);
app.use(cors(corsOptions));

// Middleware untuk body parsing
app.use(bodyParser.json());

// Middleware untuk logging HTTP request dengan morgan
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()), // Pastikan logger.info tersedia
    },
  })
);

// Middleware untuk cookie parser
app.use(cookieParser());

// Koneksi ke database
connectDB(); // Jalankan koneksi database

// Routing
app.use("/", authRoutes);
app.use("/transactions", authenticate, transactionRoute);
app.use("/budgets", authenticate, budgetRoute);
app.use("/reports", authenticate, reportRoute);

// Main page
app.get("/", (req, res) => {
  const documentationHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Financial Tracker API Documentation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        color: #333;
      }
      header {
        background: #007bff;
        color: white;
        padding: 20px 10px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      header h1 {
        margin: 0;
        font-size: 2rem;
      }
      main {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      section {
        margin-bottom: 20px;
      }
      h2, h3, h4 {
        color: #007bff;
      }
      ul {
        list-style-type: square;
        padding-left: 20px;
        margin: 10px 0;
      }
      pre {
        background: #f4f4f4;
        padding: 15px;
        border-radius: 5px;
        overflow-x: auto;
        margin: 10px 0;
        font-size: 0.9rem;
      }
      code {
        background: #f1f1f1;
        padding: 2px 4px;
        border-radius: 4px;
        color: #d6336c;
        font-family: "Courier New", Courier, monospace;
      }
      footer {
        text-align: center;
        margin: 20px 0;
        font-size: 0.8rem;
        color: #777;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>Financial Tracker API Documentation</h1>
    </header>
    <main>
      <section>
        <h2>Fitur</h2>
        <ul>
          <li><strong>Autentikasi:</strong> Registrasi pengguna, login dengan token JWT.</li>
          <li><strong>Manajemen Transaksi:</strong> Mendapatkan, menambahkan, memperbarui, dan menghapus transaksi.</li>
          <li><strong>Manajemen Anggaran:</strong> Mendapatkan dan mengatur anggaran pengguna.</li>
          <li><strong>Laporan:</strong> Mendapatkan laporan transaksi bulanan dan tahunan.</li>
        </ul>
      </section>
      <section>
        <h2>Teknologi yang Digunakan</h2>
        <ul>
          <li>Node.js</li>
          <li>Express.js</li>
          <li>MongoDB dengan Mongoose</li>
          <li>JWT (JSON Web Token) untuk autentikasi</li>
          <li>Winston untuk logging</li>
          <li>Morgan untuk HTTP request logging</li>
          <li>dotenv untuk manajemen environment variables</li>
        </ul>
      </section>
      <section>
        <h2>Domain</h2>
        <pre>https://financial-tracker-app-backend.vercel.app/</pre>
      </section>
      <section>
        <h2>API Endpoints</h2>
        <h3>1. Autentikasi</h3>
        <h4>Registrasi</h4>
        <p><strong>Endpoint:</strong> <code>POST /register</code></p>
        <pre>
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123"
}
        </pre>
        <h4>Login</h4>
        <p><strong>Endpoint:</strong> <code>POST /login</code></p>
        <pre>
{
  "email": "johndoe@example.com",
  "password": "password123"
}
        </pre>
        <h3>2. Manajemen Transaksi</h3>
        <h4>Mendapatkan Semua Transaksi</h4>
        <p><strong>Endpoint:</strong> <code>GET /transactions</code></p>
        <pre>
{
  "transactions": [
    {
      "_id": "63b6f8e2a2c8e8f9a9e1d123",
      "user_id": "123456",
      "amount": 1000,
      "type": "income",
      "date": "2025-01-01T10:00:00.000Z",
      "description": "Salary"
    }
  ]
}
        </pre>
        <h4>Menambahkan Transaksi Baru</h4>
        <p><strong>Endpoint:</strong> <code>POST /transactions</code></p>
        <pre>
{
  "amount": 1000,
  "type": "income",
  "date": "2025-01-01T10:00:00.000Z",
  "description": "Salary"
}
        </pre>
        <h3>3. Manajemen Anggaran (Budget)</h3>
        <h4>Mendapatkan Semua Anggaran</h4>
        <p><strong>Endpoint:</strong> <code>GET /budgets</code></p>
        <pre>
{
  "budgets": [
    {
      "_id": "63b6f8e2a2c8e8f9a9e1d124",
      "user_id": "123456",
      "monthly_limit": 5000
    }
  ]
}
        </pre>
        <h3>4. Laporan</h3>
        <h4>Laporan Bulanan</h4>
        <p><strong>Endpoint:</strong> <code>GET /reports/monthly</code></p>
        <pre>
{
  "transactions": [
    {
      "_id": "63b6f8e2a2c8e8f9a9e1d123",
      "user_id": "123456",
      "amount": 1000,
      "type": "income",
      "date": "2025-01-01T10:00:00.000Z",
      "description": "Salary"
    }
  ]
}
        </pre>
      </section>
    </main>
    <footer>
      &copy; 2025 Financial Tracker API. All rights reserved.
    </footer>
  </body>
  </html>
  `;
  res.send(documentationHTML);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => `Server running on port ${PORT}`);
