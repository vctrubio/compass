import { TableField, TableEntity } from "@/rails/types";

//its under_case in the schema ...
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
      { name: 'auth_id', type: 'string', required: false, isPrimaryKey: false }
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
    desc: "Teachers table - contains teacher profiles and their information",
    filterBy: [
      { field: 'languages', label: 'Language', multiSelect: true, options: [
        { value: 'english', label: 'English' },
        { value: 'spanish', label: 'Spanish' },
        { value: 'french', label: 'French' }
      ]}
    ],
    sortBy: [
      { field: 'name', label: 'Name (A-Z)', direction: 'asc' },
      { field: 'name', label: 'Name (Z-A)', direction: 'desc' }
    ]
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
    desc: "Equipment table - contains all kite equipment (kites, bars, boards)",
    filterBy: [
      { field: 'type', label: 'Type', options: [
        { value: 'kite', label: 'Kite' },
        { value: 'board', label: 'Board' },
        { value: 'bar', label: 'Control Bar' }
      ]}
    ],
    sortBy: [
      { field: 'type', label: 'Type (A-Z)', direction: 'asc' },
      { field: 'model', label: 'Model (A-Z)', direction: 'asc' },
      { field: 'size', label: 'Size (Small to Large)', direction: 'asc' },
      { field: 'size', label: 'Size (Large to Small)', direction: 'desc' }
    ]
  },
  
  packages: {
    name: "packages",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'price', type: 'number', required: true, isPrimaryKey: false },
      { name: 'hours', type: 'number', required: true, isPrimaryKey: false },
      { name: 'capacity', type: 'number', required: true, isPrimaryKey: false },
      { name: 'description', type: 'string', required: false, isPrimaryKey: false },
      { name: 'created_at', type: 'date', required: false, isPrimaryKey: false }
    ],
    relationship: ["bookings"],
    desc: "Packages table - contains lesson package offerings and pricing",
    filterBy: [
      { field: 'hours', label: 'Duration', options: [
        { value: 1, label: '1 Hour' },
        { value: 2, label: '2 Hours' },
        { value: 3, label: '3+ Hours' }
      ]},
      { field: 'capacity', label: 'Group Size', options: [
        { value: 1, label: 'Individual' },
        { value: 2, label: 'Pair' },
        { value: 3, label: 'Small Group (3-5)' },
        { value: 6, label: 'Large Group (6+)' }
      ]}
    ],
    sortBy: [
      { field: 'price', label: 'Price (Low to High)', direction: 'asc' },
      { field: 'price', label: 'Price (High to Low)', direction: 'desc' },
      { field: 'hours', label: 'Duration (Short to Long)', direction: 'asc' },
      { field: 'hours', label: 'Duration (Long to Short)', direction: 'desc' }
    ]
  },
  
  bookings: {
    name: "bookings",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'package_id', type: 'number', required: true, isPrimaryKey: false },
      { name: 'student_id', type: 'number', required: true, isPrimaryKey: false },
      { name: 'start_date', type: 'date', required: true, isPrimaryKey: false },
      { name: 'created_at', type: 'date', required: false, isPrimaryKey: false }
    ],
    relationship: ["lessons", "packages", "students"],
    desc: "Bookings table - contains student bookings for lesson packages",
    filterBy: [
      { field: 'startDate', label: 'Time Period', options: [
        { value: 'today', label: 'Today' },
        { value: 'this-week', label: 'This Week' },
        { value: 'this-month', label: 'This Month' },
        { value: 'past', label: 'Past Bookings' }
      ]}
    ],
    sortBy: [
      { field: 'startDate', label: 'Date (Newest First)', direction: 'desc' },
      { field: 'startDate', label: 'Date (Oldest First)', direction: 'asc' },
      { field: 'createdAt', label: 'Booking Date (Newest First)', direction: 'desc' },
      { field: 'createdAt', label: 'Booking Date (Oldest First)', direction: 'asc' }
    ]
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
    desc: "Sessions table - contains individual learning sessions with equipment",
    filterBy: [
      { field: 'duration', label: 'Duration', options: [
        { value: 60, label: '1 Hour' },
        { value: 120, label: '2 Hours' },
        { value: 180, label: '3+ Hours' }
      ]},
      { field: 'startTime', label: 'Time', options: [
        { value: 'morning', label: 'Morning (Before 12pm)' },
        { value: 'afternoon', label: 'Afternoon (12-4pm)' },
        { value: 'evening', label: 'Evening (After 4pm)' }
      ]}
    ],
    sortBy: [
      { field: 'startTime', label: 'Start Time (Newest First)', direction: 'desc' },
      { field: 'startTime', label: 'Start Time (Oldest First)', direction: 'asc' },
      { field: 'duration', label: 'Duration (Short to Long)', direction: 'asc' },
      { field: 'duration', label: 'Duration (Long to Short)', direction: 'desc' }
    ]
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
    desc: "Payments table - contains payment records for lessons",
    filterBy: [
      { field: 'cash', label: 'Payment Type', options: [
        { value: 'true', label: 'Cash' },
        { value: 'false', label: 'Card/Digital' }
      ]}
    ],
    sortBy: [
      { field: 'createdDate', label: 'Date (Newest First)', direction: 'desc' },
      { field: 'createdDate', label: 'Date (Oldest First)', direction: 'asc' },
      { field: 'amount', label: 'Amount (High to Low)', direction: 'desc' },
      { field: 'amount', label: 'Amount (Low to High)', direction: 'asc' }
    ]
  },
  
  postLessons: {
    name: "post_lessons",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'studentConfirmation', type: 'boolean', required: true, isPrimaryKey: false }
    ],
    relationship: ["lessons"],
    desc: "Post-lessons table - contains post-lesson feedback and confirmations",
    filterBy: [
      { field: 'studentConfirmation', label: 'Confirmation', options: [
        { value: 'true', label: 'Confirmed' },
        { value: 'false', label: 'Not Confirmed' }
      ]}
    ],
    sortBy: []
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
    desc: "Availability windows table - contains time periods for scheduling",
    filterBy: [
      { field: 'startDate', label: 'Period', options: [
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'past', label: 'Past' }
      ]}
    ],
    sortBy: [
      { field: 'startDate', label: 'Start Date (Newest First)', direction: 'desc' },
      { field: 'startDate', label: 'Start Date (Oldest First)', direction: 'asc' }
    ]
  },
  
  studentAvailabilityWindows: {
    name: "student_availability_windows",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'studentId', type: 'number', required: true, isPrimaryKey: false },
      { name: 'availabilityWindowId', type: 'number', required: true, isPrimaryKey: false }
    ],
    relationship: ["students", "availabilityWindows"],
    desc: "Student availability windows table - links students to their availability",
    filterBy: [],
    sortBy: []
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
    desc: "Lessons table - contains lesson records connecting teachers, bookings and sessions",
    filterBy: [
      { field: 'status', label: 'Status', options: [
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]}
    ],
    sortBy: [
      { field: 'createdAt', label: 'Created Date (Newest First)', direction: 'desc' },
      { field: 'createdAt', label: 'Created Date (Oldest First)', direction: 'asc' },
      { field: 'status', label: 'Status (A-Z)', direction: 'asc' }
    ]
  },
  
  lessonSessions: {
    name: "lesson_sessions",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'lessonId', type: 'number', required: true, isPrimaryKey: false },
      { name: 'sessionId', type: 'number', required: true, isPrimaryKey: false }
    ],
    relationship: ["lessons", "sessions"],
    desc: "Lesson sessions table - links lessons to their individual sessions",
    filterBy: [],
    sortBy: []
  },
  
  admins: {
    name: "admins",
    fields: [
      { name: 'id', type: 'number', required: true, isPrimaryKey: true },
      { name: 'userId', type: 'string', required: true, isPrimaryKey: false },
      { name: 'role', type: 'string', required: true, isPrimaryKey: false }
    ],
    relationship: [],
    desc: "Admins table - contains administrator user information",
    filterBy: [
      { field: 'role', label: 'Role', options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'manager', label: 'Manager' },
        { value: 'viewer', label: 'Viewer' }
      ]}
    ],
    sortBy: [
      { field: 'role', label: 'Role (A-Z)', direction: 'asc' }
    ]
  }
};
