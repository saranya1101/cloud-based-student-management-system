import { Student, UserSession, AuditLog, K8sPod, ApiEndpoint } from '../types';

export const USER_SESSIONS: Record<string, UserSession> = {
  admin: {
    id: 'USR-ADM-01',
    name: 'Dr. Sarah Jenkins',
    email: 'admin.jenkins@cloudsms.edu',
    role: 'ROLE_ADMIN',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi5qZW5raW5zIiwicm9sZXMiOlsicm9sZV9hZG1pbiJdfQ.sigAdminKey4096',
    permissions: ['READ_ALL', 'CREATE_STUDENT', 'UPDATE_STUDENT', 'DELETE_STUDENT', 'MANAGE_USERS', 'DEPLOY_INFRA', 'AUDIT_ACCESS']
  },
  faculty: {
    id: 'USR-FAC-04',
    name: 'Prof. Marcus Vance',
    email: 'm.vance@cloudsms.edu',
    role: 'ROLE_FACULTY',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtLnZhbmNlIiwicm9sZXMiOlsicm9sZV9mYWN1bHR5Il19.sigFacultyKey2048',
    permissions: ['READ_STUDENTS', 'UPDATE_GRADES', 'RECORD_ATTENDANCE', 'VIEW_COURSES']
  },
  student: {
    id: 'USR-STU-10',
    name: 'Alex Rivera',
    email: 'alex.rivera@cloudsms.edu',
    role: 'ROLE_STUDENT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGV4LnJpdmVyYSIsInJvbGVzIjpbInJvbGVfc3R1ZGVudCJdfQ.sigStudentKey1024',
    permissions: ['READ_SELF_PROFILE', 'VIEW_MY_GRADES', 'ENROLL_COURSES']
  }
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'STU-2024-001',
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@cloudsms.edu',
    phone: '+1 (555) 234-5678',
    department: 'Computer Science',
    semester: 6,
    enrollmentYear: 2022,
    status: 'Active',
    gpa: 3.88,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    address: '452 Innovation Way, Seattle, WA',
    dateOfBirth: '2003-04-12',
    courses: [
      { courseCode: 'CS401', courseName: 'Distributed Cloud Systems', credits: 4, grade: 'A', score: 94, attendancePercent: 96 },
      { courseCode: 'CS302', courseName: 'Kubernetes & Microservices', credits: 3, grade: 'A', score: 92, attendancePercent: 94 },
      { courseCode: 'MATH320', courseName: 'Stochastic Calculus & Stats', credits: 3, grade: 'A-', score: 89, attendancePercent: 90 },
      { courseCode: 'CS350', courseName: 'Database Management Systems', credits: 4, grade: 'A', score: 96, attendancePercent: 98 }
    ],
    createdAt: '2022-08-20T10:00:00Z',
    updatedAt: '2024-09-12T14:30:00Z'
  },
  {
    id: 'STU-2024-002',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.rostova@cloudsms.edu',
    phone: '+1 (555) 456-7890',
    department: 'Data Science',
    semester: 4,
    enrollmentYear: 2023,
    status: 'Active',
    gpa: 3.95,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    address: '788 Silicon Blvd, San Jose, CA',
    dateOfBirth: '2004-01-28',
    courses: [
      { courseCode: 'DS201', courseName: 'Statistical Learning Theory', credits: 4, grade: 'A', score: 98, attendancePercent: 100 },
      { courseCode: 'DS205', courseName: 'Deep Neural Networks', credits: 4, grade: 'A', score: 96, attendancePercent: 95 },
      { courseCode: 'CS210', courseName: 'Advanced Data Structures', credits: 3, grade: 'A', score: 95, attendancePercent: 96 }
    ],
    createdAt: '2023-08-25T09:15:00Z',
    updatedAt: '2024-09-10T11:20:00Z'
  },
  {
    id: 'STU-2024-003',
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@cloudsms.edu',
    phone: '+1 (555) 789-0123',
    department: 'Cyber Security',
    semester: 5,
    enrollmentYear: 2022,
    status: 'Active',
    gpa: 3.72,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    address: '102 Cyber Park, Boston, MA',
    dateOfBirth: '2003-09-17',
    courses: [
      { courseCode: 'SEC301', courseName: 'Cloud Security Architecture', credits: 4, grade: 'A-', score: 88, attendancePercent: 92 },
      { courseCode: 'SEC305', courseName: 'Penetration Testing & Auditing', credits: 3, grade: 'B+', score: 87, attendancePercent: 88 },
      { courseCode: 'NET204', courseName: 'Network Protocols & Firewalls', credits: 3, grade: 'A', score: 93, attendancePercent: 94 }
    ],
    createdAt: '2022-08-21T13:40:00Z',
    updatedAt: '2024-09-08T16:45:00Z'
  },
  {
    id: 'STU-2024-004',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@cloudsms.edu',
    phone: '+1 (555) 345-6789',
    department: 'Software Engineering',
    semester: 7,
    enrollmentYear: 2021,
    status: 'Active',
    gpa: 3.84,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    address: '320 Tech Row, Austin, TX',
    dateOfBirth: '2002-11-05',
    courses: [
      { courseCode: 'SE401', courseName: 'Enterprise Software Design', credits: 4, grade: 'A', score: 94, attendancePercent: 97 },
      { courseCode: 'SE405', courseName: 'DevOps & Continuous Delivery', credits: 3, grade: 'A', score: 95, attendancePercent: 98 },
      { courseCode: 'SE420', courseName: 'High Availability Distributed Systems', credits: 4, grade: 'A-', score: 89, attendancePercent: 91 }
    ],
    createdAt: '2021-08-18T08:00:00Z',
    updatedAt: '2024-09-05T10:10:00Z'
  },
  {
    id: 'STU-2024-005',
    firstName: 'Liam',
    lastName: 'O’Connor',
    email: 'liam.oconnor@cloudsms.edu',
    phone: '+1 (555) 890-1234',
    department: 'Electrical Engineering',
    semester: 3,
    enrollmentYear: 2023,
    status: 'On Leave',
    gpa: 3.45,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    address: '912 Meadow Lane, Denver, CO',
    dateOfBirth: '2004-06-30',
    courses: [
      { courseCode: 'EE201', courseName: 'Embedded Microcontroller Systems', credits: 4, grade: 'B+', score: 86, attendancePercent: 82 },
      { courseCode: 'EE204', courseName: 'Analog Circuit Analysis', credits: 3, grade: 'B', score: 82, attendancePercent: 80 }
    ],
    createdAt: '2023-08-28T14:20:00Z',
    updatedAt: '2024-08-15T09:00:00Z'
  },
  {
    id: 'STU-2024-006',
    firstName: 'Zainab',
    lastName: 'Al-Mansoor',
    email: 'zainab.mansoor@cloudsms.edu',
    phone: '+1 (555) 222-3344',
    department: 'Business Analytics',
    semester: 8,
    enrollmentYear: 2021,
    status: 'Graduated',
    gpa: 3.91,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    address: '50 Wall St, New York, NY',
    dateOfBirth: '2002-02-14',
    courses: [
      { courseCode: 'BA401', courseName: 'Predictive Business Analytics', credits: 4, grade: 'A', score: 97, attendancePercent: 99 },
      { courseCode: 'BA405', courseName: 'Big Data Pipeline Engineering', credits: 3, grade: 'A', score: 94, attendancePercent: 96 }
    ],
    createdAt: '2021-08-15T11:00:00Z',
    updatedAt: '2024-05-30T17:00:00Z'
  },
  {
    id: 'STU-2024-007',
    firstName: 'Mateo',
    lastName: 'Fernandez',
    email: 'mateo.fernandez@cloudsms.edu',
    phone: '+1 (555) 667-8899',
    department: 'Computer Science',
    semester: 2,
    enrollmentYear: 2024,
    status: 'Active',
    gpa: 3.65,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    address: '22 Ocean Ave, San Diego, CA',
    dateOfBirth: '2005-08-19',
    courses: [
      { courseCode: 'CS101', courseName: 'Object-Oriented Programming (Java)', credits: 4, grade: 'A-', score: 89, attendancePercent: 93 },
      { courseCode: 'CS102', courseName: 'Discrete Mathematics', credits: 3, grade: 'B+', score: 87, attendancePercent: 91 }
    ],
    createdAt: '2024-08-20T10:00:00Z',
    updatedAt: '2024-09-14T12:00:00Z'
  },
  {
    id: 'STU-2024-008',
    firstName: 'Hannah',
    lastName: 'Schmidt',
    email: 'hannah.schmidt@cloudsms.edu',
    phone: '+1 (555) 998-7766',
    department: 'Data Science',
    semester: 6,
    enrollmentYear: 2022,
    status: 'Active',
    gpa: 3.79,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    address: '414 Pine St, Chicago, IL',
    dateOfBirth: '2003-03-22',
    courses: [
      { courseCode: 'DS301', courseName: 'Natural Language Processing', credits: 4, grade: 'A', score: 92, attendancePercent: 95 },
      { courseCode: 'DS304', courseName: 'Time-Series Econometrics', credits: 3, grade: 'B+', score: 88, attendancePercent: 89 }
    ],
    createdAt: '2022-08-22T09:30:00Z',
    updatedAt: '2024-09-11T15:20:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-901',
    timestamp: '2026-09-17 08:31:02',
    action: 'LOGIN',
    user: 'admin.jenkins@cloudsms.edu',
    role: 'ROLE_ADMIN',
    details: 'JWT Authentication successful via Spring Security Filter',
    ipAddress: '192.168.1.104',
    statusCode: 200
  },
  {
    id: 'AUD-902',
    timestamp: '2026-09-17 08:25:40',
    action: 'DEPLOY',
    user: 'github-actions-bot',
    role: 'ROLE_ADMIN',
    details: 'Triggered Kubernetes RollingUpdate v2.4.1 to cluster prod-aws-ec2',
    ipAddress: '54.210.12.88',
    statusCode: 200
  },
  {
    id: 'AUD-903',
    timestamp: '2026-09-17 08:14:18',
    action: 'GRADE_ASSIGN',
    user: 'm.vance@cloudsms.edu',
    role: 'ROLE_FACULTY',
    details: 'Assigned Grade "A" (score 94) to Alex Rivera for course CS401',
    ipAddress: '192.168.1.155',
    statusCode: 200
  },
  {
    id: 'AUD-904',
    timestamp: '2026-09-17 07:55:12',
    action: 'UPDATE',
    user: 'admin.jenkins@cloudsms.edu',
    role: 'ROLE_ADMIN',
    details: 'Updated GPA metrics and semester enrollment status for STU-2024-002',
    ipAddress: '192.168.1.104',
    statusCode: 200
  },
  {
    id: 'AUD-905',
    timestamp: '2026-09-17 06:40:22',
    action: 'CREATE',
    user: 'admin.jenkins@cloudsms.edu',
    role: 'ROLE_ADMIN',
    details: 'Enrolled new student STU-2024-008 into Department of Data Science',
    ipAddress: '192.168.1.104',
    statusCode: 201
  }
];

