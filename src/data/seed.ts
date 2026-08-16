import type {
  Assignment,
  AppNotification,
  ClassSlot,
  LabWork,
  Note,
  Project,
  StudentProfile,
  Subject,
  Task } from
'../types';
import { isoOffset } from '../utils/date';

const check = (labels: string[], doneCount: number) =>
labels.map((label, i) => ({ id: `c${i}`, label, done: i < doneCount }));

export const seedProfile: StudentProfile = {
  name: 'Rana Mehta',
  college: 'Northgate Institute of Technology',
  course: 'B.Tech',
  branch: 'Computer Science',
  semester: '5',
  academicYear: '2026 – 2027'
};

export const seedSubjects: Subject[] = [
{
  id: 's1',
  name: 'Python Programming',
  code: 'CS301',
  credits: 4,
  teacher: 'Prof. A. Sharma',
  theory: true,
  lab: true,
  units: 6,
  description: 'Core Python, OOP, file handling, modules and libraries.',
  color: 'purple'
},
{
  id: 's2',
  name: 'Database Management',
  code: 'CS302',
  credits: 4,
  teacher: 'Dr. M. Iyer',
  theory: true,
  lab: true,
  units: 5,
  description: 'Relational models, SQL, normalization, transactions.',
  color: 'yellow'
},
{
  id: 's3',
  name: 'Computer Networks',
  code: 'CS303',
  credits: 3,
  teacher: 'Prof. R. Nair',
  theory: true,
  lab: false,
  units: 5,
  description: 'OSI layers, routing, TCP/IP, network security basics.',
  color: 'red'
},
{
  id: 's4',
  name: 'Java Development',
  code: 'CS304',
  credits: 4,
  teacher: 'Ms. K. Rao',
  theory: true,
  lab: true,
  units: 6,
  description: 'Java fundamentals, collections, streams, JDBC.',
  color: 'white'
},
{
  id: 's5',
  name: 'Operating Systems',
  code: 'CS305',
  credits: 3,
  teacher: 'Dr. S. Bose',
  theory: true,
  lab: true,
  units: 5,
  description: 'Processes, scheduling, memory, file systems.',
  color: 'green'
},
{
  id: 's6',
  name: 'Technical Communication',
  code: 'HS301',
  credits: 2,
  teacher: 'Mrs. L. Fernandes',
  theory: true,
  lab: false,
  units: 4,
  description: 'Report writing, presentations, professional email.',
  color: 'white'
}];


