'use client';

import { useState, useEffect } from 'react';

interface ToolInput {
  plan: string;
  monthlySpend: number;
  seats: number;
}

export default function Home() {
  const [teamSize, setTeamSize] = useState<number>(1);
  const [useCase, setUseCase] = useState<string>('coding');
  
  // State for tracked tools
  const [tools, setTools] = useState<{ [key: string]: ToolInput }>({
    chatgpt: { plan: 'Plus', monthlySpend: 20, seats: 1 },
    claude: { plan: 'Pro', monthlySpend: 20, seats: 1 },
    cursor: { plan: 'Pro', monthlySpend: 20, seats: 1 },
  });

  // Step 2 Action: Load state from LocalStorage on page load
  useEffect(() => {
    const savedData = localStorage.getItem('stacktrim_form');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setTeamSize(parsed.teamSize || 1);
      setUseCase(parsed.useCase || 'coding');
      setTools(parsed.tools || {});
    }
  }, []);

  // Save state to LocalStorage automatically whenever values change
  useEffect(() => {
    localStorage.setItem('stacktrim_form', JSON.stringify({ teamSize, useCase, tools }));
  }, [teamSize, useCase, tools]);

  const handleToolChange = (tool: string, field: keyof ToolInput, value: any) => {
    setTools((prev) => ({
      ...prev,
      [tool]: {
        ...prev[tool],
        [field]: value,
      },
    }));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
          StackTrim.ai
        </h1>
        <p className="text-slate-400 mb-8">
          Input your software parameters below to generate an instantaneous financial optimization audit.
        </p>

        {/* Core Configurations */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Total Team Size</label>
            <input
              type="number"
              min="1"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Primary Use Case</label>
            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="coding">Software Engineering</option>
              <option value="writing">Content / Copywriting</option>
              <option value="data">Data Analysis</option>
              <option value="mixed">General Purpose / Mixed</option>
            </select>
          </div>
        </div>

        <hr className="border-slate-800 my-6" />

        {/* AI Tools Inputs */}
        <h2 className="text-xl font-bold text-slate-200 mb-4">Tracked AI Subscriptions</h2>
        
        {['chatgpt', 'claude', 'cursor'].map((tool) => (
          <div key={tool} className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-4 grid grid-cols-3 gap-3 items-center">
            <span className="font-semibold capitalize text-blue-400">{tool}</span>
            
            <input
              type="text"
              placeholder="Plan (e.g. Pro, Team)"
              value={tools[tool]?.plan || ''}
              onChange={(e) => handleToolChange(tool, 'plan', e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />

            <input
              type="number"
              placeholder="Monthly Spend ($)"
              value={tools[tool]?.monthlySpend || ''}
              onChange={(e) => handleToolChange(tool, 'monthlySpend', Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}

        <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-slate-950 font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg">
          Run Spend Audit →
        </button>
      </div>
    </main>
  );
}