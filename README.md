# NoteSwift School Admin Portal (`noteswift-schools`)

This repository contains the standalone **School Administrator & Principal Portal** for the NoteSwift platform. Built with Next.js 15, React, Tailwind CSS, Recharts, and Lucide React, it enables school administrators and principals to manage student directories, academic performance, daily attendance, class assignments, parent communications, and AI operational insights.

---

## 🚀 Quick Start & How to Run Locally

1. **Navigate to directory**:
   ```bash
   cd noteswift-schools
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run development server**:
   ```bash
   npm run dev
   ```
4. **Open application**:
   Open [http://localhost:9004](http://localhost:9004) in your browser.

---

## 🔑 Demo Login Credentials

The login page opens with demo credentials pre-filled:

* **Email**: `principal.sharma@example.com`
* **Password**: `password123`
* **Role**: `School Administrator`

---

## ✨ Core Application Features

1. **Dashboard & KPIs**: Real-time overview of active students, average attendance %, academic scores, study hours, assignment completion %, and at-risk student counts.
2. **Student Directory & Detail Sheets**: Searchable, filterable student roster with drawer profile views, attendance histories, subject grades, and assignment logs.
3. **Academic Analytics & Performance**: Interactive charts for weekly academic averages, subject performance bars, and 12-month growth comparisons.
4. **Attendance Management**: Class-wise attendance tracking with present/absent/late counters.
5. **Assignments & Quizzes**: School-wide homework management, submission tracking, and quiz score analytics.
6. **Parent Communication Center**: Live messaging threads with parents, broadcast announcements, and scheduled meetings.
7. **AI Insights & Risk Tracking**: Automated operational alerts, grade drop warnings, and at-risk student intervention tags (`notify`, `meeting`, `profile`, `mentor`).
8. **Reports & Exports**: Multi-format administrative export generators (`PDF`, `Excel`, `CSV`).

---

# 📚 Phase 2 Backend Schema & API Specification

The following specification details all **Mongoose Database Schemas**, **Schema Modifications**, and **API Contracts** required in `noteswift-backend` to connect `noteswift-schools` to the production backend.

---

## 1. Architectural Standards

1. **Multi-Tenancy**: Every school document references `schoolId` (ref: `School`).
2. **Academic Year Scoping**: All queries scope data by `academicYear` (e.g. `"2081-82"`).
3. **Context Headers**: API requests pass headers `X-School-ID` and `X-Academic-Year`.
4. **Roles**: `"School Administrator"`, `"Principal"`, `"Vice Principal"`, `"Department Head"`, `"Teacher"`, `"Accountant"`.

---

## 2. Existing Backend Schemas to Modify

### 2.1 `School.model.ts` (`src/shared/models/School.model.ts`)
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ISchool extends Document {
  code: string; // "NS-LAL-01"
  name: string; // "NoteSwift Academy - Lalitpur"
  address: string;
  phone: string;
  email: string;
  principalName?: string;
  principalEmail?: string;
  principalPhone?: string;
  logo?: string;
  banner?: string;
  currentAcademicYear?: string; // "2081-82"
  status: 'Active' | 'Inactive' | 'Suspended';
  settings: {
    passingScorePercentage: number;
    attendanceWarningThreshold: number;
    gradeScale: 'GPA' | 'Percentage' | 'Letter';
  };
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSchema = new Schema<ISchool>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    principalName: { type: String },
    principalEmail: { type: String },
    principalPhone: { type: String },
    logo: { type: String, default: '/assets/logo.png' },
    banner: { type: String },
    currentAcademicYear: { type: String, default: '2081-82' },
    status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
    settings: {
      passingScorePercentage: { type: Number, default: 40 },
      attendanceWarningThreshold: { type: Number, default: 80 },
      gradeScale: { type: String, enum: ['GPA', 'Percentage', 'Letter'], default: 'Percentage' }
    }
  },
  { timestamps: true }
);

export default mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);
```

---

### 2.2 `Admin.model.ts` (`src/shared/models/Admin.model.ts`)
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: 'SuperAdmin' | 'School Administrator' | 'Principal' | 'Vice Principal' | 'Department Head' | 'Teacher' | 'Accountant';
  schoolId?: mongoose.Types.ObjectId;
  avatar?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  isSuperAdmin: boolean;
  permissions: string[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    fullName: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ['SuperAdmin', 'School Administrator', 'Principal', 'Vice Principal', 'Department Head', 'Teacher', 'Accountant'],
      default: 'School Administrator'
    },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', index: true },
    avatar: { type: String, default: '/assets/avatar-admin.png' },
    status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
    isSuperAdmin: { type: Boolean, default: false },
    permissions: [{ type: String }],
    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