export const INITIAL_K8S_PODS: K8sPod[] = [
  {
    id: 'pod-1',
    name: 'cloudsms-backend-78b9d6f5c8-v9q4z',
    namespace: 'production',
    status: 'Running',
    ready: '1/1',
    restarts: 0,
    node: 'ip-10-0-1-42.ec2.internal',
    cpuUsage: '42m (2.1%)',
    memoryUsage: '380Mi / 1024Mi',
    age: '4d 18h'
  },
  {
    id: 'pod-2',
    name: 'cloudsms-backend-78b9d6f5c8-kx7nm',
    namespace: 'production',
    status: 'Running',
    ready: '1/1',
    restarts: 0,
    node: 'ip-10-0-1-98.ec2.internal',
    cpuUsage: '38m (1.9%)',
    memoryUsage: '372Mi / 1024Mi',
    age: '4d 18h'
  },
  {
    id: 'pod-3',
    name: 'cloudsms-backend-78b9d6f5c8-w2p9x',
    namespace: 'production',
    status: 'Running',
    ready: '1/1',
    restarts: 1,
    node: 'ip-10-0-2-15.ec2.internal',
    cpuUsage: '46m (2.3%)',
    memoryUsage: '394Mi / 1024Mi',
    age: '2d 06h'
  },
  {
    id: 'pod-mysql-0',
    name: 'mysql-primary-0',
    namespace: 'production',
    status: 'Running',
    ready: '1/1',
    restarts: 0,
    node: 'ip-10-0-1-42.ec2.internal',
    cpuUsage: '64m (3.2%)',
    memoryUsage: '620Mi / 2048Mi',
    age: '14d 02h'
  },
  {
    id: 'pod-ingress',
    name: 'ingress-nginx-controller-5c69784f9-mbt2w',
    namespace: 'ingress-nginx',
    status: 'Running',
    ready: '1/1',
    restarts: 0,
    node: 'ip-10-0-1-98.ec2.internal',
    cpuUsage: '18m (0.9%)',
    memoryUsage: '145Mi / 512Mi',
    age: '14d 02h'
  }
];

