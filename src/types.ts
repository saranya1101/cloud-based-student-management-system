export type UserRole = 'ROLE_ADMIN' | 'ROLE_FACULTY' | 'ROLE_STUDENT';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  token: string;
  permissions: string[];
}

export type StudentStatus = 'Active' | 'On Leave' | 'Graduated' | 'Suspended';
export type Department = 
  | 'Computer Science' 
  | 'Data Science' 
  | 'Cyber Security' 
  | 'Electrical Engineering' 
  | 'Business Analytics'
  | 'Software Engineering';

export interface CourseGrade {
  courseCode: string;
  courseName: string;
  credits: number;
  grade: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'F';
  score: number;
  attendancePercent: number;
}

export interface Student {
  id: string; // e.g. STU-2024-001
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: Department;
  semester: number;
  enrollmentYear: number;
  status: StudentStatus;
  gpa: number; // 0.0 - 4.0
  avatar: string;
  address: string;
  dateOfBirth: string;
  courses: CourseGrade[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'GRADE_ASSIGN' | 'DEPLOY';
  user: string;
  role: UserRole;
  details: string;
  ipAddress: string;
  statusCode: number;
}

export interface K8sPod {
  id: string;
  name: string;
  namespace: string;
  status: 'Running' | 'Pending' | 'Terminating' | 'CrashLoopBackOff';
  ready: string;
  restarts: number;
  node: string;
  cpuUsage: string;
  memoryUsage: string;
  age: string;
}

export interface CiCdStage {
  id: string;
  name: string;
  status: 'success' | 'running' | 'failed' | 'pending';
  duration: string;
  command: string;
  logs: string[];
}

export interface ProjectFile {
  path: string;
  filename: string;
  language: 'java' | 'yaml' | 'terraform' | 'dockerfile' | 'sql' | 'xml' | 'json' | 'markdown';
  category: 'Spring Boot' | 'Docker & K8s' | 'Terraform IaC' | 'CI/CD Pipeline' | 'Database';
  content: string;
  description: string;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  requiredRole: UserRole[];
  requestBodySample?: Record<string, unknown>;
  responseSample: Record<string, unknown>;
}