```

---

### 2.3 `Student.model.ts` (`src/apps/student/models/students/Student.model.ts`)
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  studentId: string; // "std-201"
  schoolId: mongoose.Types.ObjectId;
  academicYear: string; // "2081-82"
  fullName: string;
  avatar: string; // "SA"
  rollNumber: number;
  grade: string; // "Grade 10"
  section: string; // "A"
  className: string; // "Grade 10A"
  classSectionId?: mongoose.Types.ObjectId;
  status: 'Active' | 'On Leave' | 'Suspended';
  attendancePercentage: number;
  overallScore: number;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  parentStudentLinkCode: string; // "NS-PAR-9821"
  riskStatus: 'Normal' | 'At-Risk';
  riskTags: string[]; // ['Low Attendance', 'Missing Assignments', 'Score Below 40%', 'Declining Trend']
  emergencyContact?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    studentId: { type: String, required: true, unique: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    academicYear: { type: String, required: true, default: '2081-82', index: true },
    fullName: { type: String, required: true, trim: true },
    avatar: { type: String, default: 'ST' },
    rollNumber: { type: Number, required: true },
    grade: { type: String, required: true },
    section: { type: String, required: true },
    className: { type: String, required: true, index: true },
    classSectionId: { type: Schema.Types.ObjectId, ref: 'SchoolClass' },
    status: { type: String, enum: ['Active', 'On Leave', 'Suspended'], default: 'Active' },
    attendancePercentage: { type: Number, default: 100 },
    overallScore: { type: Number, default: 0 },
    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
    parentEmail: { type: String },
    parentStudentLinkCode: { type: String, unique: true },
    riskStatus: { type: String, enum: ['Normal', 'At-Risk'], default: 'Normal', index: true },
    riskTags: [{ type: String }],
    emergencyContact: { type: String }
  },
  { timestamps: true }
);

StudentSchema.index({ schoolId: 1, academicYear: 1, className: 1 });
StudentSchema.index({ schoolId: 1, academicYear: 1, status: 1 });

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
```

---

### 2.4 `Teacher.model.ts` (`src/shared/models/Teacher.model.ts`)
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  schoolId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  employeeCode?: string;
  qualification?: string;
  subjectsTaught: string[];
  assignedClasses: string[];
  isClassTeacherOf?: string;
  status: 'Active' | 'On Leave' | 'Resigned';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    employeeCode: { type: String },
    qualification: { type: String },
    subjectsTaught: [{ type: String }],
    assignedClasses: [{ type: String }],
    isClassTeacherOf: { type: String },
    status: { type: String, enum: ['Active', 'On Leave', 'Resigned'], default: 'Active' },
    avatar: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);
```

---

## 3. NEW Schemas to Add (`noteswift-backend/src/shared/models/`)

### 3.1 `AcademicYear.model.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademicYear extends Document {
  schoolId: mongoose.Types.ObjectId;
  code: string; // "2081-82"
  label: string; // "Academic Year 2081–82"
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  status: 'Active' | 'Archived' | 'Upcoming';
}

const AcademicYearSchema = new Schema<IAcademicYear>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    code: { type: String, required: true },
    label: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isCurrent: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Archived', 'Upcoming'], default: 'Active' }
  },
  { timestamps: true }
);

AcademicYearSchema.index({ schoolId: 1, code: 1 }, { unique: true });

export default mongoose.models.AcademicYear || mongoose.model<IAcademicYear>('AcademicYear', AcademicYearSchema);
```

---

### 3.2 `SchoolClass.model.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ISchoolClass extends Document {
  schoolId: mongoose.Types.ObjectId;
  academicYear: string;
  grade: string; // "Grade 10"
  section: string; // "A"
  className: string; // "Grade 10A"
  classTeacherId?: mongoose.Types.ObjectId;
  studentCount: number;
  subjects: Array<{
    subjectName: string;
    teacherId?: mongoose.Types.ObjectId;
  }>;
}

const SchoolClassSchema = new Schema<ISchoolClass>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    academicYear: { type: String, required: true, default: '2081-82' },
    grade: { type: String, required: true },
    section: { type: String, required: true },
    className: { type: String, required: true },
    classTeacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    studentCount: { type: Number, default: 0 },
    subjects: [
      {
        subjectName: { type: String, required: true },
        teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' }
      }
    ]
  },
  { timestamps: true }
);

SchoolClassSchema.index({ schoolId: 1, academicYear: 1, className: 1 }, { unique: true });

