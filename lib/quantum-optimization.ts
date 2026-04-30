/**
 * Quantum-Inspired Budget Optimizer
 * Uses simulated annealing (mimics quantum annealing)
 * MIT License - Free for all uses
 */

interface Creator {
  id: string;
  name: string;
  costPerPost: number;
  expectedEngagement: number; // per ₹1000 spent
}

interface Allocation {
  creatorId: string;
  budget: number;
  expectedEngagement: number;
}

export function optimizeBudget(
  creators: Creator[],
  totalBudget: number,
  iterations: number = 10000
): Allocation[] {
  // Start with random allocation
  let currentAllocation = randomAllocation(creators, totalBudget);
  let currentScore = calculateScore(currentAllocation, creators);
  
  let bestAllocation = [...currentAllocation];
  let bestScore = currentScore;
  
  let temperature = 1000; // Initial "temperature"
  const coolingRate = 0.995;
  
  for (let i = 0; i < iterations; i++) {
    // Generate neighbor (small change to allocation)
    const neighbor = generateNeighbor(currentAllocation, totalBudget);
    const neighborScore = calculateScore(neighbor, creators);
    
    // Quantum-inspired acceptance probability
    const delta = neighborScore - currentScore;
    const acceptanceProbability = Math.exp(delta / temperature);
    
    if (delta > 0 || Math.random() < acceptanceProbability) {
      currentAllocation = neighbor;
      currentScore = neighborScore;
    }
    
    // Update best
    if (currentScore > bestScore) {
      bestAllocation = [...currentAllocation];
      bestScore = currentScore;
    }
    
    // Cool down
    temperature *= coolingRate;
  }
  
  return bestAllocation.map(a => {
    const creator = creators.find(c => c.id === a.creatorId)!;
    return {
      creatorId: a.creatorId,
      creatorName: creator.name,
      budget: a.budget,
      expectedEngagement: (a.budget / 1000) * creator.expectedEngagement,
    };
  });
}

function randomAllocation(creators: Creator[], totalBudget: number): { creatorId: string; budget: number }[] {
  const allocation = creators.map(c => ({ creatorId: c.id, budget: 0 }));
  let remaining = totalBudget;
  
  while (remaining > 0) {
    const idx = Math.floor(Math.random() * creators.length);
    const amount = Math.min(remaining, 1000); // ₹1000 increments
    allocation[idx].budget += amount;
    remaining -= amount;
  }
  
  return allocation;
}

function generateNeighbor(
  allocation: { creatorId: string; budget: number }[],
  totalBudget: number
): { creatorId: string; budget: number }[] {
  const neighbor = allocation.map(a => ({ ...a }));
  
  // Transfer budget from one creator to another
  const fromIdx = Math.floor(Math.random() * neighbor.length);
  const toIdx = Math.floor(Math.random() * neighbor.length);
  
  if (fromIdx !== toIdx && neighbor[fromIdx].budget >= 1000) {
    const transfer = 1000;
    neighbor[fromIdx].budget -= transfer;
    neighbor[toIdx].budget += transfer;
  }
  
  return neighbor;
}

function calculateScore(
  allocation: { creatorId: string; budget: number }[],
  creators: Creator[]
): number {
  // Score = total expected engagement
  return allocation.reduce((sum, a) => {
    const creator = creators.find(c => c.id === a.creatorId);
    if (!creator) return sum;
    return sum + (a.budget / 1000) * creator.expectedEngagement;
  }, 0);
}

export function optimizePortfolio(
  campaigns: { id: string; budget: number; expectedROI: number }[],
  riskTolerance: number = 0.5
): { campaignId: string; allocation: number }[] {
  // Simplified Markowitz portfolio optimization
  // Higher ROI = higher allocation, adjusted by risk tolerance
  
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalROI = campaigns.reduce((sum, c) => sum + c.expectedROI, 0);
  
  return campaigns.map(c => ({
    campaignId: c.id,
    allocation: (c.expectedROI / totalROI) * totalBudget * (1 + riskTolerance),
  }));
}
