export interface School {
  id: string;
  name: string;
  address: string;
}

export interface AcademicYear {
  id: string;
  label: string;
}

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  phone_number?: string;
  role: string;
  avatar: string;
}

export interface KPI {
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  iconName: string;
  colorType: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

export interface SubjectPerformance {
  subject: string;
  percentage: number;
  color: string; // Tailwind class color e.g., 'bg-blue-500'
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  class: string;
  attendance: number;
  studyHours: number;
  score: number;
  badge: string;
}

export interface AtRiskStudent {
  id: string;
  name: string;
  avatar: string;
  class: string;
  roll: number;
  riskTags: string[];
  actionType: 'notify' | 'meeting' | 'profile' | 'mentor';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  submissionRate: number;
  status: 'Active' | 'Closed' | 'Pending' | 'Draft';
}

export interface QuizTestOverview {
  total: number;
  active: number;
  averageScore: number;
  passRate: number;
}

export interface AIInsight {
  id: string;
  type: 'alert' | 'warning' | 'good' | 'info';
  text: string;
}

export interface Benchmark {
  label: string;
  percentage: number;
  color: string;
  isCurrentSchool?: boolean;
}

export interface MessageThread {
  id: string;
  parentName: string;
  studentName: string;
  avatar: string;
  snippet: string;
  unreadCount: number;
  timestamp: string;
  messages: Array<{
    sender: 'admin' | 'parent';
    text: string;
    timestamp: string;
  }>;
}

export interface Announcement {
  id: string;
  title: string;
  target: string;
  sender: string;
  timestamp: string;
  content: string;
  recipientCount: number;
}

export interface ReportItem {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  format: 'PDF' | 'Excel' | 'CSV';
  size: string;
}

export const schools: School[] = [
  { id: '1', name: 'NoteSwift Academy - Lalitpur', address: 'Jawalakhel, Lalitpur' },
  { id: '2', name: 'NoteSwift Academy - Kathmandu', address: 'Baneshwor, Kathmandu' },
  { id: '3', name: 'NoteSwift Academy - Bhaktapur', address: 'Suryabinayak, Bhaktapur' }
];

export const academicYears: AcademicYear[] = [
  { id: '2081-82', label: 'Academic Year 2081–82' },
  { id: '2080-81', label: 'Academic Year 2080–81' }
];

export const adminProfile: AdminProfile = {
  id: 'adm-101',
  fullName: 'Principal Ramesh Sharma',
  email: 'principal.sharma@example.com',
  role: 'School Administrator',
  avatar: '/assets/logo.png'
};

export const kpis: Record<string, KPI[]> = {
  '2081-82': [
    { label: 'Active Students', value: '1,248', trend: '+4.2% vs last month', trendDirection: 'up', iconName: 'Users', colorType: 'primary' },
    { label: 'Avg Attendance', value: '94.2%', trend: '+0.8% vs last week', trendDirection: 'up', iconName: 'CalendarCheck', colorType: 'success' },
    { label: 'Avg Academic Score', value: '78.5%', trend: '+1.5% vs midterm', trendDirection: 'up', iconName: 'GraduationCap', colorType: 'info' },
    { label: 'Avg Study Hours', value: '14.5 hr', trend: '-2.1% vs last week', trendDirection: 'down', iconName: 'Clock', colorType: 'secondary' },
    { label: 'Assignment Completion', value: '88.6%', trend: '+3.4% vs last term', trendDirection: 'up', iconName: 'ClipboardList', colorType: 'warning' },
    { label: 'At-Risk Students', value: '14', trend: '-2 count from last week', trendDirection: 'up', iconName: 'AlertTriangle', colorType: 'danger' } // down in at-risk is up (good)
  ],
  '2080-81': [
    { label: 'Active Students', value: '1,120', trend: '+5.0% yearly', trendDirection: 'up', iconName: 'Users', colorType: 'primary' },
    { label: 'Avg Attendance', value: '93.1%', trend: '+0.2% yearly', trendDirection: 'up', iconName: 'CalendarCheck', colorType: 'success' },
    { label: 'Avg Academic Score', value: '76.1%', trend: '+0.9% yearly', trendDirection: 'up', iconName: 'GraduationCap', colorType: 'info' },
    { label: 'Avg Study Hours', value: '13.8 hr', trend: '+4.1% yearly', trendDirection: 'up', iconName: 'Clock', colorType: 'secondary' },
    { label: 'Assignment Completion', value: '85.2%', trend: '+1.2% yearly', trendDirection: 'up', iconName: 'ClipboardList', colorType: 'warning' },
    { label: 'At-Risk Students', value: '18', trend: 'Average trend', trendDirection: 'neutral', iconName: 'AlertTriangle', colorType: 'danger' }
  ]
};

export const subjectPerformance: SubjectPerformance[] = [
  { subject: 'Mathematics', percentage: 82, color: 'bg-blue-500' },
  { subject: 'Science', percentage: 78, color: 'bg-emerald-500' },
  { subject: 'English', percentage: 85, color: 'bg-purple-500' },
  { subject: 'Social Studies', percentage: 74, color: 'bg-amber-500' },
  { subject: 'Computer Science', percentage: 88, color: 'bg-pink-500' },
  { subject: 'Nepali', percentage: 71, color: 'bg-rose-500' }
];

export const weeklyPerformance = [
  { week: 'Week 1', score: 72 },
  { week: 'Week 2', score: 74 },
  { week: 'Week 3', score: 73 },
  { week: 'Week 4', score: 76 },
  { week: 'Week 5', score: 75 },
  { week: 'Week 6', score: 78 },
  { week: 'Week 7', score: 77 },
  { week: 'Week 8', score: 78.5 }
];

export const monthlyGrowth = [
  { month: 'Baisakh', thisYear: 71, lastYear: 68 },
  { month: 'Jestha', thisYear: 73, lastYear: 69 },
  { month: 'Asar', thisYear: 72, lastYear: 70 },
  { month: 'Shrawan', thisYear: 74, lastYear: 71 },
  { month: 'Bhadra', thisYear: 75, lastYear: 72 },
  { month: 'Ashwin', thisYear: 73, lastYear: 71 },
  { month: 'Kartik', thisYear: 76, lastYear: 73 },
  { month: 'Mangsir', thisYear: 77, lastYear: 74 },
  { month: 'Poush', thisYear: 78, lastYear: 75 },
  { month: 'Magh', thisYear: 76, lastYear: 74 },
  { month: 'Fagun', thisYear: 78, lastYear: 75 },
  { month: 'Chaitra', thisYear: 78.5, lastYear: 76.1 }
];

export const leaderboard: Record<string, LeaderboardEntry[]> = {
  'Weekly': [
    { rank: 1, name: 'Siddharth Adhikari', avatar: 'SA', class: 'Grade 10A', attendance: 98, studyHours: 22, score: 96.5, badge: 'Top Scholar' },
    { rank: 2, name: 'Pooja Shrestha', avatar: 'PS', class: 'Grade 10B', attendance: 99, studyHours: 20, score: 95.2, badge: 'Rising Star' },
    { rank: 3, name: 'Aarav Pandey', avatar: 'AP', class: 'Grade 9A', attendance: 96, studyHours: 19, score: 94.0, badge: 'Math Whiz' },
    { rank: 4, name: 'Kriti Baral', avatar: 'KB', class: 'Grade 10A', attendance: 97, studyHours: 18, score: 92.8, badge: 'Creative Thinker' },
    { rank: 5, name: 'Nischal Bhattarai', avatar: 'NB', class: 'Grade 9B', attendance: 95, studyHours: 21, score: 91.5, badge: 'Science Champ' }
  ],
  'Monthly': [
    { rank: 1, name: 'Pooja Shrestha', avatar: 'PS', class: 'Grade 10B', attendance: 99.5, studyHours: 85, score: 95.8, badge: 'Consistency Queen' },
    { rank: 2, name: 'Siddharth Adhikari', avatar: 'SA', class: 'Grade 10A', attendance: 98.2, studyHours: 88, score: 95.5, badge: 'Top Scholar' },
    { rank: 3, name: 'Ananya Joshi', avatar: 'AJ', class: 'Grade 8A', attendance: 97.8, studyHours: 78, score: 93.6, badge: 'Grammar Guru' },
    { rank: 4, name: 'Aarav Pandey', avatar: 'AP', class: 'Grade 9A', attendance: 95.8, studyHours: 80, score: 93.0, badge: 'Active Learner' },
    { rank: 5, name: 'Kabir Thapa', avatar: 'KT', class: 'Grade 10A', attendance: 94.5, studyHours: 82, score: 92.1, badge: 'Math Whiz' }
  ],
  'Grade 10': [
    { rank: 1, name: 'Siddharth Adhikari', avatar: 'SA', class: 'Grade 10A', attendance: 98.0, studyHours: 22, score: 96.5, badge: 'Top Scholar' },
    { rank: 2, name: 'Pooja Shrestha', avatar: 'PS', class: 'Grade 10B', attendance: 99.0, studyHours: 20, score: 95.2, badge: 'Rising Star' },
    { rank: 3, name: 'Kriti Baral', avatar: 'KB', class: 'Grade 10A', attendance: 97.0, studyHours: 18, score: 92.8, badge: 'Creative Thinker' },
    { rank: 4, name: 'Kabir Thapa', avatar: 'KT', class: 'Grade 10A', attendance: 94.5, studyHours: 19, score: 91.8, badge: 'Tech Wizard' },
    { rank: 5, name: 'Rohan Shrestha', avatar: 'RS', class: 'Grade 10B', attendance: 93.8, studyHours: 17, score: 90.2, badge: 'Active Learner' }
  ]
};

export const classAttendance = [
  { className: 'Grade 10A', present: 38, total: 40, percentage: 95 },
  { className: 'Grade 10B', present: 36, total: 38, percentage: 94.7 },
  { className: 'Grade 9A', present: 41, total: 42, percentage: 97.6 },
  { className: 'Grade 9B', present: 35, total: 40, percentage: 87.5 },
  { className: 'Grade 8A', present: 37, total: 37, percentage: 100 },
  { className: 'Grade 8B', present: 32, total: 36, percentage: 88.8 }
];

export const atRiskStudents: AtRiskStudent[] = [
  { id: 'std-201', name: 'Bibek Magar', avatar: 'BM', class: 'Grade 9B', roll: 12, riskTags: ['Low Attendance', 'Declining Trend'], actionType: 'notify' },
  { id: 'std-202', name: 'Reena Maharjan', avatar: 'RM', class: 'Grade 10B', roll: 28, riskTags: ['Score Below 40%', 'Missing Assignments'], actionType: 'meeting' },
  { id: 'std-203', name: 'Pranish Karki', avatar: 'PK', class: 'Grade 8B', roll: 8, riskTags: ['Low Attendance', 'Score Below 40%'], actionType: 'mentor' },
  { id: 'std-204', name: 'Sneha Shrestha', avatar: 'SS', class: 'Grade 9B', roll: 19, riskTags: ['Missing Assignments', 'Declining Trend'], actionType: 'profile' },
  { id: 'std-205', name: 'Ayush Tamang', avatar: 'AT', class: 'Grade 10A', roll: 3, riskTags: ['Low Attendance'], actionType: 'notify' }
];

export const activityHeatmap = [
  // grid of 7 days x 10 weeks
  // value represents activity score: 0 to 4
  { day: 'Sun', week: 1, value: 3 }, { day: 'Sun', week: 2, value: 2 }, { day: 'Sun', week: 3, value: 4 }, { day: 'Sun', week: 4, value: 1 }, { day: 'Sun', week: 5, value: 3 }, { day: 'Sun', week: 6, value: 2 }, { day: 'Sun', week: 7, value: 3 }, { day: 'Sun', week: 8, value: 4 }, { day: 'Sun', week: 9, value: 2 }, { day: 'Sun', week: 10, value: 3 },
  { day: 'Mon', week: 1, value: 4 }, { day: 'Mon', week: 2, value: 3 }, { day: 'Mon', week: 3, value: 3 }, { day: 'Mon', week: 4, value: 2 }, { day: 'Mon', week: 5, value: 4 }, { day: 'Mon', week: 6, value: 4 }, { day: 'Mon', week: 7, value: 4 }, { day: 'Mon', week: 8, value: 3 }, { day: 'Mon', week: 9, value: 3 }, { day: 'Mon', week: 10, value: 4 },
  { day: 'Tue', week: 1, value: 2 }, { day: 'Tue', week: 2, value: 4 }, { day: 'Tue', week: 3, value: 2 }, { day: 'Tue', week: 4, value: 3 }, { day: 'Tue', week: 5, value: 2 }, { day: 'Tue', week: 6, value: 3 }, { day: 'Tue', week: 7, value: 2 }, { day: 'Tue', week: 8, value: 4 }, { day: 'Tue', week: 9, value: 4 }, { day: 'Tue', week: 10, value: 2 },
  { day: 'Wed', week: 1, value: 3 }, { day: 'Wed', week: 2, value: 2 }, { day: 'Wed', week: 3, value: 3 }, { day: 'Wed', week: 4, value: 4 }, { day: 'Wed', week: 5, value: 3 }, { day: 'Wed', week: 6, value: 1 }, { day: 'Wed', week: 7, value: 3 }, { day: 'Wed', week: 8, value: 2 }, { day: 'Wed', week: 9, value: 1 }, { day: 'Wed', week: 10, value: 3 },
  { day: 'Thu', week: 1, value: 4 }, { day: 'Thu', week: 2, value: 4 }, { day: 'Thu', week: 3, value: 4 }, { day: 'Thu', week: 4, value: 2 }, { day: 'Thu', week: 5, value: 4 }, { day: 'Thu', week: 6, value: 3 }, { day: 'Thu', week: 7, value: 4 }, { day: 'Thu', week: 8, value: 4 }, { day: 'Thu', week: 9, value: 3 }, { day: 'Thu', week: 10, value: 4 },
  { day: 'Fri', week: 1, value: 1 }, { day: 'Fri', week: 2, value: 1 }, { day: 'Fri', week: 3, value: 2 }, { day: 'Fri', week: 4, value: 0 }, { day: 'Fri', week: 5, value: 1 }, { day: 'Fri', week: 6, value: 2 }, { day: 'Fri', week: 7, value: 1 }, { day: 'Fri', week: 8, value: 2 }, { day: 'Fri', week: 9, value: 0 }, { day: 'Fri', week: 10, value: 1 },
  { day: 'Sat', week: 1, value: 0 }, { day: 'Sat', week: 2, value: 0 }, { day: 'Sat', week: 3, value: 0 }, { day: 'Sat', week: 4, value: 1 }, { day: 'Sat', week: 5, value: 0 }, { day: 'Sat', week: 6, value: 0 }, { day: 'Sat', week: 7, value: 0 }, { day: 'Sat', week: 8, value: 1 }, { day: 'Sat', week: 9, value: 0 }, { day: 'Sat', week: 10, value: 0 }
];

export const assignments: Assignment[] = [
  { id: 'asn-301', title: 'Quadratic Equations Practice', subject: 'Mathematics', grade: 'Grade 10', dueDate: '2026-07-02', submissionRate: 92, status: 'Active' },
  { id: 'asn-302', title: 'Chemical Bond Lab Report', subject: 'Science', grade: 'Grade 9', dueDate: '2026-07-01', submissionRate: 85, status: 'Active' },
  { id: 'asn-303', title: 'Hamlet Essay Analysis', subject: 'English', grade: 'Grade 10', dueDate: '2026-06-28', submissionRate: 98, status: 'Closed' },
  { id: 'asn-304', title: 'Industrial Revolution Timeline', subject: 'Social Studies', grade: 'Grade 8', dueDate: '2026-07-05', submissionRate: 0, status: 'Pending' },
  { id: 'asn-305', title: 'HTML/CSS Portfolio Draft', subject: 'Computer Science', grade: 'Grade 9', dueDate: '2026-07-10', submissionRate: 0, status: 'Draft' }
];

export const quizzesOverview: QuizTestOverview = {
  total: 48,
  active: 8,
  averageScore: 74.8,
  passRate: 85.5
};

export const subjectQuizzes = [
  { subject: 'Math Quizzes', averageScore: 72 },
  { subject: 'Science Quizzes', averageScore: 76 },
  { subject: 'English Quizzes', averageScore: 84 },
  { subject: 'Social Quizzes', averageScore: 70 },
  { subject: 'Computer Quizzes', averageScore: 86 }
];

export const platformEngagement = {
  videosWatched: '3,842',
  notesAccessed: '12,940',
  assignmentsSubmitted: '8,412',
  quizAttempts: '5,102',
  dailyActiveStudents: '912'
};

export const weeklyEngagement = [
  { name: 'Sun', videos: 400, notes: 800, quizzes: 200 },
  { name: 'Mon', videos: 1200, notes: 2500, quizzes: 800 },
  { name: 'Tue', videos: 1100, notes: 2300, quizzes: 750 },
  { name: 'Wed', videos: 1300, notes: 2700, quizzes: 900 },
  { name: 'Thu', videos: 1250, notes: 2600, quizzes: 850 },
  { name: 'Fri', videos: 700, notes: 1400, quizzes: 400 },
  { name: 'Sat', videos: 200, notes: 500, quizzes: 100 }
];

export const aiInsights: AIInsight[] = [
  { id: 'ins-1', type: 'warning', text: 'Grade 10 Mathematics average dropped 7% this month. Consider scheduling additional revision sessions.' },
  { id: 'ins-2', type: 'alert', text: 'At-risk cluster detected in Grade 9B due to missing assignments (12% drop in completions).' },
  { id: 'ins-3', type: 'good', text: '85% assignment completion reached in Science across all sections, exceeding the district benchmark.' },
  { id: 'ins-4', type: 'info', text: 'Engagement in daily quizzes increased by 14% this week. Keep up the gamified leaderboard activities.' }
];

export const benchmarking: Benchmark[] = [
  { label: 'Your School (Lalitpur)', percentage: 78.5, color: 'bg-blue-600', isCurrentSchool: true },
  { label: 'Top Partner School', percentage: 89.0, color: 'bg-emerald-600' },
  { label: 'District Average', percentage: 71.2, color: 'bg-gray-400' },
  { label: 'Municipality Average', percentage: 68.4, color: 'bg-slate-400' }
];

export const parentMessages: MessageThread[] = [
  {
    id: 'msg-501',
    parentName: 'Gopal Adhikari',
    studentName: 'Siddharth Adhikari',
    avatar: 'GA',
    snippet: 'Thank you for the update, Principal. I will monitor his study hours.',
    unreadCount: 1,
    timestamp: '2 hours ago',
    messages: [
      { sender: 'admin', text: 'Hello Gopal, Siddharth has been performing exceptionally well. Just a note that he could improve his study hours outside of school.', timestamp: '1 day ago' },
      { sender: 'parent', text: 'Thank you for the update, Principal. I will monitor his study hours.', timestamp: '2 hours ago' }
    ]
  },
  {
    id: 'msg-502',
    parentName: 'Sunita Maharjan',
    studentName: 'Reena Maharjan',
    avatar: 'SM',
    snippet: 'Can we schedule a meeting on Friday afternoon?',
    unreadCount: 2,
    timestamp: '5 hours ago',
    messages: [
      { sender: 'admin', text: 'Dear Sunita, we noticed Reenas grades have dipped in Science. We would love to discuss a support plan.', timestamp: '1 day ago' },
      { sender: 'parent', text: 'I am concerned too. Can we schedule a meeting on Friday afternoon?', timestamp: '5 hours ago' }
    ]
  },
  {
    id: 'msg-503',
    parentName: 'Bishnu Karki',
    studentName: 'Pranish Karki',
    avatar: 'BK',
    snippet: 'I will ensure he attends classes regularly now.',
    unreadCount: 0,
    timestamp: 'Yesterday',
    messages: [
      { sender: 'admin', text: 'Hello Bishnu, Pranish has missed 4 classes this week. Regular attendance is critical.', timestamp: '2 days ago' },
      { sender: 'parent', text: 'He was unwell early this week. I will ensure he attends classes regularly now.', timestamp: 'Yesterday' }
    ]
  }
];

export const announcements: Announcement[] = [
  { id: 'ann-601', title: 'First Term Examination Schedule Released', target: 'All Parents & Teachers', sender: 'Principal Ramesh Sharma', timestamp: '2 days ago', content: 'The first term exam timetable is now online. Please download it from the portal.', recipientCount: 1284 },
  { id: 'ann-602', title: 'Parent-Teacher Meeting (PTA) Notice', target: 'Grade 9 & 10 Parents', sender: 'Administration', timestamp: '5 days ago', content: 'A meeting is scheduled this Saturday at 10 AM to discuss term progression.', recipientCount: 312 },
  { id: 'ann-603', title: 'Monsoon Break Announcement', target: 'All Students & Staff', sender: 'Principal Ramesh Sharma', timestamp: '1 week ago', content: 'School will remain closed from July 5th to July 12th for the annual monsoon break.', recipientCount: 1350 }
];

export const reports: ReportItem[] = [
  { id: 'rep-701', name: 'First Term School Performance Report', type: 'Academic', generatedAt: '2026-06-25 10:15', format: 'PDF', size: '2.4 MB' },
  { id: 'rep-702', name: 'Weekly Attendance Analysis - Week 12', type: 'Attendance', generatedAt: '2026-06-28 16:30', format: 'Excel', size: '156 KB' },
  { id: 'rep-703', name: 'At-Risk Students Action Tracker', type: 'Student Care', generatedAt: '2026-06-29 09:00', format: 'CSV', size: '42 KB' }
];

// Student Profiles mock directory
export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  roll: number;
  class: string;
  attendance: number;
  score: number;
  status: 'Active' | 'On Leave' | 'Suspended';
  parentName: string;
  parentPhone: string;
  attendanceHistory: Array<{ date: string; status: 'Present' | 'Absent' | 'Late' }>;
  subjectGrades: Array<{ subject: string; grade: string; score: number }>;
  assignments: Array<{ title: string; dueDate: string; score: number | null; status: 'Submitted' | 'Pending' | 'Overdue' }>;
}

