# 🚀 Community Event Planner

A modern web application built using **Next.js** and **Firebase** that allows users to discover, create, and manage community events in real time.

This project demonstrates a clean full-stack architecture with reusable components, real-time database updates, and secure authentication.

---

## ✨ Overview

Community Event Planner helps users:

✅ Browse upcoming events
✅ View detailed event information
✅ Create and manage their own events
✅ RSVP to events
✅ Experience real-time updates powered by Firebase

The application uses Next.js App Router architecture combined with Firebase backend services.

---

## 🧠 Tech Stack

### Frontend

* ⚛️ React
* 🚀 Next.js (App Router)
* 🟦 TypeScript
* 🎨 CSS Modules + Global CSS

### Backend Services

* 🔥 Firebase Authentication
* 🗄️ Firebase Firestore Database

### Tooling

* ESLint (code quality)
* Modern Next.js architecture

---

## 📂 Project Structure

```
community-event-planner/
│
├── app/                     # Next.js pages and routing
│   ├── page.tsx             # Home / signup page
│   ├── events/
│   │   ├── page.tsx         # Events list
│   │   └── [id]/page.tsx    # Event details (dynamic route)
│   ├── create-event/        # Create event page
│   ├── edit-event/[id]/     # Edit event page
│   └── layout.tsx           # Global layout (Navbar, styles)
│
├── components/              # Reusable UI components
│   ├── Navbar
│   ├── EventCard
│   └── SearchWidget
│
├── lib/
│   ├── firebase.ts          # Firebase initialization + auth helpers
│   └── eventService.ts      # Event business logic
│
├── globals.css              # Global styles
└── README.md
```

---

## 🏗️ Architecture Overview

The project follows a clean layered architecture:

```
UI Pages (Next.js app/)
        ↓
Reusable Components
        ↓
Event Service (business logic)
        ↓
Firebase Setup (auth + database)
        ↓
Firebase Backend
```

This separation keeps the code:

* Maintainable
* Scalable
* Easy to understand

---

## 🔥 Key Features Explained

### 🧭 File-Based Routing (Next.js)

Routes are automatically generated from folder structure:

```
app/page.tsx            → /
app/events/page.tsx     → /events
app/events/[id]/        → /events/:id
```

---

### ⚡ Real-Time Updates

Uses Firestore `onSnapshot()`:

* Events update automatically
* No page refresh needed

---

### 🔐 Authentication

Firebase Auth handles:

* User signup
* Login
* Logout
* Profile updates

---

### 🎯 Business Logic Separation

* `firebase.ts` → Firebase initialization + auth helpers
* `eventService.ts` → All event-related logic

This improves readability and maintainability.

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd community-event-planner
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

### 4️⃣ Run development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🧪 Learning Goals

This project demonstrates:

* Next.js App Router architecture
* Dynamic routing
* Component-based design
* Firebase integration
* Clean separation of concerns


---

## 👨‍💻 Author

Bhuvan T Raj

---

## ⭐ Future Improvements

* Event categories filtering
* Better UI animations
* Pagination
* Admin dashboard

---

## 📄 License

This project is for learning and demonstration purposes.
