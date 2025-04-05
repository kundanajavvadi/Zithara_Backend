# 🧠 Zithara Backend API

This is the backend server for the **Zithara Job Portal**. It provides RESTful APIs for managing users, companies, jobs, and job applications. The system is built with **Node.js**, **Express**, **MongoDB**, and includes **WebSocket support** and **rate limiting** for enhanced performance and security.

---

## 📚 API Documentation

- ✅ **Production Server**: [https://zithara-backend4.onrender.com/api/v1/api-docs](https://zithara-backend4.onrender.com/api/v1/api-docs)  
- 🛠️ **Development Server (Localhost)**: [http://localhost:3000/api/v1/api-docs](http://localhost:3000/api/v1/api-docs)

The API is fully documented using **Swagger UI**.

---

## 🧩 Technologies Used

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Swagger** for API documentation
- **WebSockets** for real-time updates
- **Rate Limiting** middleware
- **JWT-based** authentication

---

## 📦 API Routes Overview

### 1️⃣ Users (`/api/v1/user`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | [Register](https://zithara-backend4.onrender.com/api/v1/user/register) a new user (`role` should be `"student"` or `"admin"`) |
| `POST` | `/login` | [Login](https://zithara-backend4.onrender.com/api/v1/user/login) user and receive token. The token must be placed in Authorize section in Swagger. | 
| `GET`  | `/logout` | [Logout](https://zithara-backend4.onrender.com/api/v1/user/logout) current user |
| `PUT`  | `/update-profile/{userId}` | [Update Profile](https://zithara-backend4.onrender.com/api/v1/user/update-profile/{userId}) |

---

### 2️⃣ Company (`/api/v1/company`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register-company` | [Register Company](https://zithara-backend4.onrender.com/api/v1/company/register-company) |
| `GET`  | `/get-companies` | [Get All Companies](https://zithara-backend4.onrender.com/api/v1/company/get-companies) |
| `GET`  | `/get-company/{id}` | [Get Single Company](https://zithara-backend4.onrender.com/api/v1/company/get-company/{id}) |
| `PUT`  | `/update-company/{id}` | [Update Company](https://zithara-backend4.onrender.com/api/v1/company/update-company/{id}) |

---

### 3️⃣ Job (`/api/v1/job`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/admin/post-job` | [Post a Job](https://zithara-backend4.onrender.com/api/v1/job/admin/post-job) (Position data type is Number) |
| `GET`  | `/get/jobs` | [Get All Jobs](https://zithara-backend4.onrender.com/api/v1/job/get/jobs) (title filters: SDE, Frontend Developer, etc.) |
| `GET`  | `/get/jobs/{id}` | [Get Job by ID](https://zithara-backend4.onrender.com/api/v1/job/get/jobs/{id}) |
| `GET`  | `/admin/jobs` | [Get My Posted Jobs](https://zithara-backend4.onrender.com/api/v1/job/admin/jobs) |

---

### 4️⃣ Application (`/api/v1/application`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/apply/{id}` | [Apply for Job](https://zithara-backend4.onrender.com/api/v1/application/apply/{id}) |
| `GET`  | `/get/appliedjobs` | [View My Applications](https://zithara-backend4.onrender.com/api/v1/application/get/appliedjobs) |
| `GET`  | `/7890/applicants` | [View Applicants](https://zithara-backend4.onrender.com/api/v1/application/7890/applicants) |
| `PUT`  | `/status/hh/update` | [Update Application Status](https://zithara-backend4.onrender.com/api/v1/application/status/hh/update) |

---

## 🔒 Security & Optimization

- ✅ **JWT Authentication** for secure route access  
- ⚙️ **Rate Limiting** to prevent abuse and DDoS attacks  
- 📡 **WebSocket Integration** for real-time updates (e.g., job postings, status)  
- 🌐 **CORS Enabled** for frontend-backend communication  
- 🧪 **Input Validation** to ensure safety and data consistency  

---

## 🔧 Development Setup

```bash
# Clone the repository
git clone https://github.com/kundanajavvadi/Zithara_backend.git
cd Zithara_backend

# Install dependencies
npm install

# Run the development server
node index.js