export const studentsDirectory: StudentProfile[] = [
  {
    id: 'std-201',
    name: 'Bibek Magar',
    avatar: 'BM',
    roll: 12,
    class: 'Grade 9B',
    attendance: 78.4,
    score: 62.5,
    status: 'Active',
    parentName: 'Ganesh Magar',
    parentPhone: '9841234567',
    attendanceHistory: [
      { date: '2026-06-29', status: 'Absent' },
      { date: '2026-06-28', status: 'Present' },
      { date: '2026-06-26', status: 'Absent' },
      { date: '2026-06-25', status: 'Present' }
    ],
    subjectGrades: [
      { subject: 'Mathematics', grade: 'C+', score: 58 },
      { subject: 'Science', grade: 'B', score: 65 },
      { subject: 'English', grade: 'B-', score: 60 }
    ],
    assignments: [
      { title: 'Algebra Equations', dueDate: '2026-06-29', score: 52, status: 'Submitted' },
      { title: 'Newtonian Physics', dueDate: '2026-06-27', score: null, status: 'Overdue' }
    ]
  },
  {
    id: 'std-202',
    name: 'Reena Maharjan',
    avatar: 'RM',
    roll: 28,
    class: 'Grade 10B',
    attendance: 88.5,
    score: 38.0,
    status: 'Active',
    parentName: 'Sunita Maharjan',
    parentPhone: '9801234567',
    attendanceHistory: [
      { date: '2026-06-29', status: 'Present' },
      { date: '2026-06-28', status: 'Present' },
      { date: '2026-06-26', status: 'Present' },
      { date: '2026-06-25', status: 'Present' }
    ],
    subjectGrades: [
      { subject: 'Mathematics', grade: 'D', score: 35 },
      { subject: 'Science', grade: 'D', score: 32 },
      { subject: 'English', grade: 'C', score: 47 }
    ],
    assignments: [
      { title: 'Trigonometry Intro', dueDate: '2026-06-25', score: 36, status: 'Submitted' },
      { title: 'Chemical Formulae', dueDate: '2026-06-28', score: null, status: 'Pending' }
    ]
  },
  {
    id: 'std-203',
    name: 'Pranish Karki',
    avatar: 'PK',
    roll: 8,
    class: 'Grade 8B',
    attendance: 64.2,
    score: 39.5,
    status: 'Active',
    parentName: 'Bishnu Karki',
    parentPhone: '9851012345',
    attendanceHistory: [
      { date: '2026-06-29', status: 'Absent' },
      { date: '2026-06-28', status: 'Absent' },
      { date: '2026-06-26', status: 'Present' },
      { date: '2026-06-25', status: 'Absent' }
    ],
    subjectGrades: [
      { subject: 'Mathematics', grade: 'D', score: 38 },
      { subject: 'Science', grade: 'D', score: 35 },
      { subject: 'English', grade: 'C-', score: 45.5 }
    ],
    assignments: [
      { title: 'Fractions Basics', dueDate: '2026-06-26', score: 40, status: 'Submitted' },
      { title: 'Animal Cells Diagram', dueDate: '2026-06-29', score: null, status: 'Overdue' }
    ]
  },
  {
    id: 'std-204',
    name: 'Sneha Shrestha',
    avatar: 'SS',
    roll: 19,
    class: 'Grade 9B',
    attendance: 92.0,
    score: 55.4,
    status: 'Active',
    parentName: 'Anil Shrestha',
    parentPhone: '9812345678',
    attendanceHistory: [
      { date: '2026-06-29', status: 'Present' },
      { date: '2026-06-28', status: 'Present' },
      { date: '2026-06-26', status: 'Present' },
      { date: '2026-06-25', status: 'Present' }
    ],
    subjectGrades: [
      { subject: 'Mathematics', grade: 'C', score: 50 },
      { subject: 'Science', grade: 'C+', score: 58 },
      { subject: 'English', grade: 'B', score: 68 }
    ],
    assignments: [
      { title: 'Linear Equations', dueDate: '2026-06-29', score: null, status: 'Pending' },
      { title: 'Cell Theory Quiz', dueDate: '2026-06-24', score: 56, status: 'Submitted' }
    ]
  },
  {
    id: 'std-205',
    name: 'Ayush Tamang',
    avatar: 'AT',
    roll: 3,
    class: 'Grade 10A',
    attendance: 80.2,
    score: 72.8,
    status: 'Active',
    parentName: 'Sita Tamang',
    parentPhone: '9803456789',
    attendanceHistory: [
      { date: '2026-06-29', status: 'Present' },
      { date: '2026-06-28', status: 'Absent' },
      { date: '2026-06-26', status: 'Present' },
      { date: '2026-06-25', status: 'Absent' }
    ],
    subjectGrades: [
      { subject: 'Mathematics', grade: 'B', score: 71 },
      { subject: 'Science', grade: 'B+', score: 76 },
      { subject: 'English', grade: 'A-', score: 81 }
    ],
    assignments: [
      { title: 'Calculus Intro', dueDate: '2026-06-29', score: null, status: 'Pending' },
      { title: 'Genetics Lab', dueDate: '2026-06-26', score: 75, status: 'Submitted' }
    ]
  },
  {
    id: 'std-101',
    name: 'Siddharth Adhikari',
    avatar: 'SA',
    roll: 1,
    class: 'Grade 10A',
    attendance: 98.0,
    score: 96.5,
    status: 'Active',
    parentName: 'Gopal Adhikari',
    parentPhone: '9841987654',
    attendanceHistory: [
      { date: '2026-06-29', status: 'Present' },
      { date: '2026-06-28', status: 'Present' },
      { date: '2026-06-26', status: 'Present' },
      { date: '2026-06-25', status: 'Present' }
    ],
    subjectGrades: [
      { subject: 'Mathematics', grade: 'A+', score: 98 },
      { subject: 'Science', grade: 'A+', score: 97 },
      { subject: 'English', grade: 'A', score: 94 }
    ],
    assignments: [
      { title: 'Calculus Intro', dueDate: '2026-06-29', score: 98, status: 'Submitted' },
      { title: 'Genetics Lab', dueDate: '2026-06-26', score: 95, status: 'Submitted' }
    ]
  },
  {
    id: 'std-102',
    name: 'Pooja Shrestha',
    avatar: 'PS',
    roll: 2,
    class: 'Grade 10B',
    attendance: 99.0,
    score: 95.2,
    status: 'Active',
    parentName: 'Rajesh Shrestha',
    parentPhone: '9801987654',
    attendanceHistory: [
      { date: '2026-06-29', status: 'Present' },
      { date: '2026-06-28', status: 'Present' },
      { date: '2026-06-26', status: 'Present' },
      { date: '2026-06-25', status: 'Present' }
    ],
    subjectGrades: [
      { subject: 'Mathematics', grade: 'A', score: 94 },
      { subject: 'Science', grade: 'A+', score: 96 },
      { subject: 'English', grade: 'A+', score: 95.6 }
    ],
    assignments: [
      { title: 'Trigonometry Intro', dueDate: '2026-06-25', score: 95, status: 'Submitted' },
      { title: 'Chemical Formulae', dueDate: '2026-06-28', score: 96, status: 'Submitted' }
    ]
  }
];

