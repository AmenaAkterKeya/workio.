# Workio

**Workio** is a web platform designed to streamline project management and enhance team collaboration. With features for creating boards, lists, and cards, teams can organize tasks effectively, set priorities, and manage project workflows in a user-friendly environment.

---

## Main Features

- **User Authentication**: Secure user registration and login.
- **Task Organization**: Create boards, lists, and cards to organize and track tasks.
- **Role-Based Permissions**: 
  - **Admins**: Manage lists and cards, view member details.
  - **Members**: View, edit cards, and set priorities and statuses.
- **Responsive UI/UX**: Optimized for use across devices.

---

## Technologies Used

### Frontend
- **HTML, CSS, JavaScript**: Core web technologies for structure, styling, and interactivity.
- **Bootstrap**: Responsive design framework.

### Backend
- **Python 3.x**: Programming language.
- **Django**: Web framework for backend development.
- **Django REST Framework**: API development for seamless frontend-backend communication.

---

## Live Demo

- **Frontend**: [Workio Frontend](https://amenaakterkeya.github.io/workio./index.html)
- **Backend**: [Workio Backend](https://workio-theta.vercel.app/)

---

## API Endpoints

### User Management
- **POST** `/api/account/register/` - Register a new user.
- **POST** `/api/account/login/` - User login.

### Board Management
- **GET** `/api/board/board/` - List all boards.
- **GET** `/api/board/board/{id}/` - Retrieve a specific board’s details.

### List Management
- **GET** `/api/board/list/` - Retrieve all lists within boards.
- **POST** `/api/board/list/` - Add a new list.
- **PUT** `/api/board/{board_id}/list/{list_id}/` - Update a specific list.
- **DELETE** `/api/board/{board_id}/list/{list_id}/` - Delete a specific list.

### Card Management
- **GET** `/api/board/card/` - Retrieve all cards.
- **POST** `/api/board/list/{list_id}/card/` - Add a new card to a list.
- **PUT** `/api/board/card/{card_id}/` - Update a specific card.
- **DELETE** `/api/board/card/{card_id}/` - Delete a specific card.

### Member Management
- **POST** `/api/board/{board_id}/addmember/` - Add a new member to a board.
- **GET** `/api/board/member/{board_id}/` - Retrieve members of a board.

---

## Installation & Running the App

### Prerequisites
- **Python 3.x**
- **Django** and **Django REST Framework**

### Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/username/workio.git
   cd workio
2. **Install Dependencies:**:
   ```bash
   pip install -r requirements.txt
3. **Run Database Migrations:**:
   ```bash
   python manage.py migrate
4. **Start the Development Server:**:
   ```bash
   python manage.py runserver
5. **Run Tests:**:
   ```bash
   python manage.py test
The backend server will be accessible at http://localhost:8000/api/.

## Technologies Used

This project is licensed under the MIT License.
This version includes all information within a single structured flow in `README.md`. It’s designed for easy access and readability for anyone interacting with the repository.