export default mongoose.models.SchoolClass || mongoose.model<ISchoolClass>('SchoolClass', SchoolClassSchema);
```

---

### 3.3 `SchoolAttendance.model.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ISchoolAttendance extends Document {
  schoolId: mongoose.Types.ObjectId;
  academicYear: string;
  className: string; // "Grade 10A"
  studentId: mongoose.Types.ObjectId;
  studentCode: string; // "std-201"
  date: Date;
  dateString: string; // "2026-06-29"
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  timeIn?: string;
  markedBy?: mongoose.Types.ObjectId;
  remarks?: string;
}

const SchoolAttendanceSchema = new Schema<ISchoolAttendance>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    academicYear: { type: String, required: true, default: '2081-82' },
    className: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    studentCode: { type: String, required: true },
    date: { type: Date, required: true, index: true },
    dateString: { type: String, required: true, index: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late', 'Excused'], required: true },
    timeIn: { type: String },
    markedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    remarks: { type: String }
  },
  { timestamps: true }
);

SchoolAttendanceSchema.index({ schoolId: 1, studentId: 1, dateString: 1 }, { unique: true });
SchoolAttendanceSchema.index({ schoolId: 1, className: 1, dateString: 1 });

export default mongoose.models.SchoolAttendance || mongoose.model<ISchoolAttendance>('SchoolAttendance', SchoolAttendanceSchema);
```

---

### 3.4 `SchoolAssignment.model.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ISchoolAssignment extends Document {
  assignmentId: string; // "asn-301"
  schoolId: mongoose.Types.ObjectId;
  academicYear: string;
  title: string;
  subject: string;
  grade: string; // "Grade 10"
  className?: string;
  dueDate: Date;
  dueDateString: string; // "2026-07-02"
  totalMarks?: number;
  submissionRate: number; // 92 (%)
  status: 'Active' | 'Closed' | 'Pending' | 'Draft';
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SchoolAssignmentSchema = new Schema<ISchoolAssignment>(
  {
    assignmentId: { type: String, required: true, unique: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    academicYear: { type: String, required: true, default: '2081-82' },
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, index: true },
    grade: { type: String, required: true, index: true },
    className: { type: String },
    dueDate: { type: Date, required: true },
    dueDateString: { type: String, required: true },
    totalMarks: { type: Number, default: 100 },
    submissionRate: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Closed', 'Pending', 'Draft'], default: 'Active', index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

SchoolAssignmentSchema.index({ schoolId: 1, academicYear: 1, status: 1 });

export default mongoose.models.SchoolAssignment || mongoose.model<ISchoolAssignment>('SchoolAssignment', SchoolAssignmentSchema);
```

---

### 3.5 `SchoolAssignmentSubmission.model.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ISchoolAssignmentSubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  submittedAt?: Date;
  status: 'Submitted' | 'Pending' | 'Overdue' | 'Late';
  score?: number | null;
  feedback?: string;
  fileUrl?: string;
}

const SchoolAssignmentSubmissionSchema = new Schema<ISchoolAssignmentSubmission>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'SchoolAssignment', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    submittedAt: { type: Date },
    status: { type: String, enum: ['Submitted', 'Pending', 'Overdue', 'Late'], default: 'Pending' },
    score: { type: Number, default: null },
    feedback: { type: String },
    fileUrl: { type: String }
  },
  { timestamps: true }
);

SchoolAssignmentSubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

export default mongoose.models.SchoolAssignmentSubmission || mongoose.model<ISchoolAssignmentSubmission>('SchoolAssignmentSubmission', SchoolAssignmentSubmissionSchema);
```

---

### 3.6 `SchoolQuiz.model.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ISchoolQuiz extends Document {
  quizId: string;
  schoolId: mongoose.Types.ObjectId;
  academicYear: string;
  title: string;
  subject: string;
  grade: string;
  averageScore: number;
  passRate: number;
  totalAttempts: number;
  status: 'Active' | 'Closed' | 'Draft';
}

