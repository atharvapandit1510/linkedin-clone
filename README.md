# linkedin-clone
LinkedIn Clone - Full-Stack MERN Project

A simple social media app where users can sign up, log in, create posts with text and images, and interact with a global feed.

Features

Authentication: JWT-based user sign-up and login.

Post CRUD: Create, edit, and delete your own posts.

Image Uploads: Attach an image to new posts.

Interactions: Like, unlike, and comment on any post.

Profile Page: View a dedicated profile page for any user, showing all their posts.

UI: User avatars (initials) and a clean, responsive layout.

Tech Stack

Frontend: React.js, React Router, Axios, CSS

Backend: Node.js, Express.js

Database: MongoDB (with Mongoose)

File Handling: multer

Auth: JWT, bcryptjs

How to Run Locally

1. Backend (Server)

# Clone the main project
git clone [https://github.com/atharvapandit1510/linkedin-clone.git]
cd YOUR_REPO_NAME/server

# Install dependencies
npm install

# Create a .env file with your MONGO_URI and JWT_SECRET
# Get MONGO_URI from MongoDB Atlas
# (Remember to allow 0.0.0.0/0 IP access in Atlas)
cp .env.example .env 

# Create the uploads folder
mkdir uploads

# Start the server
node server.js
# Server runs on http://localhost:5000


2. Frontend (Client)

# Open a new terminal
cd ../client

# Install dependencies
npm install

# Start the client
npm start
# Client runs on http://localhost:3000

