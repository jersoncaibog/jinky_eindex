# Student E-Index System 💝

A modern student record management system with RFID integration, created with love as an academic requirement. This project is dedicated to my wife Jinky, whose pursuit of education and determination to excel in her studies continues to inspire me.

## 💕 Dedication

This project is a labor of love, dedicated to my wonderful wife, Jinky. As a student herself, she understands the importance of efficient academic record management. 

## 🎯 What Does This Project Do?

The Student E-Index System helps manage student records with these cool features:

- Quick student lookup using RFID cards 🔍
- Easy-to-use student record management 📝
- Track academic performance with style 📊
- Beautiful pink-themed interface 💗
- Smart filtering and search options 🔎

## 🚀 Tech Stack (For Beginners)

Here's what makes this project work:

### Frontend (What You See):

- HTML5 (The structure)
- CSS3 with a custom pink theme (Makes it pretty)
- JavaScript (Makes it interactive)
- Bootstrap 5.3.2 (Makes it responsive)
- Font Awesome 6.0.0 (Adds nice icons)

### Backend (Behind the Scenes):

- Node.js (Runs the server)
- Express.js (Handles web requests)
- MariaDB (Stores the data)

## 🛠️ Setting Up (Complete Beginner's Guide)

### Step 1: Install Required Software

1. Download and install Node.js

   - Go to [nodejs.org](https://nodejs.org)
   - Download the "LTS" version (it's more stable)
   - Run the installer and follow the prompts

2. Install MariaDB

   - Go to [mariadb.org/download](https://mariadb.org/download)
   - Download the version for your system
   - During installation:
     - Remember the root password you set
     - Use port 3307 (important!)

3. Install Git
   - Go to [git-scm.com](https://git-scm.com)
   - Download and install for your system

### Step 2: Get the Project Files

Open Terminal in your IDE (eg VS Code or Cursor IDE) and type:

```bash
# Clone the project
git clone git clone https://github.com/yourusername/jinky-e-index.git

# Go into the project folder
cd jinky-e-index
```

### Step 3: Set Up the Database

1. Open MariaDB command prompt (search for it in Start menu)
2. Log in with your password:
   ```sql
   mysql -u root -p
   ```
3. Create the database:
   ```sql
   CREATE DATABASE jinky_eindex;
   ```
4. Exit MariaDB with: `exit`

5. Import the database structure:

   ```bash
   mysql -u root -p jinky_eindex < backend/src/config/schema.sql
   ```

6. Import sample data (optional but recommended):
   ```bash
   mysql -u root -p jinky_eindex < backend/src/config/sample-data.sql
   ```

### Step 4: Configure the Project

1. Go to the backend folder and copy the example environment file:

   ```bash
   cd backend
   copy .env.example .env
   ```

2. Edit the `.env` file (use Notepad or any text editor):
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3307
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=jinky_eindex
   ```

### Step 5: Install Project Dependencies

In the backend folder, run:

```bash
npm install
```

### Step 6: Start the Project

1. Start the server:

   ```bash
   npm run dev
   ```

2. Open your web browser and go to:
   `http://localhost:3000`

You should see the pink-themed student management system! 🎉

## 🎮 How to Use

1. **View Students:**

   - All students are shown in the main table
   - Use the search box to find specific students
   - Filter by course, year, or section

2. **RFID Scanner:**

   - Enter an RFID number to quickly find students
   - View their details instantly

3. **Student Records:**
   - Click on a student to see their records
   - Add or edit academic records
   - Filter records by category

## 🤝 Need Help?

If you're stuck or something's not working:

1. Double-check all the steps above
2. Make sure MariaDB is running
3. Verify your database password in the `.env` file
4. Check if port 3000 is free on your computer

## 💝 Special Thanks

This project would not be possible without:

- My beloved wife Jinky, who inspires me to grow and learn
- The amazing open-source community
- My professors and mentors who guided me

---

Made with 💗 for Jinky | Academic Project February 2025
