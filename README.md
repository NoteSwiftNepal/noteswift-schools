# NoteSwift School Admin Portal (Phase 1)

This is a standalone, runnable Next.js application designed to function as the school administrator portal for NoteSwift. It provides features for tracking student records, term averages, learning engagement, and messaging templates.

## Main Key Features

1.  **Welcome Panel & KPI Row**: Highlights active students, overall session average scores, attendance rates, and active alert scopes.
2.  **Stateful Global Search**: Dynamically searches across student directories, classes, and assignment titles.
3.  **Branch Switch & Year Toggles**: Stateful selectors scope dashboard data context between branches and years.
4.  **Academic Growth Charts**: Recharts visualizations for weekly averages and class benchmarks.
5.  **Student Directory side drawer**: Detailed profile sheet deep-linked via URL queries.
6.  **Broadcast Notice Board**: General circular publishing widget for event announcements.
7.  **Parent Chat Center**: Live message threading and reply composers.
8.  **Excel/PDF Exporter**: Simulates document compiler downloads.

---

## Technical Stack

*   **Framework**: Next.js 15 (App Router)
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Data Charts**: Recharts

---

## How to Run Locally

1.  Navigate to the directory:
    ```bash
    cd noteswift-schools
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:9004](http://localhost:9004) in your browser.

---

## Login Demo Credentials

*   **Username**: `principal.sharma@example.com`
*   **Password**: `password123`
