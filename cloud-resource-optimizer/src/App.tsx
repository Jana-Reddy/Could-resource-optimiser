import React, { useState, useMemo, useEffect } from 'react';
import { Server, Cpu, HardDrive, Plus, Trash2, Play, CheckCircle2, XCircle, Info, DollarSign, Activity } from 'lucide-react';
import { solveMultiKnapsack, Task, OptimizationResult } from './optimizer';

const INITIAL_TASKS: Task[] = [
  { id: '1', name: 'Web Server A', cpu: 4, ram: 8, revenue: 100, priority: 1 },
  { id: '2', name: 'Database Master', cpu: 16, ram: 32, revenue: 500, priority: 1.5 },
  { id: '3', name: 'DB Replica', cpu: 8, ram: 16, revenue: 200, priority: 1.2 },
  { id: '4', name: 'AI Training Job', cpu: 32, ram: 64, revenue: 1000, priority: 0.8 },
  { id: '5', name: 'Cache Node', cpu: 2, ram: 16, revenue: 150, priority: 1 },
  { id: '6', name: 'Background Worker', cpu: 4, ram: 4, revenue: 50, priority: 0.5 },
  { id: '7', name: 'Search Indexer', cpu: 16, ram: 16, revenue: 300, priority: 1 },
  { id: '8', name: 'Analytics Job', cpu: 12, ram: 32, revenue: 250, priority: 0.9 },
  { id: '9', name: 'Render Worker', cpu: 24, ram: 16, revenue: 400, priority: 1 },
  { id: '10', name: 'Logging Service', cpu: 2, ram: 2, revenue: 30, priority: 1 },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [maxCpu, setMaxCpu] = useState(64);
  const [maxRam, setMaxRam] = useState(128);
  const [result, setResult] = useState<OptimizationResult | null>(null);

  // New task form state
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: '',
    cpu: 4,
    ram: 8,
    revenue: 100,
    priority: 1
  });

  const handleRunOptimization = () => {
    // Ensure limits are integers for array sizes
    const validCpu = Math.max(1, Math.floor(maxCpu));
    const validRam = Math.max(1, Math.floor(maxRam));
    
    // Prevent huge arrays from crashing the browser (e.g. limiting to 1000)
    const safeCpu = Math.min(validCpu, 2000);
    const safeRam = Math.min(validRam, 2000);
    
    if (safeCpu !== maxCpu) setMaxCpu(safeCpu);
    if (safeRam !== maxRam) setMaxRam(safeRam);

    const res = solveMultiKnapsack(tasks, safeCpu, safeRam);
    setResult(res);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.name) return;
    
    const task: Task = {
      id: Math.random().toString(36).substring(7),
      name: newTask.name,
      cpu: Math.max(1, Number(newTask.cpu) || 1),
      ram: Math.max(1, Number(newTask.ram) || 1),
      revenue: Math.max(0, Number(newTask.revenue) || 0),
      priority: Math.max(0.1, Number(newTask.priority) || 1),
    };
    
    setTasks([...tasks, task]);
    setNewTask({ name: '', cpu: 4, ram: 8, revenue: 100, priority: 1 });
    setResult(null); // Clear previous result
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-300 font-sans p-8 flex flex-col">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
            CLOUDOPS <span className="text-slate-500 font-light">OPTIMIZER v4.2</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Multi-Dimensional Knapsack DP Solver</p>
        </div>
        <div className="flex gap-6 items-center">
          {result && (
            <>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Max Value Yield</p>
                <p className="text-xl font-mono text-emerald-400 font-bold">${result.maxValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="w-[1px] bg-slate-800 h-10"></div>
            </>
          )}
          <button
            onClick={handleRunOptimization}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-5 py-2 rounded font-medium transition-colors shadow-sm text-sm tracking-wide"
          >
            <Play className="w-4 h-4 fill-current text-cyan-500" />
            Run Optimization
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        
        {/* LEFT COLUMN: Input Configuration & Task Pool */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          <section className="bg-[#151921] border border-slate-800 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 uppercase tracking-tight">
              <Activity className="w-4 h-4 text-cyan-500" />
              Global Capacity Cluster
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Max CPU Cores</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Cpu className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="number"
                    value={maxCpu}
                    onChange={(e) => { setMaxCpu(e.target.valueAsNumber); setResult(null); }}
                    className="pl-10 w-full bg-slate-900/50 text-white border border-slate-800 rounded py-2 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Max RAM (GB)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HardDrive className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="number"
                    value={maxRam}
                    onChange={(e) => { setMaxRam(e.target.valueAsNumber); setResult(null); }}
                    className="pl-10 w-full bg-slate-900/50 text-white border border-slate-800 rounded py-2 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#151921] border border-slate-800 rounded-xl p-5 flex-grow flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2 uppercase tracking-tight">
                <Server className="w-4 h-4 text-cyan-500" />
                PENDING TASK QUEUE
              </h2>
              <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded text-slate-400 uppercase tracking-widest">
                {tasks.length} TASKS IN BUFFER
              </span>
            </div>

            <form onSubmit={handleAddTask} className="grid grid-cols-12 gap-3 mb-6 bg-slate-900/50 p-4 rounded border border-slate-800">
              <div className="col-span-12 sm:col-span-3">
                <input
                  type="text"
                  placeholder="Task Name"
                  required
                  value={newTask.name}
                  onChange={e => setNewTask({...newTask, name: e.target.value})}
                  className="w-full text-xs bg-[#0B0E14] text-white border border-slate-800 rounded py-1.5 px-3 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <input
                  type="number"
                  placeholder="CPU"
                  min="1"
                  required
                  value={newTask.cpu}
                  onChange={e => setNewTask({...newTask, cpu: e.target.valueAsNumber})}
                  className="w-full text-xs font-mono bg-[#0B0E14] text-white border border-slate-800 rounded py-1.5 px-3 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <input
                  type="number"
                  placeholder="RAM"
                  min="1"
                  required
                  value={newTask.ram}
                  onChange={e => setNewTask({...newTask, ram: e.target.valueAsNumber})}
                  className="w-full text-xs font-mono bg-[#0B0E14] text-white border border-slate-800 rounded py-1.5 px-3 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <input
                  type="number"
                  placeholder="Revenue"
                  min="0"
                  required
                  value={newTask.revenue}
                  onChange={e => setNewTask({...newTask, revenue: e.target.valueAsNumber})}
                  className="w-full text-xs font-mono bg-[#0B0E14] text-white border border-slate-800 rounded py-1.5 px-3 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <input
                  type="number"
                  placeholder="Priority"
                  step="0.1"
                  min="0.1"
                  required
                  value={newTask.priority}
                  onChange={e => setNewTask({...newTask, priority: e.target.valueAsNumber})}
                  className="w-full text-xs font-mono bg-[#0B0E14] text-white border border-slate-800 rounded py-1.5 px-3 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div className="col-span-12 sm:col-span-1">
                <button type="submit" className="w-full flex items-center justify-center bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded py-1.5 hover:bg-cyan-600/40 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800 uppercase tracking-tighter">
                    <th className="pb-2 font-medium">Task Name</th>
                    <th className="pb-2 font-medium text-right">CPU</th>
                    <th className="pb-2 font-medium text-right">RAM</th>
                    <th className="pb-2 font-medium text-right">Revenue</th>
                    <th className="pb-2 font-medium text-right text-slate-600">Value(p)</th>
                    <th className="pb-2 font-medium text-right">Status</th>
                    <th className="pb-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[11px]">
                  {tasks.map((task, idx) => {
                    const value = task.revenue * task.priority;
                    const isSelected = result?.selectedTaskIds.has(task.id);
                    
                    return (
                      <tr 
                        key={task.id} 
                        className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${result ? (isSelected ? 'bg-emerald-900/10' : 'opacity-40') : idx % 2 === 1 ? 'bg-slate-800/20' : ''}`}
                      >
                        <td className="py-3 text-cyan-500 flex items-center gap-2">
                          {result && (
                            isSelected ? 
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)] flex-shrink-0"></span> : 
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 flex-shrink-0"></span>
                          )}
                          <span className="font-sans font-medium">{task.name}</span>
                        </td>
                        <td className="py-3 text-right text-slate-300">{task.cpu}</td>
                        <td className="py-3 text-right text-slate-300">{task.ram}</td>
                        <td className="py-3 text-right text-white">${task.revenue}</td>
                        <td className="py-3 text-right text-slate-500">{value.toFixed(0)}</td>
                        <td className="py-3 text-right">
                          {result ? (
                             isSelected ? 
                               <span className="text-emerald-500 italic">Allocated</span> :
                               <span className="text-slate-500 italic">Deferred</span>
                          ) : (
                             <span className="text-amber-500">Pending</span>
                          )}
                        </td>
                        <td className="py-3 text-right pl-2">
                          <button 
                            onClick={() => removeTask(task.id)}
                            className="text-slate-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-600 font-sans">
                        No tasks added yet. Add some tasks above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {!result && tasks.length > 0 && (
                <div className="mt-6 p-4 rounded bg-cyan-500/5 border border-cyan-500/20">
                  <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold mb-2">DP Solver Logic</p>
                  <p className="text-xs text-slate-400 leading-relaxed font-serif italic">
                    "Evaluating permutations for multi-dimensional capacity constraints (CPU + RAM). Optimization target: Maximum Revenue Density per Unit Core."
                  </p>
                </div>
            )}
          </section>

        </div>

        {/* RIGHT COLUMN: Results & Visualization */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Server / Cluster Status */}
          <div className="bg-[#151921] border border-slate-800 rounded-xl p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white text-sm font-bold tracking-tight uppercase">SERVER CLUSTER: ALPHA-01</h3>
                <p className="text-[10px] text-slate-500 uppercase mt-0.5">Datacenter: US-EAST-1</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-emerald-500 animate-pulse">ACTIVE</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] mb-1 uppercase tracking-tighter">
                  <span className="text-slate-400">CPU Capacity (vCPUs)</span>
                  <span className="text-white">{result ? result.usedCpu : 0} / {maxCpu}</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)] transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min(100, (result ? (result.usedCpu / maxCpu) * 100 : 0))}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1 uppercase tracking-tighter">
                  <span className="text-slate-400">RAM Utilization (GiB)</span>
                  <span className="text-white">{result ? result.usedRam : 0} / {maxRam}</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)] transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min(100, (result ? (result.usedRam / maxRam) * 100 : 0))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {!result ? (
            <div className="flex-grow flex flex-col items-center justify-center p-8 border border-slate-800 border-dashed rounded-xl bg-slate-900/20 text-center">
              <Activity className="w-8 h-8 text-slate-700 mb-3" />
              <p className="text-slate-400 text-sm mb-1 uppercase tracking-widest text-[10px] font-bold">Awaiting Execution</p>
              <p className="text-slate-600 text-xs max-w-xs">Run optimizer to calculate optimal multi-dimensional knapsack allocation.</p>
            </div>
          ) : (
            <div className="bg-[#151921] border border-slate-800 rounded-xl p-5 flex-grow animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-tight">Optimization Analytics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase mb-1 tracking-wider">Global Optimum</p>
                  <p className="text-lg font-mono text-emerald-400">REACHED</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase mb-1 tracking-wider">Calc Time</p>
                  <p className="text-lg font-mono text-cyan-400">{result.timeMs.toFixed(1)}ms</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase mb-1 tracking-wider">Tasks Selected</p>
                  <p className="text-lg font-mono text-white">{result.selectedTaskIds.size} <span className="text-sm text-slate-600">/ {tasks.length}</span></p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase mb-1 tracking-wider">State Space</p>
                  <p className="text-lg font-mono text-slate-400">{(maxCpu * maxRam * tasks.length / 1000).toFixed(0)}k</p>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                 <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Solver Configuration</p>
                 <div className="bg-slate-900/50 rounded border border-slate-800 p-3 text-xs font-mono text-slate-400 space-y-2">
                    <p><span className="text-emerald-500">✔</span> Objective: MAXIMIZE ∑(Revenue × Priority)</p>
                    <p><span className="text-emerald-500">✔</span> Constraint 1: ∑CPU ≤ {maxCpu}</p>
                    <p><span className="text-emerald-500">✔</span> Constraint 2: ∑RAM ≤ {maxRam}</p>
                    <p><span className="text-cyan-500">ℹ</span> Complexity: O(N × W_cpu × W_ram)</p>
                 </div>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Footer Status Bar */}
      <footer className="mt-8 pt-4 border-t border-slate-800 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">SYSTEMS NOMINAL</span>
          </div>
          <span className="text-slate-800">|</span>
          <span className="text-[10px] text-slate-500 font-mono">MEMORY_STATE: {result ? "OPTIMIZED_ALLOCATION_LOADED" : "AWAITING_INPUT"}</span>
        </div>
        <div className="text-[10px] text-slate-600 flex gap-4">
          <span>ALLOCATION ENGINE: v4.2-STABLE</span>
          <span>&copy; 2026 CLOUDOPS INFRASTRUCTURE</span>
        </div>
      </footer>

    </div>
  );
}
