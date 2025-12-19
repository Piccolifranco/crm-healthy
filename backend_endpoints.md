# Backend API Requirements

This document outlines the API endpoints required to support the current frontend implementation of the Medical CRM.

## 1. Pacientes (Patients)

Manage patient records.

### List Patients
- **Endpoint**: `GET /patients`
- **Query Params**: `search` (string) - Filter by name, doctor, or insurance.
- **Response**: Array of patients.
- **Required Fields**:
  ```json
  [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "age": number,
      "dni": "string",
      "doctor": "string",
      "insurance": "string",
      "lastVisit": "date (ISO String)"
    }
  ]
  ```

### Get Patient Details
- **Endpoint**: `GET /patients/:id`
- **Response**: Single patient object (same fields as above).

### Create Patient
- **Endpoint**: `POST /patients`
- **Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "age": number,
    "dni": "string",
    "doctor": "string",
    "insurance": "string"
  }
  ```

### Delete Patient
- **Endpoint**: `DELETE /patients/:id`

---

## 2. Visitas (Visits)

Manage medical visits per patient.

### List Visits by Patient
- **Endpoint**: `GET /patients/:id/visits`
- **Response**: Array of visits.
- **Required Fields**:
  ```json
  [
    {
      "id": "string",
      "date": "date (ISO String)",
      "protocol": "string",
      "diagnosisType": "string",
      "diagnosis": "string",
      "description": "string",
      "status": "Pendiente" | "Pago",
      "amount": number,
      "doctor": "string"
    }
  ]
  ```

### Create Visit
- **Endpoint**: `POST /visits`
- **Body**:
  ```json
  {
    "patientId": "string",
    "date": "date (ISO String)",
    "protocol": "string",
    "diagnosisType": "string",
    "diagnosis": "string",
    "description": "string",
    "status": "Pendiente" | "Pago",
    "amount": number
  }
  ```

---

## 3. Turnos (Appointments)

Manage calendar availability and booking.

### Get Appointments (Availability)
- **Endpoint**: `GET /appointments`
- **Query Params**: `date` (YYYY-MM-DD), `month` (optional, if fetching by month).
- **Purpose**: To determine which hours are busy for the `ShiftModal` and Calendar view.
- **Response**: Array of booked slots.
  ```json
  [
    {
      "date": "YYYY-MM-DD",
      "hour": "HH:mm",
      "patientId": "string" // Optional, for admin view
    }
  ]
  ```

### Book Appointment
- **Endpoint**: `POST /appointments`
- **Body**:
  ```json
  {
    "date": "YYYY-MM-DD",
    "hour": "HH:mm",
    "patientId": "string" // Or userId from token
  }
  ```

---

## 4. Historia Clínica (Clinical History)

The "Historia Clínica" view (Customer facing) displays patient details and their visit history.

### Endpoints
It is recommended to reuse the existing **Patients** and **Visits** endpoints, ensuring proper authorization (e.g., a Customer should only be able to view their own ID).

1. **Get Patient Info**: `GET /patients/:id`
   - Used to display the header (Name, Age, Last Visit).
2. **Get Visits**: `GET /patients/:id/visits`
   - Used to populate the "Consultas y diagnósticos" table.
   - **Fields Used**: `date`, `diagnosis`, `description`.

---

## Notes

- **Authentication**: Existing `auth.ts` uses `/login` and `/register`. Ensure these return the `accessToken` and user `role` (ADMIN/CUSTOMER) as implemented in the frontend.
- **User Roles**: Endpoints under **Patients** and **Visits** (Create/Delete) should likely be protected and accessible only by users with the `ADMIN` role.
- **Pagination**: Consider adding pagination (`page`, `limit`) for the `GET /patients` and `GET /visits` endpoints as the data grows.
