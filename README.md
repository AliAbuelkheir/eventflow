# 🎟️ EventFlow - Ticket Booking System

**EventFlow** is a backend-only RESTful API for managing event ticket bookings. It includes secure authentication with JWT, role-based access control (Admin, Organizer, User), and support for multiple ticket types per event (e.g., Regular, Fan Pit, VIP). The project follows backend best practices and is ready for integration with a future React frontend.

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - JWT-based login system
  - Secure password hashing using bcrypt
  - Role-based access: Admin, Organizer, User
  - Unauthenticated users can view events

- 🧾 **Booking System**
  - Book events with multiple ticket types
  - Discount application and price calculation
  - Track booking status (pending, confirmed, canceled)

- 🎤 **Event Management**
  - Create, update, and delete events (organizers only)
  - Admin control over all events
  - Retrieve approved or all events

- 👥 **User Roles**
  - **User**: Can browse and book events
  - **Organizer**: Manages their own events
  - **Admin**: Full access to all system data

- 📦 **Backend Standards**
  - JWT for stateless authentication
  - Environment configuration using `.env`
  - Bcrypt for password encryption
  - Organized codebase with MVC structure
  - Express middleware for auth and validations

## ⚙️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas + Mongoose
- **Authentication**: JWT
- **Security**: bcrypt, dotenv
- **Validation**: Mongoose validators
- **Dev Tools**: Nodemon, Postman


## 📦 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/aliabuelkheir/eventflow.git
   cd eventflow/backend
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a .env file
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Run the development server
   ```bash
   npm run dev
   ```
# 📚 API Routes

> 📄 For full request/response specs, see [`/docs`](./docs).



### 🔐 Auth Routes

| Method | Endpoint                 | Description                          | Access  |
|--------|--------------------------|--------------------------------------|---------|
| POST   | `/api/v1/register`       | Register a new user                  | Public  |
| POST   | `/api/v1/login`          | Authenticate user and return token   | Public  |
| PUT    | `/api/v1/forgetPassword` | Update user password                 | Public  |



### 👥 User Routes

| Method | Endpoint                    | Description                        | Access              |
|--------|-----------------------------|------------------------------------|---------------------|
| GET    | `/api/v1/users`             | Get a list of all users            | Admin               |
| GET    | `/api/v1/users/profile`     | Get current user’s profile         | Authenticated Users |
| PUT    | `/api/v1/users/profile`     | Update current user’s profile      | Authenticated Users |
| GET    | `/api/v1/users/:id`         | Get details of a single user       | Admin               |
| PUT    | `/api/v1/users/:id`         | Update user’s role                 | Admin               |
| DELETE | `/api/v1/users/:id`         | Delete a user                      | Admin               |
| GET    | `/api/v1/users/bookings`    | Get current user’s bookings        | Standard User       |
| GET    | `/api/v1/users/events`      | Get current user’s events          | Event Organizer     |



### 🎟️ Booking Routes

| Method | Endpoint                   | Description              | Access         |
|--------|----------------------------|--------------------------|----------------|
| POST   | `/api/v1/bookings`         | Book tickets for an event| Standard User  |
| GET    | `/api/v1/bookings/:id`     | Get booking details by ID| Standard User  |
| DELETE | `/api/v1/bookings/:id`     | Cancel a booking         | Standard User  |



### 🎤 Event Routes

| Method | Endpoint                    | Description                                           | Access                  |
|--------|-----------------------------|-------------------------------------------------------|-------------------------|
| POST   | `/api/v1/events`            | Create a new event                                    | Event Organizer         |
| GET    | `/api/v1/events`            | Get list of all Approved events                       | Public                  |
| GET    | `/api/v1/events/all`        | Get list of all events (approved, pending, declined)  | Admin                   |
| GET    | `/api/v1/events/:id`        | Get details of a single event                         | Public                  |
| PUT    | `/api/v1/events/:id`        | Update an event                                       | Event Organizer or Admin|
| DELETE | `/api/v1/events/:id`        | Delete an event                                       | Event Organizer or Admin|

# 🔮 Future Plans
 Implement React frontend

 Add payment gateway integration

 Dashboard for organizers and admins

 PDF ticket generation

 Email notifications

# 👥 Author
Ali Abuelkheir – Developer & Architect

# 📜 License
This project is licensed under the MIT License.
