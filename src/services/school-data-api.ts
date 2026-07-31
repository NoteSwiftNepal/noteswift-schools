import { API_BASE_URL } from "@/config/app-config";

// Real backend calls for the school dashboard's data — replaces the mock
// apiService for everything except attendance (no attendance system exists
// in the platform yet) and everything that would require a new write-side
// feature (assignment authoring, parent messaging, report generation) that
// hasn't been built.

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('schoolToken') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/school${path}`, { headers: authHeaders() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

export interface DashboardKPIs {
  activeStudents: number;
  totalEnrollments: number;
  avgProgress: number;
  avgScore: number;
  completedCourses: number;
  atRiskCount: number;
}

export interface StudentSummary {
  _id: string;
  full_name: string;
  email: string;
  grade?: number;
  avatarEmoji?: string;
  profileImage?: string | null;
  enrolledCourseCount: number;
  avgProgress: number;
  lastLogin?: string;
}

export interface LeaderboardEntry {
  rank: number;
  _id: string;
  full_name: string;
  grade?: number;
  avatarEmoji?: string;
  profileImage?: string | null;
  avgProgress: number;
  avgScore: number;
  enrolledCourseCount: number;
}

export interface AtRiskStudent {
  _id: string;
  full_name: string;
  grade?: number;
  avatarEmoji?: string;
  profileImage?: string | null;
  avgProgress: number;
  lastAccessedAt?: string;
  riskTags: string[];
}

export interface TeacherSummary {
  _id: string;
  full_name: string;
  email: string;
  subjects: any[];
  status: string;
  createdAt: string;
}

export interface AcademicAnalytics {
  byProgram: { program: string; avgProgress: number; enrollmentCount: number }[];
  weeklyTrend: { label: string; avgScore: number | null; attemptCount: number }[];
}

export interface EngagementSummary {
  activeToday: number;
  activeThisWeek: number;
  activeThisMonth: number;
  inactive: number;
  total: number;
}

export interface TestSummary {
  _id: string;
  title: string;
  courseName: string;
  subjectName: string;
  category: string;
  status: string;
  totalMarks: number;
  schoolAttemptCount: number;
  schoolAvgScore: number | null;
  schoolPassRate: number | null;
  createdAt: string;
}

export interface SchoolSettings {
  _id: string;
  name: string;
  shortCode: string;
  address?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface StudentDetail {
  student: {
    _id: string;
    full_name: string;
    email: string;
    grade?: number;
    avatarEmoji?: string;
    profileImage?: string | null;
    lastLogin?: string;
    createdAt: string;
  };
  enrollments: {
    courseId: string;
    courseTitle: string;
    program: string | null;
    progress: number;
    isActive: boolean;
    enrolledAt: string;
    lastAccessedAt?: string;
    completedAt?: string;
    assessmentCount: number;
    avgAssessmentScore: number | null;
  }[];
}

export const schoolDataApi = {
  getDashboardKPIs: () => get<{ data: DashboardKPIs }>("/dashboard/kpis").then(r => r.data),

  listStudents: (params?: { search?: string; grade?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.grade) qs.set('grade', params.grade);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return get<{ data: StudentSummary[]; pagination: any }>(`/students${suffix}`);
  },

  getStudentDetail: (id: string) => get<{ data: StudentDetail }>(`/students/${id}`).then(r => r.data),

  getLeaderboard: (limit = 20) => get<{ data: LeaderboardEntry[] }>(`/students/leaderboard?limit=${limit}`).then(r => r.data),

  getAtRiskStudents: () => get<{ data: AtRiskStudent[] }>("/students/at-risk").then(r => r.data),

  listTeachers: () => get<{ data: TeacherSummary[] }>("/teachers").then(r => r.data),

  getAcademicAnalytics: () => get<{ data: AcademicAnalytics }>("/academic/analytics").then(r => r.data),

  getAssignments: () => get<{ data: TestSummary[] }>("/academic/assignments").then(r => r.data),
  getQuizzes: () => get<{ data: TestSummary[] }>("/academic/quizzes").then(r => r.data),
  getMockTests: () => get<{ data: TestSummary[] }>("/academic/mock-tests").then(r => r.data),

  getEngagement: () => get<{ data: EngagementSummary }>("/analytics/engagement").then(r => r.data),

  getSettings: () => get<{ data: { school: SchoolSettings } }>("/settings").then(r => r.data.school),

  getAnnouncements: () => get<{ data: any[] }>("/announcements").then(r => r.data),
  getParentMessages: () => get<{ data: any[] }>("/parent-messages").then(r => r.data),
  getReports: () => get<{ data: any[] }>("/reports").then(r => r.data),
};
