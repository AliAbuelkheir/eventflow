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

---

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

---

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
