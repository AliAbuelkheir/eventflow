# 📚 EventFlow API Documentation

This file provides detailed specifications for each API endpoint of the EventFlow backend system.

---


## 🔐 Auth Routes

<details>
<summary><code>POST</code> <code><b>/api/v1/register</b></code> <code>(Register a new user)</code></summary>

##### Request Body

```json
{
  "firstName": "Ali",
  "lastName": "Abuelkheir",
  "email": "user@example.com",
  "password": "yourPassword123",
  "role": "user",                        // optional, defaults to 'user'
  "profilePicture": "https://url.com"   // optional
}
```

##### Responses

| Status | Content-Type         | Description                         |
|--------|----------------------|-------------------------------------|
| 201    | application/json     | User created, JWT token returned    |
| 400    | application/json     | User already exists or validation error |
| 500    | application/json     | Server error                        |

##### Example cURL

```bash
curl -X POST http://localhost:5000/api/v1/register \
-H "Content-Type: application/json" \
-d '{"firstName":"Ali","lastName":"Abuelkheir","email":"user@example.com","password":"yourPassword123"}'
```

</details>

<details>
<summary><code>POST</code> <code><b>/api/v1/login</b></code> <code>(Login and receive JWT)</code></summary>

##### Request Body

```json
{
  "email": "user@example.com",
  "password": "yourPassword123"
}
```

##### Responses

| Status | Content-Type         | Description                      |
|--------|----------------------|----------------------------------|
| 200    | application/json     | Successful login, JWT + user info|
| 400    | application/json     | Invalid credentials              |
| 500    | application/json     | Server error                     |

##### Example cURL

```bash
curl -X POST http://localhost:5000/api/v1/login \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","password":"yourPassword123"}'
```

</details>


<details>
<summary><code>PUT</code> <code><b>/api/v1/forgetPassword</b></code> <code>(Reset password by email)</code></summary>

##### Request Body

```json
{
  "email": "user@example.com",
  "newPassword": "newStrongPassword456"
}
```

##### Responses

| Status | Content-Type         | Description                      |
|--------|----------------------|----------------------------------|
| 200    | application/json     | Password updated successfully    |
| 400    | application/json     | Missing fields or invalid input |
| 404    | application/json     | User not found                   |
| 500    | application/json     | Server error                     |

##### Example cURL

```bash
curl -X PUT http://localhost:5000/api/v1/forgetPassword \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","newPassword":"newStrongPassword456"}'
```

</details>


## 👥 User Routes

<details>
<summary><code>GET</code> <code><b>/api/v1/users</b></code> <code>(Get list of all users)</code></summary>

##### Access: Admin Only

##### Parameters

> None

##### Responses

| Status | Content-Type     | Description               |
|--------|------------------|---------------------------|
| 200    | application/json | Array of user objects     |
| 401    | application/json | Unauthorized              |
| 403    | application/json | Forbidden (not admin)     |

</details>


