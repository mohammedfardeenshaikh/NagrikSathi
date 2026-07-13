# NagrikSathi AI Agent Architecture

## Overview

NagrikSathi is an AI-powered citizen grievance platform designed to help Members of Parliament (MPs) identify, prioritize, and manage constituency issues efficiently.

Citizens submit complaints in text format. Gemini AI processes each complaint by analyzing its content, generating a concise summary, assigning a priority level, explaining the reason for the priority, and generating relevant tags.

The processed complaint is stored in the database and displayed on the MP Dashboard, allowing representatives to focus on the most important issues first.

---

## System Components

### Citizen Portal

Allows citizens to submit complaints.

Responsibilities

- Submit text complaint
- Select category
- Select subcategory
- View submission confirmation

---

### AI Analysis Agent

Processes complaints using Gemini AI.

Responsibilities

- Read complaint
- Generate summary
- Determine priority
- Explain priority
- Generate tags

---

### Complaint Management Agent

Responsible for complaint storage and lifecycle.

Responsibilities

- Save complaint
- Save AI response
- Update complaint status
- Retrieve complaints

---

### MP Dashboard Agent

Displays processed complaints for MPs.

Responsibilities

- Load complaints
- Sort by priority
- Display analytics
- Manage complaint status

---

## System Workflow

Citizen

↓

Submit Complaint

↓

Gemini AI Analysis

↓

Store in MySQL

↓

Display in MP Dashboard

↓

MP Takes Action

---

## Technology Stack

Frontend
- Next.js
- TypeScript
- Tailwind CSS

Backend
- FastAPI

Database
- MySQL

Artificial Intelligence
- Gemini API