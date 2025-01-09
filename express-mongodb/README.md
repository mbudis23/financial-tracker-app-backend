# Financial Tracker API

API ini digunakan untuk melacak transaksi, anggaran, dan menghasilkan laporan keuangan bulanan dan tahunan.

## Fitur

1. **Autentikasi:**
   - Registrasi pengguna.
   - Login pengguna dengan token JWT.

2. **Manajemen Transaksi:**
   - Mendapatkan semua transaksi.
   - Menambahkan transaksi baru.
   - Memperbarui transaksi berdasarkan ID.
   - Menghapus transaksi berdasarkan ID.
   - Mendapatkan transaksi berdasarkan ID.

3. **Manajemen Anggaran (Budget):**
   - Mendapatkan semua anggaran.
   - Menambahkan anggaran baru.
   - Memperbarui anggaran berdasarkan ID.

4. **Laporan:**
   - Mendapatkan laporan transaksi bulanan.
   - Mendapatkan laporan transaksi tahunan.

## Teknologi yang Digunakan

- **Node.js**
- **Express.js**
- **MongoDB** dengan **Mongoose**
- **JWT (JSON Web Token)** untuk autentikasi
- **Winston** untuk logging
- **Morgan** untuk HTTP request logging
- **dotenv** untuk manajemen environment variables

---

## Instalasi

1. Clone repository ini:
   ```bash
   git clone https://github.com/username/financial-tracker-api.git
   cd financial-tracker-api
   ```

2. Install dependensi:
   ```bash
   npm install
   ```

3. Buat file `.env` di root project Anda dan tambahkan variabel-variabel berikut:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/financial-tracker
   JWT_SECRET=your_jwt_secret_key
   ```

4. Jalankan server:
   ```bash
   npm start
   ```

---

## API Endpoints

### **1. Autentikasi**

#### **Registrasi**
- **Endpoint:** `POST /register`
- **Body Request:**
  ```json
  {
      "name": "John Doe",
      "email": "johndoe@example.com",
      "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
      "message": "User registered successfully!"
  }
  ```

#### **Login**
- **Endpoint:** `POST /login`
- **Body Request:**
  ```json
  {
      "email": "johndoe@example.com",
      "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
      "message": "Login successful"
  }
  ```
  > **Note:** Token JWT akan disimpan di cookie.

---

### **2. Manajemen Transaksi**

#### **Mendapatkan Semua Transaksi**
- **Endpoint:** `GET /transactions`
- **Header:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:**
  ```json
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
  ```

#### **Menambahkan Transaksi Baru**
- **Endpoint:** `POST /transactions`
- **Header:**
  ```
  Authorization: Bearer <token>
  ```
- **Body Request:**
  ```json
  {
      "amount": 1000,
      "type": "income",
      "date": "2025-01-01T10:00:00.000Z",
      "description": "Salary"
  }
  ```
- **Response:**
  ```json
  {
      "message": "Transaction created successfully!",
      "transaction": {
          "_id": "63b6f8e2a2c8e8f9a9e1d123",
          "user_id": "123456",
          "amount": 1000,
          "type": "income",
          "date": "2025-01-01T10:00:00.000Z",
          "description": "Salary"
      }
  }
  ```

#### **Memperbarui Transaksi**
- **Endpoint:** `PUT /transactions/:id`
- **Header:**
  ```
  Authorization: Bearer <token>
  ```
- **Body Request:**
  ```json
  {
      "amount": 1500,
      "description": "Updated Salary"
  }
  ```
- **Response:**
  ```json
  {
      "message": "Transaction updated successfully!",
      "transaction": {
          "_id": "63b6f8e2a2c8e8f9a9e1d123",
          "user_id": "123456",
          "amount": 1500,
          "type": "income",
          "date": "2025-01-01T10:00:00.000Z",
          "description": "Updated Salary"
      }
  }
  ```

#### **Menghapus Transaksi**
- **Endpoint:** `DELETE /transactions/:id`
- **Header:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:**
  ```json
  {
      "message": "Transaction deleted successfully!"
  }
  ```

---

### **3. Manajemen Anggaran (Budget)**

#### **Mendapatkan Semua Anggaran**
- **Endpoint:** `GET /budgets`
- **Header:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:**
  ```json
  {
      "budgets": [
          {
              "_id": "63b6f8e2a2c8e8f9a9e1d124",
              "user_id": "123456",
              "monthly_limit": 5000
          }
      ]
  }
  ```

#### **Menambahkan Anggaran Baru**
- **Endpoint:** `POST /budgets`
- **Header:**
  ```
  Authorization: Bearer <token>
  ```
- **Body Request:**
  ```json
  {
      "monthly_limit": 5000
  }
  ```
- **Response:**
  ```json
  {
      "message": "Budget created successfully!",
      "budget": {
          "_id": "63b6f8e2a2c8e8f9a9e1d124",
          "user_id": "123456",
          "monthly_limit": 5000
      }
  }
  ```

#### **Memperbarui Anggaran**
- **Endpoint:** `PUT /budgets/:id`
- **Header:**
  ```
  Authorization: Bearer <token>
  ```
- **Body Request:**
  ```json
  {
      "monthly_limit": 6000
  }
  ```
- **Response:**
  ```json
  {
      "message": "Budget updated successfully!"
  }
  ```

---

### **4. Laporan**

#### **Laporan Bulanan**
- **Endpoint:** `GET /reports/monthly`
- **Header:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:**
  ```json
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
  ```

#### **Laporan Tahunan**
- **Endpoint:** `GET /reports/yearly`
- **Header:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:**
  ```json
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
  ```

---

## Logging

- **Informasi:** Semua log aktivitas dicatat di konsol dan file `logs/combined.log`.
- **Error:** Semua error dicatat di file `logs/error.log`.

---

## Catatan

- Gunakan [Postman](https://www.postman.com/) atau alat serupa untuk menguji API ini.
- Pastikan MongoDB berjalan di komputer Anda sebelum menjalankan server.

---

Jika Anda memiliki pertanyaan atau menemukan masalah, silakan buat *issue* di repository ini! 🎉

