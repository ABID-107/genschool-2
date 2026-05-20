
export type AssignmentStatus = 'draft' | 'published' | 'pending' | 'submitted' | 'late' | 'graded' | 'reviewed';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  classGroup?: string;
  type: string;
  instructions: string;
  dueDate: string;
  dueTime: string;
  totalMarks: number;
  status: AssignmentStatus;
  submittedAt?: string;
  marks?: number;
  feedback?: string;
  fileName?: string;
  files?: string[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  status: 'not_submitted' | 'submitted' | 'late' | 'graded';
  fileName?: string;
  submittedAt?: string;
  marks?: number;
  feedback?: string;
}

export type EventType = 'class' | 'homework' | 'exam' | 'event';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  start: string; // ISO string or YYYY-MM-DD HH:mm
  end: string;
  subject?: string;
  description?: string;
  teacher?: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  thumbnail: string;
  pdfUrl: string;
  description: string;
  addedDate: string;
}

export const CATEGORIES = [
  'Mathematics',
  'Science',
  'English',
  'Programming',
  'Islamic Studies',
  'General Knowledge'
];

