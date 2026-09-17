import React from 'react';
import { UserRole, UserSession } from '../types';
import { USER_SESSIONS } from '../data/mockData';
import { 
  Server, 
  ShieldCheck, 
  Download, 
  Layers, 
  Terminal, 
  Cloud, 
  GitBranch, 
  Code2, 
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'students' | 'rbac' | 'api' | 'devops' | 'cicd' | 'code';
  setActiveTab: (tab: 'students' | 'rbac' | 'api' | 'devops' | 'cicd' | 'code') => void;
  currentUser: UserSession;
  setCurrentUserRole: (role: 'admin' | 'faculty' | 'student') => void;
  onDownloadZip: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUserRole,
  onDownloadZip,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
      {/* Top Banner with Architecture Meta */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-slate-300 font-semibold">AWS EC2 (us-east-1)</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Kubernetes v1.29</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Spring Boot 3.3.2</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">MySQL 8.0 RDS</span>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-medium">Active RBAC Role:</span>
          </span>
          <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-700/80">
            <button
              id="role-admin-btn"
              onClick={() => setCurrentUserRole('admin')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                currentUser.role === 'ROLE_ADMIN'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin
            </button>
            <button
              id="role-faculty-btn"
              onClick={() => setCurrentUserRole('faculty')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                currentUser.role === 'ROLE_FACULTY'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Faculty
            </button>
            <button
              id="role-student-btn"
              onClick={() => setCurrentUserRole('student')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                currentUser.role === 'ROLE_STUDENT'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Student
            </button>
          </div>

          <button
            id="download-project-zip-btn"
            onClick={onDownloadZip}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-all shadow-sm ml-2 border border-blue-400/30 text-xs"
            title="Download full Spring Boot + Docker + K8s + Terraform repository as ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Project (.ZIP)</span>
          </button>
        </div>
      </div>

      {/* Main Title & Nav Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-md shadow-indigo-950">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Cloud-Based Student Management System
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Production Ready
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Spring Boot RESTful APIs • MySQL • AWS EC2 & RDS • Docker • Kubernetes • Terraform IaC • GitHub Actions
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            id="tab-students"
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'students'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Student Management (CRUD)</span>
          </button>

          <button
            id="tab-rbac"
            onClick={() => setActiveTab('rbac')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'rbac'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>RBAC & Security</span>
          </button>

          <button
            id="tab-api"
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'api'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>REST API Console</span>
          </button>

          <button
            id="tab-devops"
            onClick={() => setActiveTab('devops')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'devops'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>AWS & Kubernetes</span>
          </button>

          <button
            id="tab-cicd"
            onClick={() => setActiveTab('cicd')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'cicd'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>CI/CD Pipeline</span>
          </button>

          <button
            id="tab-code"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Project Files</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
