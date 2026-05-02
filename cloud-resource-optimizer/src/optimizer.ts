export interface Task {
  id: string;
  name: string;
  cpu: number;
  ram: number;
  revenue: number;
  priority: number;
}

export interface OptimizationResult {
  maxValue: number;
  selectedTaskIds: Set<string>;
  usedCpu: number;
  usedRam: number;
  timeMs: number;
}

export function solveMultiKnapsack(tasks: Task[], maxCpu: number, maxRam: number): OptimizationResult {
  const start = performance.now();
  const n = tasks.length;
  
  // Create typed arrays for performance
  // dp stores the max value for a given (c, r)
  const dp = Array.from({ length: maxCpu + 1 }, () => new Float64Array(maxRam + 1));
  
  // keep tracks which items were selected to reach max value at (c, r)
  const keep = Array.from({ length: n + 1 }, () =>
    Array.from({ length: maxCpu + 1 }, () => new Uint8Array(maxRam + 1))
  );

  for (let i = 1; i <= n; i++) {
    const task = tasks[i - 1];
    const weightCpu = Math.floor(task.cpu);
    const weightRam = Math.floor(task.ram);
    const value = task.revenue * task.priority;

    for (let c = maxCpu; c >= 0; c--) {
      for (let r = maxRam; r >= 0; r--) {
        if (c >= weightCpu && r >= weightRam) {
          const valueIfIncluded = dp[c - weightCpu][r - weightRam] + value;
          if (valueIfIncluded > dp[c][r]) {
            dp[c][r] = valueIfIncluded;
            keep[i][c][r] = 1;
          } else {
            keep[i][c][r] = 0;
          }
        } else {
          keep[i][c][r] = 0;
        }
      }
    }
  }

  // Reconstruct the optimal solution
  let currCpu = maxCpu;
  let currRam = maxRam;
  const selectedTaskIds = new Set<string>();
  let usedCpu = 0;
  let usedRam = 0;

  for (let i = n; i >= 1; i--) {
    if (keep[i][currCpu][currRam] === 1) {
      const task = tasks[i - 1];
      selectedTaskIds.add(task.id);
      usedCpu += Math.floor(task.cpu);
      usedRam += Math.floor(task.ram);
      currCpu -= Math.floor(task.cpu);
      currRam -= Math.floor(task.ram);
    }
  }

  const end = performance.now();

  return {
    maxValue: dp[maxCpu][maxRam],
    selectedTaskIds,
    usedCpu,
    usedRam,
    timeMs: end - start
  };
}
