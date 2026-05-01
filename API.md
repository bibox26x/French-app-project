# Fête, en fait — API Documentation

This file documents the API routes for the `fete-en-fait` web and future mobile applications. All endpoints return stable JSON payloads according to the specifications in `PLAN.md` (Section 16).

---

### POST /api/auth/token
Auth: none
Body: `{ email: string, password: string }`
Response 200: 
```json
{ 
  "token": "string", 
  "expiresAt": "ISODate", 
  "user": { 
    "id": "string", 
    "email": "string", 
    "firstName": "string", 
    "lastName": "string", 
    "role": "string", 
    "isVerifiedStudent": boolean 
  } 
}
```
Response 400: `{ "error": { "code": "BAD_REQUEST", "message": "Email et mot de passe requis." } }`
Response 401: `{ "error": { "code": "UNAUTHORIZED", "message": "Identifiants incorrects." } }`
Response 500: `{ "error": { "code": "INTERNAL_ERROR", "message": "Une erreur est survenue." } }`

---

### POST /api/auth/register
Auth: none
Body: `{ firstName: string, lastName: string, email: string, password: string }`
Response 201: `{ "user": { ... } }`
Response 400: `{ "error": { "code": "BAD_REQUEST", "message": string } }`
Response 409: `{ "error": { "code": "EMAIL_TAKEN", "message": string } }`

---

### POST /api/bookings
Auth: required (guest)
Body: `{ listingId: string, startDate: ISODate, endDate: ISODate, guestCount: number }`
Response 201: `{ "booking": { "id": string, "status": "pending", "startDate": ISODate, ... } }`
Response 400: `{ "error": { "code": "BAD_REQUEST", "message": string } }`
Response 401: `{ "error": { "code": "UNAUTHORIZED", "message": string } }`

---

### GET /api/bookings
Auth: required
Response 200: `{ "bookings": [{ "id": string, "status": string, "startDate": ISODate, "listing": {...} }] }`

---

### PATCH /api/bookings/[id]
Auth: required (guest to cancel, host to confirm/decline)
Body: `{ status: string }`
Response 200: `{ "booking": { "id": string, "status": string, "updatedAt": ISODate } }`

---

### GET /api/listings
Auth: none
Response 200: `{ "listings": [{ "id": string, "title": string, ... }] }`

---

### POST /api/listings
Auth: required (host)
Body: `{ title: string, description: string, propertyType: string, addressLine: string, city: string, latitude: number, longitude: number, maxGuests: number, bedrooms: number, amenities: string[], houseRules: string, photos: string[], pricePerNight: number, weekendPrice?: number, depositAmount?: number }`
Response 201: `{ "listing": { ... } }`

---

### PATCH /api/listings/[id]
Auth: required (admin to hide, host to edit)
Body: `{ status?: string, ...other_fields }`
Response 200: `{ "listing": { ... } }`

---

### POST /api/users/me/verify
Auth: required
Body: `{ university: string, studentId: string }`
Response 200: `{ "success": true, "user": { "isVerifiedStudent": true, ... } }`
