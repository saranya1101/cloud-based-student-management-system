import React, { useState } from 'react';
import { Student, UserRole } from '../types';
import { X, Award, BookOpen, Calendar, MapPin, Mail, Phone, Clock, PlusCircle } from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  userRole: UserRole;
  onAddGrade?: (studentId: string, courseCode: string, courseName: string, credits: number, grade: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'F', score: number) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  userRole,
  onAddGrade
}) => {
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [courseCode, setCourseCode] = useState('CS450');
  const [courseName, setCourseName] = useState('Cloud Native Microservices');
  const [credits, setCredits] = useState(3);
  const [grade, setGrade] = useState<'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'F'>('A');
  const [score, setScore] = useState(94);

  if (!student) return null;

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddGrade) {
      onAddGrade(student.id, courseCode, courseName, credits, grade, score);
      setIsAddingCourse(false);
    }
  };

  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.8) return 'text-emerald-400 bg-emerald-950/60 border-emerald-700/60';
    if (gpa >= 3.4) return 'text-sky-400 bg-sky-950/60 border-sky-700/60';
    if (gpa >= 3.0) return 'text-amber-400 bg-amber-950/60 border-amber-700/60';
    return 'text-rose-400 bg-rose-950/60 border-rose-700/60';
  };

  const canEditGrades = userRole === 'ROLE_ADMIN' || userRole === 'ROLE_FACULTY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Student Banner */}
        <div className="relative bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 p-6 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={student.avatar}
              alt={`${student.firstName} ${student.lastName}`}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white">
                  {student.firstName} {student.lastName}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold border border-indigo-500/20">
                  {student.id}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
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
              </div>
              <p className="text-sm text-slate-300 font-medium">{student.department}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {student.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {student.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Semester {student.semester} (Class of {student.enrollmentYear})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-4 rounded-xl border ${getGpaColor(student.gpa)}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                  Cumulative GPA
                </span>
                <Award className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold mt-1">{student.gpa.toFixed(2)}</p>
              <p className="text-[11px] opacity-75 mt-0.5">Scale: 4.00</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Completed Credits
              </span>
              <p className="text-2xl font-bold mt-1 text-white">
                {student.courses.reduce((acc, c) => acc + c.credits, 0)}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Across {student.courses.length} courses</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Avg. Attendance
              </span>
              <p className="text-2xl font-bold mt-1 text-emerald-400">
                {student.courses.length > 0
                  ? Math.round(
                      student.courses.reduce((acc, c) => acc + c.attendancePercent, 0) /
                        student.courses.length
                    )
                  : 100}
                %
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Lecture presence</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Residential Info
              </span>
              <p className="text-xs font-medium text-slate-300 mt-1 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{student.address || 'Campus Dormitories'}</span>
              </p>
            </div>
          </div>

          {/* Academic Transcripts & Courses */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Enrolled Courses & Academic Transcript</span>
              </h4>

              {canEditGrades && !isAddingCourse && (
                <button
                  onClick={() => setIsAddingCourse(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Assign Course / Grade</span>
                </button>
              )}
            </div>

            {/* Form to add grade if open */}
            {isAddingCourse && (
              <form
                onSubmit={handleSaveGrade}
                className="p-4 rounded-xl bg-slate-950 border border-indigo-700/50 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Course Code</label>
                    <input
                      type="text"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1">Course Name</label>
                    <input
                      type="text"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Credits</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={credits}
                      onChange={(e) => setCredits(parseInt(e.target.value) || 3)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Grade</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    >
                      {['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'F'].map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Numeric Score (0-100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddingCourse(false)}
                    className="px-3 py-1 rounded text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                  >
                    Save Grade Entry
                  </button>
                </div>
              </form>
            )}

            {/* Courses Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Course Code</th>
                    <th className="py-2.5 px-4 font-semibold">Course Title</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Credits</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Score</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Grade</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {student.courses.map((course, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-semibold text-indigo-400">
                        {course.courseCode}
                      </td>
                      <td className="py-2.5 px-4 text-slate-200 font-medium">
                        {course.courseName}
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 text-center">{course.credits}</td>
                      <td className="py-2.5 px-4 text-slate-300 text-center font-mono">
                        {course.score}%
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            course.grade.startsWith('A')
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                              : course.grade.startsWith('B')
                              ? 'bg-sky-950 text-sky-300 border border-sky-700/50'
                              : 'bg-amber-950 text-amber-300 border border-amber-700/50'
                          }`}
                        >
                          {course.grade}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 text-slate-300">
                          <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${course.attendancePercent}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px]">
                            {course.attendancePercent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {student.courses.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">
                        No courses recorded yet for this student.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cloud Database Metadata */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Created at: {new Date(student.createdAt).toLocaleDateString()}</span>
              <span className="text-slate-700">•</span>
              <span>Last updated: {new Date(student.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="font-mono text-[11px] text-slate-500">
              MySQL Entity ID: {student.id}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            RBAC Permission status: <span className="text-indigo-400 font-semibold">{userRole}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
