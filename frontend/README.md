# Frontend - Private Clinic Management UI

Modern, responsive React application for the Private Clinic Management System.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm or yarn
- Backend API running on http://localhost:5000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/            # React Context
│   │   └── AuthContext.jsx
│   │
│   ├── pages/              # Page components
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── patient/
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── PatientProfile.jsx
│   │   │   ├── PatientAppointments.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   └── PatientMedicalRecords.jsx
│   │   └── doctor/
│   │       ├── DoctorDashboard.jsx
│   │       ├── DoctorAppointments.jsx
│   │       ├── DoctorPatients.jsx
│   │       ├── PatientDetail.jsx
│   │       ├── CreateMedicalRecord.jsx
│   │       └── ManageSpecialties.jsx
│   │
│   ├── services/           # API service layer
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── patientService.js
│   │   ├── doctorService.js
│   │   ├── appointmentService.js
│   │   ├── medicalRecordService.js
│   │   └── specialtyService.js
│   │
│   ├── App.jsx            # Main app with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles with Tailwind
│
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🎨 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **date-fns** - Date formatting and manipulation

## 🔐 Authentication Flow

### Auth Context
The `AuthContext` provides global authentication state:
- `user` - Current logged-in user
- `login(credentials)` - Login function
- `register(userData)` - Registration function
- `logout()` - Logout function
- `updateUser(user)` - Update user state
- `isAuthenticated` - Boolean flag
- `isPatient` - Boolean flag
- `isDoctor` - Boolean flag

### Protected Routes
Routes are protected using the `ProtectedRoute` component:
```jsx
<ProtectedRoute role="patient">
  <PatientDashboard />
</ProtectedRoute>
```

### Token Management
- Token stored in localStorage
- Automatically attached to API requests
- Auto-redirect to login on 401 errors

## 🛣️ Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Patient registration

### Patient Routes (Protected)
- `/patient/dashboard` - Patient dashboard
- `/patient/profile` - Edit profile
- `/patient/appointments` - View appointments
- `/patient/book-appointment` - Book new appointment
- `/patient/medical-records` - View medical records

### Doctor Routes (Protected)
- `/doctor/dashboard` - Doctor dashboard
- `/doctor/appointments` - Manage appointments
- `/doctor/patients` - Search patients
- `/doctor/patients/:id` - Patient detail view
- `/doctor/medical-records/create` - Create medical record
- `/doctor/specialties` - Manage specialties

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS with custom configuration:

#### Custom Colors
```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ... up to 900
  }
}
```

#### Custom Component Classes
Defined in `index.css`:
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.btn-danger` - Danger/delete button style
- `.input-field` - Input field style
- `.card` - Card container style
- `.badge-*` - Status badge styles

### Responsive Design
All components are mobile-responsive using Tailwind's responsive prefixes:
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid */}
</div>
```

## 🔧 API Service Layer

### Structure
Each API domain has its own service:

```javascript
// Example: appointmentService.js
export const appointmentService = {
  createAppointment: async (data) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },
  // ... more methods
};
```

### Axios Interceptors
Request interceptor adds auth token:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Response interceptor handles 401 errors:
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
    }
    return Promise.reject(error);
  }
);
```

## 📱 Key Features

### Patient Features

#### Dashboard
- View summary statistics
- See upcoming appointments
- Quick actions for booking

#### Book Appointment
- Select doctor
- Choose date and time slot
- Provide reason for visit
- View doctor information

#### View Appointments
- Filter by status (all, upcoming, past)
- Cancel appointments (24h+ in advance)
- See appointment details

#### Medical Records
- View all medical records
- See diagnoses and prescriptions
- Doctor information for each record

### Doctor Features

#### Dashboard
- Today's appointments count
- Pending approvals count
- Quick access to key features

#### Appointment Management
- View all clinic appointments
- Filter by status and date
- Approve/confirm appointments
- Mark appointments as completed
- Cancel appointments

#### Patient Management
- Search patients by name, email, or phone
- View detailed patient information
- See patient history
- View appointments and medical records

#### Medical Record Creation
- Search and select patient
- Enter diagnosis and symptoms
- Add multiple prescriptions
- Add notes and recommendations

#### Specialty Management
- Add new specialties
- Edit existing specialties
- Delete specialties

## 🔄 State Management

### Global State (Context)
- Authentication state
- User information

### Local State (useState)
- Component-level data
- Form inputs
- Loading states
- Error messages

## 🎯 Form Handling

### Pattern Used
```jsx
const [formData, setFormData] = useState({
  field1: '',
  field2: ''
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // Submit logic
};
```

## 🖼️ Date Formatting

Using `date-fns` for consistent date display:
```javascript
import { format } from 'date-fns';

// Display format
format(new Date(date), 'MMM dd, yyyy')
// Output: Jan 15, 2024

// Day of week
format(new Date(date), 'EEEE, MMM dd, yyyy')
// Output: Monday, Jan 15, 2024
```

## 🚀 Build and Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

This creates an optimized build in the `dist` folder.

### Preview Production Build
```bash
npm run preview
```

### Deployment Options

#### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Environment variable: `VITE_API_URL=https://your-api.com/api`

#### Vercel
1. Framework preset: Vite
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variable: `VITE_API_URL=https://your-api.com/api`

#### AWS S3 + CloudFront
```bash
# Build the app
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## 🔧 Configuration

### Vite Config (`vite.config.js`)
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

### Environment Variables
Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Access in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

## 🎨 Customization

### Changing Theme Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      }
    }
  }
}
```

### Adding New Components
1. Create component in `src/components/`
2. Import and use in pages
3. Add to component library

## 🐛 Common Issues

### API Connection Error
**Issue**: Cannot connect to backend
**Solution**: 
1. Ensure backend is running on port 5000
2. Check VITE_API_URL in .env
3. Check proxy configuration in vite.config.js

### Token Expired
**Issue**: User gets logged out randomly
**Solution**: Token expires after 7 days. This is normal. User needs to login again.

### Styling Not Applied
**Issue**: Tailwind classes not working
**Solution**:
1. Restart dev server
2. Check tailwind.config.js content paths
3. Ensure @tailwind directives are in index.css

## 📚 Dependencies

### Production
- `react` & `react-dom` - React library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `date-fns` - Date utilities

### Development
- `@vitejs/plugin-react` - Vite React plugin
- `tailwindcss` - CSS framework
- `autoprefixer` - CSS vendor prefixing
- `postcss` - CSS processing

## 🤝 Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Keep components small and focused
4. Write descriptive prop types
5. Add comments for complex logic

## 📄 License

MIT License