export const seedTasks: Task[] = [
{
  id: 't1',
  title: 'Complete Python assignment questions 4–8',
  subjectId: 's1',
  category: 'ASSIGNMENT',
  description: 'Finish the remaining function questions from Assignment 03.',
  dueDate: isoOffset(0),
  dueTime: '16:00',
  priority: 'URGENT',
  status: 'IN_PROGRESS',
  estimatedHours: 2,
  checklist: check(['Read questions', 'Write answers', 'Review'], 1),
  reminder: true
},
{
  id: 't2',
  title: 'Revise DBMS normalization forms',
  subjectId: 's2',
  category: 'STUDY',
  description: '1NF through BCNF with examples from the unit 3 notes.',
  dueDate: isoOffset(0),
  dueTime: '19:30',
  priority: 'IMPORTANT',
  status: 'NOT_STARTED',
  estimatedHours: 1.5,
  checklist: [],
  reminder: true
},
{
  id: 't3',
  title: 'Write DBMS Lab 04 output screenshots',
  subjectId: 's2',
  category: 'LAB',
  description: 'Capture query outputs and paste into the record file.',
  dueDate: isoOffset(1),
  dueTime: '11:00',
  priority: 'IMPORTANT',
  status: 'IN_PROGRESS',
  estimatedHours: 1,
  checklist: check(['Run queries', 'Capture output', 'Paste in record'], 2),
  reminder: false
},
{
  id: 't4',
  title: 'Networks unit 2 problem set',
  subjectId: 's3',
  category: 'STUDY',
  description: 'Subnetting practice problems 1–15.',
  dueDate: isoOffset(-2),
  dueTime: '18:00',
  priority: 'URGENT',
  status: 'NOT_STARTED',
  estimatedHours: 2,
  checklist: [],
  reminder: true
},
{
  id: 't5',
  title: 'Build calculator history feature',
  subjectId: 's1',
  category: 'MINI_PROJECT',
  description: 'Persist last 20 calculations in the mini project.',
  dueDate: isoOffset(3),
  dueTime: '21:00',
  priority: 'NORMAL',
  status: 'IN_PROGRESS',
  estimatedHours: 3,
  checklist: check(['Design store', 'Implement', 'Test'], 1),
  reminder: false
},
{
  id: 't6',
  title: 'Smart Campus — finish auth module',
  subjectId: 's4',
  category: 'MAJOR_PROJECT',
  description: 'JWT login and role guards for the major project backend.',
  dueDate: isoOffset(8),
  dueTime: '20:00',
  priority: 'IMPORTANT',
  status: 'IN_PROGRESS',
  estimatedHours: 6,
  checklist: [],
  reminder: true
},
{
  id: 't7',
  title: 'Submit Java Lab 03 record',
  subjectId: 's4',
  category: 'LAB',
  description: 'Get the record signed before the lab session.',
  dueDate: isoOffset(2),
  dueTime: '09:00',
  priority: 'IMPORTANT',
  status: 'NOT_STARTED',
  estimatedHours: 0.5,
  checklist: [],
  reminder: true
},
{
  id: 't8',
  title: 'OS scheduling numericals',
  subjectId: 's5',
  category: 'STUDY',
  description: 'FCFS, SJF, round robin worked examples.',
  dueDate: isoOffset(0),
  dueTime: '22:00',
  priority: 'NORMAL',
  status: 'NOT_STARTED',
  estimatedHours: 1,
  checklist: [],
  reminder: false
},
{
  id: 't9',
  title: 'Draft seminar presentation outline',
  subjectId: 's6',
  category: 'PERSONAL',
  description: 'Ten slide structure for the technical seminar.',
  dueDate: isoOffset(5),
  dueTime: '17:00',
  priority: 'NORMAL',
  status: 'COMPLETED',
  estimatedHours: 1,
  checklist: [],
  reminder: false
},
{
  id: 't10',
  title: 'Python OOP notes cleanup',
  subjectId: 's1',
  category: 'STUDY',
  description: 'Reorganize inheritance and polymorphism sections.',
  dueDate: isoOffset(-1),
  dueTime: '20:00',
  priority: 'NORMAL',
  status: 'COMPLETED',
  estimatedHours: 1,
  checklist: [],
  reminder: false
}];


