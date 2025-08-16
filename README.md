# GNCC Fees & Activities Management System

The **GNCC Fees & Activities Management System** is a full-stack MERN application designed for **GNCC Academy** to efficiently manage students, fee payments, and academy activities.  
It centralizes fee tracking, slip generation, and communication with students, while also managing other academy-related activities.

---

## 🚀 Project UI

#Login Page
<img width="1339" height="583" alt="gncc-fees1" src="https://github.com/user-attachments/assets/890c8a75-c2b3-4eb4-a6e4-f00405078a3d" />

#Dashboard
<img width="1336" height="546" alt="gnccFees3" src="https://github.com/user-attachments/assets/cb7ae8df-ce9a-4126-a157-8e04b8b00093" />

#Students Managment UI
<img width="1328" height="579" alt="gncc-fees2" src="https://github.com/user-attachments/assets/79d68c1c-ce53-49ed-b6fc-4bc3d50889db" />

#Student Viewbar
<img width="1339" height="567" alt="gncc7" src="https://github.com/user-attachments/assets/88f4f101-f883-4f29-9e8a-ac64be75b4d4" />

#Stduent Forms

<img width="1325" height="574" alt="gncc5" src="https://github.com/user-attachments/assets/ddc1f674-8772-4ca3-a49e-194984c55b3f" />
<img width="1355" height="537" alt="gncc6" src="https://github.com/user-attachments/assets/c36bd54c-60d7-433e-97ca-cc81ffe0157c" />

#Fees Managment
<img width="1329" height="571" alt="gncc8" src="https://github.com/user-attachments/assets/9870124b-c3db-432a-9ad2-1fba392c8d87" />


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
