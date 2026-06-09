
import { Assignment, CalendarEvent, LibraryBook } from './types';

const STORAGE_KEYS = {
  ASSIGNMENTS: 'genschool_assignments',
  EVENTS: 'genschool_events',
  LIBRARY: 'genschool_library',
};

// Default Mock Data
const DEFAULT_ASSIGNMENTS: Assignment[] = [
  { 
    id: 'asgn-1', 
    title: 'Typography Principles Essay', 
    subject: 'Visual Communication', 
    teacher: 'Dr. Sarah Smith', 
    type: 'Project Submission', 
    instructions: 'Write a 1500-word essay exploring the five key principles of modern typography...', 
    dueDate: '2026-05-15', 
    dueTime: '23:59', 
    totalMarks: 100, 
    status: 'pending' 
  },
  { 
    id: 'asgn-2', 
    title: 'Color Theory Quiz', 
    subject: 'Color Theory', 
    teacher: 'Prof. Michael Brown', 
    type: 'Quiz / Test', 
    instructions: 'Complete the online quiz covering chapters 3–5...', 
    dueDate: '2026-05-10', 
    dueTime: '14:00', 
    totalMarks: 30, 
    status: 'graded', 
    submittedAt: '2026-05-09T11:00:00', 
    marks: 28, 
    feedback: 'Very good performance.', 
    fileName: 'Jane_ColorQuiz.pdf' 
  },
];

const DEFAULT_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Advanced UI Design',
    type: 'class',
    start: '2026-05-08T14:00:00',
    end: '2026-05-08T15:30:00',
    subject: 'Visual Communication',
    teacher: 'Dr. Sarah Jenkins',
    description: 'Deep dive into grid systems and typography.'
  },
  {
    id: 'evt-2',
    title: 'Math Midterm Exam',
    type: 'exam',
    start: '2026-05-12T09:00:00',
    end: '2026-05-12T11:00:00',
    subject: 'Mathematics',
    teacher: 'Prof. Miller',
    description: 'Chapters 1-6 coverage.'
  },
  {
    id: 'evt-3',
    title: 'History Assignment Due',
    type: 'homework',
    start: '2026-05-10T23:59:00',
    end: '2026-05-10T23:59:00',
    subject: 'History',
    description: 'Submit your Renaissance analysis.'
  }
];

const DEFAULT_LIBRARY: LibraryBook[] = [
  {
    id: 'book-1',
    title: 'Fundamentals of Calculus',
    author: 'Gilbert Strang',
    category: 'Mathematics',
    thumbnail: 'https://images.unsplash.com/photo-1543004629-141a4446255c?auto=format&fit=crop&q=80&w=200',
    pdfUrl: 'https://ocw.mit.edu/ans7870/resources/Strang/Edited/Calculus/Calculus.pdf',
    description: 'A comprehensive guide to calculus fundamentals.',
    addedDate: '2024-01-15'
  },
  {
    id: 'book-2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Programming',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=200',
    pdfUrl: 'https://web.archive.org/web/20180328221805/http://files.meetup.com/1837728/Clean%20Code.pdf',
    description: 'A handbook of agile software craftsmanship.',
    addedDate: '2024-02-10'
  },
  {
    id: 'book-3',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'English',
    thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200',
    pdfUrl: 'https://www.planetpublish.com/wp-content/uploads/2011/11/The_Great_Gatsby.pdf',
    description: 'A classic of American literature.',
    addedDate: '2024-03-05'
  }
];

export const storage = {
  getAssignments: (): Assignment[] => {
    if (typeof window === 'undefined') return DEFAULT_ASSIGNMENTS;
    const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return data ? JSON.parse(data) : DEFAULT_ASSIGNMENTS;
  },
  saveAssignments: (assignments: Assignment[]) => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  },
  getEvents: (): CalendarEvent[] => {
    if (typeof window === 'undefined') return DEFAULT_EVENTS;
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return data ? JSON.parse(data) : DEFAULT_EVENTS;
  },
  saveEvents: (events: CalendarEvent[]) => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },
  getLibrary: (): LibraryBook[] => {
    if (typeof window === 'undefined') return DEFAULT_LIBRARY;
    const data = localStorage.getItem(STORAGE_KEYS.LIBRARY);
    return data ? JSON.parse(data) : DEFAULT_LIBRARY;
  },
  saveLibrary: (books: LibraryBook[]) => {
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(books));
  }
};

