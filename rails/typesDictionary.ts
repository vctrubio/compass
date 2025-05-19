import { TableField, TableEntity } from "@/rails/types";

export const dbTableDictionary: Record<string, Pick<TableEntity, 'name' | 'fields' | 'relationship' | 'desc' | 'filterBy' | 'sortBy'>> = {
  students: {
    name: "students",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'name', type: 'string', required: true, isPrimaryKey: false },
      { name: 'email', type: 'string', required: false, isPrimaryKey: false },
      { name: 'phone', type: 'string', required: false, isPrimaryKey: false },
      { name: 'languages', type: 'array', required: true, isPrimaryKey: false },
      { name: 'age', type: 'number', required: true, isPrimaryKey: false },
      { name: 'authId', type: 'string', required: false, isPrimaryKey: false }
    ],
    relationship: ["bookings", "studentAvailabilityWindows"],
    desc: "Students table - contains student profiles and their information",
    filterBy: [
      { field: 'languages', label: 'Language', multiSelect: true, options: [
        { value: 'english', label: 'English' },
        { value: 'spanish', label: 'Spanish' },
        { value: 'french', label: 'French' }
      ]},
      { field: 'age', label: 'Age Group', options: [
        { value: '18-25', label: '18-25' },
        { value: '26-35', label: '26-35' },
        { value: '36+', label: '36+' }
      ]}
    ],
    sortBy: [
      { field: 'name', label: 'Name (A-Z)', direction: 'asc' },
      { field: 'name', label: 'Name (Z-A)', direction: 'desc' },
      { field: 'age', label: 'Age (Low to High)', direction: 'asc' },
      { field: 'age', label: 'Age (High to Low)', direction: 'desc' }
    ]
  },
  
  teachers: {
    name: "teachers",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'name', type: 'string', required: true, isPrimaryKey: false },
      { name: 'email', type: 'string', required: false, isPrimaryKey: false },
      { name: 'phone', type: 'string', required: false, isPrimaryKey: false },
      { name: 'languages', type: 'array', required: true, isPrimaryKey: false },
      { name: 'authId', type: 'string', required: false, isPrimaryKey: false }
    ],
    relationship: ["lessons"],
    desc: "Teachers table - contains teacher profiles and their information"
  },
  
  equipment: {
    name: "equipment",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'type', type: 'string', required: true, isPrimaryKey: false },
      { name: 'model', type: 'string', required: true, isPrimaryKey: false },
      { name: 'size', type: 'number', required: true, isPrimaryKey: false }
    ],
    relationship: [],
    desc: "Equipment table - contains all kite equipment (kites, bars, boards)"
  },
  
  packages: {
    name: "packages",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'price', type: 'number', required: true, isPrimaryKey: false },
      { name: 'hours', type: 'number', required: true, isPrimaryKey: false },
      { name: 'capacity', type: 'number', required: true, isPrimaryKey: false },
      { name: 'description', type: 'string', required: false, isPrimaryKey: false },
      { name: 'createdAt', type: 'date', required: false, isPrimaryKey: false }
    ],
    relationship: ["bookings"],
    desc: "Packages table - contains lesson package offerings and pricing"
  },
  
  bookings: {
    name: "bookings",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'packageId', type: 'number', required: true, isPrimaryKey: false },
      { name: 'studentId', type: 'number', required: true, isPrimaryKey: false },
      { name: 'startDate', type: 'date', required: true, isPrimaryKey: false },
      { name: 'createdAt', type: 'date', required: false, isPrimaryKey: false }
    ],
    relationship: ["lessons", "packages", "students"],
    desc: "Bookings table - contains student bookings for lesson packages"
  },
  
  sessions: {
    name: "sessions",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'equipmentIds', type: 'array', required: true, isPrimaryKey: false },
      { name: 'startTime', type: 'date', required: true, isPrimaryKey: false },
      { name: 'duration', type: 'number', required: true, isPrimaryKey: false }
    ],
    relationship: ["lessonSessions"],
    desc: "Sessions table - contains individual learning sessions with equipment"
  },
  
  payments: {
    name: "payments",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'cash', type: 'boolean', required: true, isPrimaryKey: false },
      { name: 'createdDate', type: 'date', required: true, isPrimaryKey: false },
      { name: 'amount', type: 'number', required: true, isPrimaryKey: false }
    ],
    relationship: ["lessons"],
    desc: "Payments table - contains payment records for lessons"
  },
  
  postLessons: {
    name: "post_lessons",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'studentConfirmation', type: 'boolean', required: true, isPrimaryKey: false }
    ],
    relationship: ["lessons"],
    desc: "Post-lessons table - contains post-lesson feedback and confirmations"
  },
  
  availabilityWindows: {
    name: "availability_windows",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'startDate', type: 'date', required: true, isPrimaryKey: false },
      { name: 'endDate', type: 'date', required: true, isPrimaryKey: false },
      { name: 'createdAt', type: 'date', required: false, isPrimaryKey: false }
    ],
    relationship: ["studentAvailabilityWindows"],
    desc: "Availability windows table - contains time periods for scheduling"
  },
  
  studentAvailabilityWindows: {
    name: "student_availability_windows",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'studentId', type: 'number', required: true, isPrimaryKey: false },
      { name: 'availabilityWindowId', type: 'number', required: true, isPrimaryKey: false }
    ],
    relationship: ["students", "availabilityWindows"],
    desc: "Student availability windows table - links students to their availability"
  },
  
  lessons: {
    name: "lessons",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'teacherId', type: 'number', required: true, isPrimaryKey: false },
      { name: 'bookingId', type: 'number', required: true, isPrimaryKey: false },
      { name: 'paymentId', type: 'number', required: false, isPrimaryKey: false },
      { name: 'postLessonId', type: 'number', required: false, isPrimaryKey: false },
      { name: 'status', type: 'string', required: true, isPrimaryKey: false },
      { name: 'createdAt', type: 'date', required: false, isPrimaryKey: false }
    ],
    relationship: ["teachers", "bookings", "payments", "postLessons", "lessonSessions"],
    desc: "Lessons table - contains lesson records connecting teachers, bookings and sessions"
  },
  
  lessonSessions: {
    name: "lesson_sessions",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'lessonId', type: 'number', required: true, isPrimaryKey: false },
      { name: 'sessionId', type: 'number', required: true, isPrimaryKey: false }
    ],
    relationship: ["lessons", "sessions"],
    desc: "Lesson sessions table - links lessons to their individual sessions"
  },
  
  admins: {
    name: "admins",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'userId', type: 'string', required: true, isPrimaryKey: false },
      { name: 'role', type: 'string', required: true, isPrimaryKey: false }
    ],
    relationship: [],
    desc: "Admins table - contains administrator user information"
  }
};
