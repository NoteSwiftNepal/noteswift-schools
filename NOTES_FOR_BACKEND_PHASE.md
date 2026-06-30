# Phase 2: Backend Integration Specifications & Guidelines

This document outlines instructions and API contracts for replacing the simulated mock service layer with a real production backend in Phase 2.

## Current Setup

All API calls are routed through the async service wrapper located at `src/services/api.ts` which consumes seeds from `src/mocks/mock-data.ts`. The flag `VITE_USE_MOCKS` (currently defaulting to `true`) routes requests to client-side simulations with a 300ms simulated network latency.

To switch to a live server:
1. Update `src/services/api.ts` to execute real `fetch` or `axios` calls to your API endpoint.
2. Set up standard JWT authentication headers.

---

## Authentication Layer

### 1. Admin Login
*   **Mock Endpoint Reference:** `login(email, password)`
*   **Request Payload:**
    ```json
    {
      "email": "principal.sharma@example.com",
      "password": "password123"
    }
    ```
*   **Response payload:**
    ```json
    {
      "token": "admin-mock-token-xyz-12345",
      "email": "principal.sharma@example.com",
      "fullName": "Principal Ramesh Sharma",
      "role": "School Administrator",
      "avatar": "/assets/avatar-admin.png"
    }
    ```
*   **Security Lockout Rules:** Rate limit prevents login attempts for 30s after 3 consecutive failures.

### 2. Multi-Branch Contexts
*   **Mock Endpoint Reference:** `getSchools()` & `getAcademicYears()`
*   **Scope Header Recommendation:** Append headers `X-School-ID` and `X-Academic-Year` to all API calls.

---

## Data Entities & Schema Forms

### 1. Student Profiles & Directory
*   **Search Filters:** Client-side filters support `search` (text matching `name` or `roll`), `class` (grade section), and `status` ("Active", "On Leave", "Suspended").
*   **Object Schema:**
    ```typescript
    export interface StudentProfile {
      id: string;
      name: string;
      roll: number;
      class: string;
      avatar: string;
      attendance: number;
      score: number;
      status: "Active" | "On Leave" | "Suspended";
      parentName: string;
      parentPhone: string;
      subjectGrades: Array<{ subject: string; score: number; grade: string }>;
      attendanceHistory: Array<{ date: string; status: "Present" | "Absent" | "Late" }>;
      assignments: Array<{ title: string; score: number | null; status: "Submitted" | "Pending" | "Late" }>;
    }
    ```

### 2. Assignments
*   **Action support:** Supports `createAssignment({ title, subject, grade, dueDate })`.
*   **Object Schema:**
    ```typescript
    export interface Assignment {
      id: string;
      title: string;
      subject: string;
      grade: string;
      dueDate: string;
      submissionRate: number;
      status: "Active" | "Closed" | "Pending" | "Draft";
    }
    ```

### 3. Parent Messages
*   **Action support:** Supports `sendParentMessage(threadId, replyText)`.
*   **Object Schema:**
    ```typescript
    export interface MessageThread {
      id: number;
      parentName: string;
      studentName: string;
      class: string;
      avatar: string;
      snippet: string;
      timestamp: string;
      unreadCount: number;
      messages: Array<{
        sender: "parent" | "admin";
        text: string;
        timestamp: string;
      }>;
    }
    ```

### 4. Exporter compilation
*   **Action support:** Supports `generateReport(name, format)`.
*   **Object Schema:**
    ```typescript
    export interface AuditReport {
      id: number;
      name: string;
      generatedAt: string;
      size: string;
      format: "PDF" | "Excel" | "CSV";
    }
    ```