export const REST_API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/students',
    summary: 'List all students (Paginated & Filtered)',
    description: 'Retrieves a page of student entities with optional filters (department, status, minGpa).',
    requiredRole: ['ROLE_ADMIN', 'ROLE_FACULTY'],
    responseSample: {
      content: [
        {
          id: 'STU-2024-001',
          firstName: 'Alex',
          lastName: 'Rivera',
          department: 'Computer Science',
          gpa: 3.88,
          status: 'Active'
        }
      ],
      page: 0,
      size: 10,
      totalElements: 8,
      totalPages: 1
    }
  },
  {
    method: 'GET',
    path: '/api/v1/students/{id}',
    summary: 'Get student details by ID',
    description: 'Fetches full student profile including course transcripts and GPA metrics.',
    requiredRole: ['ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT'],
    responseSample: {
      id: 'STU-2024-001',
      firstName: 'Alex',
      lastName: 'Rivera',
      email: 'alex.rivera@cloudsms.edu',
      department: 'Computer Science',
      gpa: 3.88,
      courses: [
        { courseCode: 'CS401', courseName: 'Distributed Cloud Systems', grade: 'A', score: 94 }
      ]
    }
  },
  {
    method: 'POST',
    path: '/api/v1/students',
    summary: 'Create new student record',
    description: 'Validates input payload with Bean Validation (@Valid) and persists into MySQL database.',
    requiredRole: ['ROLE_ADMIN'],
    requestBodySample: {
      firstName: 'Jordan',
      lastName: 'Taylor',
      email: 'jordan.taylor@cloudsms.edu',
      phone: '+1 (555) 432-1098',
      department: 'Computer Science',
      semester: 1,
      enrollmentYear: 2024,
      status: 'Active',
      gpa: 3.75,
      address: '100 Campus Drive'
    },
    responseSample: {
      id: 'STU-2024-009',
      status: 'Created',
      timestamp: '2026-09-17T08:33:00Z',
      message: 'Student record enrolled successfully in MySQL database'
    }
  },
  {
    method: 'PUT',
    path: '/api/v1/students/{id}',
    summary: 'Update student entity',
    description: 'Modifies profile details, department change, or enrollment status.',
    requiredRole: ['ROLE_ADMIN'],
    requestBodySample: {
      firstName: 'Alex',
      lastName: 'Rivera',
      phone: '+1 (555) 999-0000',
      status: 'Active',
      gpa: 3.90
    },
    responseSample: {
      id: 'STU-2024-001',
      updatedAt: '2026-09-17T08:33:00Z',
      status: 'Updated'
    }
  },
  {
    method: 'DELETE',
    path: '/api/v1/students/{id}',
    summary: 'Delete student record',
    description: 'Permanently removes record from MySQL database with cascade deletion on enrollments.',
    requiredRole: ['ROLE_ADMIN'],
    responseSample: {
      success: true,
      message: 'Student STU-2024-005 deleted successfully',
      deletedAt: '2026-09-17T08:33:00Z'
    }
  },
  {
    method: 'POST',
    path: '/api/v1/auth/login',
    summary: 'User Authentication & JWT Token Issuance',
    description: 'Authenticates username and password via Spring Security DaoAuthenticationProvider and returns signed JWT token.',
    requiredRole: ['ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT'],
    requestBodySample: {
      username: 'admin.jenkins@cloudsms.edu',
      password: '********'
    },
    responseSample: {
      tokenType: 'Bearer',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      expiresIn: 86400,
      role: 'ROLE_ADMIN'
    }
  }
];
