# User Management System

## Overview

This project is a User Management System built with Vue.js for the frontend, Flask for the backend, and MongoDB as the database. It allows you to create, read, update, and delete user information, including roles and timezones.

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- Vue CLI
- Python (v3.7 or higher)
- MongoDB
- MongoDB Shell

## Project Structure

The project consists of three main parts:

1. **backend**: Contains the Flask backend logic and the `parser.py` script for importing data.
2. **data**: Contains the `udata.json` file which needs to be loaded into MongoDB.
3. **frontend**: Contains the Vue.js frontend.

## Setup Instructions

### 1. Clone the Repository

Clone this repository to your local machine:

```sh
git clone https://github.com/your-repo/user-management-system.git
cd user-management-system
```

### 2. MongoDB Setup

#### Install MongoDB and MongoDB Shell

Follow the official MongoDB installation instructions for your operating system:

- [MongoDB Installation](https://www.mongodb.com/docs/manual/installation/)
- [MongoDB Shell Installation](https://www.mongodb.com/docs/mongodb-shell/install/)

#### Start MongoDB

Ensure MongoDB is running before proceeding:

```sh
mongod --dbpath /path/to/your/database
```

### 3. Backend Setup

Navigate to the backend folder:

```sh
cd backend
```

#### Install Dependencies

Install the required Python dependencies:

```sh
pip install -r requirements.txt
```

#### Configure Database

Ensure your `app.py` file has the correct MongoDB configuration:

```python
client = MongoClient("mongodb://localhost:27017/")
db = client["prodDatabase"]
users_collection = db["users"]
```

#### Run the Backend

Start the Flask server:

```sh
python app.py
```

The backend server should now be running on [http://127.0.0.1:5000](http://127.0.0.1:5000).

### 4. Load Initial Data into MongoDB

Run the provided `parser.py` script to parse and insert the data from `udata.json` into MongoDB:

```sh
python parser.py
```

This script reads the `udata.json` file, parses it using the predefined `User` and `UserPreferences` dataclasses, and inserts it into the `users` collection.

### 5. Frontend Setup

Navigate to the frontend folder:

```sh
cd ../frontend
```

#### Install Dependencies

Install the required dependencies:

```sh
npm install
```

### 6. Start the Frontend Development Server

Run the following command to start the development server:

```sh
npm run serve
```

The application should now be running on [http://localhost:8080](http://localhost:8080).

## Features

- **User Management**: Create, read, update, and delete users.
- **Role Management**: Assign roles to users (admin, manager, tester).
- **Timezone Management**: Set and display user timezones.
- **Dark Mode Toggle**: Switch between light and dark modes.

## Usage

- **Create User**: Click "Create User" button to add a new user.
- **Edit User**: Click the pencil icon next to a user to edit their information.
- **Delete User**: Click the trash icon next to a user to delete them.
- **View User**: Click on a user's username to view their detailed information.

## Contact
If you have any questions or suggestions, feel free to get in touch:

LinkedIn: [Robson Fernando](https://www.linkedin.com/in/robsonffdossantos)