<details>
<summary><code>GET</code> <code><b>/api/v1/users/profile</b></code> <code>(Get current user's profile)</code></summary>

##### Access: Authenticated Users

##### Parameters

> None

##### Responses

| Status | Content-Type     | Description               |
|--------|------------------|---------------------------|
| 200    | application/json | Current user's data       |
| 401    | application/json | Unauthorized              |

</details>


<details>
<summary><code>PUT</code> <code><b>/api/v1/users/profile</b></code> <code>(Update current user's profile)</code></summary>

##### Request Body

```json
{
  "firstName": "Ali",
  "lastName": "Abuelkheir",
  "email": "user@example.com",
  "profilePicture": "https://url.com/profile.jpg"
}
```

##### Responses

| Status | Content-Type     | Description               |
|--------|------------------|---------------------------|
| 200    | application/json | Updated user object       |
| 404    | application/json | User not found            |
| 500    | application/json | Server error              |

</details>


<details>
<summary><code>GET</code> <code><b>/api/v1/users/:id</b></code> <code>(Get a single user's details)</code></summary>

##### Access: Admin Only

##### Parameters

- `:id` – MongoDB User ID

##### Responses

| Status | Content-Type     | Description               |
|--------|------------------|---------------------------|
| 200    | application/json | User object               |
| 404    | application/json | User not found            |

</details>


<details>
<summary><code>PUT</code> <code><b>/api/v1/users/:id</b></code> <code>(Update a user's role)</code></summary>

##### Access: Admin Only

##### Request Body

```json
{
  "role": "admin"
}
```

##### Responses

| Status | Content-Type     | Description               |
|--------|------------------|---------------------------|
| 200    | application/json | Updated user object       |
| 404    | application/json | User not found            |

</details>


<details>
<summary><code>DELETE</code> <code><b>/api/v1/users/:id</b></code> <code>(Delete a user)</code></summary>

##### Access: Admin Only

##### Parameters

- `:id` – MongoDB User ID

##### Responses

| Status | Content-Type     | Description               |
|--------|------------------|---------------------------|
| 200    | application/json | Success message           |
| 404    | application/json | User not found            |

</details>


<details>
<summary><code>GET</code> <code><b>/api/v1/users/bookings</b></code> <code>(Get current user's bookings)</code></summary>

##### Access: Standard User

##### Responses

| Status | Content-Type     | Description               |
|--------|------------------|---------------------------|
| 200    | application/json | List of bookings          |
| 401    | application/json | Unauthorized              |

</details>


<details>
<summary><code>GET</code> <code><b>/api/v1/users/events</b></code> <code>(Get current organizer's events)</code></summary>

##### Access: Event Organizer

##### Responses

| Status | Content-Type     | Description               |
|--------|------------------|---------------------------|
| 200    | application/json | List of events            |
| 401    | application/json | Unauthorized              |

</details>



## 🎟️ Booking Routes

<details>
<summary><code>POST</code> <code><b>/api/v1/bookings</b></code> <code>(Book tickets for an event)</code></summary>

##### Access: Standard User

##### Request Body

```json
{
  "eventId": "60f5a3f8e13e4b1c8d3c34b9",
  "discountPercent": 10,
  "tickets": [
    {
      "ticketTypeName": "VIP",
      "ticketQuantity": 2
    },
    {
      "ticketTypeName": "Regular",
      "ticketQuantity": 3
    }
  ]
}
```

##### Responses

| Status | Content-Type     | Description                                           |
|--------|------------------|-------------------------------------------------------|
| 201    | application/json | Booking created successfully                          |
| 400    | application/json | Validation error or bad input                         |
| 404    | application/json | Event or ticket type not found                        |
| 409    | application/json | Conflict (concurrent update or booking conflict)      |
| 500    | application/json | Server error                                          |

</details>


<details>
<summary><code>GET</code> <code><b>/api/v1/bookings/:id</b></code> <code>(Get booking details)</code></summary>

##### Access: Standard User (Only booking owner)

##### Parameters

- `:id` – Booking ID (MongoDB ObjectId)

##### Responses

| Status | Content-Type     | Description                   |
|--------|------------------|-------------------------------|
| 200    | application/json | Booking details               |
| 400    | application/json | Invalid booking ID            |
| 403    | application/json | Unauthorized access           |
| 404    | application/json | Booking not found             |
| 500    | application/json | Server error                  |

</details>


<details>
<summary><code>DELETE</code> <code><b>/api/v1/bookings/:id</b></code> <code>(Cancel a booking)</code></summary>

##### Access: Standard User (Only booking owner)

##### Parameters

- `:id` – Booking ID (MongoDB ObjectId)

##### Responses

| Status | Content-Type     | Description                                   |
|--------|------------------|-----------------------------------------------|
| 200    | application/json | Booking deleted and tickets restored          |
| 400    | application/json | Invalid booking ID or missing ID              |
| 403    | application/json | Unauthorized access                           |
| 404    | application/json | Booking or associated event not found         |
| 500    | application/json | Server error                                  |

</details>



## 🎤 Event Routes

<details>
<summary><code>POST</code> <code><b>/api/v1/events</b></code> <code>(Create a new event)</code></summary>

##### Access: Event Organizer

##### Request Body

```json
{
  "title": "Music Festival",
  "description": "A summer music event",
  "eventDate": "2025-08-01T18:00:00Z",
  "location": "Cairo Opera House",
  "category": "Music",
  "imageUrl": "https://example.com/event.jpg",
  "ticketTypes": [
    { "name": "VIP", "price": 500, "quantity": 50 },
    { "name": "Regular", "price": 250, "quantity": 150 }
  ],
  "ticketsAvailable": 200,
  "organizer": {
    "userId": "6620698a1a870a6e6e9850cb",
    "fullName": "Ali Abuelkheir",
    "profileUrl": "https://example.com/profile.jpg"
  }
}
```

##### Responses

| Status | Content-Type     | Description               |
|--------|------------------|---------------------------|
| 201    | application/json | Event created successfully|
| 400    | application/json | Missing required fields   |
| 500    | application/json | Server error              |

</details>


<details>
<summary><code>GET</code> <code><b>/api/v1/events</b></code> <code>(Get approved upcoming events)</code></summary>

##### Access: Public

##### Query Parameters (optional)

- `page` – Pagination page (default: 1)
- `limit` – Items per page (default: 10)
- `showPast` – Include past events (`true` to show)

##### Responses

| Status | Content-Type     | Description                        |
|--------|------------------|------------------------------------|
| 200    | application/json | Paginated list of approved events  |
| 500    | application/json | Server error                       |

</details>


<details>
<summary><code>GET</code> <code><b>/api/v1/events/all</b></code> <code>(Get all events - Admin only)</code></summary>

##### Access: Admin

##### Query Parameters (optional)

- `page` – Pagination page (default: 1)
- `limit` – Items per page (default: 10)

##### Responses

| Status | Content-Type     | Description               |
|--------|------------------|---------------------------|
| 200    | application/json | Paginated list of events  |
| 500    | application/json | Server error              |

</details>


<details>
<summary><code>GET</code> <code><b>/api/v1/events/:id</b></code> <code>(Get single event by ID)</code></summary>

##### Access: Public

##### Parameters

- `:id` – Event ID (MongoDB ObjectId)

##### Responses

| Status | Content-Type     | Description               |
|--------|------------------|---------------------------|
| 200    | application/json | Event details             |
| 404    | application/json | Event not found           |
| 500    | application/json | Server error              |

</details>


<details>
<summary><code>PUT</code> <code><b>/api/v1/events/:id</b></code> <code>(Update an event)</code></summary>

##### Access: Event Organizer or Admin

##### Parameters

- `:id` – Event ID

##### Request Body

> JSON object with one or more event fields to update.

##### Responses

| Status | Content-Type     | Description               |
|--------|------------------|---------------------------|
| 200    | application/json | Updated event             |
| 404    | application/json | Event not found           |
| 500    | application/json | Server error              |

</details>


<details>
<summary><code>DELETE</code> <code><b>/api/v1/events/:id</b></code> <code>(Delete an event)</code></summary>

##### Access: Event Organizer or Admin

##### Parameters

- `:id` – Event ID

##### Responses

| Status | Content-Type     | Description                     |
|--------|------------------|---------------------------------|
| 200    | application/json | Event deleted successfully      |
| 404    | application/json | Event not found                 |
| 500    | application/json | Server error                    |

</details>
