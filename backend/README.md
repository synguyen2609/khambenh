# Backend - Private Clinic Management API

RESTful API for the Private Clinic Management System built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB v5+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Seed the database
npm run seed

# Start development server
npm run dev
```

## 📁 Project Structure

```
backend/
├── controllers/           # Request handlers
│   ├── authController.js
│   ├── patientController.js
│   ├── doctorController.js
│   ├── appointmentController.js
│   ├── medicalRecordController.js
│   └── specialtyController.js
│
├── middleware/           # Middleware functions
│   ├── auth.js          # JWT authentication
│   └── errorHandler.js  # Centralized error handling
│
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Specialty.js
│   ├── Appointment.js
│   └── MedicalRecord.js
│
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── patientRoutes.js
│   ├── doctorRoutes.js
│   ├── appointmentRoutes.js
│   ├── medicalRecordRoutes.js
│   └── specialtyRoutes.js
│
├── utils/               # Utility functions
│   └── generateToken.js
│
├── server.js           # Main server file
├── seed.js             # Database seeding script
└── package.json
```

## 🗄️ Database Models

### User Model
- **Role**: patient or doctor
- **Common fields**: name, email, phone, password
- **Patient fields**: gender, dob, address
- **Doctor fields**: specialty, bio, yearsOfExperience

### Specialty Model
- name
- description

### Appointment Model
- patient (ref: User)
- doctor (ref: User)
- date
- timeSlot
- reason
- status (pending, confirmed, completed, cancelled)

### MedicalRecord Model
- patient (ref: User)
- doctor (ref: User)
- appointment (optional ref: Appointment)
- diagnosis
- symptoms
- notes
- prescriptions (array of medicine details)

## 🔐 Authentication

### JWT Token Authentication
- Token expires in 7 days
- Include in Authorization header: `Bearer <token>`
- Token returned on login and registration

### Password Security
- Hashed with bcrypt (10 salt rounds)
- Never returned in API responses
- Verified using bcrypt.compare()

## 🛣️ API Routes

### Authentication Routes (`/api/auth`)
```
POST   /register    - Register new patient
POST   /login       - Login user (patient/doctor)
GET    /me          - Get current user info
```

### Patient Routes (`/api/patients`)
All require authentication with patient role.
```
GET    /me                    - Get patient profile
PUT    /me                    - Update patient profile
GET    /me/appointments       - Get patient's appointments
GET    /me/medical-records    - Get patient's medical records
```

### Doctor Routes (`/api/doctors`)
```
GET    /                      - Get all doctors (public)
GET    /me/appointments       - Get doctor's appointments (auth)
GET    /patients              - Search patients (auth, doctor)
GET    /patients/:id          - Get patient details (auth, doctor)
PUT    /patients/:id          - Update patient (auth, doctor)
```

### Appointment Routes (`/api/appointments`)
```
POST   /                  - Create appointment (auth, patient)
GET    /                  - Get appointments (auth)
GET    /:id               - Get appointment by ID (auth)
PATCH  /:id/status        - Update status (auth, doctor)
PATCH  /:id/cancel        - Cancel appointment (auth, patient)
```

### Medical Record Routes (`/api/medical-records`)
```
GET    /patient/:patientId  - Get patient's records (auth, doctor)
GET    /:id                 - Get record by ID (auth)
POST   /                    - Create record (auth, doctor)
PUT    /:id                 - Update record (auth, doctor)
DELETE /:id                 - Delete record (auth, doctor)
```

### Specialty Routes (`/api/specialties`)
```
GET    /          - Get all specialties (public)
GET    /:id       - Get specialty by ID (public)
POST   /          - Create specialty (auth, doctor)
PUT    /:id       - Update specialty (auth, doctor)
DELETE /:id       - Delete specialty (auth, doctor)
```

## 🔧 Environment Variables

Create a `.env` file with the following:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/clinic_management

# JWT Secret (use a strong random string in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

## 📊 Database Seeding

Run the seed script to populate the database with sample data:

```bash
npm run seed
```

This creates:
- **2 doctors** with different specialties
- **3 patients** with complete profiles
- **4 specialties** (General Medicine, Cardiology, Pediatrics, Dermatology)
- **3 sample appointments**
- **1 medical record** with prescriptions

### Default Accounts After Seeding:

**Doctor:**
- Email: `doctor@clinic.com`
- Password: `doctor123`

**Patient:**
- Email: `patient@test.com`
- Password: `patient123`

## 🛡️ Middleware

### Authentication Middleware (`authMiddleware`)
- Verifies JWT token
- Attaches user to request object
- Returns 401 if token is invalid or missing

### Doctor Only Middleware (`doctorOnlyMiddleware`)
- Checks if authenticated user is a doctor
- Returns 403 if not authorized

### Error Handler Middleware
- Catches all errors
- Returns consistent JSON error responses
- Handles Mongoose validation errors
- Handles duplicate key errors

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

### List Response
```json
{
  "success": true,
  "count": 10,
  "data": [
    // array of items
  ]
}
```

## 🧪 Testing API with cURL

### Register a Patient
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "dob": "1990-01-01",
    "gender": "male",
    "address": "123 Main St"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@clinic.com",
    "password": "doctor123"
  }'
```

### Get Current User (with token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🚀 Deployment

### Production Checklist
- [ ] Change JWT_SECRET to a strong random string
- [ ] Use MongoDB Atlas or managed MongoDB service
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for your frontend domain
- [ ] Set up logging (Winston, Morgan)
- [ ] Use PM2 or similar process manager
- [ ] Set up monitoring (New Relic, DataDog)
- [ ] Enable rate limiting
- [ ] Add input sanitization
- [ ] Set up automated backups

### Example PM2 Configuration
```bash
# Install PM2
npm install -g pm2

# Start the server
pm2 start server.js --name clinic-api

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
```

## 📚 Dependencies

### Core Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables
- `cors` - Cross-origin resource sharing
- `express-validator` - Input validation

### Dev Dependencies
- `nodemon` - Development auto-restart

## 🐛 Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### JWT Token Expired
```json
{
  "success": false,
  "message": "Token expired. Please login again."
}
```
**Solution**: Login again to get a new token

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 Contributing

1. Follow the existing code style
2. Write descriptive commit messages
3. Add comments for complex logic
4. Test your changes thoroughly

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.



