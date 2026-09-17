import React, { useState, useEffect } from 'react';
import { K8sPod } from '../types';
import { INITIAL_K8S_PODS } from '../data/mockData';
import { 
  Cloud, 
  Server, 
  Cpu, 
  HardDrive, 
  RotateCw, 
  Play, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Database,
  Terminal,
  Zap,
  ArrowRight
} from 'lucide-react';

export const DevOpsCluster: React.FC = () => {
  const [pods, setPods] = useState<K8sPod[]>(INITIAL_K8S_PODS);
  const [syntheticLoad, setSyntheticLoad] = useState<number>(35); // CPU load %
  const [isRestarting, setIsRestarting] = useState(false);
  const [activeLogPod, setActiveLogPod] = useState<string>(INITIAL_K8S_PODS[0].name);

  // Auto-scale pods when load > 70%
  useEffect(() => {
    if (syntheticLoad >= 70 && pods.filter(p => p.name.includes('backend')).length < 5) {
      // Add 2 scaled pods
      const newPod1: K8sPod = {
        id: `pod-${Date.now()}-1`,
        name: `cloudsms-backend-78b9d6f5c8-hpa${Math.floor(Math.random() * 899 + 100)}`,
        namespace: 'production',
        status: 'Running',
        ready: '1/1',
        restarts: 0,
        node: 'ip-10-0-2-88.ec2.internal',
        cpuUsage: `${Math.floor(syntheticLoad * 0.9)}m (${(syntheticLoad * 0.05).toFixed(1)}%)`,
        memoryUsage: '360Mi / 1024Mi',
        age: '1m (HPA Scaled)'
      };
      setPods((prev) => [...prev, newPod1]);
    } else if (syntheticLoad < 50 && pods.filter(p => p.name.includes('hpa')).length > 0) {
      // Scale down
      setPods((prev) => prev.filter(p => !p.name.includes('hpa')));
    }
  }, [syntheticLoad]);

  const handleRollingRestart = () => {
    setIsRestarting(true);
    // Temporarily set a backend pod to Terminating then Running
    setPods((prev) =>
      prev.map((p) =>
        p.id === 'pod-1' ? { ...p, status: 'Terminating' } : p
      )
    );

    setTimeout(() => {
      setPods((prev) =>
        prev.map((p) =>
          p.id === 'pod-1'
            ? { ...p, status: 'Running', restarts: p.restarts + 1, age: '10s' }
            : p
        )
      );
      setIsRestarting(false);
    }, 1200);
  };

  const sampleLogs = [
    `2026-09-17T08:33:10.124Z  INFO 1 --- [main] c.c.StudentManagementApplication: Starting StudentManagementApplication v1.0.0 using Java 21`,
    `2026-09-17T08:33:11.450Z  INFO 1 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer: Tomcat initialized with port 8080 (http)`,
    `2026-09-17T08:33:12.890Z  INFO 1 --- [main] com.zaxxer.hikari.HikariDataSource: HikariPool-1 - Starting...`,
    `2026-09-17T08:33:13.310Z  INFO 1 --- [main] com.zaxxer.hikari.pool.HikariPool: HikariPool-1 - Added connection com.mysql.cj.jdbc.ConnectionImpl@38f5c8`,
    `2026-09-17T08:33:13.315Z  INFO 1 --- [main] com.zaxxer.hikari.HikariDataSource: HikariPool-1 - Start completed. MySQL 8.0 connection verified.`,
    `2026-09-17T08:33:14.200Z  INFO 1 --- [main] o.s.s.web.DefaultSecurityFilterChain: Will secure any request with [SecurityConfig, JwtAuthenticationFilter]`,
    `2026-09-17T08:33:15.010Z  INFO 1 --- [main] o.s.b.a.e.web.EndpointLinksResolver: Exposing 4 endpoint(s) beneath base path '/actuator'`,
    `2026-09-17T08:33:15.112Z  INFO 1 --- [main] c.c.StudentManagementApplication: Started StudentManagementApplication in 4.988 seconds (process running for 5.4)`,
    `2026-09-17T08:33:45.001Z  INFO 1 --- [http-nio-8080-exec-1] o.s.web.servlet.DispatcherServlet: Initializing Servlet 'dispatcherServlet'`,
    `2026-09-17T08:34:01.240Z  INFO 1 --- [kube-probe] c.c.actuator.HealthCheck: Liveness probe HTTP GET 200 OK`,
    `2026-09-17T08:34:15.241Z  INFO 1 --- [kube-probe] c.c.actuator.HealthCheck: Readiness probe HTTP GET 200 OK`
  ];

  return (
    <div className="space-y-6">
      {/* Topology Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30">
              <Cloud className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                AWS EC2 & Kubernetes Cluster Architecture
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Cluster: prod-sms-aws
                </span>
              </h2>
              <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
                Production deployment running on AWS EC2 worker nodes inside a multi-AZ VPC.
                Traffic flows through AWS Application Load Balancer to NGINX Ingress, routed to Spring Boot
                service pods backed by an AWS RDS MySQL multi-AZ database instance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRollingRestart}
              disabled={isRestarting}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-md disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRestarting ? 'animate-spin' : ''}`} />
              <span>Simulate Rolling Restart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Architectural Topology Flow */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Cloud Infrastructure Topology Flow</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          {/* Node 1: Client / DNS */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Traffic Ingress</span>
            <p className="text-xs font-bold text-white">Route 53 & ALB</p>
            <p className="text-[11px] font-mono text-indigo-300">api.cloudsms.edu</p>
            <div className="text-[10px] text-emerald-400">TLS Termination (Port 443)</div>
          </div>

          <div className="hidden md:flex justify-center text-slate-600">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Node 2: K8s Ingress NGINX */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">K8s Ingress</span>
            <p className="text-xs font-bold text-white">NGINX Controller</p>
            <p className="text-[11px] font-mono text-sky-300">Port 80/443 & Rewrite</p>
            <div className="text-[10px] text-slate-400">1 Replicas Active</div>
          </div>

          <div className="hidden md:flex justify-center text-slate-600">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Node 3: Spring Boot Pods with HPA */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-700/60 text-center space-y-1 shadow-md">
            <span className="text-[10px] font-bold text-indigo-300 uppercase">Compute Tier</span>
            <p className="text-xs font-bold text-white">Spring Boot 3.3 Pods</p>
            <p className="text-[11px] font-mono text-indigo-200">
              {pods.filter((p) => p.name.includes('backend')).length} Replicas (HPA 2-10)
            </p>
            <div className="text-[10px] text-emerald-400">Liveness / Readiness Probes</div>
          </div>

          <div className="hidden md:flex justify-center text-slate-600">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Node 4: AWS RDS MySQL */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Data Tier</span>
            <p className="text-xs font-bold text-white">AWS RDS MySQL 8.0</p>
            <p className="text-[11px] font-mono text-amber-300">Multi-AZ Encrypted</p>
            <div className="text-[10px] text-emerald-400">HikariCP Pool 20 Conns</div>
          </div>
        </div>
      </div>

      {/* Interactive HPA Load Generator */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Horizontal Pod Autoscaler (HPA) Simulator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate high request traffic to test auto-scaling. When average CPU exceeds <strong className="text-white">70%</strong>, Kubernetes HPA provisions extra backend pods!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-white bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
              Synthetic CPU: <span className={syntheticLoad >= 70 ? 'text-rose-400' : 'text-emerald-400'}>{syntheticLoad}%</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-1">
          <span className="text-xs text-slate-400">Low (20%)</span>
          <input
            type="range"
            min="20"
            max="95"
            value={syntheticLoad}
            onChange={(e) => setSyntheticLoad(parseInt(e.target.value))}
            className="flex-1 accent-indigo-500 cursor-pointer"
          />
          <span className="text-xs text-slate-400">High Load (95%)</span>
        </div>

        {syntheticLoad >= 70 && (
          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-700/60 text-amber-200 text-xs flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>
              <strong>HPA Triggered!</strong> Cluster CPU at {syntheticLoad}% (threshold 70%). Kubernetes has automatically scaled Spring Boot backend replicas up to handle traffic spike.
            </span>
          </div>
        )}
      </div>

      {/* Kubernetes Pods Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-lg">
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Kubernetes Pods in Namespace <code className="text-indigo-300 font-mono">production</code>
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {pods.filter((p) => p.status === 'Running').length}/{pods.length} Running
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Pod Name</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold text-center">Ready</th>
                <th className="py-2.5 px-4 font-semibold text-center">Restarts</th>
                <th className="py-2.5 px-4 font-semibold">EC2 Node</th>
                <th className="py-2.5 px-4 font-semibold">CPU Usage</th>
                <th className="py-2.5 px-4 font-semibold">Memory</th>
                <th className="py-2.5 px-4 font-semibold">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {pods.map((pod) => (
                <tr
                  key={pod.id}
                  onClick={() => setActiveLogPod(pod.name)}
                  className={`hover:bg-slate-850 transition-colors cursor-pointer ${
                    activeLogPod === pod.name ? 'bg-indigo-950/30' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 font-semibold text-slate-200 flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        pod.status === 'Running' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                      }`}
                    />
                    <span className="truncate max-w-[240px]">{pod.name}</span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pod.status === 'Running'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {pod.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center text-slate-300">{pod.ready}</td>
                  <td className="py-2.5 px-4 text-center text-slate-400">{pod.restarts}</td>
                  <td className="py-2.5 px-4 text-slate-400">{pod.node}</td>
                  <td className="py-2.5 px-4 text-sky-400">{pod.cpuUsage}</td>
                  <td className="py-2.5 px-4 text-slate-300">{pod.memoryUsage}</td>
                  <td className="py-2.5 px-4 text-slate-400">{pod.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pod Live Logs Stream */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">Live Pod Logs</span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-indigo-300 truncate max-w-[300px]">{activeLogPod}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Streaming stdout/stderr
          </span>
        </div>

        <div className="p-4 font-mono text-xs text-slate-300 space-y-1 max-h-[220px] overflow-y-auto scrollbar-thin">
          {sampleLogs.map((log, idx) => (
            <div key={idx} className="leading-relaxed text-[11px]">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
