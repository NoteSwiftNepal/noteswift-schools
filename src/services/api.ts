import * as mocks from '../mocks/mock-data';

// Simulate async network latency
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const VITE_USE_MOCKS = true; // Easily toggled to false when backend API is ready

export const apiService = {
  async getSchools(): Promise<mocks.School[]> {
    await delay();
    return mocks.schools;
  },

  async getAcademicYears(): Promise<mocks.AcademicYear[]> {
    await delay();
    return mocks.academicYears;
  },

  async getAdminProfile(): Promise<mocks.AdminProfile> {
    await delay();
    return mocks.adminProfile;
  },

  async getKPIs(year: string = '2081-82'): Promise<mocks.KPI[]> {
    await delay();
    return mocks.kpis[year] || mocks.kpis['2081-82'];
  },

  async getSubjectPerformance(): Promise<mocks.SubjectPerformance[]> {
    await delay();
    return mocks.subjectPerformance;
  },

  async getWeeklyPerformance() {
    await delay();
    return mocks.weeklyPerformance;
  },

  async getMonthlyGrowth() {
    await delay();
    return mocks.monthlyGrowth;
  },

  async getLeaderboard(tab: string = 'Weekly'): Promise<mocks.LeaderboardEntry[]> {
    await delay();
    return mocks.leaderboard[tab] || mocks.leaderboard['Weekly'];
  },

  async getClassAttendance() {
    await delay();
    return mocks.classAttendance;
  },

  async getAtRiskStudents(): Promise<mocks.AtRiskStudent[]> {
    await delay();
    return mocks.atRiskStudents;
  },

  async getActivityHeatmap() {
    await delay();
    return mocks.activityHeatmap;
  },

  async getAssignments(): Promise<mocks.Assignment[]> {
    await delay();
    return mocks.assignments;
  },

  async getQuizzesOverview(): Promise<mocks.QuizTestOverview> {
    await delay();
    return mocks.quizzesOverview;
  },

  async getSubjectQuizzes() {
    await delay();
    return mocks.subjectQuizzes;
  },

  async getPlatformEngagement() {
    await delay();
    return mocks.platformEngagement;
  },

  async getWeeklyEngagement() {
    await delay();
    return mocks.weeklyEngagement;
  },

  async getAIInsights(): Promise<mocks.AIInsight[]> {
    await delay();
    return mocks.aiInsights;
  },

  async getBenchmarking(): Promise<mocks.Benchmark[]> {
    await delay();
    return mocks.benchmarking;
  },

  async getParentMessages(): Promise<mocks.MessageThread[]> {
    await delay();
    return mocks.parentMessages;
  },

  async getAnnouncements(): Promise<mocks.Announcement[]> {
    await delay();
    return mocks.announcements;
  },

  async getReports(): Promise<mocks.ReportItem[]> {
    await delay();
    return mocks.reports;
  },

  async getStudentsDirectory(
    search: string = '',
    classFilter: string = '',
    statusFilter: string = ''
  ): Promise<mocks.StudentProfile[]> {
    await delay(400); // slightly longer to simulate query database
    let list = [...mocks.studentsDirectory];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.class.toLowerCase().includes(q) ||
          (s.roll && s.roll.toString() === q)
      );
    }

    if (classFilter && classFilter !== 'all') {
      list = list.filter(s => s.class.includes(classFilter));
    }

    if (statusFilter && statusFilter !== 'all') {
      list = list.filter(s => s.status === statusFilter);
    }

    return list;
  },

  async getStudentProfile(id: string): Promise<mocks.StudentProfile | null> {
    await delay();
    const student = mocks.studentsDirectory.find(s => s.id === id);
    return student || null;
  },

  // Simulated creation/updates
  async createAnnouncement(data: { title: string; target: string; content: string }): Promise<mocks.Announcement> {
    await delay(600);
    if (!data.title || !data.content) {
      throw new Error('Title and content are required.');
    }
    const newAnn: mocks.Announcement = {
      id: `ann-${Date.now()}`,
      title: data.title,
      target: data.target || 'All Parents & Teachers',
      sender: mocks.adminProfile.fullName,
      timestamp: 'Just now',
      content: data.content,
      recipientCount: Math.floor(Math.random() * 1000) + 100
    };
    mocks.announcements.unshift(newAnn);
    return newAnn;
  },

  async createAssignment(data: { title: string; subject: string; grade: string; dueDate: string }): Promise<mocks.Assignment> {
    await delay(600);
    if (!data.title || !data.subject || !data.grade || !data.dueDate) {
      throw new Error('Please fill in all required fields.');
    }
    const newAsn: mocks.Assignment = {
      id: `asn-${Date.now()}`,
      title: data.title,
      subject: data.subject,
      grade: data.grade,
      dueDate: data.dueDate,
      submissionRate: 0,
      status: 'Active'
    };
    mocks.assignments.unshift(newAsn);
    return newAsn;
  },

  async sendParentMessage(threadId: string, text: string): Promise<mocks.MessageThread> {
    await delay(400);
    if (!text.trim()) {
      throw new Error('Message cannot be empty.');
    }
    const thread = mocks.parentMessages.find(t => t.id === threadId);
    if (!thread) {
      throw new Error('Message thread not found.');
    }
    const newMsg = {
      sender: 'admin' as const,
      text,
      timestamp: 'Just now'
    };
    thread.messages.push(newMsg);
    thread.snippet = text;
    thread.timestamp = 'Just now';
    return thread;
  },

  async generateReport(reportName: string, format: 'PDF' | 'Excel' | 'CSV'): Promise<mocks.ReportItem> {
    await delay(1000); // Simulate report compile duration
    const newReport: mocks.ReportItem = {
      id: `rep-${Date.now()}`,
      name: `${reportName} - Generated Report`,
      type: 'Admin Export',
      generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      format,
      size: `${(Math.random() * 2 + 0.1).toFixed(1)} MB`
    };
    mocks.reports.unshift(newReport);
    return newReport;
  }
};
