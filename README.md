# ☁️ Cloud Resource Allocation Optimizer

A simulation system that models how modern cloud platforms allocate limited compute resources using **0/1 Knapsack (Dynamic Programming)** to achieve optimal workload selection.

---

## 🚀 Overview

Cloud systems operate under strict resource constraints (CPU, memory, etc.) while handling multiple incoming workloads. This project demonstrates how to **select the most valuable subset of tasks** without exceeding available capacity.

The system compares:
- ✅ **Dynamic Programming (Optimal Solution)**
- ⚠️ **Greedy Approach (Approximation)**

---

## 🎯 Problem Statement

Given:
- A fixed CPU capacity (server limit)
- A set of tasks, each with:
  - CPU requirement (weight)
  - Value (profit/priority)

Goal:
> Maximize total value without exceeding CPU capacity.

This is modeled as a **0/1 Knapsack Problem**.

---

## 🧠 Key Concepts

- Dynamic Programming (DP)
- Greedy Algorithms
- Optimization under constraints
- Algorithm comparison (optimal vs approximate)

---

## ⚙️ How It Works

### 1. Input
User provides:
- CPU capacity
- List of tasks (CPU, value)

---

### 2. Dynamic Programming (Optimal)

We compute a DP table:

dp[i][w] = max(
  dp[i-1][w],
  value[i] + dp[i-1][w - cpu[i]]
)

Result:
- Maximum achievable value
- Exact set of selected tasks

---

### 3. Greedy Approximation

- Sort tasks by value/cpu ratio
- Select while capacity allows

Result:
- Faster but not always optimal

---

### 4. Comparison

The system displays:
- DP result (optimal)
- Greedy result
- Difference in output

---

## 🖥️ Features

- 📥 Add/remove tasks dynamically
- ⚙️ Adjustable CPU capacity
- 📊 Optimal allocation using DP
- ⚡ Greedy comparison
- 📈 Visual result breakdown
- 🎯 Clean dashboard UI

---

## 🧱 Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Vercel (deployment)

---

## 📊 Complexity Analysis

| Algorithm | Time Complexity | Space Complexity |
|----------|---------------|-----------------|
| DP