export const seedAssignments: Assignment[] = [
{
  id: 'a1',
  number: 3,
  title: 'Python Functions',
  subjectId: 's1',
  description:
  'Answer all ten questions on user defined functions, arguments, recursion and lambda expressions.',
  instructions:
  'Handwritten submission. Include the question statement above each answer. Programs must show sample output.',
  dueDate: isoOffset(4),
  dueTime: '16:00',
  priority: 'URGENT',
  status: 'IN_PROGRESS',
  checklist: check(
    ['Read questions', 'Research', 'Write answer', 'Review', 'Submit'],
    3
  ),
  notes: 'Q7 recursion needs a dry run table.',
  attachments: ['assignment-03-questions.pdf'],
  links: ['https://docs.python.org/3/tutorial/controlflow.html'],
  submitted: false
},
{
  id: 'a2',
  number: 4,
  title: 'Normalization Case Study',
  subjectId: 's2',
  description: 'Normalize the given hospital schema up to BCMF with justification.',
  instructions: 'Typed submission, max 6 pages, include dependency diagrams.',
  dueDate: isoOffset(6),
  dueTime: '23:59',
  priority: 'IMPORTANT',
  status: 'NOT_STARTED',
  checklist: check(['Read questions', 'Research', 'Write answer', 'Review', 'Submit'], 0),
  notes: '',
  attachments: [],
  links: [],
  submitted: false
},
{
  id: 'a3',
  number: 2,
  title: 'Subnetting Worksheet',
  subjectId: 's3',
  description: 'Twenty subnetting problems covering VLSM and CIDR.',
  instructions: 'Show all binary working.',
  dueDate: isoOffset(-3),
  dueTime: '17:00',
  priority: 'URGENT',
  status: 'IN_PROGRESS',
  checklist: check(['Read questions', 'Research', 'Write answer', 'Review', 'Submit'], 2),
  notes: 'Ask about problem 14 during the tutorial.',
  attachments: [],
  links: [],
  submitted: false
},
{
  id: 'a4',
  number: 1,
  title: 'Collections Framework Report',
  subjectId: 's4',
  description: 'Compare List, Set and Map implementations with complexity analysis.',
  instructions: 'Typed report with a comparison table.',
  dueDate: isoOffset(-6),
  dueTime: '16:00',
  priority: 'NORMAL',
  status: 'COMPLETED',
  checklist: check(['Read questions', 'Research', 'Write answer', 'Review', 'Submit'], 5),
  notes: 'Graded 18/20.',
  attachments: ['collections-report.pdf'],
  links: [],
  submitted: true
},
{
  id: 'a5',
  number: 2,
  title: 'Process Scheduling Problems',
  subjectId: 's5',
  description: 'Gantt charts and average waiting time for five scheduling algorithms.',
  instructions: 'Handwritten, submit in the tutorial slot.',
  dueDate: isoOffset(2),
  dueTime: '10:00',
  priority: 'IMPORTANT',
  status: 'IN_PROGRESS',
  checklist: check(['Read questions', 'Research', 'Write answer', 'Review', 'Submit'], 3),
  notes: '',
  attachments: [],
  links: [],
  submitted: false
},
{
  id: 'a6',
  number: 1,
  title: 'Formal Report Writing',
  subjectId: 's6',
  description: 'Write a formal report on campus energy usage.',
  instructions: '1200 words, include an executive summary.',
  dueDate: isoOffset(9),
  dueTime: '23:59',
  priority: 'NORMAL',
  status: 'NOT_STARTED',
  checklist: check(['Read questions', 'Research', 'Write answer', 'Review', 'Submit'], 0),
  notes: '',
  attachments: [],
  links: [],
  submitted: false
}];


