# Student Enrollment Form using JsonPowerDB (JPDB)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NetBeans IDE](https://img.shields.io/badge/NetBeans-IDE-blue.svg)](https://netbeans.apache.org/)
[![Database](https://img.shields.io/badge/JsonPowerDB-JPDB%20v2.0-orange.svg)](http://login2explore.com/jpdb/)
[![Status](https://img.shields.io/badge/Status-Completed-success.svg)](#project-status)

---

## Table of Contents
1. [Title of the Project](#title-of-the-project)
2. [Description](#description)
3. [Benefits of using JsonPowerDB](#benefits-of-using-jsonpowerdb)
4. [Illustrations & Architecture](#illustrations--architecture)
5. [Scope of Functionalities](#scope-of-functionalities)
6. [Field Specifications](#field-specifications)
7. [Control Flow & Dynamic Form Behavior](#control-flow--dynamic-form-behavior)
8. [Examples of Use](#examples-of-use)
9. [Release History](#release-history)
10. [Project Status](#project-status)
11. [How to Run in NetBeans IDE](#how-to-run-in-netbeans-ide)
12. [Sources & References](#sources--references)
13. [Other Information & Author](#other-information--author)

---

## Title of the Project
**Student Enrollment Form** – An Interactive Web Application integrated with **JsonPowerDB (JPDB)** developed in **Apache NetBeans IDE**.

---

## Description
This project is an interactive, responsive web application for managing student registrations and enrollments. It performs real-time **CRUD (Create, Read, Update, Delete)** operations directly from client-side JavaScript by interfacing seamlessly with **JsonPowerDB (JPDB)** via its REST APIs.

The system utilizes the student's unique **Roll-No** as the primary key. When a user enters the roll number:
- If the student is **already enrolled**, the system retrieves and populates the student's existing profile (Full Name, Class, Birth Date, Address, Enrollment Date) and switches the form to **Update** mode while locking the primary key.
- If the roll number is **new**, the system enables entry for all details and enables **Save** mode.
- A **Reset** button allows clearing and restoring the form to its initial state at any moment.

---

## Benefits of using JsonPowerDB
**JsonPowerDB (JPDB)** by Login2Xplore is a next-generation, high-performance, real-time, schema-free NoSQL database with a built-in REST API engine. Key benefits include:

1. **Schema-Free Architecture:** No need to predefine schemas, tables, or column types; stores any structured or semi-structured JSON document dynamically.
2. **Serverless & Zero Backend Overhead:** Enables direct database interaction straight from client-side JavaScript (AJAX) without needing middleware (like Node.js, Spring Boot, or PHP).
3. **Ultra High Performance:** Built on top of high-speed in-memory indexing algorithms, delivering lightning-fast read/write operations (up to 10x faster than traditional RDBMS).
4. **Rich Multi-Mode Capabilities:** Combines Document DB, Key-Value DB, and RDBMS-like relational capabilities through unified REST APIs.
5. **Low-Code API Helper Libraries:** Provides `jpdb-commons.js` which simplifies complex REST requests (e.g. `createPUTRequest`, `createGET_BY_KEYRequest`, `createUPDATERecordRequest`) into one-line method calls.
6. **Built-in Security & Access Tokenization:** Provides fine-grained token-based security controlling API access and permissions.
7. **Cost-Effective & Lightweight:** Minimal memory footprint and infrastructure costs compared to heavyweight SQL databases.

---

## Illustrations & Architecture

```
+-------------------------------------------------------------+
|                     Client Web Browser                      |
|  (Apache NetBeans HTML5 / Bootstrap 5 / jQuery / JavaScript) |
+-------------------------------------------------------------+
                              |
                     AJAX (REST APIs)
          [createGET_BY_KEYRequest / createPUTRequest]
                              |
                              v
+-------------------------------------------------------------+
|                  JsonPowerDB Server (JPDB)                   |
|                   http://api.login2explore.com:5577          |
|                                                             |
|   Database:   SCHOOL-DB                                     |
|   Relation:   STUDENT-TABLE                                 |
|   Index/Key:  Roll-No                                       |
+-------------------------------------------------------------+
```

### Form Workflow State Transition
```
                   +------------------------+
                   |       Page Load        |
                   |  (or Reset / Finished)  |
                   +------------------------+
                               |
                               v
               +--------------------------------+
               |  Roll-No Field: ENABLED        |
               |  Other Fields: DISABLED        |
               |  Buttons (Save/Update): DISABLED|
               |  Cursor placed at Roll-No      |
               +--------------------------------+
                               |
                   User Enters Roll-No
                   (onchange / Tab / Blur)
                               |
                               v
                     Query JsonPowerDB
                  [GET_BY_KEY Request]
                               |
               +---------------+---------------+
               |                               |
       Status == 400                   Status == 200
    (Record Not Found)              (Record Found in DB)
               |                               |
               v                               v
     +-------------------+           +-------------------+
     | Enable [Save]     |           | Disable Roll-No   |
     | Enable [Reset]    |           | Fill data fields  |
     | Disable [Update]  |           | Enable [Update]   |
     | Enable fields     |           | Enable [Reset]    |
     | Focus: Full-Name  |           | Disable [Save]    |
     +-------------------+           | Focus: Full-Name  |
               |                     +-------------------+
               |                               |
         User Clicks [Save]              User Clicks [Update]
               |                               |
               v                               v
       Execute PUT API                Execute UPDATE API
               \                              /
                +------------->--------------+
                               |
                    Record Stored/Updated
                               |
                               v
                    Return to Step-2 Reset
```

---

## Scope of Functionalities
- **Primary Key Auto-Detection:** Automatically checks for duplicate or existing primary keys (`Roll-No`) on user exit from the input field.
- **Dynamic Field Locking/Unlocking:** Prevents inconsistent state by disabling unused buttons and locking the primary key during record updates.
- **Client-Side Form Validation:** Enforces non-empty values across all student attributes before issuing network requests.
- **Local Record Tracking:** Automatically tracks JPDB record numbers (`rec_no`) in browser session storage (`localStorage`) for precise indexed record updates.
- **Live Connection Configuration:** Supports an inline collapsible settings card allowing users to easily test with their custom Login2Xplore API connection tokens.
- **Cross-Browser & Mobile Responsive:** Built with Bootstrap 5 to guarantee flawless rendering on desktop, tablets, and smartphones.

---

## Field Specifications

| Field Name | HTML Element ID | Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Roll Number** | `rollNo` | Text / Number | Primary Key, Required | Unique identifier for each student |
| **Full Name** | `fullName` | Text | Required | Complete student name |
| **Class** | `class` | Text | Required | Academic class/division (e.g. 10th, B.Tech) |
| **Birth Date** | `birthDate` | Date (`YYYY-MM-DD`) | Required | Student date of birth |
| **Address** | `address` | Text | Required | Residential street address |
| **Enrollment Date**| `enrollmentDate` | Date (`YYYY-MM-DD`) | Required | Date when student was officially enrolled |

---

## Control Flow & Dynamic Form Behavior

1. **Step 1 (Initial Load / After Any Action):**
   - Cursor defaults to `Roll-No`.
   - All other input fields (`fullName`, `class`, `birthDate`, `address`, `enrollmentDate`) are **disabled**.
   - `[Save]`, `[Update]`, and `[Reset]` buttons are **disabled**.
2. **Step 2 (Entering Primary Key):**
   - User inputs a Roll Number and tabs or clicks out.
   - JPDB is queried via `GET_BY_KEY` to search `SCHOOL-DB / STUDENT-TABLE`.
3. **Step 3A (If Roll-No does NOT exist):**
   - `[Save]` and `[Reset]` buttons are **enabled**.
   - `[Update]` remains **disabled**.
   - All input fields are enabled.
   - Cursor focuses on `Full Name`.
   - On clicking `[Save]`, form data is validated, stored in JPDB via `PUT`, and form resets to Step 1.
4. **Step 3B (If Roll-No EXISTS):**
   - Existing values are populated automatically.
   - `Roll-No` field is **disabled** to maintain primary key integrity.
   - All other input fields are enabled for editing.
   - `[Update]` and `[Reset]` buttons are **enabled**.
   - `[Save]` remains **disabled**.
   - Cursor focuses on `Full Name`.
   - On clicking `[Update]`, modified data is validated, updated in JPDB via `UPDATE`, and form resets to Step 1.

---

## Examples of Use

### Example 1: Enrolling a New Student
1. Enter Roll No: `101`
2. Form detects `101` is not in database &rarr; activates `[Save]` and `[Reset]`.
3. Enter:
   - Full Name: `Prateek Srivastava`
   - Class: `B.Tech CSE`
   - Birth Date: `2004-05-15`
   - Address: `Ghaziabad, Uttar Pradesh`
   - Enrollment Date: `2024-08-01`
4. Click **[Save]** &rarr; Record is saved to `SCHOOL-DB/STUDENT-TABLE` and the form resets.

### Example 2: Updating an Existing Student
1. Enter Roll No: `101`
2. Form detects `101` exists &rarr; fetches stored details, fills all fields, and activates `[Update]`.
3. Modify Address to: `Noida Sector 62, Uttar Pradesh`.
4. Click **[Update]** &rarr; Record is updated in JsonPowerDB and the form resets.

---

## Release History

* **v1.0.0 (2026-11-11):**
  - Initial public release of Student Enrollment Form using JsonPowerDB.
  - Complete implementation of Apache NetBeans HTML5/JS project structure.
  - Form state machine adhering strictly to Micro Project Work specifications.
  - Integration of `jpdb-commons.js` library for REST calls (`PUT`, `GET_BY_KEY`, `UPDATE`).
  - Added modern responsive UI with Bootstrap 5 and FontAwesome.

---

## Project Status
- **Status:** **Completed & Production Ready**
- All required assignment criteria (Database: `SCHOOL-DB`, Relation: `STUDENT-TABLE`, 3 control buttons, exact dynamic state switching) have been implemented and verified.

---

## How to Run in NetBeans IDE

1. **Open Apache NetBeans IDE**.
2. Click **File > Open Project**.
3. Navigate to this folder (`Student-Enrollment-Form`) and click **Open Project**.
4. In the NetBeans Projects window, right-click on `Student-Enrollment-Form` and choose **Run** (or press `F6`).
5. NetBeans will launch the application in your default browser.
6. *(Optional)* Click on **JPDB Connection Settings** inside the app to input your unique Login2Xplore API connection token if desired.

---

## Sources & References
- [JsonPowerDB Official Documentation](http://login2explore.com/jpdb/docs.html)
- [Login2Xplore Learning Portal](https://login2explore.com/)
- [JsonPowerDB GitHub Repository](https://github.com/BeAgarwal/JsonPowerDB)
- [Apache NetBeans Documentation](https://netbeans.apache.org/)

---

## Other Information & Author
- **Developer:** Prateek Srivastava
- **Project Type:** Web Application / Micro Project
- **Target Database:** JsonPowerDB (`SCHOOL-DB` / `STUDENT-TABLE`)
- **IDE:** Apache NetBeans