// Generate 50 additional mock students for performance prep/pagination demonstration
const nepalNames = [
  "Ramesh Thapa", "Sita Bhandari", "Hari Khadka", "Gita Pandey", "Niranjan Shrestha",
  "Anju Gurung", "Sunil Rai", "Pooja Acharya", "Bibek Karki", "Saraswati Giri",
  "Dipesh Joshi", "Aarati Dahal", "Sujan Lama", "Manju Tamang", "Prabhat Adhikari",
  "Kabita Mahat", "Roshan Bhattarai", "Binu Ghimire", "Suresh Regmi", "Rupa KC",
  "Prakash Gautam", "Sarmila Oli", "Amit Baral", "Kalpana Subedi", "Bipin Thapa",
  "Nisha Bhandari", "Sandip Khadka", "Sujata Pandey", "Raju Shrestha", "Binita Gurung",
  "Anil Rai", "Ganga Acharya", "Manoj Karki", "Radha Giri", "Suraj Joshi",
  "Karuna Dahal", "Nabin Lama", "Maya Tamang", "Pradip Adhikari", "Sabina Mahat",
  "Kiran Bhattarai", "Anita Ghimire", "Bimal Regmi", "Kriti KC", "Pawan Gautam",
  "Deepa Oli", "Anup Baral", "Laxmi Subedi", "Umesh Thapa", "Rekha Bhandari"
];

