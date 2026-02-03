# 🎓 HireSphere: Student-First Job & Internship Platform

> **Fair. Transparent. Ethical.**  
> A bridge between verified students and genuine recruiters, ensuring zero spam and a level playing field.

![Project Status](https://img.shields.io/badge/Status-In%20Development-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Focus](https://img.shields.io/badge/Focus-Student%20Centric-orange)

---

## 📖 Table of Contents
- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Core Philosophy](#-core-philosophy)
- [User Roles & Rules](#-user-roles--rules)
- [Key Features](#-key-features)
  - [Email & Verification](#email--verification-rules)
  - [Two-Level Resume Priority](#two-level-priority-resume-system)
  - [Controlled Chat System](#controlled-chat-system)
- [System Architecture](#-system-architecture)
- [Future Scope](#-future-scope)
- [Getting Started](#-getting-started)

---

## 🚩 The Problem
Current hiring platforms are broken for students:
*   **Recruiter Spam:** Students are bombarded with irrelevant emails and scams.
*   **Unverified Profiles:** Fake candidates and dubious recruiters flood the ecosystem.
*   **Unfair Advantages:** Networking often trumps merit.
*   **Unsafe Interactions:** Physical interviews and off-platform communications can lead to harassment or high-pressure situations.

## ✅ The Solution
**HireSphere** is a digital-first recruitment platform designed primarily for students and fresh graduates. We eliminate the noise by prioritizing **verified college students**, banning free-email recruiters, and keeping all interaction strictly digital and monitored within the platform.

**No walk-ins. No external pressure. Just pure, merit-based hiring.**

---

## 🧠 Core Philosophy
1.  **Student Priority:** The platform allows everyone, but verified college students get ranking priority.
2.  **Strictly Professional:** No Gmail/Yahoo recruiters. Official company emails only.
3.  **Zero Spam:** Recruiters cannot mass-email. Chat is locked until a student is shortlisted.
4.  **Digital Sanctity:** No physical interaction required. The entire process, from application to offer, happens online.

---

## 👥 User Roles & Rules

### 👨‍🎓 Students
*   **Registration:** Requires Personal Email + **College Email** (for verification).
*   **Key Privileges:**
    *   Apply for unlimited jobs/internships.
    *   Upload resumes and validated certificates.
    *   Receive offers and interview invites.
*   **Restrictions:**
    *   ❌ Cannot initiate chats with recruiters.
    *   ❌ Cannot bypass the Resume Priority logic.

### 🧑‍💼 Recruiters
*   **Registration:** Strict domain check. **No public email providers** (Gmail, Outlook, etc.) allowed.
*   **Posting Limit:** Must wait **15 days** after changing jobs/companies before posting new roles (prevents spam/fraud).
*   **Key Privileges:**
    *   Post jobs & internships.
    *   Access the **Shared Question Bank** (Technical, Aptitude, HR).
    *   Initiate chat *only* with shortlisted candidates.
*   **Restrictions:**
    *   ❌ Cannot contact students outside the platform initially.
    *   ❌ No physical interviews allowed.

---

## 🌟 Key Features

### 📧 Email & Verification Rules
*   **Recruiters:** verification link sent to company domain email. Manual approval layer for new companies.
*   **Students:**
    *   **Verified College ID:** Grants **"Verified Student"** badge and boosts profile visibility.
    *   **Personal Email:** Used for recovery and notifications.

### 📄 Two-Level Priority Resume System
To ensure authenticity, our ranking algorithm uses a two-level trust system:

| Priority Level | Requirement | Status |
| :--- | :--- | :--- |
| **Level 1 (High)** | Certificate uploaded via **Verified URL** (e.g., Coursera, HackerRank, University Portal) | ✅ Trusted & Ranked Higher |
| **Level 2 (Standard)** | Certificate uploaded as **Manual File** (PDF/JPG) | ⚠️ Subject to manual review; standard ranking |

### 💬 Controlled Chat System
*   **Initiation:** Only recruiters can start a conversation.
*   **Unlock Condition:** Chat feature is **LOCKED** until the student is explicitly **Shortlisted**.
*   **Safety:** All chats are monitored for keyword triggers (harassment, off-platform lures).

### 📝 Shared Question Bank
A transparent, standardized repository for interviews:
*   **Technical:** Coding problems, system design queries.
*   **Aptitude:** Logical reasoning and math.
*   **HR:** Situational and behavioral questions.
*   *Recruiters select from this bank to ensure fair and standardized evaluation.*

---

## 🏗 System Architecture

The detailed technical design ensures security, scalability, and fairness.

### High-Level Stack
*   **Frontend:** Modern, Responsive Web App (React / Next.js)
*   **Backend:** Secure REST API (Node.js / Express or Python/Django)
*   **Database:** Relational DB (PostgreSQL) for structured user/job data.
*   **Storage:** Secure Object Storage (AWS S3 / Firebase) for resumes and certificates.
*   **Auth:** Role-Based Access Control (RBAC) with JWT.

### Workflow
1.  **Auth Layer:** Validates email domains during signup.
2.  **Job Engine:** Matches verified students to relevant posts.
3.  **Application Service:** Handles resume parsing and priority ranking.
4.  **Communication Service:** WebSocket-based chat (enabled only on status change).

---

## 🚀 Future Scope
*   **🎥 In-Built Video Interviews:** WebRTC-powered secure video calls. No Zoom/Teams links required.
*   **🤖 AI Resume Ranking:** NLP models to match skills with job descriptions automatically.
*   **🏫 College Analytics:** Dashboards for placement cells to track student performance.
*   **💡 Internship Recommendations:** ML-based suggestions for internships based on course curriculum.

---

## 🏁 Getting Started (For Developers)

*(Note: This section is for contributors setting up the project locally)*

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/hiresphere.git
    cd hiresphere
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file and populate:
    ```env
    DB_URL=postgres://user:pass@localhost:5432/hiresphere
    JWT_SECRET=your_super_secret_key
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

## 🔐 Security & Ethics
*   **Data Privacy:** Student data is hidden until they apply.
*   **Anti-Harassment:** Strict zero-tolerance policy for abusive language in chats.
*   **Transparency:** All interview questions and processes are visible and standardized.

---

> Built with ❤️ for the student community.
