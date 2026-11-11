# Student Enrollment Form using JsonPowerDB

[![NetBeans IDE](https://img.shields.io/badge/NetBeans-IDE-blue.svg)](https://netbeans.apache.org/)
[![Database](https://img.shields.io/badge/Database-JsonPowerDB-orange.svg)](http://login2explore.com/jpdb/)
[![Release](https://img.shields.io/badge/Release-v1.0.0-success.svg)](#release-history)

---

## 📌 Title of the Project
**Student Enrollment Form** – An interactive, serverless web form built with **HTML5, Bootstrap, jQuery**, and **JsonPowerDB (JPDB)** in **Apache NetBeans IDE**.

---

## 📖 Description
This project implements a dynamic student enrollment system that executes real-time CRUD operations against **JsonPowerDB** via REST APIs.

Using **`Roll-No`** as the primary key:
- **New Student:** Entering an unregistered Roll-No unlocks the form and enables the **[Save]** button to insert a new record into `SCHOOL-DB/STUDENT-TABLE`.
- **Existing Student:** Entering an existing Roll-No automatically retrieves and populates the student's details, disables the primary key field, and enables the **[Update]** button.
- **Reset:** Clears all fields and restores the form to its initial state with the cursor focused on `Roll-No`.

---

## 🚀 Benefits of using JsonPowerDB
1. **Schema-Free:** Store dynamic JSON documents without pre-defining table structures or schemas.
2. **Serverless CRUD:** Perform database queries straight from client-side JavaScript via REST APIs without middleware.
3. **High Performance:** In-memory indexing delivers ultra-fast read/write operations (up to 10x faster than traditional RDBMS).
4. **Low-Code Integration:** Built-in `jpdb-commons.js` simplifies complex REST calls into simple helper methods (`createPUTRequest`, `createGET_BY_KEYRequest`, `createUPDATERecordRequest`).
5. **Secure:** Token-based access control manages authentication and API request authorization.

---

## ⚙️ Scope of Functionalities & Fields

- **Database:** `SCHOOL-DB`
- **Relation:** `STUDENT-TABLE`
- **Primary Key:** `Roll-No`

| Field | Element ID | Type | Description |
| :--- | :--- | :--- | :--- |
| **Roll Number** | `rollNo` | Text / Number | Primary Key (auto-lookup on entry) |
| **Full Name** | `fullName` | Text | Student's full name |
| **Class** | `class` | Text | Class / Degree (e.g. 10th, B.Tech) |
| **Birth Date** | `birthDate` | Date | Date of birth |
| **Address** | `address` | Text | Residential address |
| **Enrollment Date** | `enrollmentDate` | Date | Date of enrollment |

---

## 🔄 Form Workflow
1. **Initial State:** All fields and buttons are disabled except **Roll-No**. Cursor is placed on **Roll-No**.
2. **On Roll-No Entry:**
   - **If NOT found (400):** Enables input fields + **[Save]** + **[Reset]**. Cursor moves to **Full Name**.
   - **If found (200):** Fills data, disables **Roll-No**, enables input fields + **[Update]** + **[Reset]**. Cursor moves to **Full Name**.
3. **On Save / Update:** Validates no empty fields, executes JPDB REST API, shows confirmation alert, and resets form.

---

## 📦 How to Run in Apache NetBeans
1. Open **Apache NetBeans IDE**.
2. Click **File > Open Project** and select `Student-Enrollment-Form`.
3. Right-click the project and select **Run** (or press `F6`) to launch in your browser.

---

## 📜 Release History
* **v1.0.0 (Initial Release):**
  - Integrated `SCHOOL-DB` and `STUDENT-TABLE` with JsonPowerDB REST APIs.
  - Interactive smart form with dynamic button state management (`Save`, `Update`, `Reset`).
  - NetBeans HTML5/JS client project configuration (`nbproject`).
  - Complete form validation and local session tracking.

---

## 👨‍💻 Author
- **Developer:** Prateek Srivastava
- **Technology Stack:** HTML5, CSS3, JavaScript, jQuery, Bootstrap 5, JsonPowerDB
