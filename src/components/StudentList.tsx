import React, { useState, useMemo } from 'react';
import { Student, Department, StudentStatus, UserRole } from '../types';
import { 
  Search, 
  Plus, 
  Filter, 
  Trash2, 
  Edit3, 
  Eye, 
  Download, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Database,
  ArrowUpDown,
  AlertTriangle,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface StudentListProps {
  students: Student[];
  userRole: UserRole;
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onViewStudent: (student: Student) => void;
}

const DEPARTMENTS: ('All' | Department)[] = [
  'All',
  'Computer Science',
  'Data Science',
  'Cyber Security',
  'Software Engineering',
  'Electrical Engineering',
  'Business Analytics'
];

const STATUSES: ('All' | StudentStatus)[] = ['All', 'Active', 'On Leave', 'Graduated', 'Suspended'];

export const StudentList: React.FC<StudentListProps> = ({
  students,
  userRole,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onViewStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<'All' | Department>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | StudentStatus>('All');
  const [minGpa, setMinGpa] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'gpa_desc' | 'name_asc' | 'id_asc' | 'date_desc'>('gpa_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const isAdmin = userRole === 'ROLE_ADMIN';
  const isFaculty = userRole === 'ROLE_FACULTY';
  const isStudent = userRole === 'ROLE_STUDENT';

  // Filter & Sort Logic
  const filteredStudents = useMemo(() => {
    return students
      .filter((stu) => {
        const matchesSearch =
          stu.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stu.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stu.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stu.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept = selectedDept === 'All' || stu.department === selectedDept;
        const matchesStatus = selectedStatus === 'All' || stu.status === selectedStatus;
        const matchesGpa = stu.gpa >= minGpa;

        return matchesSearch && matchesDept && matchesStatus && matchesGpa;
      })
      .sort((a, b) => {
        if (sortBy === 'gpa_desc') return b.gpa - a.gpa;
        if (sortBy === 'name_asc') return a.firstName.localeCompare(b.firstName);
        if (sortBy === 'id_asc') return a.id.localeCompare(b.id);
        if (sortBy === 'date_desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [students, searchQuery, selectedDept, selectedStatus, minGpa, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Metrics
  const avgGpa = students.length > 0
    ? (students.reduce((acc, s) => acc + s.gpa, 0) / students.length).toFixed(2)
    : '0.00';
  const activeCount = students.filter((s) => s.status === 'Active').length;

  const handleExportCSV = () => {
    const headers = ['ID,First Name,Last Name,Email,Phone,Department,Semester,Status,GPA'];
    const rows = filteredStudents.map(
      (s) =>
        `"${s.id}","${s.firstName}","${s.lastName}","${s.email}","${s.phone}","${s.department}",${s.semester},"${s.status}",${s.gpa}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'students_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Enrolled
            </p>
            <p className="text-2xl font-bold text-white mt-1">{students.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Across 6 academic faculties</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/40">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Students
            </p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{activeCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {Math.round((activeCount / (students.length || 1)) * 100)}% active rate
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Average GPA
            </p>
            <p className="text-2xl font-bold text-sky-400 mt-1">{avgGpa}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Scale: 4.00 Grade Cap</p>
          </div>
          <div className="p-3 rounded-xl bg-sky-950/60 text-sky-400 border border-sky-800/40">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              MySQL RDS Instance
            </p>
            <p className="text-sm font-bold text-indigo-400 mt-1 font-mono">sms-db:3306</p>
            <p className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Multi-AZ Synchronized
            </p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
            <Database className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* RBAC notice bar if not Admin */}
      {!isAdmin && (
        <div className="p-3.5 rounded-xl border border-amber-800/60 bg-amber-950/30 text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              You are signed in with <strong className="font-mono text-amber-300">{userRole}</strong>. 
              {isFaculty && ' As Faculty, you have read access and grade recording permissions. Create and Delete operations require ROLE_ADMIN.'}
              {isStudent && ' As Student, you have read-only access to records. Creation, updates, and deletion are protected by Spring Security.'}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 font-mono text-[10px] border border-amber-700/50 whitespace-nowrap">
            @PreAuthorize enforced
          </span>
        </div>
      )}

      {/* Search, Filter & Action Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name, email, or STU-ID..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
              title="Export filtered records to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              id="enroll-student-btn"
              onClick={onAddStudent}
              disabled={!isAdmin}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-md ${
                isAdmin
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
              title={isAdmin ? 'Enroll new student' : 'Requires ROLE_ADMIN in Spring Security'}
            >
              {isAdmin ? <Plus className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
              <span>Enroll Student</span>
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 text-xs">
          {/* Department */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Min GPA */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Min GPA: <span className="text-indigo-300 font-bold">{minGpa.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="4.0"
              step="0.1"
              value={minGpa}
              onChange={(e) => {
                setMinGpa(parseFloat(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="gpa_desc">Highest GPA</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="id_asc">Student ID</option>
              <option value="date_desc">Recent Enrollment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Student ID & Name</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-4 font-semibold">Semester</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">GPA</th>
                <th className="py-3 px-4 font-semibold">Enrolled Courses</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-850/60 transition-colors group"
                >
                  {/* Student ID & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.firstName}
                        className="w-9 h-9 rounded-full object-cover border border-indigo-500/30 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {student.firstName} {student.lastName}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                          <span>{student.id}</span>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">{student.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-200">
                      {student.department}
                    </span>
                  </td>

                  {/* Semester */}
                  <td className="py-3 px-4 text-slate-300 font-medium">
                    Sem {student.semester}
                    <span className="text-[10px] text-slate-500 block">Class of {student.enrollmentYear}</span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        student.status === 'Active'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                          : student.status === 'On Leave'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                          : student.status === 'Graduated'
                          ? 'bg-purple-950/80 text-purple-300 border-purple-700/60'
                          : 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>

                  {/* GPA */}
                  <td className="py-3 px-4 font-mono font-bold">
                    <span
                      className={`${
                        student.gpa >= 3.8
                          ? 'text-emerald-400'
                          : student.gpa >= 3.4
                          ? 'text-sky-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {student.gpa.toFixed(2)}
                    </span>
                  </td>

                  {/* Courses */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {student.courses.slice(0, 2).map((c, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded font-mono border border-slate-700"
                        >
                          {c.courseCode}
                        </span>
                      ))}
                      {student.courses.length > 2 && (
                        <span className="px-1.5 py-0.5 bg-slate-800/60 text-slate-400 text-[10px] rounded">
                          +{student.courses.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewStudent(student)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="View Academic Dossier & Transcripts"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEditStudent(student)}
                        disabled={!isAdmin}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isAdmin
                            ? 'text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/50'
                            : 'text-slate-700 cursor-not-allowed'
                        }`}
                        title={isAdmin ? 'Edit Student (PUT /api/v1/students/{id})' : 'Requires ROLE_ADMIN'}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setStudentToDelete(student)}
                        disabled={!isAdmin}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isAdmin
                            ? 'text-slate-400 hover:text-red-400 hover:bg-red-950/50'
                            : 'text-slate-700 cursor-not-allowed'
                        }`}
                        title={isAdmin ? 'Delete Student (DELETE /api/v1/students/{id})' : 'Requires ROLE_ADMIN'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-slate-600" />
                      <p className="font-medium text-slate-400">No matching student records found</p>
                      <p className="text-[11px] text-slate-500">
                        Try adjusting your search criteria or clear active filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{paginatedStudents.length}</strong> of{' '}
            <strong className="text-white">{filteredStudents.length}</strong> records (Page{' '}
            {currentPage} of {totalPages})
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 disabled:opacity-40 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-200">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 disabled:opacity-40 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-red-900/60 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-800/60">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Delete Student Record</h4>
                <p className="text-xs text-red-300">Cascade delete in MySQL database</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white">
                {studentToDelete.firstName} {studentToDelete.lastName}
              </strong>{' '}
              ({studentToDelete.id})? This will remove all associated course transcripts, grades,
              and attendance records via Spring Boot JPA repository.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
