import React, { useState } from 'react';
import { UserRole, UserSession } from '../types';
import { USER_SESSIONS } from '../data/mockData';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Key, 
  Lock, 
  Terminal, 
  FileCode, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface RbacMatrixProps {
  currentUser: UserSession;
  setCurrentUserRole: (role: 'admin' | 'faculty' | 'student') => void;
}

interface ActionTest {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  requiredRole: UserRole[];
  springAnnotation: string;
}

const ACTION_TESTS: ActionTest[] = [
  {
    id: 'act-1',
    name: 'Enroll New Student Record',
    endpoint: '/api/v1/students',
    method: 'POST',
    requiredRole: ['ROLE_ADMIN'],
    springAnnotation: "@PreAuthorize(\"hasRole('ADMIN')\")"
  },
  {
    id: 'act-2',
    name: 'Update Student Profile / GPA',
    endpoint: '/api/v1/students/{id}',
    method: 'PUT',
    requiredRole: ['ROLE_ADMIN'],
    springAnnotation: "@PreAuthorize(\"hasRole('ADMIN')\")"
  },
  {
    id: 'act-3',
    name: 'Delete Student & Cascade Records',
    endpoint: '/api/v1/students/{id}',
    method: 'DELETE',
    requiredRole: ['ROLE_ADMIN'],
    springAnnotation: "@PreAuthorize(\"hasRole('ADMIN')\")"
  },
  {
    id: 'act-4',
    name: 'Assign Grades & Attendance Record',
    endpoint: '/api/v1/students/{id}/grades',
    method: 'PATCH',
    requiredRole: ['ROLE_ADMIN', 'ROLE_FACULTY'],
    springAnnotation: "@PreAuthorize(\"hasAnyRole('ADMIN', 'FACULTY')\")"
  },
  {
    id: 'act-5',
    name: 'List All Students with Pagination',
    endpoint: '/api/v1/students',
    method: 'GET',
    requiredRole: ['ROLE_ADMIN', 'ROLE_FACULTY'],
    springAnnotation: "@PreAuthorize(\"hasAnyRole('ADMIN', 'FACULTY')\")"
  },
  {
    id: 'act-6',
    name: 'View Individual Academic Dossier',
    endpoint: '/api/v1/students/{id}',
    method: 'GET',
    requiredRole: ['ROLE_ADMIN', 'ROLE_FACULTY', 'ROLE_STUDENT'],
    springAnnotation: "@PreAuthorize(\"hasAnyRole('ADMIN', 'FACULTY', 'STUDENT')\")"
  }
];