export const seedLabs: LabWork[] = [
{
  id: 'l1',
  number: 4,
  title: 'File Handling',
  subjectId: 's1',
  objective:
  'Write a Python program to read, append and analyse a text file, reporting word and line counts.',
  theory:
  'Python exposes files through the built in open() function returning a file object. Modes r, w, a and r+ control access. Context managers close the handle automatically.',
  requirements: ['Python 3.11', 'VS Code', 'sample.txt input file'],
  procedure: [
  'Create sample.txt with five lines of text.',
  'Open the file in read mode inside a with block.',
  'Count lines, words and characters.',
  'Append a summary line to the same file.',
  'Print the final report to the console.'],

  code: `def analyse(path: str) -> dict:\n    with open(path, "r", encoding="utf-8") as f:\n        lines = f.readlines()\n    words = sum(len(line.split()) for line in lines)\n    chars = sum(len(line) for line in lines)\n    return {"lines": len(lines), "words": words, "chars": chars}\n\n\nif __name__ == "__main__":\n    report = analyse("sample.txt")\n    with open("sample.txt", "a", encoding="utf-8") as f:\n        f.write(f"\\n# summary {report}\\n")\n    print(report)`,
  output: `{'lines': 5, 'words': 42, 'chars': 231}`,
  viva: [
  {
    id: 'v1',
    question: 'What is the difference between write and append mode?',
    answer: 'Write truncates the existing file, append adds to the end without clearing it.'
  },
  {
    id: 'v2',
    question: 'Why use a with block for files?',
    answer: 'It closes the file automatically even if an exception is raised.'
  },
  {
    id: 'v3',
    question: 'What does readlines() return?',
    answer: 'A list of strings, each keeping its trailing newline character.'
  }],

  notes: 'Remember to mention buffering during the viva.',
  submissionDate: isoOffset(3),
  status: 'IN_PROGRESS',
  checklist: check(
    [
    'Understand experiment',
    'Write code',
    'Run program',
    'Capture output',
    'Prepare viva',
    'Submit'],

    4
  ),
  attachments: ['output-screenshot.png']
},
{
  id: 'l2',
  number: 4,
  title: 'Joins and Subqueries',
  subjectId: 's2',
  objective: 'Execute inner, outer and self joins on the hospital schema.',
  theory:
  'A join combines rows from two relations based on a predicate. Outer joins preserve unmatched rows padded with NULLs.',
  requirements: ['MySQL 8', 'hospital.sql dump'],
  procedure: [
  'Import the hospital schema.',
  'Write six join queries from the manual.',
  'Capture the result sets.'],

  code: `SELECT p.name, d.name AS doctor\nFROM patient p\nLEFT JOIN doctor d ON d.id = p.doctor_id\nORDER BY p.name;`,
  output: '6 rows returned in 0.004s',
  viva: [
  {
    id: 'v1',
    question: 'When is a self join useful?',
    answer: 'When rows of a table relate to other rows of the same table, e.g. employee and manager.'
  }],

  notes: '',
  submissionDate: isoOffset(1),
  status: 'IN_PROGRESS',
  checklist: check(
    [
    'Understand experiment',
    'Write code',
    'Run program',
    'Capture output',
    'Prepare viva',
    'Submit'],

    3
  ),
  attachments: []
},
{
  id: 'l3',
  number: 3,
  title: 'Exception Handling',
  subjectId: 's4',
  objective: 'Demonstrate checked and unchecked exceptions with custom exception classes.',
  theory: 'Java separates checked exceptions, verified at compile time, from runtime exceptions.',
  requirements: ['JDK 21', 'IntelliJ IDEA'],
  procedure: ['Write a custom exception.', 'Trigger and catch it.', 'Log the stack trace.'],
  code: `class LowBalanceException extends Exception {\n    LowBalanceException(String message) { super(message); }\n}`,
  output: 'LowBalanceException: balance below minimum',
  viva: [
  {
    id: 'v1',
    question: 'Difference between throw and throws?',
    answer: 'throw raises an exception instance, throws declares that a method may raise one.'
  }],

  notes: '',
  submissionDate: isoOffset(2),
  status: 'NOT_STARTED',
  checklist: check(
    [
    'Understand experiment',
    'Write code',
    'Run program',
    'Capture output',
    'Prepare viva',
    'Submit'],

    1
  ),
  attachments: []
},
{
  id: 'l4',
  number: 2,
  title: 'Shell Scripting Basics',
  subjectId: 's5',
  objective: 'Write shell scripts using loops, conditions and command substitution.',
  theory: 'The shell interprets commands and provides control flow constructs of its own.',
  requirements: ['Ubuntu 24.04', 'bash 5'],
  procedure: ['Write the script.', 'Make it executable.', 'Run and capture output.'],
  code: `#!/usr/bin/env bash\nfor f in *.txt; do\n  echo "$f -> $(wc -l < "$f") lines"\ndone`,
  output: 'notes.txt -> 12 lines',
  viva: [
  {
    id: 'v1',
    question: 'What does the shebang line do?',
    answer: 'It tells the kernel which interpreter should execute the script.'
  }],

  notes: '',
  submissionDate: isoOffset(-4),
  status: 'COMPLETED',
  checklist: check(
    [
    'Understand experiment',
    'Write code',
    'Run program',
    'Capture output',
    'Prepare viva',
    'Submit'],

    6
  ),
  attachments: ['lab2-record.pdf']
},
{
  id: 'l5',
  number: 3,
  title: 'Dictionaries and Sets',
  subjectId: 's1',
  objective: 'Implement a word frequency counter using dictionaries and sets.',
  theory: 'Dictionaries are hash maps with average O(1) lookup, sets store unique hashable items.',
  requirements: ['Python 3.11'],
  procedure: ['Tokenize input.', 'Count with a dictionary.', 'Report the top ten words.'],
  code: `from collections import Counter\nprint(Counter(open("sample.txt").read().split()).most_common(10))`,
  output: "[('the', 9), ('a', 6)]",
  viva: [
  {
    id: 'v1',
    question: 'Why must dictionary keys be hashable?',
    answer: 'The hash determines the bucket, so keys must have a stable hash value.'
  }],

  notes: '',
  submissionDate: isoOffset(-8),
  status: 'COMPLETED',
  checklist: check(
    [
    'Understand experiment',
    'Write code',
    'Run program',
    'Capture output',
    'Prepare viva',
    'Submit'],

    6
  ),
  attachments: []
}];


