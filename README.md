# PDF Master Pro

PDF Master Pro is a web-based PDF utility application that allows
users to perform common PDF operations online.

## Features

- User Signup and Login
- JWT Authentication
- Merge Multiple PDF Files
- Split PDF Files
- Compress PDF Files
- Convert Images to PDF
- Automatic PDF Download
- User-wise PDF History
- Delete History
- File Upload Validation
- Maximum File Size Validation
- Responsive Dashboard

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Font Awesome

### Backend

- Node.js
- Express.js
- Multer
- pdf-lib
- JWT
- bcryptjs

### Database

- MongoDB
- Mongoose

## Project Structure

```text
master pdf/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   ├── uploads/
│   ├── output/
│   └── server.js
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── pages/
│   └── index.html
│
└── README.md