# Workio.

Workio is a web platform designed to streamline project management and enhance collaboration among teams.

## Main Feature

- Users can register and log in securely.
- Users can create boards, lists, and cards to organize tasks.
- Admins and members can set card priorities and statuses.
- Members can view and edit cards.
- Admins can manage lists, cards, and view member details.
- Responsive UI/UX design

## Technologies Used

  ### Frontend Development
      - HTML
      - CSS
      - Bootstrap
      - JavaScript

  ### Backend Development
     - Python 3.x
     - Django
     - Django REST framework

## Frontend Live Site

- [Live Site URL](https://amenaakterkeya.github.io/workio./)

 ## Backend Live Site

- [Live Link URL](https://workio-ypph.onrender.com/account/)

 ## API Endpoints (For Backend Projects)

### User Management
- **POST** `/api/account/register/` - Register a new user
- **POST** `/api/account/login/` - User login

### Board Browsing
- **GET** `/api/board/board/` - List all boards
- **GET** `/api/board/board/id/` - Get details of a specific board

### List Management
- **GET** `/api/board/list/` - View lists
- **POST** `/api/board/list/` - Add a list
- **PUT** `/api/board/board/board_id/list/list_id/` - Update a list
- **DELETE** `/api/board/board/board_id/list/list_id/` - Remove a list

### Card Management
- **GET** `/api/board/card/` - View cards
- **POST** `/api/board/list/list_id/card/` - Add a card
- **PUT** `/api/board/card/card_id/` - Update a card
- **DELETE** `/api/board/card/card_id/` - Remove a card

### Add Member Management
- **POST** `/api/board/board/board_id/addmember/` - Add a member
- **GET** `/api/board/member/board_id/` - View members

### Running the App
API: The server will be running on http://localhost:8000/api/

