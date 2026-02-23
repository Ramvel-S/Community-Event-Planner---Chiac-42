# Community Event Planner App

## 📌 Project Overview

The Community Event Planner App is a web-based prototype that allows users to:

- Create community events
- Discover events
- RSVP to events
- Manage events they have created

The application is designed as a Minimum Viable Product (MVP) focusing on correctness, modularity, and collaborative team development.

The system uses a single shared UI for both organizers and attendees.
A user becomes an organizer simply by creating an event.

---

## 🌐 Live Deployment

The application is deployed on Vercel and can be accessed here:

https://community-event-planner.vercel.app/

---

## 🚀 Core Features

### 🔐 Authentication
- User Registration (Username + Email + Password)
- User Login
- Firebase Authentication (Email/Password – Backup Implementation)
- Authenticated user identity includes:
  - user.id
  - user.email
  - user.username

---

### 📅 Event Management
- Create events
- Edit events (only by event creator)
- Delete events (only by event creator)
- View event details

Each event contains:
- Title
- Date
- Time
- Location
- Description
- Category
- created_by (user ID)
- Attendees list

---

### 🔎 Event Discovery
- View all events
- Search events
- Filter events by date
- Filter events by category

---

### 🙋 RSVP System
- Users can RSVP to events
- Duplicate RSVPs are prevented
- Users can toggle RSVP
- Attendee list visible for each event

---

## 🏗️ System Architecture

High-Level Flow:

Next.js UI  
   ↓  
Service Layer (eventService.ts)  
   ↓  
Firebase Authentication + Firestore (Backup Full-Stack Implementation)

---

### Architecture Breakdown

lib/firebase.ts
- Initializes Firebase
- Exports authentication (auth)
- Exports Firestore database instance (db)

lib/eventService.ts
- Contains all Firestore CRUD operations
- Handles:
  - createEvent
  - updateEvent
  - deleteEvent
  - getEventById
  - subscribeEvents
  - toggleRSVP
- Enforces ownership logic

UI Components
- Call service layer functions
- Do NOT directly access Firestore

This separation ensures the system can later migrate to a MySQL backend without major UI changes.

---

## 🔒 Authorization Model

Ownership-based authorization:

If event.created_by === currentUser.uid  
    Allow edit/delete  
Else  
    Deny operation  

No role-based access control is used.

---

## 🛠️ Tech Stack

Frontend:
- Next.js (App Router)
- React
- TypeScript

Authentication (Backup Implementation):
- Firebase Authentication (Email/Password)

Database (Backup Implementation):
- Firebase Firestore

Intended Primary Database (As per Project Specification):
- MySQL

---

## 📂 Folder Structure

community-event-planner/

- app/ → Next.js pages and UI
- lib/
  - firebase.ts → Firebase initialization & auth setup
  - eventService.ts → Firestore event & RSVP logic
- package.json
- package-lock.json
- .env.local → Environment variables (not committed)
- README.md

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

git clone <repository-url>  
cd community-event-planner  

---

### 2️⃣ Install Dependencies

npm install  

---

### 3️⃣ Configure Environment Variables

Create a file named:

.env.local

Add the following:

NEXT_PUBLIC_FIREBASE_API_KEY=your_key  
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain  
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id  
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket  
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id  
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id  

Do NOT commit .env.local to GitHub.

---

### 4️⃣ Firebase Console Setup

In Firebase Console:

- Enable Email/Password Authentication
- Create Firestore Database
- Start in Test Mode for development

---

### 5️⃣ Run Development Server

npm run dev  

Open in browser:

http://localhost:3000  

---

## 🌿 Branch Strategy

- main → Stable team branch
- frontend → UI-only implementation
- frontend-firebase_auth → Firebase authentication backup
- frontend-firebase_fullstack → Firebase auth + Firestore backup full-stack implementation

---

## 👥 Team Work Distribution

Bhuvan → Frontend UI development  
Rayan → Authentication implementation  
Ramvel → Database implementation  
Abhishek → RSVP logic  
Manohar → Event management logic (Create, Edit, Delete operations)  
Zaid → Event listing, search, and filter logic  

---

## 📝 Important Notes

- Firebase implementation serves as a backup full-stack solution.
- The primary backend architecture is intended to use MySQL and API endpoints.
- The system follows ownership-based authorization.
- No role-based system (admin/organizer) is used.
- Users and organizers share the same UI.

---

## 🎯 Project Objective

To build a collaborative community event management system that demonstrates:

- Authentication handling
- Database integration
- CRUD operations
- Authorization enforcement
- RSVP participation logic
- Team-based modular development