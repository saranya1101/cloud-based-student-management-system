import React, { useState } from 'react';
import { GitBranch, Play, CheckCircle2, Clock, Terminal, Check, Layers, Cpu, ShieldCheck } from 'lucide-react';

interface PipelineStep {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  duration: string;
  logs: string[];
}

const INITIAL_STEPS: PipelineStep[] = [
  {
    id: 'step-1',
    name: 'Maven Lint & Unit Tests',
    description: 'Runs JUnit 5 test suites and Spring Security RBAC mock tests',
    status: 'success',
    duration: '42s',
    logs: [
      '[INFO] Scanning for projects...',
      '[INFO] ----------------< com.cloudsms:student-management-system >----------------',
      '[INFO] Building cloud-student-management-system 1.0.0',
      '[INFO] --- maven-surefire-plugin:3.2.5:test (default-test) @ student-management-system ---',
      '[INFO] Running com.cloudsms.controller.StudentControllerRbacTest',
      '[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.842 s',
      '[INFO] Running com.cloudsms.service.StudentServiceTest',
      '[INFO] Tests run: 12, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.941 s',
      '[INFO] Results: All 20 tests passed successfully!'
    ]
  },
  {
    id: 'step-2',
    name: 'Spring Boot Executable JAR Packaging',
    description: 'Compiles executable JAR artifact with embedded Tomcat and HikariCP',
    status: 'success',
    duration: '28s',
    logs: [
      '[INFO] --- spring-boot-maven-plugin:3.3.2:repackage (repackage) ---',
      '[INFO] Replacing /workspace/app/target/student-management-system-1.0.0.jar with repackaged fat-jar',
      '[INFO] BUILD SUCCESS - Total time: 01:10 min',
      '[INFO] Produced artifact: target/student-management-system-1.0.0.jar (48.4 MB)'
    ]
  },
  {
    id: 'step-3',
    name: 'Docker Multi-Stage Container Build',
    description: 'Builds hardened Alpine Linux container image with non-root user',
    status: 'success',
    duration: '35s',
    logs: [
      '#1 [internal] load build definition from Dockerfile',
      '#2 [stage-1 1/4] FROM maven:3.9.6-eclipse-temurin-21-alpine',
      '#3 [stage-2 1/3] FROM eclipse-temurin:21-jre-alpine',
      '#4 [stage-2 2/3] RUN addgroup -S smsgroup && adduser -S smsuser -G smsgroup',
      '#5 [stage-2 3/3] COPY --from=builder /workspace/app/target/*.jar app.jar',
      '#6 exporting to image',
      '#6 naming to 123456789012.dkr.ecr.us-east-1.amazonaws.com/cloudsms-backend:sha-9f4a12c',
      '#6 DONE 34.8s'
    ]
  },
  {
    id: 'step-4',
    name: 'Amazon ECR Image Push',
    description: 'Pushes signed container image to AWS Elastic Container Registry',
    status: 'success',
    duration: '18s',
    logs: [
      'Authenticating with AWS ECR us-east-1...',
      'Login Succeeded',
      'The push refers to repository [123456789012.dkr.ecr.us-east-1.amazonaws.com/cloudsms-backend]',
      '9f4a12c: Pushed',
      'latest: Pushed',
      'Digest: sha256:7c8b0a5f6e8d0c2b4a6f8e0d2c4b6a8f0e2d4c6b8a0f2e4d6c8b0a9f4a12ceb'
    ]
  },
  {
    id: 'step-5',
    name: 'Kubernetes EC2 Deployment & Rollout',
    description: 'Applies Kubernetes manifests and validates zero-downtime rolling update',
    status: 'success',
    duration: '22s',
    logs: [
      'Updating kubeconfig for cluster cloudsms-prod-cluster (us-east-1)...',
      'deployment.apps/cloudsms-backend configured',
      'service/cloudsms-service unchanged',
      'horizontalpodautoscaler.autoscaling/cloudsms-hpa configured',
      'Waiting for deployment "cloudsms-backend" rollout to finish: 1 out of 3 new replicas updated...',
      'Waiting for deployment "cloudsms-backend" rollout to finish: 2 out of 3 new replicas updated...',
      'deployment "cloudsms-backend" successfully rolled out to cluster prod-aws-ec2!'
    ]
  }
];

export const CiCdPipeline: React.FC = () => {
  const [steps, setSteps] = useState<PipelineStep[]>(INITIAL_STEPS);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepId, setActiveStepId] = useState<string>('step-1');

  const handleRunWorkflow = () => {
    setIsRunning(true);
    // Reset all steps to idle except first
    setSteps((prev) =>
      prev.map((s, idx) => ({
        ...s,
        status: idx === 0 ? 'running' : 'idle'
      }))
    );

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < INITIAL_STEPS.length) {
        setSteps((prev) =>
          prev.map((s, idx) => {
            if (idx < currentStep) return { ...s, status: 'success' };
            if (idx === currentStep) return { ...s, status: 'running' };
            return { ...s, status: 'idle' };
          })
        );
        setActiveStepId(`step-${currentStep + 1}`);
      } else {
        setSteps((prev) => prev.map((s) => ({ ...s, status: 'success' })));
        setIsRunning(false);
        clearInterval(interval);
      }
    }, 1200);
  };

  const selectedStep = steps.find((s) => s.id === activeStepId) || steps[0];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <GitBranch className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              GitHub Actions CI/CD Pipeline
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Workflow: deploy.yml
              </span>
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Automated continuous integration and delivery pipeline triggered on push to <code className="text-indigo-300 font-mono">main</code> branch.
              Packages the Spring Boot app, runs unit tests, creates multi-stage Docker container image, pushes to AWS ECR, and triggers zero-downtime rolling update on AWS EC2 Kubernetes cluster.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunWorkflow}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md disabled:opacity-50 shrink-0"
        >
          {isRunning ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Pipeline Running...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Trigger Pipeline Run</span>
            </>
          )}
        </button>
      </div>

      {/* Pipeline Stages Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {steps.map((step, idx) => {
          const isSelected = step.id === selectedStep.id;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStepId(step.id)}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">
                    Step 0{idx + 1}
                  </span>
                  {step.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : step.status === 'running' ? (
                    <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2">{step.name}</h4>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="font-mono">{step.duration}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                    step.status === 'success'
                      ? 'bg-emerald-950 text-emerald-300'
                      : step.status === 'running'
                      ? 'bg-indigo-950 text-indigo-300 animate-pulse'
                      : 'bg-slate-950 text-slate-500'
                  }`}
                >
                  {step.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Terminal Log Output for Selected Step */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">{selectedStep.name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 text-[11px]">{selectedStep.description}</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span>Runner: ubuntu-latest</span>
            <span className="text-emerald-400">Exit Code: 0</span>
          </div>
        </div>

        <div className="p-5 font-mono text-xs text-slate-300 space-y-1.5 max-h-[340px] overflow-y-auto scrollbar-thin">
          {selectedStep.logs.map((log, idx) => (
            <div key={idx} className="leading-relaxed">
              <span className="text-slate-600 select-none mr-3">{idx + 1}</span>
              <span
                className={
                  log.includes('SUCCESS') || log.includes('passed')
                    ? 'text-emerald-400 font-bold'
                    : log.includes('Pushed') || log.includes('Digest')
                    ? 'text-sky-300'
                    : log.includes('ERROR') || log.includes('Failures')
                    ? 'text-rose-400'
                    : 'text-slate-300'
                }
              >
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
