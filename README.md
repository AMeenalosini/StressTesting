# Full-Stack Banking Stress Testing Demo
---

## Project Overview

This project is a **Full-Stack Banking Stress Testing Demo** built using **React (frontend) and Node.js + Express (backend)**. It simulates **stress testing of bank capital adequacy** based on real-time US economic data from the **FRED API** (Federal Reserve Economic Data).

The app calculates:

- Credit Loss (from unemployment shock)  
- Market Loss (from GDP shock)  
- Total Loss  
- Capital After Stress  
- Capital Adequacy Ratio (CAR)  

It then determines whether the bank **passes or fails Basel minimum capital requirements**.

---

## Features

- Real-time unemployment data via FRED API  
- Adjustable **Unemployment Shock** (%) and **GDP Shock** (%)  
- Automatic calculation of Credit Loss, Market Loss, Total Loss, Capital After Stress, and CAR  
- Interactive **Bar Chart** showing Capital Before vs After Stress  
- PASS/FAIL indicator based on Basel Minimum CAR (10.5%)  

---

## Tech Stack

**Frontend:** React, Recharts, HTML, CSS, JavaScript  
**Backend:** Node.js, Express  
**Database/Logic:** No database needed, calculations done in backend  
**API:** FRED API for real-time unemployment data  
**Deployment:** Render (optional)  
**Version Control:** Git/GitHub  

---

## Installation & Setup

1. Clone the repo:

```bash
git clone https://github.com/AMeenalosini/Fullstack.Ecomm-Capstone.git

2. Navigate to backend folder and install dependencies:
    cd backend
    npm install

3. Create a .env file in backend with your FRED API key:
    FRED_API_KEY=your_fred_api_key_here

4. Start the backend:
    node server.js

5. Navigate to frontend folder and install dependencies:
    cd Frontend/stress-dashoard
    npm install
    npm start

6. Open your browser at http://localhost:3000 to access the dashboard.

    Bank Profile Used
    Parameter	Value
    Tier 1 Capital	$120,000,000
    Risk-Weighted Assets	$1,000,000,000
    Basel Minimum CAR (%)	10.5

Table of Sample Scenarios (Real FRED Data)

Note: Adjusted Unemployment Shock = FRED latest unemployment rate + User Input

## Table of Sample Scenarios (Real FRED Data)
## Sample Scenarios (Using Real FRED Data)

> **Note:**  
> `Adjusted Unemployment = FRED unemployment + User shock`

| FRED Unemployment (%) | User Shock (%) | GDP Shock (%) | Capital After Stress ($) | CAR (%) | Result |
| --------------------: | -------------: | ------------: | -----------------------: | ------: | :----: |
|                   3.4 |            0.5 |           0.0 |               42,000,000 |     4.2 | ❌ FAIL |
|                   3.4 |            0.0 |           0.0 |               52,000,000 |     5.2 | ❌ FAIL |
|                   0.0 |            0.0 |           0.0 |              120,000,000 |    12.0 | ✅ PASS |
|                   0.0 |            0.0 |          -0.5 |              105,000,000 |    10.5 | ✅ PASS |

✅ PASS = CAR ≥ 10.5%
❌ FAIL = CAR < 10.5%