# 🧠 Zithara Backend API

This is the backend server for the **Zithara Job Portal**. It provides RESTful APIs for managing users, companies, jobs, and job applications. The system is built with Node.js, Express, MongoDB, and includes WebSocket support and rate limiting for enhanced performance and security.

---

## 📚 API Documentation

- ✅ **Production Server**: [https://zithara-backend4.onrender.com/api/v1/api-docs](https://zithara-backend4.onrender.com/api/v1/api-docs)
- 🛠️ **Development Server(locally)**: [http://localhost:3000/api/v1/api-docs](http://localhost:3000/api/v1/api-docs)

The API is fully documented using Swagger UI.

---

## 🧩 Technologies Used

- Node.js + Express.js
- MongoDB + Mongoose
- Swagger for API docs
- WebSockets (real-time updates)
- Rate limiting middleware
- JWT-based authentication

---

## 📦 API Routes Overview (Production URLs)

### 1️⃣ Users (`/api/v1/user`)

| Method | URL                                                                 | Description                       |
|--------|----------------------------------------------------------------------|-----------------------------------|
| POST   | `/api/v1/user/register`                                              | [Register](https://zithara-backend4.onrender.com/api/v1/user/register) a new user(role should be either "student" or "admin"
| POST   | `/api/v1/user/login`                                                | [Login](https://zithara-backend4.onrender.com/api/v1/user/login) user and receive token |
| GET    | `/api/v1/user/logout`                                               | [Logout](https://zithara-backend4.onrender.com/api/v1/user/logout) current user |
| PUT    | `/api/v1/user/update-profile/{userId}`                              | [Update Profile](https://zithara-backend4.onrender.com/api/v1/user/update-profile/{userId}) |

---

### 2️⃣ Company (`/api/v1/company`)

| Method | URL                                                                     | Description                         |
|--------|--------------------------------------------------------------------------|-------------------------------------|
| POST   | `/api/v1/company/register-company`                                       | [Register Company](https://zithara-backend4.onrender.com/api/v1/company/register-company) |
| GET    | `/api/v1/company/get-companies`                                          | [Get All Companies](https://zithara-backend4.onrender.com/api/v1/company/get-companies) |
| GET    | `/api/v1/company/get-company/{id}`                                       | [Get Single Company](https://zithara-backend4.onrender.com/api/v1/company/get-company/{id}) |
| PUT    | `/api/v1/company/update-company/{id}`                                    | [Update Company](https://zithara-backend4.onrender.com/api/v1/company/update-company/{id}) |

---

### 3️⃣ Job (`/api/v1/job`)

| Method | URL                                                                         | Description                          |
|--------|------------------------------------------------------------------------------|--------------------------------------|
| POST   | `/api/v1/job/admin/post-job`                                                | [Post a Job](https://zithara-backend4.onrender.com/api/v1/job/admin/post-job) |
| GET    | `/api/v1/job/get/jobs`                                                      | [Get All Jobs](https://zithara-backend4.onrender.com/api/v1/job/get/jobs) |
| GET    | `/api/v1/job/get/jobs/{id}`                                                 | [Get Job by ID](https://zithara-backend4.onrender.com/api/v1/job/get/jobs/{id}) |
| GET    | `/api/v1/job/admin/jobs`                                                    | [Get My Posted Jobs](https://zithara-backend4.onrender.com/api/v1/job/admin/jobs) |

---

### 4️⃣ Application (`/api/v1/application`)

| Method | URL                                                                                       | Description                              |
|--------|--------------------------------------------------------------------------------------------|------------------------------------------|
| POST   | `/api/v1/application/apply/{id}`                                                           | [Apply for Job](https://zithara-backend4.onrender.com/api/v1/application/apply/{id}) |
| GET    | `/api/v1/application/get/appliedjobs`                                                     | [View My Applications](https://zithara-backend4.onrender.com/api/v1/application/get/appliedjobs) |
| GET    | `/api/v1/application/7890/applicants`                                                     | [View Applicants](https://zithara-backend4.onrender.com/api/v1/application/7890/applicants) |
| PUT    | `/api/v1/application/status/hh/update`                                                    | [Update Application Status](https://zithara-backend4.onrender.com/api/v1/application/status/hh/update) |

---

## 🔒 Security & Optimization

- ✅ **JWT Authentication** for secure access  
- ⚙️ **Rate Limiting** to prevent abuse and DDOS  
- 📡 **WebSocket Integration** for real-time features (e.g., job updates, application status)  
- 🌐 **CORS Enabled** for frontend-backend communication  
- 🧪 **Input Validation** for safety and consistency  

---

## 🔧 Development Setup

```bash
# Clone the repository
git clone https://github.com/kundanajavvadi/Zithara_backend.git
cd Zithara_backend

# Install dependencies
npm install

# Run development server
node index.js