export const seedProjects: Project[] = [
{
  id: 'p1',
  name: 'Smart Campus System',
  type: 'MAJOR',
  subjectId: 's4',
  description:
  'A campus wide platform for attendance, room booking and notice distribution with role based access.',
  startDate: isoOffset(-30),
  deadline: isoOffset(22),
  priority: 'URGENT',
  ownerId: 'seed-user',
  members: [],
  pendingInvites: [],
  technologies: ['React', 'Spring Boot', 'PostgreSQL', 'Docker'],
  repoLink: 'https://github.com/rana/smart-campus',
  docsLink: 'https://docs.google.com/document/d/smart-campus',
  notes: 'Guide review scheduled for the 20th. Bring the ER diagram printout.',
  stage: 'DEVELOPMENT',
  status: 'IN_PROGRESS',
  milestones: [
  { id: 'm1', title: 'UI Design', status: 'COMPLETED', progress: 100 },
  { id: 'm2', title: 'Backend & API', status: 'IN_PROGRESS', progress: 60 },
  { id: 'm3', title: 'Testing', status: 'NOT_STARTED', progress: 0 },
  { id: 'm4', title: 'Documentation', status: 'NOT_STARTED', progress: 0 },
  { id: 'm5', title: 'Final Presentation', status: 'NOT_STARTED', progress: 0 }]

},
{
  id: 'p2',
  name: 'Student Calculator',
  type: 'MINI',
  subjectId: 's1',
  description: 'A GPA and scientific calculator desktop app with calculation history.',
  startDate: isoOffset(-14),
  deadline: isoOffset(14),
  priority: 'IMPORTANT',
  ownerId: 'seed-user',
  members: [],
  pendingInvites: [],
  technologies: ['Python', 'Tkinter'],
  repoLink: 'https://github.com/rana/student-calculator',
  docsLink: '',
  notes: '',
  stage: 'DEVELOPMENT',
  status: 'IN_PROGRESS',
  milestones: [
  { id: 'm1', title: 'Core arithmetic', status: 'COMPLETED', progress: 100 },
  { id: 'm2', title: 'GPA module', status: 'IN_PROGRESS', progress: 65 },
  { id: 'm3', title: 'History panel', status: 'NOT_STARTED', progress: 0 }]

},
{
  id: 'p3',
  name: 'Query Visualiser',
  type: 'MINI',
  subjectId: 's2',
  description: 'Visualise SQL execution plans as an interactive tree.',
  startDate: isoOffset(-9),
  deadline: isoOffset(18),
  priority: 'NORMAL',
  ownerId: 'seed-user',
  members: [],
  pendingInvites: [],
  technologies: ['TypeScript', 'D3'],
  repoLink: '',
  docsLink: '',
  notes: '',
  stage: 'PLANNING',
  status: 'IN_PROGRESS',
  milestones: [
  { id: 'm1', title: 'Parser research', status: 'COMPLETED', progress: 100 },
  { id: 'm2', title: 'Tree renderer', status: 'NOT_STARTED', progress: 0 }]

}];


