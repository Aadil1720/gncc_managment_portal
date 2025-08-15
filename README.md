# GNCC Fees & Activities Management System

The **GNCC Fees & Activities Management System** is a full-stack MERN application designed for **GNCC Academy** to efficiently manage students, fee payments, and academy activities.  
It centralizes fee tracking, slip generation, and communication with students, while also managing other academy-related activities.

---

## 🚀 Features

### **Student Management**
- Add, update, and delete student profiles.
- Store personal details, admission number, contact info, and joining date.
- Search, filter, and sort students by multiple parameters.

### **Fee Management**
- Add and update monthly fees (tuition + transport).
- Track paid and pending fees.
- Filter and list fee defaulters.
- Generate detailed fee slips in **PDF format**.
- Send fee slips to students via **email**.

### **Activity Management**
- Record and manage extra-curricular activities.
- Maintain attendance or participation logs.
- Track and organize academy events.

### **Search, Filter & Pagination**
- Search by name, admission number, and other fields.
- Filter by payment status, month, or activity.
- Paginated lists for large datasets.

### **Notifications**
- Email notifications for fee payments and reminders.

---

## 🛠 Tech Stack

### **Frontend**
- React.js (with MUI for UI components)
- Axios for API calls
- Notistack for notifications
- React Router for navigation

### **Backend**
- Node.js & Express.js
- MongoDB with Mongoose
- Joi for request validation
- Multer for image uploads
- Puppeteer for PDF generation
- Nodemailer for sending emails

### **Environment Variables**
The following `.env` variables are required (store them in both frontend & backend where applicable):

#### **Backend**
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password


## 📂 Project Structure
gncc-management-system/
│
├── frontend/ # React frontend
│ ├── src/
│ ├── public/
│ └── package.json
│
├── backend/ # Node.js backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ └── package.json
│
└── README.md



## ⚙️ Installation & Setup

### **1. Clone the repository**
```bash
git clone https://github.com/your-username/gncc-management-portal.git
cd gncc-management-system

2. Setup Backend
bash
Copy
Edit
cd backend
npm install
cp .env.example .env   # Add your environment variables
npm run dev

3. Setup Frontend
bash
Copy
Edit
cd ../frontend
npm install

cp .env.example .env   # Add your environment variables
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

npm start