const SchoolQuizSchema = new Schema<ISchoolQuiz>(
  {
    quizId: { type: String, required: true, unique: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    academicYear: { type: String, required: true, default: '2081-82' },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    averageScore: { type: Number, default: 0 },
    passRate: { type: Number, default: 0 },
    totalAttempts: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Closed', 'Draft'], default: 'Active' }
  },
  { timestamps: true }
);

export default mongoose.models.SchoolQuiz || mongoose.model<ISchoolQuiz>('SchoolQuiz', SchoolQuizSchema);
```

---

### 3.7 `ParentMessageThread.model.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IParentMessageThread extends Document {
  threadId: string; // "msg-501"
  schoolId: mongoose.Types.ObjectId;
  academicYear: string;
  studentId?: mongoose.Types.ObjectId;
  parentName: string;
  studentName: string;
  avatar: string; // "GA"
  className: string; // "Grade 10A"
  snippet: string;
  unreadCountAdmin: number;
  unreadCountParent: number;
  lastMessageTimestamp: Date;
  messages: Array<{
    sender: 'admin' | 'parent';
    text: string;
    timestamp: Date;
  }>;
}

const ParentMessageThreadSchema = new Schema<IParentMessageThread>(
  {
    threadId: { type: String, required: true, unique: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    academicYear: { type: String, required: true, default: '2081-82' },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    parentName: { type: String, required: true },
    studentName: { type: String, required: true },
    avatar: { type: String, default: 'PA' },
    className: { type: String },
    snippet: { type: String, default: '' },
    unreadCountAdmin: { type: Number, default: 0 },
    unreadCountParent: { type: Number, default: 0 },
    lastMessageTimestamp: { type: Date, default: Date.now },
    messages: [
      {
        sender: { type: String, enum: ['admin', 'parent'], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.ParentMessageThread || mongoose.model<IParentMessageThread>('ParentMessageThread', ParentMessageThreadSchema);
```

---

### 3.8 `SchoolAnnouncement.model.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ISchoolAnnouncement extends Document {
  announcementId: string; // "ann-601"
  schoolId: mongoose.Types.ObjectId;
  academicYear: string;
  title: string;
  target: string; // "All Parents & Teachers"
  sender: string; // "Principal Ramesh Sharma"
  senderId?: mongoose.Types.ObjectId;
  content: string;
  recipientCount: number;
  createdAt: Date;
}

const SchoolAnnouncementSchema = new Schema<ISchoolAnnouncement>(
  {
    announcementId: { type: String, required: true, unique: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    academicYear: { type: String, required: true, default: '2081-82' },
    title: { type: String, required: true },
    target: { type: String, required: true, default: 'All Parents & Teachers' },
    sender: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'Admin' },
    content: { type: String, required: true },
    recipientCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.SchoolAnnouncement || mongoose.model<ISchoolAnnouncement>('SchoolAnnouncement', SchoolAnnouncementSchema);
```

---

### 3.9 `SchoolAIInsight.model.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ISchoolAIInsight extends Document {
  schoolId: mongoose.Types.ObjectId;
  academicYear: string;
  type: 'alert' | 'warning' | 'good' | 'info';
  text: string;
  isActive: boolean;
}

const SchoolAIInsightSchema = new Schema<ISchoolAIInsight>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    academicYear: { type: String, required: true, default: '2081-82' },
    type: { type: String, enum: ['alert', 'warning', 'good', 'info'], required: true },
    text: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.SchoolAIInsight || mongoose.model<ISchoolAIInsight>('SchoolAIInsight', SchoolAIInsightSchema);
```

---

### 3.10 `SchoolReportAudit.model.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ISchoolReportAudit extends Document {
  reportId: string; // "rep-701"
  schoolId: mongoose.Types.ObjectId;
  academicYear: string;
  name: string;
  type: string;
  generatedAt: string; // "2026-06-25 10:15"
  format: 'PDF' | 'Excel' | 'CSV';
  size: string;
  generatedBy?: mongoose.Types.ObjectId;
}

const SchoolReportAuditSchema = new Schema<ISchoolReportAudit>(
  {
    reportId: { type: String, required: true, unique: true },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    academicYear: { type: String, required: true, default: '2081-82' },
    name: { type: String, required: true },
    type: { type: String, required: true },
    generatedAt: { type: String, required: true },
    format: { type: String, enum: ['PDF', 'Excel', 'CSV'], required: true },
    size: { type: String, default: '0 KB' },
    generatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

export default mongoose.models.SchoolReportAudit || mongoose.model<ISchoolReportAudit>('SchoolReportAudit', SchoolReportAuditSchema);
```

---

### 3.11 `StudentRiskLog.model.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentRiskLog extends Document {
  schoolId: mongoose.Types.ObjectId;
  academicYear: string;
  studentId: mongoose.Types.ObjectId;
  studentCode: string;
  riskTags: string[];
  actionType: 'notify' | 'meeting' | 'profile' | 'mentor';
  actionStatus: 'Pending' | 'In Progress' | 'Resolved';
  assignedStaffId?: mongoose.Types.ObjectId;
  notes?: string;
}

const StudentRiskLogSchema = new Schema<IStudentRiskLog>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    academicYear: { type: String, required: true, default: '2081-82' },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    studentCode: { type: String, required: true },
    riskTags: [{ type: String }],
    actionType: { type: String, enum: ['notify', 'meeting', 'profile', 'mentor'], required: true },
    actionStatus: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
    assignedStaffId: { type: Schema.Types.ObjectId, ref: 'Admin' },
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.StudentRiskLog || mongoose.model<IStudentRiskLog>('StudentRiskLog', StudentRiskLogSchema);
```

---

### 3.12 `SchoolKPI.model.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ISchoolKPI extends Document {
  schoolId: mongoose.Types.ObjectId;
  academicYear: string;
  activeStudents: { value: string; trend: string; trendDirection: 'up' | 'down' | 'neutral' };
  avgAttendance: { value: string; trend: string; trendDirection: 'up' | 'down' | 'neutral' };
  avgScore: { value: string; trend: string; trendDirection: 'up' | 'down' | 'neutral' };
  avgStudyHours: { value: string; trend: string; trendDirection: 'up' | 'down' | 'neutral' };
  assignmentCompletion: { value: string; trend: string; trendDirection: 'up' | 'down' | 'neutral' };
  atRiskCount: { value: number; trend: string; trendDirection: 'up' | 'down' | 'neutral' };
}

const SchoolKPISchema = new Schema<ISchoolKPI>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    academicYear: { type: String, required: true, default: '2081-82' },
    activeStudents: { type: Object, required: true },
    avgAttendance: { type: Object, required: true },
    avgScore: { type: Object, required: true },
    avgStudyHours: { type: Object, required: true },
    assignmentCompletion: { type: Object, required: true },
    atRiskCount: { type: Object, required: true }
  },
  { timestamps: true }
);

SchoolKPISchema.index({ schoolId: 1, academicYear: 1 }, { unique: true });

export default mongoose.models.SchoolKPI || mongoose.model<ISchoolKPI>('SchoolKPI', SchoolKPISchema);
```

---

## 4. Summary Matrix of Database Models

| Model Name | Operation | Primary Fields / Responsibility | Target File Path |
| :--- | :--- | :--- | :--- |
| `School` | **Modified** | `code`, `logo`, `banner`, `currentAcademicYear`, `settings` | `src/shared/models/School.model.ts` |
| `Admin` | **Modified** | `schoolId`, `role` enum extensions, `avatar`, `phone` | `src/shared/models/Admin.model.ts` |
| `Student` | **Modified** | `schoolId`, `academicYear`, `rollNumber`, `className`, `riskTags`, `parentStudentLinkCode` | `src/apps/student/models/students/Student.model.ts` |
| `Teacher` | **Modified** | `schoolId`, `employeeCode`, `assignedClasses`, `isClassTeacherOf` | `src/shared/models/Teacher.model.ts` |
| `AcademicYear` | **NEW** | Academic session management (`"2081-82"`) | `src/shared/models/AcademicYear.model.ts` |
| `SchoolClass` | **NEW** | Grade & Section structures (`"Grade 10A"`) | `src/shared/models/SchoolClass.model.ts` |
| `SchoolAttendance` | **NEW** | Daily student attendance logs | `src/shared/models/SchoolAttendance.model.ts` |
| `SchoolAssignment` | **NEW** | School homework & project assignments | `src/shared/models/SchoolAssignment.model.ts` |
| `SchoolAssignmentSubmission` | **NEW** | Student homework submissions & grading | `src/shared/models/SchoolAssignmentSubmission.model.ts` |
| `SchoolQuiz` | **NEW** | Quiz & Mock Test aggregated tracking | `src/shared/models/SchoolQuiz.model.ts` |
| `ParentMessageThread` | **NEW** | Messaging thread containers with parents | `src/shared/models/ParentMessageThread.model.ts` |
| `SchoolAnnouncement` | **NEW** | Targeted announcement broadcasts | `src/shared/models/SchoolAnnouncement.model.ts` |
| `SchoolAIInsight` | **NEW** | Analytical insight & warning logs | `src/shared/models/SchoolAIInsight.model.ts` |
| `SchoolReportAudit` | **NEW** | Administrative export audit history | `src/shared/models/SchoolReportAudit.model.ts` |
| `StudentRiskLog` | **NEW** | At-risk student action & care logs | `src/shared/models/StudentRiskLog.model.ts` |
| `SchoolKPI` | **NEW** | Cached dashboard metrics | `src/shared/models/SchoolKPI.model.ts` |

---
*NoteSwift School Admin Portal documentation.*