export const seedNotes: Note[] = [
{
  id: 'n1',
  title: 'Python OOP Concepts',
  subjectId: 's1',
  type: 'REVISION',
  tags: ['OOP', 'INTERVIEW', 'EXAM'],
  content:
  '# Python OOP\n\n## Four pillars\n- **Encapsulation** — bundle data with the methods that use it\n- **Inheritance** — derive a class from a base class\n- **Polymorphism** — same interface, different behaviour\n- **Abstraction** — hide implementation behind an interface\n\n## MRO\nPython resolves attributes using the C3 linearisation. Check with `Class.__mro__`.\n\n```python\nclass Base:\n    def speak(self): return "base"\n\nclass Child(Base):\n    def speak(self): return "child"\n```\n\n> Dunder methods let your classes cooperate with built in operators.',
  updatedAt: isoOffset(-1)
},
{
  id: 'n2',
  title: 'Normalization Cheat Sheet',
  subjectId: 's2',
  type: 'EXAM',
  tags: ['DBMS', 'EXAM'],
  content:
  '# Normal Forms\n\n1. **1NF** — atomic values only\n2. **2NF** — 1NF plus no partial dependency\n3. **3NF** — 2NF plus no transitive dependency\n4. **BCNF** — every determinant is a candidate key\n\nRemember: decomposition must be lossless and dependency preserving.',
  updatedAt: isoOffset(-3)
},
{
  id: 'n3',
  title: 'TCP vs UDP — lecture 08',
  subjectId: 's3',
  type: 'LECTURE',
  tags: ['NETWORKS'],
  content:
  '# Transport layer\n\n- TCP: connection oriented, ordered, retransmits, flow and congestion control\n- UDP: connectionless, no ordering, tiny 8 byte header, used for DNS, VoIP, games\n\nHandshake: SYN, SYN-ACK, ACK.',
  updatedAt: isoOffset(-5)
},
{
  id: 'n4',
  title: 'Project idea backlog',
  subjectId: null,
  type: 'IDEAS',
  tags: ['PROJECT', 'IDEAS'],
  content:
  '# Ideas\n\n- Attendance prediction from timetable data\n- Lab record generator from code + output\n- Campus lost and found board',
  updatedAt: isoOffset(-2)
},
{
  id: 'n5',
  title: 'Deadlock conditions',
  subjectId: 's5',
  type: 'IMPORTANT',
  tags: ['OS', 'EXAM'],
  content:
  '# Coffman conditions\n\n1. Mutual exclusion\n2. Hold and wait\n3. No preemption\n4. Circular wait\n\nBreak any one to prevent deadlock. Bankers algorithm avoids unsafe states.',
  updatedAt: isoOffset(-7)
}];


export const seedTimetable: ClassSlot[] = [
{ id: 'c1', subjectId: 's1', teacher: 'Prof. A. Sharma', room: 'Room 204', day: 'MON', start: '09:00', end: '10:00', kind: 'THEORY' },
{ id: 'c2', subjectId: 's2', teacher: 'Dr. M. Iyer', room: 'Room 118', day: 'MON', start: '10:00', end: '11:00', kind: 'THEORY' },
{ id: 'c3', subjectId: 's2', teacher: 'Dr. M. Iyer', room: 'Lab 03', day: 'MON', start: '11:00', end: '13:00', kind: 'LAB' },
{ id: 'c4', subjectId: 's3', teacher: 'Prof. R. Nair', room: 'Room 301', day: 'MON', start: '14:00', end: '15:00', kind: 'THEORY' },
{ id: 'c5', subjectId: 's4', teacher: 'Ms. K. Rao', room: 'Room 210', day: 'TUE', start: '09:00', end: '10:00', kind: 'THEORY' },
{ id: 'c6', subjectId: 's5', teacher: 'Dr. S. Bose', room: 'Room 115', day: 'TUE', start: '10:00', end: '11:00', kind: 'THEORY' },
{ id: 'c7', subjectId: 's1', teacher: 'Prof. A. Sharma', room: 'Lab 01', day: 'TUE', start: '14:00', end: '16:00', kind: 'LAB' },
{ id: 'c8', subjectId: 's6', teacher: 'Mrs. L. Fernandes', room: 'Room 402', day: 'WED', start: '09:00', end: '10:00', kind: 'THEORY' },
{ id: 'c9', subjectId: 's3', teacher: 'Prof. R. Nair', room: 'Room 301', day: 'WED', start: '11:00', end: '12:00', kind: 'THEORY' },
{ id: 'c10', subjectId: 's4', teacher: 'Ms. K. Rao', room: 'Lab 02', day: 'WED', start: '14:00', end: '16:00', kind: 'LAB' },
{ id: 'c11', subjectId: 's2', teacher: 'Dr. M. Iyer', room: 'Room 118', day: 'THU', start: '10:00', end: '11:00', kind: 'THEORY' },
{ id: 'c12', subjectId: 's5', teacher: 'Dr. S. Bose', room: 'Lab 04', day: 'THU', start: '11:00', end: '13:00', kind: 'LAB' },
{ id: 'c13', subjectId: 's1', teacher: 'Prof. A. Sharma', room: 'Room 204', day: 'FRI', start: '09:00', end: '10:00', kind: 'THEORY' },
{ id: 'c14', subjectId: 's2', teacher: 'Dr. M. Iyer', room: 'Lab 03', day: 'FRI', start: '11:00', end: '13:00', kind: 'LAB' },
{ id: 'c15', subjectId: 's3', teacher: 'Prof. R. Nair', room: 'Room 301', day: 'FRI', start: '14:00', end: '15:00', kind: 'THEORY' },
{ id: 'c16', subjectId: 's6', teacher: 'Mrs. L. Fernandes', room: 'Room 402', day: 'SAT', start: '10:00', end: '11:00', kind: 'THEORY' }];


