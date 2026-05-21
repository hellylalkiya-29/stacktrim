'use client';

import { useState, useEffect } from 'react';
import { calculateAudit, AuditResult } from '@/utils/auditEngine';

interface ToolInput {
  plan: string;
  monthlySpend: number;
  seats: number;
}

export default function Home() {
  const [teamSize, setTeamSize] = useState<number>(1);
  const [useCase, setUseCase] = useState<string>('coding');
  const [results, setResults] = useState<AuditResult[]>([]);
  const [hasAudited, setHasAudited] = useState<boolean>(false);

  const [tools, setTools] = useState<{ [key: string]: ToolInput }>({
    chatgpt: { plan: 'Plus', monthlySpend: 20, seats: 1 },
    claude: { plan: 'Pro', monthlySpend: 20, seats: 1 },
    cursor: { plan: 'Pro', monthlySpend: 20, seats: 1 },
  });

  useEffect(() => {
    const savedData = localStorage.getItem('stacktrim_form');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setTeamSize(parsed.teamSize || 1);
      setUseCase(parsed.useCase || 'coding');
      setTools(parsed.tools || {});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('stacktrim_form', JSON.stringify({ teamSize, useCase, tools }));
  }, [teamSize, useCase, tools]);

  const handleToolChange = (tool: string, field: keyof ToolInput, value: any) => {
    setTools((prev) => ({
      ...prev,
      [tool]: { ...prev[tool], [field]: value },
    }));
  };

  const triggerAuditAnalysis = () => {
    const auditOutput: AuditResult[] = [];
    Object.keys(tools).forEach((toolName) => {
      const res = calculateAudit(toolName, tools[toolName], teamSize);
      auditOutput.push(res);
    });
    setResults(auditOutput);
    setHasAudited(true);
  };

  const totalMonthlySavings = results.reduce((acc, curr) => acc + curr.savings, 0);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-6 pt-12">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl mb-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
          StackTrim.ai
        </h1>
        <p className="text-slate-400 mb-8">
          Input your infrastructure sizing models below to evaluate operational SaaS compliance and waste.
        </p>

        {/* Configurations */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Total Workspace Team Size</label>
            <input
              type="number"
              min="1"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Operational Workflow Profile</label>
            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="coding">Software Engineering Matrix</option>
              <option value="writing">Content Generation / Marketing</option>
              <option value="data">Quantitative Data Analytics</option>
            </select>
          </div>
        </div>

        <hr className="border-slate-800 my-6" />

        {/* Subscriptions */}
        <h2 className="text-xl font-bold text-slate-200 mb-4">Target SaaS Subscriptions</h2>
        {['chatgpt', 'claude', 'cursor'].map((tool) => (
          <div key={tool} className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-4 grid grid-cols-3 gap-3 items-center">
            <span className="font-semibold capitalize text-blue-400">{tool}</span>
            <input
              type="text"
              placeholder="Plan Tier (e.g. Team, Business)"
              value={tools[tool]?.plan || ''}
              onChange={(e) => handleToolChange(tool, 'plan', e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Gross Monthly Cost ($)"
              value={tools[tool]?.monthlySpend || ''}
              onChange={(e) => handleToolChange(tool, 'monthlySpend', Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}

        <button
          onClick={triggerAuditAnalysis}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-slate-950 font-extrabold py-3 px-4 rounded-lg transition duration-200 shadow-lg"
        >
          Execute FinOps Audit Report →
        </button>
      </div>

      {/* Audit Output Render Panel */}
      {hasAudited && (
        <div className="max-w-3xl w-full bg-slate-900 border border-emerald-900/40 rounded-xl p-8 shadow-2xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-emerald-400">Audit Analytics Summary</h2>
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full font-mono text-sm font-bold">
              Total Found Savings: ${totalMonthlySavings}/mo
            </div>
          </div>

          <div className="space-y-4">
            {results.map((res) => (
              <div key={res.toolName} className="bg-slate-950 border border-slate-800 p-5 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold capitalize text-lg text-slate-200">{res.toolName} Status</h3>
                  <span className={`text-sm px-2 py-0.5 rounded font-medium ${res.savings > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400'}`}>
                    {res.savings > 0 ? `Leakage Detected: -$${res.savings}` : 'Optimized Plan'}
                  </span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">{res.reason}</p>
                <div className="mt-3 flex gap-6 text-xs font-mono text-slate-500">
                  <div>Current Invoiced Runrate: <span className="text-slate-300">${res.currentSpend}/mo</span></div>
                  <div>Target Strategy Runrate: <span className="text-emerald-400">${res.recommendedSpend}/mo</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
