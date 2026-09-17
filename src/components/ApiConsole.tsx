import React, { useState } from 'react';
import { ApiEndpoint, Student, UserSession } from '../types';
import { REST_API_ENDPOINTS } from '../data/mockData';
import { 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  Code2, 
  Send
} from 'lucide-react';

interface ApiConsoleProps {
  students: Student[];
  currentUser: UserSession;
}

export const ApiConsole: React.FC<ApiConsoleProps> = ({
  students,
  currentUser
}) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(REST_API_ENDPOINTS[0]);
  const [requestBodyText, setRequestBodyText] = useState(
    JSON.stringify(REST_API_ENDPOINTS[0].requestBodySample || {}, null, 2)
  );
  const [activeTab, setActiveTab] = useState<'response' | 'curl' | 'headers'>('response');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [responseOutput, setResponseOutput] = useState<{
    status: number;
    statusText: string;
    durationMs: number;
    data: any;
  } | null>(null);

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    if (ep.requestBodySample) {
      setRequestBodyText(JSON.stringify(ep.requestBodySample, null, 2));
    } else {
      setRequestBodyText('');
    }
    setResponseOutput(null);
  };

  const handleSendRequest = () => {
    setIsLoading(true);
    setResponseOutput(null);

    setTimeout(() => {
      setIsLoading(false);
      const isAllowed = selectedEndpoint.requiredRole.includes(currentUser.role);

      if (!isAllowed) {
        setResponseOutput({
          status: 403,
          statusText: 'Forbidden',
          durationMs: 38,
          data: {
            timestamp: new Date().toISOString(),
            status: 403,
            error: 'Forbidden',
            message: `Access Denied: Principal with authority '${currentUser.role}' is not authorized to access ${selectedEndpoint.method} ${selectedEndpoint.path}`,
            path: selectedEndpoint.path
          }
        });
        return;
      }

      // If authorized, return appropriate data
      let resultData: any = selectedEndpoint.responseSample;

      if (selectedEndpoint.path === '/api/v1/students' && selectedEndpoint.method === 'GET') {
        resultData = {
          content: students.map((s) => ({
            id: s.id,
            firstName: s.firstName,
            lastName: s.lastName,
            email: s.email,
            department: s.department,
            gpa: s.gpa,
            status: s.status,
            coursesCount: s.courses.length
          })),
          pageable: {
            pageNumber: 0,
            pageSize: 10,
            sort: { sorted: true, unsorted: false, empty: false }
          },
          totalElements: students.length,
          totalPages: 1,
          first: true,
          last: true
        };
      } else if (selectedEndpoint.path.includes('/api/v1/students/{id}')) {
        const student = students[0];
        resultData = {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          phone: student.phone,
          department: student.department,
          gpa: student.gpa,
          status: student.status,
          courses: student.courses
        };
      }

      setResponseOutput({
        status: selectedEndpoint.method === 'POST' ? 201 : 200,
        statusText: selectedEndpoint.method === 'POST' ? 'Created' : 'OK',
        durationMs: Math.floor(Math.random() * 45) + 35,
        data: resultData
      });
    }, 400);
  };

  const generateCurlCommand = () => {
    let curl = `curl -X ${selectedEndpoint.method} "https://api.cloudsms.edu${selectedEndpoint.path.replace(
      '{id}',
      'STU-2024-001'
    )}" \\\n  -H "Authorization: Bearer ${currentUser.token.substring(0, 32)}..." \\\n  -H "Content-Type: application/json"`;

    if (
      (selectedEndpoint.method === 'POST' || selectedEndpoint.method === 'PUT') &&
      requestBodyText
    ) {
      curl += ` \\\n  -d '${requestBodyText.replace(/\n/g, '')}'`;
    }
    return curl;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            Interactive RESTful API Explorer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Test Spring Boot CRUD endpoints live. Requests are authenticated using your active JWT token with role-based checks.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            <span className="text-slate-500">Base URL:</span>{' '}
            <span className="font-mono text-indigo-300">https://api.cloudsms.edu</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint Selector Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Spring Boot REST Endpoints
          </p>

          <div className="space-y-1.5">
            {REST_API_ENDPOINTS.map((ep, idx) => {
              const isSelected =
                selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500/80 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                        ep.method === 'GET'
                          ? 'bg-blue-950 text-blue-300'
                          : ep.method === 'POST'
                          ? 'bg-emerald-950 text-emerald-300'
                          : ep.method === 'PUT'
                          ? 'bg-amber-950 text-amber-300'
                          : 'bg-rose-950 text-rose-300'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {ep.requiredRole.join(' | ').replace(/ROLE_/g, '')}
                    </span>
                  </div>

                  <code className="text-xs font-mono font-semibold text-slate-200 truncate">
                    {ep.path}
                  </code>

                  <p className="text-[11px] text-slate-400 line-clamp-1">{ep.summary}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Request / Response Panel */}
        <div className="lg:col-span-8 space-y-4">
          {/* Request Header Bar */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <span
                  className={`font-mono text-xs font-bold px-2.5 py-1 rounded ${
                    selectedEndpoint.method === 'GET'
                      ? 'bg-blue-950 text-blue-300 border border-blue-700/50'
                      : selectedEndpoint.method === 'POST'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                      : selectedEndpoint.method === 'PUT'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700/50'
                      : 'bg-rose-950 text-rose-300 border border-rose-700/50'
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <input
                  type="text"
                  readOnly
                  value={`https://api.cloudsms.edu${selectedEndpoint.path}`}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs font-mono text-slate-200 flex-1"
                />
              </div>

              <button
                onClick={handleSendRequest}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md disabled:opacity-50 shrink-0"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400">{selectedEndpoint.description}</p>
          </div>

          {/* Request Body Editor (if POST or PUT) */}
          {(selectedEndpoint.method === 'POST' || selectedEndpoint.method === 'PUT') && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                JSON Request Body (Application/json)
              </label>
              <textarea
                rows={5}
                value={requestBodyText}
                onChange={(e) => setRequestBodyText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Response / cURL Tabs */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('response')}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                    activeTab === 'response'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  HTTP Response
                </button>
                <button
                  onClick={() => setActiveTab('curl')}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                    activeTab === 'curl'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  cURL Command
                </button>
              </div>

              {responseOutput && activeTab === 'response' && (
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      responseOutput.status >= 200 && responseOutput.status < 300
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {responseOutput.status} {responseOutput.statusText}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {responseOutput.durationMs}ms
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 font-mono text-xs overflow-x-auto relative max-h-[380px] scrollbar-thin">
              {activeTab === 'response' && (
                <>
                  {responseOutput ? (
                    <div className="space-y-2">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleCopy(JSON.stringify(responseOutput.data, null, 2))}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
                        </button>
                      </div>
                      <pre className="text-emerald-400 whitespace-pre-wrap">
                        {JSON.stringify(responseOutput.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-500">
                      Click <strong className="text-slate-400">"Send Request"</strong> to execute this REST API call.
                    </div>
                  )}
                </>
              )}

              {activeTab === 'curl' && (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleCopy(generateCurlCommand())}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied cURL' : 'Copy cURL'}</span>
                    </button>
                  </div>
                  <pre className="text-sky-300 whitespace-pre-wrap">{generateCurlCommand()}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