export const RbacMatrix: React.FC<RbacMatrixProps> = ({
  currentUser,
  setCurrentUserRole
}) => {
  const [testResult, setTestResult] = useState<{
    action: ActionTest;
    allowed: boolean;
    timestamp: string;
  } | null>(null);

  const handleSimulateAction = (action: ActionTest) => {
    const isAllowed = action.requiredRole.includes(currentUser.role);
    setTestResult({
      action,
      allowed: isAllowed,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Role-Based Access Control (RBAC) Architecture
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Spring Security 6
                </span>
              </h2>
              <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
                Fine-grained security implemented using method-level security with{' '}
                <code className="text-indigo-300 font-mono">@EnableMethodSecurity</code>, custom JWT
                Token verification filter, and declarative authorization rules across endpoints.
              </p>
            </div>
          </div>

          {/* Quick Role Tester Switcher */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Switch Test Identity
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentUserRole('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentUser.role === 'ROLE_ADMIN'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                ROLE_ADMIN
              </button>
              <button
                onClick={() => setCurrentUserRole('faculty')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentUser.role === 'ROLE_FACULTY'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                ROLE_FACULTY
              </button>
              <button
                onClick={() => setCurrentUserRole('student')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentUser.role === 'ROLE_STUDENT'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                ROLE_STUDENT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Authorization Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center justify-between mb-3">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                Live Authorization Test Simulator
              </span>
              <span className="text-xs text-slate-400">
                Testing as: <strong className="text-indigo-300 font-mono">{currentUser.role}</strong>
              </span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Click any API operation to simulate a live request passing through the Spring Security Filter Chain.
            </p>

            <div className="space-y-2.5">
              {ACTION_TESTS.map((action) => {
                const canExecute = action.requiredRole.includes(currentUser.role);
                return (
                  <div
                    key={action.id}
                    className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                            action.method === 'GET'
                              ? 'bg-blue-950 text-blue-300'
                              : action.method === 'POST'
                              ? 'bg-emerald-950 text-emerald-300'
                              : action.method === 'PUT'
                              ? 'bg-amber-950 text-amber-300'
                              : action.method === 'PATCH'
                              ? 'bg-purple-950 text-purple-300'
                              : 'bg-rose-950 text-rose-300'
                          }`}
                        >
                          {action.method}
                        </span>
                        <span className="text-xs font-bold text-slate-200">{action.name}</span>
                        <code className="text-[11px] text-slate-400 font-mono hidden md:inline">
                          {action.endpoint}
                        </code>
                      </div>
                      <div className="text-[11px] font-mono text-indigo-400">
                        {action.springAnnotation}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSimulateAction(action)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Test Call</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Evaluation Feedback Box */}
          {testResult && (
            <div
              className={`p-4 rounded-xl border animate-in fade-in duration-200 ${
                testResult.allowed
                  ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-700/60 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {testResult.allowed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {testResult.allowed
                      ? 'HTTP 200 OK — Authorization Granted'
                      : 'HTTP 403 FORBIDDEN — Access Denied'}
                    <span className="text-[10px] opacity-75 font-mono">
                      [{testResult.timestamp}]
                    </span>
                  </h4>
                  <p className="text-xs">
                    Operation <code className="font-mono font-bold">{testResult.action.method} {testResult.action.endpoint}</code> was evaluated against principal role{' '}
                    <code className="font-mono font-bold">{currentUser.role}</code>.
                  </p>
                  <p className="text-xs opacity-90">
                    {testResult.allowed
                      ? `Spring Security verified that ${currentUser.role} satisfies constraint: ${testResult.action.springAnnotation}. Request allowed to hit StudentService.`
                      : `Access denied! Required role(s): [${testResult.action.requiredRole.join(', ')}]. Principal ${currentUser.role} lacks required authority.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: JWT Token Inspector & RBAC Matrix */}
        <div className="space-y-4">
          {/* JWT Token Decoder */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Active JWT Bearer Token</span>
            </h3>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[10px] font-mono break-all text-slate-400 select-all">
              <span className="text-red-400">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>.
              <span className="text-indigo-300">
                eyJzdWIiOiI{currentUser.email}Iiwicm9sZXMiOlsie3VzZXJSb2xlfSJdfQ
              </span>.
              <span className="text-emerald-400">signatureVerified4096bit</span>
            </div>

            <div className="text-xs space-y-2 border-t border-slate-800 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Principal Subject:</span>
                <span className="text-slate-200 font-medium">{currentUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Authority:</span>
                <span className="font-mono font-bold text-indigo-400">{currentUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Token Expiry:</span>
                <span className="text-slate-200">24 Hours (Stateless)</span>
              </div>
            </div>
          </div>

          {/* RBAC Permissions Matrix Table */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>Permission Entitlement Matrix</span>
            </h3>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="border-b border-slate-800 text-slate-400 text-[10px]">
                  <tr>
                    <th className="py-2">Capability</th>
                    <th className="py-2 text-center">Admin</th>
                    <th className="py-2 text-center">Faculty</th>
                    <th className="py-2 text-center">Student</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-[11px]">
                  <tr>
                    <td className="py-2 text-slate-300">Create Students</td>
                    <td className="py-2 text-center text-emerald-400 font-bold">✓</td>
                    <td className="py-2 text-center text-rose-500">✗</td>
                    <td className="py-2 text-center text-rose-500">✗</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-300">Update Records</td>
                    <td className="py-2 text-center text-emerald-400 font-bold">✓</td>
                    <td className="py-2 text-center text-rose-500">✗</td>
                    <td className="py-2 text-center text-rose-500">✗</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-300">Delete Records</td>
                    <td className="py-2 text-center text-emerald-400 font-bold">✓</td>
                    <td className="py-2 text-center text-rose-500">✗</td>
                    <td className="py-2 text-center text-rose-500">✗</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-300">Assign Grades</td>
                    <td className="py-2 text-center text-emerald-400 font-bold">✓</td>
                    <td className="py-2 text-center text-emerald-400 font-bold">✓</td>
                    <td className="py-2 text-center text-rose-500">✗</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-300">View All Students</td>
                    <td className="py-2 text-center text-emerald-400 font-bold">✓</td>
                    <td className="py-2 text-center text-emerald-400 font-bold">✓</td>
                    <td className="py-2 text-center text-rose-500">✗</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-300">View Own Profile</td>
                    <td className="py-2 text-center text-emerald-400 font-bold">✓</td>
                    <td className="py-2 text-center text-emerald-400 font-bold">✓</td>
                    <td className="py-2 text-center text-emerald-400 font-bold">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
