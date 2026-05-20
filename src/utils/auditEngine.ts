export interface ToolInput {
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditResult {
  toolName: string;
  currentSpend: number;
  recommendedSpend: number;
  savings: number;
  reason: string;
}

export function calculateAudit(
  toolName: string,
  input: ToolInput,
  teamSize: number
): AuditResult {
  const current = input.monthlySpend;
  let recommended = current;
  let reason = "Your current plan tier is completely optimized for your team scale.";

  switch (toolName.toLowerCase()) {
    case 'claude':
      if (input.plan.toLowerCase() === 'team' && teamSize < 5) {
        recommended = teamSize * 20;
        reason = `You are on a Team plan with only ${teamSize} users. Downgrading to individual Pro tiers saves $5/seat without losing core feature access.`;
      }
      break;

    case 'chatgpt':
      if (input.plan.toLowerCase() === 'team' && teamSize < 2) {
        recommended = teamSize * 20;
        reason = "Single-user workspaces do not utilize Team shared primitives. Reverting to ChatGPT Plus saves $10 monthly.";
      }
      break;

    case 'cursor':
      if (input.plan.toLowerCase() === 'business' && input.seats <= 2) {
        recommended = input.seats * 20;
        reason = "Small engineering cohorts under 3 seats rarely require centralized SAML or audit logs. Shifting to Pro retains full context models.";
      }
      break;
  }

  return {
    toolName,
    currentSpend: current,
    recommendedSpend: recommended,
    savings: Math.max(0, current - recommended),
    reason
  };
}