const grades = ["Grade 10A", "Grade 10B", "Grade 9A", "Grade 9B", "Grade 8A", "Grade 8B"];
const statuses: Array<'Active' | 'On Leave' | 'Suspended'> = ["Active", "Active", "Active", "On Leave", "Suspended"];

nepalNames.forEach((name, idx) => {
  const initials = name.split(" ").map(n => n[0]).join("");
  const roll = idx + 10;
  const grade = grades[idx % grades.length];
  const attendance = parseFloat((70 + Math.random() * 28).toFixed(1));
  const score = parseFloat((45 + Math.random() * 50).toFixed(1));
  const status = statuses[idx % statuses.length];
  const parentName = name.split(" ")[0] + "'s Guardian";
  const id = `std-auto-${100 + idx}`;

  studentsDirectory.push({
    id,
    name,
    avatar: initials,
    roll,
    class: grade,
    attendance,
    score,
    status,
    parentName,
    parentPhone: "98" + Math.floor(10000000 + Math.random() * 90000000),
    attendanceHistory: [
      { date: '2026-06-29', status: 'Present' },
      { date: '2026-06-28', status: 'Present' }
    ],
    subjectGrades: [
      { subject: 'Mathematics', grade: 'B', score: Math.round(score) },
      { subject: 'Science', grade: 'B', score: Math.round(score - 2) },
      { subject: 'English', grade: 'B', score: Math.round(score + 3) }
    ],
    assignments: [
      { title: 'Algebra Equations', dueDate: '2026-06-29', score: Math.round(score), status: 'Submitted' }
    ]
  });
});

