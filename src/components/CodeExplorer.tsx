import React, { useState } from 'react';
import { ProjectFile } from '../types';
import { PROJECT_SOURCE_FILES } from '../data/sourceCodeFiles';
import { 
  Code2, 
  Folder, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Search, 
  Layers, 
  FileText,
  Terminal,
  ExternalLink
} from 'lucide-react';

interface CodeExplorerProps {
  onDownloadZip: () => void;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ onDownloadZip }) => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PROJECT_SOURCE_FILES[0]);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Spring Boot', 'Docker & K8s', 'Terraform IaC', 'CI/CD Pipeline', 'Database'];

  const filteredFiles = PROJECT_SOURCE_FILES.filter((file) => {
    const matchesCategory = filterCategory === 'All' || file.category === filterCategory;
    const matchesSearch =
      file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = selectedFile.content.split('\n').length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Code2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Full Project Code Repository & Artifacts
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                13 Production Files
              </span>
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Complete, production-ready codebase including Spring Boot 3 Java entities & controllers,
              Spring Security JWT filters, multi-stage Dockerfile, Kubernetes rolling deployment manifests,
              Terraform AWS IaC, and GitHub Actions CI/CD workflows.
            </p>
          </div>
        </div>

        <button
          onClick={onDownloadZip}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md shrink-0 border border-blue-400/30"
        >
          <Download className="w-4 h-4" />
          <span>Download Entire Project (.ZIP)</span>
        </button>
      </div>

      {/* Main IDE-style view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left File Tree Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files by name or path..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Files List */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-2 space-y-1 max-h-[500px] overflow-y-auto scrollbar-thin">
            {filteredFiles.map((file, idx) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full p-2.5 rounded-lg text-left transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-indigo-950/70 border border-indigo-500/70 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isSelected ? 'text-indigo-400' : 'text-slate-500'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold font-mono truncate">{file.filename}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{file.path}</p>
                    <span className="inline-block text-[9px] px-1.5 py-0.2 rounded bg-slate-950 text-indigo-300 border border-slate-800 mt-1">
                      {file.category}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredFiles.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-500">
                No matching files found.
              </div>
            )}
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-8 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex flex-col">
          {/* File Header Bar */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-bold text-white font-mono truncate">
                  {selectedFile.filename}
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  ({lineCount} lines • {selectedFile.language.toUpperCase()})
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{selectedFile.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy(selectedFile.content)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Code Text with Line Numbers */}
          <div className="p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[540px] overflow-y-auto scrollbar-thin bg-slate-950">
            <pre className="flex">
              {/* Line Numbers */}
              <div className="select-none text-slate-600 text-right pr-4 border-r border-slate-800/80 mr-4 space-y-0.5">
                {selectedFile.content.split('\n').map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Code Content */}
              <div className="flex-1 whitespace-pre leading-relaxed text-slate-200">
                {selectedFile.content}
              </div>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
