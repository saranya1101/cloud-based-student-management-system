import React, { useState } from 'react';
import { Student, UserRole, UserSession } from './types';
import { INITIAL_STUDENTS, USER_SESSIONS } from './data/mockData';
import { Header } from './components/Header';
import { StudentList } from './components/StudentList';
import { StudentModal } from './components/StudentModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { RbacMatrix } from './components/RbacMatrix';
import { ApiConsole } from './components/ApiConsole';
import { DevOpsCluster } from './components/DevOpsCluster';
import { CiCdPipeline } from './components/CiCdPipeline';
import { CodeExplorer } from './components/CodeExplorer';
import { downloadProjectZip } from './utils/zipExporter';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'students' | 'rbac' | 'api' | 'devops' | 'cicd' | 'code'>('students');
  const [currentUserRoleKey, setCurrentUserRoleKey] = useState<'admin' | 'faculty' | 'student'>('admin');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>({
    message: 'Welcome to the Cloud-Based Student Management System! Try switching RBAC roles or downloading the full project ZIP.',
    type: 'info'
  });

  const currentUser: UserSession = USER_SESSIONS[currentUserRoleKey];

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleRoleChange = (role: 'admin' | 'faculty' | 'student') => {
    setCurrentUserRoleKey(role);
    const roleName = USER_SESSIONS[role].role;
    showToast(`Switched active identity to ${USER_SESSIONS[role].name} (${roleName})`, 'info');
  };

  const handleDownloadZip = async () => {
    try {
      showToast('Generating and packaging complete project archive...', 'info');
      await downloadProjectZip();
      showToast('Successfully downloaded cloud-student-management-system.zip!', 'success');
    } catch (err) {
      showToast('Failed to generate project ZIP archive', 'error');
    }
  };

  // CRUD Operations
  const handleOpenAddModal = () => {
    if (currentUser.role !== 'ROLE_ADMIN') {
      showToast('Action Forbidden (HTTP 403): Only ROLE_ADMIN can enroll students.', 'error');
      return;
    }
    setSelectedStudentForEdit(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    if (currentUser.role !== 'ROLE_ADMIN') {
      showToast('Action Forbidden (HTTP 403): Only ROLE_ADMIN can update student records.', 'error');
      return;
    }
    setSelectedStudentForEdit(student);
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (data: Partial<Student>) => {
    if (selectedStudentForEdit) {
      // Update
      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudentForEdit.id
            ? {
                ...s,
                ...data,
                updatedAt: new Date().toISOString()
              }
            : s
        )
      );
      showToast(`Student ${selectedStudentForEdit.id} updated successfully (PUT /api/v1/students/${selectedStudentForEdit.id})`);
    } else {
      // Create new
      const nextNum = students.length + 1;
      const formattedNum = nextNum.toString().padStart(3, '0');
      const newStudent: Student = {
        id: `STU-2024-${formattedNum}`,
        firstName: data.firstName || 'New',
        lastName: data.lastName || 'Student',
        email: data.email || 'student@cloudsms.edu',
        phone: data.phone || '+1 (555) 000-0000',
        department: data.department || 'Computer Science',
        semester: data.semester || 1,
        enrollmentYear: data.enrollmentYear || 2024,
        status: data.status || 'Active',
        gpa: data.gpa || 3.50,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + (nextNum * 12345)}?w=150&auto=format&fit=crop&q=80`,
        address: data.address || 'Campus Dorms',
        dateOfBirth: '2004-01-01',
        courses: [
          { courseCode: 'CS101', courseName: 'Introduction to Programming', credits: 4, grade: 'A', score: 92, attendancePercent: 96 }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setStudents((prev) => [newStudent, ...prev]);
      showToast(`Enrolled student ${newStudent.id} (${newStudent.firstName} ${newStudent.lastName}) into MySQL database`);
    }
  };

  const handleDeleteStudent = (id: string) => {
    if (currentUser.role !== 'ROLE_ADMIN') {
      showToast('Action Forbidden (HTTP 403): Only ROLE_ADMIN can delete records.', 'error');
      return;
    }
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast(`Student ${id} removed permanently from MySQL database (DELETE /api/v1/students/${id})`);
  };

  const handleAddGrade = (
    studentId: string,
    courseCode: string,
    courseName: string,
    credits: number,
    grade: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'F',
    score: number
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const newCourse = {
          courseCode,
          courseName,
          credits,
          grade,
          score,
          attendancePercent: 95
        };
        const updatedCourses = [newCourse, ...s.courses];
        // Recalculate GPA roughly
        const gradePointMap: Record<string, number> = {
          'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'F': 0.0
        };
        const totalPts = updatedCourses.reduce((acc, c) => acc + (gradePointMap[c.grade] || 3.0) * c.credits, 0);
        const totalCreds = updatedCourses.reduce((acc, c) => acc + c.credits, 0);
        const newGpa = Math.min(4.0, parseFloat((totalPts / totalCreds).toFixed(2)));

        const updatedStudent: Student = {
          ...s,
          gpa: newGpa,
          courses: updatedCourses,
          updatedAt: new Date().toISOString()
        };

        if (selectedStudentForDetail && selectedStudentForDetail.id === studentId) {
          setSelectedStudentForDetail(updatedStudent);
        }

        return updatedStudent;
      })
    );
    showToast(`Grade "${grade}" recorded for student ${studentId} in course ${courseCode}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div
            className={`p-3.5 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-700 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-700 text-rose-200'
                : 'bg-indigo-950/90 border-indigo-700 text-indigo-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}

            <p className="text-xs font-medium flex-1 leading-relaxed">{toast.message}</p>

            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header & Tab Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUserRole={handleRoleChange}
        onDownloadZip={handleDownloadZip}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'students' && (
          <StudentList
            students={students}
            userRole={currentUser.role}
            onAddStudent={handleOpenAddModal}
            onEditStudent={handleOpenEditModal}
            onDeleteStudent={handleDeleteStudent}
            onViewStudent={(s) => setSelectedStudentForDetail(s)}
          />
        )}

        {activeTab === 'rbac' && (
          <RbacMatrix
            currentUser={currentUser}
            setCurrentUserRole={handleRoleChange}
          />
        )}

        {activeTab === 'api' && (
          <ApiConsole
            students={students}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'devops' && <DevOpsCluster />}

        {activeTab === 'cicd' && <CiCdPipeline />}

        {activeTab === 'code' && (
          <CodeExplorer onDownloadZip={handleDownloadZip} />
        )}
      </main>

      {/* Student Modals */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        initialData={selectedStudentForEdit}
      />

      <StudentDetailModal
        student={selectedStudentForDetail}
        onClose={() => setSelectedStudentForDetail(null)}
        userRole={currentUser.role}
        onAddGrade={handleAddGrade}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Cloud-Based Student Management System • Spring Boot 3.3.2 • MySQL 8.0 • AWS EC2 & RDS • Docker • Kubernetes
          </p>
          <p className="font-mono text-slate-400">
            RBAC: <span className="text-indigo-400 font-semibold">{currentUser.role}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