export const seedNotifications: AppNotification[] = [
{
  id: 'nt1',
  kind: 'urgent',
  message: 'Python Assignment 03 is due today at 4:00 PM.',
  meta: 'PYTHON PROGRAMMING • ASSIGNMENT',
  createdAt: isoOffset(0),
  read: false
},
{
  id: 'nt2',
  kind: 'warn',
  message: 'Smart Campus System milestone “Backend & API” is due this week.',
  meta: 'MAJOR PROJECT • MILESTONE',
  createdAt: isoOffset(0),
  read: false
},
{
  id: 'nt3',
  kind: 'info',
  message: 'DBMS Lab 04 — Joins and Subqueries has been added to your workspace.',
  meta: 'DATABASE MANAGEMENT • LAB',
  createdAt: isoOffset(0),
  read: true
},
{
  id: 'nt4',
  kind: 'urgent',
  message: 'Networks Subnetting Worksheet is overdue by 3 days.',
  meta: 'COMPUTER NETWORKS • ASSIGNMENT',
  createdAt: isoOffset(-1),
  read: false
},
{
  id: 'nt5',
  kind: 'success',
  message: 'Java Assignment 01 marked as completed.',
  meta: 'JAVA DEVELOPMENT • ASSIGNMENT',
  createdAt: isoOffset(-2),
  read: true
},
{
  id: 'nt6',
  kind: 'success',
  message: 'OS Lab 02 submitted and signed.',
  meta: 'OPERATING SYSTEMS • LAB',
  createdAt: isoOffset(-4),
  read: true
}];


export const detectedFromPdf = [
{ name: 'Python Programming', code: 'CS301', credits: 4, units: 6, theory: true, lab: true },
{ name: 'Database Management', code: 'CS302', credits: 4, units: 5, theory: true, lab: true },
{ name: 'Computer Networks', code: 'CS303', credits: 3, units: 5, theory: true, lab: false },
{ name: 'Java Development', code: 'CS304', credits: 4, units: 6, theory: true, lab: true },
{ name: 'Operating Systems', code: 'CS305', credits: 3, units: 5, theory: true, lab: true },
{ name: 'Technical Communication', code: 'HS301', credits: 2, units: 4, theory: true, lab: false },
{ name: 'Discrete Mathematics', code: 'MA301', credits: 3, units: 5, theory: true, lab: false },
{ name: 'Software Engineering', code: 'CS306', credits: 3, units: 6, theory: true, lab: false },
{ name: 'Environmental Studies', code: 'HS302', credits: 2, units: 4, theory: true, lab: false },
{ name: 'Data Structures Lab', code: 'CS307', credits: 2, units: 4, theory: false, lab: true },
{ name: 'Minor Project Work', code: 'CS308', credits: 2, units: 3, theory: false, lab: true },
{ name: 'Open Elective — UI Design', code: 'OE301', credits: 3, units: 5, theory: true, lab: false }];