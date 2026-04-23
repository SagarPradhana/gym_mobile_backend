# ForgeFit API Reference

Base URL: `http://localhost:3200`

Auth header for protected routes:

```http
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

## Authentication

### `POST /auth/login`

Description: Login for members, staff, or admins.

Auth required: `No`

Request payload:

```json
{
  "email": "admin@forgefit.com",
  "password": "Admin@123"
}
```

Success response:

```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "68088f8e4f6d3f3d6f4e1111",
    "name": "ForgeFit Admin",
    "email": "admin@forgefit.com",
    "role": "admin",
    "status": "active"
  }
}
```

Error responses:

```json
{
  "message": "Email and password are required"
}
```

```json
{
  "message": "Invalid credentials"
}
```

### `POST /auth/logout`

Description: Logout current user.

Auth required: `Yes`

Request payload:

```json
null
```

Success response:

```json
{
  "message": "Logout successful"
}
```

### `GET /auth/me`

Description: Get the currently authenticated user profile.

Auth required: `Yes`

Request payload:

```json
null
```

Success response:

```json
{
  "data": {
    "_id": "68088f8e4f6d3f3d6f4e1111",
    "username": "forgefit-admin",
    "name": "ForgeFit Admin",
    "email": "admin@forgefit.com",
    "role": "admin",
    "phone": "9876543210",
    "status": "active",
    "address": "Main branch",
    "createdAt": "2026-04-23T06:30:00.000Z",
    "updatedAt": "2026-04-23T06:30:00.000Z"
  }
}
```

## Admin: User Management

All routes in this section require an admin token.

### `GET /users`

Description: List all users. Supports query params `role` and `status`.

Auth required: `Yes (Admin)`

Query example:

```http
GET /users?role=member&status=active
```

Request payload:

```json
null
```

Success response:

```json
{
  "data": [
    {
      "_id": "68088f8e4f6d3f3d6f4e2222",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member",
      "phone": "9999999999",
      "status": "active",
      "createdAt": "2026-04-23T06:35:00.000Z",
      "updatedAt": "2026-04-23T06:35:00.000Z"
    }
  ],
  "message": "Users fetched successfully"
}
```

### `POST /users`

Description: Create a new user.

Auth required: `Yes (Admin)`

Request payload:

```json
{
  "username": "john-doe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "John@123",
  "role": "member",
  "phone": "9999999999",
  "address": "Delhi"
}
```

Success response:

```json
{
  "message": "User created successfully",
  "data": {
    "id": "68088f8e4f6d3f3d6f4e2222",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member",
    "phone": "9999999999",
    "status": "active"
  }
}
```

Error responses:

```json
{
  "message": "name, email, password and role are required"
}
```

```json
{
  "message": "User with this email already exists"
}
```

### `PATCH /users/:id`

Description: Update user details.

Auth required: `Yes (Admin)`

Request payload:

```json
{
  "name": "John D",
  "phone": "8888888888",
  "address": "Mumbai"
}
```

Success response:

```json
{
  "message": "User updated successfully",
  "data": {
    "_id": "68088f8e4f6d3f3d6f4e2222",
    "name": "John D",
    "email": "john@example.com",
    "role": "member",
    "phone": "8888888888",
    "status": "active",
    "address": "Mumbai"
  }
}
```

### `DELETE /users/:id`

Description: Delete a user.

Auth required: `Yes (Admin)`

Request payload:

```json
null
```

Success response:

```json
{
  "message": "User deleted successfully"
}
```

### `POST /users/:id/toggle-status`

Description: Toggle user status between `active` and `inactive`.

Auth required: `Yes (Admin)`

Request payload:

```json
null
```

Success response:

```json
{
  "message": "User status updated successfully",
  "data": {
    "id": "68088f8e4f6d3f3d6f4e2222",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member",
    "phone": "9999999999",
    "status": "inactive"
  }
}
```

### `POST /users/:id/change-password`

Description: Reset or change a user's password.

Auth required: `Yes (Admin)`

Request payload:

```json
{
  "new_password": "NewPassword@123"
}
```

Success response:

```json
{
  "message": "Password changed successfully"
}
```

## Admin: Live Attendance

All routes in this section require an admin token.

### `GET /attendance/live`

Description: Get all users currently inside the gym.

Auth required: `Yes (Admin)`

Request payload:

```json
null
```

Success response:

```json
{
  "data": [
    {
      "_id": "6808915b4f6d3f3d6f4e3333",
      "user": {
        "_id": "68088f8e4f6d3f3d6f4e2222",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "member",
        "status": "active",
        "phone": "9999999999"
      },
      "checkInTime": "2026-04-23T07:10:00.000Z",
      "checkOutTime": null,
      "status": "inside"
    }
  ]
}
```

### `POST /attendance/check-in`

Description: Manually check a user into the gym.

Auth required: `Yes (Admin)`

Request payload:

```json
{
  "user_id": "68088f8e4f6d3f3d6f4e2222"
}
```

Success response:

```json
{
  "message": "Check-in successful",
  "data": {
    "_id": "6808915b4f6d3f3d6f4e3333",
    "user": "68088f8e4f6d3f3d6f4e2222",
    "checkInTime": "2026-04-23T07:10:00.000Z",
    "checkOutTime": null,
    "status": "inside"
  }
}
```

Error response:

```json
{
  "message": "User is already checked in"
}
```

### `POST /attendance/check-out`

Description: Manually check a user out of the gym.

Auth required: `Yes (Admin)`

Request payload:

```json
{
  "user_id": "68088f8e4f6d3f3d6f4e2222"
}
```

Success response:

```json
{
  "message": "Check-out successful",
  "data": {
    "_id": "6808915b4f6d3f3d6f4e3333",
    "user": "68088f8e4f6d3f3d6f4e2222",
    "checkInTime": "2026-04-23T07:10:00.000Z",
    "checkOutTime": "2026-04-23T08:20:00.000Z",
    "status": "completed"
  }
}
```

## Admin: Subscription Plans

All routes in this section require an admin token.

### `GET /plans`

Description: Fetch all plans.

Auth required: `Yes (Admin)`

Request payload:

```json
null
```

Success response:

```json
{
  "data": [
    {
      "_id": "680892184f6d3f3d6f4e4444",
      "title": "Platinum Annual",
      "price": 99.9,
      "duration_months": 12,
      "createdAt": "2026-04-23T08:00:00.000Z",
      "updatedAt": "2026-04-23T08:00:00.000Z"
    }
  ]
}
```

### `POST /plans`

Description: Create a subscription plan.

Auth required: `Yes (Admin)`

Request payload:

```json
{
  "title": "Platinum Annual",
  "price": 99.9,
  "duration_months": 12
}
```

Success response:

```json
{
  "message": "Plan created successfully",
  "data": {
    "_id": "680892184f6d3f3d6f4e4444",
    "title": "Platinum Annual",
    "price": 99.9,
    "duration_months": 12
  }
}
```

### `POST /plans/assign`

Description: Assign a plan to a user.

Auth required: `Yes (Admin)`

Request payload:

```json
{
  "user_id": "68088f8e4f6d3f3d6f4e2222",
  "plan_id": "680892184f6d3f3d6f4e4444"
}
```

Success response:

```json
{
  "message": "Plan assigned successfully",
  "data": {
    "_id": "6808927d4f6d3f3d6f4e5555",
    "user": {
      "_id": "68088f8e4f6d3f3d6f4e2222",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member",
      "status": "active"
    },
    "plan": {
      "_id": "680892184f6d3f3d6f4e4444",
      "title": "Platinum Annual",
      "price": 99.9,
      "duration_months": 12
    },
    "amountPaid": 99.9,
    "startDate": "2026-04-23T08:05:00.000Z",
    "endDate": "2027-04-23T08:05:00.000Z",
    "status": "active"
  }
}
```

## Communications & Inquiries

All routes in this section require an admin token.

### `GET /inquiries`

Description: Fetch inquiry inbox threads.

Auth required: `Yes (Admin)`

Request payload:

```json
null
```

Success response:

```json
{
  "data": [
    {
      "_id": "6808932a4f6d3f3d6f4e6666",
      "name": "Alice",
      "email": "alice@example.com",
      "subject": "Membership pricing",
      "message": "Please share your annual package.",
      "replies": [],
      "status": "open",
      "createdAt": "2026-04-23T08:10:00.000Z",
      "updatedAt": "2026-04-23T08:10:00.000Z"
    }
  ]
}
```

### `POST /inquiries/:id/reply`

Description: Reply to an inquiry thread.

Auth required: `Yes (Admin)`

Request payload:

```json
{
  "message": "Our annual platinum package is available for 99.9."
}
```

Success response:

```json
{
  "message": "Reply added successfully",
  "data": {
    "_id": "6808932a4f6d3f3d6f4e6666",
    "status": "replied",
    "replies": [
      {
        "message": "Our annual platinum package is available for 99.9.",
        "repliedAt": "2026-04-23T08:15:00.000Z"
      }
    ]
  }
}
```

### `DELETE /inquiries/:id`

Description: Delete an inquiry thread.

Auth required: `Yes (Admin)`

Request payload:

```json
null
```

Success response:

```json
{
  "message": "Inquiry deleted successfully"
}
```

## Financial Analytics

All routes in this section require an admin token.

### `GET /admin/dashboard-stats`

Description: Get top-level dashboard totals.

Auth required: `Yes (Admin)`

Request payload:

```json
null
```

Success response:

```json
{
  "data": {
    "active_members": 35,
    "expired_members": 8,
    "today_revenue": 299.7
  }
}
```

### `GET /admin/revenue-analytics?period=weekly`

Description: Get grouped revenue analytics. Supported periods: `daily`, `weekly`, `monthly`.

Auth required: `Yes (Admin)`

Request payload:

```json
null
```

Success response:

```json
{
  "data": {
    "period": "weekly",
    "analytics": [
      {
        "_id": {
          "year": 2026,
          "week": 17
        },
        "total": 499.5,
        "count": 5
      }
    ]
  }
}
```

## Common Error Responses

### `401 Unauthorized`

```json
{
  "message": "Authorization header missing"
}
```

```json
{
  "message": "Invalid authorization format"
}
```

```json
{
  "message": "Invalid or expired token"
}
```

### `403 Forbidden`

```json
{
  "message": "Admin access required"
}
```

### `404 Not Found`

```json
{
  "message": "User not found"
}
```

```json
{
  "message": "Plan not found"
}
```

```json
{
  "message": "Inquiry not found"
}
```

### `500 Server Error`

```json
{
  "message": "Internal server error"
}
```