// Generate 35 mock assignments
const assignmentTitles = [
  "Linear Graphs & Slopes", "Photosynthesis Experiment", "Prepositions Quiz", "Ancient Rome Research", "Basic Python Exercises",
  "Trigonometric Values Sheet", "Chemical Reactions Sheet", "Creative Writing: Short Story", "Mapping South America", "Arrays and Loops Project",
  "Statistics and Probability", "Digestive System Diagram", "Active/Passive Voice Practice", "World War I Causes", "CSS Flexbox Challenge",
  "Calculus Limits Homework", "Periodic Table Trends", "Shakespeare Sonnet Analysis", "Geography of Nepal Project", "SQL Database Creation",
  "Geometry Properties Quiz", "Cell Division Study Guide", "Tense Transformation Sheet", "French Revolution Timeline", "Recursion Theory Sheet",
  "Probability Distributions", "Friction Experiment Log", "Essay on Climate Action", "United Nations History", "Binary Search Trees",
  "Matrix Operations Task", "Eco-system Energy Flow", "Adjective Clauses Practice", "Modern History Overview", "REST API Development"
];

const mockSubjects = ["Mathematics", "Science", "English", "Social Studies", "Computer Science"];
const mockGrades = ["Grade 10", "Grade 9", "Grade 8"];
const mockStatuses: Array<'Active' | 'Closed' | 'Pending' | 'Draft'> = ["Active", "Closed", "Pending", "Draft"];

assignmentTitles.forEach((title, idx) => {
  const id = `asn-auto-${400 + idx}`;
  const subject = mockSubjects[idx % mockSubjects.length];
  const grade = mockGrades[idx % mockGrades.length];
  const submissionRate = Math.round(50 + Math.random() * 45);
  const status = mockStatuses[idx % mockStatuses.length];
  
  const futureDays = (idx % 15) + 1;
  const dueDateStr = `2026-07-${futureDays < 10 ? '0' + futureDays : futureDays}`;

  assignments.push({
    id,
    title,
    subject,
    grade,
    dueDate: dueDateStr,
    submissionRate: status === 'Draft' || status === 'Pending' ? 0 : submissionRate,
    status
  });
});


