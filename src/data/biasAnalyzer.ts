export interface BiasAuditResult {
  status: 'neutral' | 'warning' | 'biased';
  score: number;
  category: string;
  matchedPhrase?: string;
  explanation: string;
  suggestion?: string;
}

interface BiasRule {
  pattern: RegExp;
  category: string;
  severity: 'warning' | 'biased';
  penalty: number;
  explanation: string;
  rewrite: (original: string) => string;
}

const BIAS_RULES: BiasRule[] = [
  {
    pattern: /\b(how much (did|do) you (enjoy|love|like)|enjoyed|loved)\b/i,
    category: 'Positive Framing Bias',
    severity: 'biased',
    penalty: 58,
    explanation:
      'Presupposes a positive emotional outcome and nudges participants to validate the design instead of reporting friction.',
    rewrite: () => 'Walk me through your experience completing this flow from start to finish.',
  },
  {
    pattern: /\b(frustrating|annoying|confusing|broken|hard to use|difficult)\b/i,
    category: 'Negative Priming',
    severity: 'biased',
    penalty: 46,
    explanation:
      'Introduces negative emotional vocabulary before the participant has framed the moment in their own words.',
    rewrite: () => 'What stood out to you while navigating that step, and what did you expect to happen?',
  },
  {
    pattern: /\b(easy|simple|intuitive|clean|fast|seamless|helpful)\b/i,
    category: 'Leading Adjective',
    severity: 'warning',
    penalty: 32,
    explanation:
      'Evaluative adjectives anchor the participant toward agreeing with your internal team vocabulary.',
    rewrite: () => 'How would you describe the process of finding and using this feature?',
  },
  {
    pattern: /\b(would you use|would you buy|would you pay|do you think you would)\b/i,
    category: 'Hypothetical Intent Bias',
    severity: 'warning',
    penalty: 36,
    explanation:
      'Participants reliably overestimate future behavior. Anchor questions in recent past behavior instead.',
    rewrite: () => 'Tell me about the last time you solved this problem. What tools or workarounds did you use?',
  },
  {
    pattern: /\b(don't you think|wouldn't you agree|isn't it better|obviously)\b/i,
    category: 'Confirmation Prompt',
    severity: 'biased',
    penalty: 64,
    explanation:
      'Directly solicits agreement with the moderator’s hypothesis, invalidating qualitative independence.',
    rewrite: () => 'How does this compare to the workflow you currently rely on?',
  },
  {
    pattern: /\b(best|worst|favorite|always|never)\b/i,
    category: 'Extreme Quantifier',
    severity: 'warning',
    penalty: 24,
    explanation:
      'Absolute phrasing pushes participants toward binary answers rather than nuanced situational recall.',
    rewrite: () => 'Which part of this workflow worked well for you, and where did you hesitate?',
  },
];

export function auditResearchQuestion(input: string): BiasAuditResult {
  const trimmed = input.trim();
  if (trimmed.length < 8) {
    return {
      status: 'neutral',
      score: 100,
      category: 'Awaiting Input',
      explanation: 'Enter a full research question to check for leading phrasing, priming, or hypothetical bias.',
    };
  }

  for (const rule of BIAS_RULES) {
    const match = trimmed.match(rule.pattern);
    if (match) {
      return {
        status: rule.severity,
        score: Math.max(18, 100 - rule.penalty),
        category: rule.category,
        matchedPhrase: match[0],
        explanation: rule.explanation,
        suggestion: rule.rewrite(trimmed),
      };
    }
  }

  // Check for closed yes/no opener
  if (/^(do|did|is|are|was|were|can|could)\s+you\b/i.test(trimmed)) {
    return {
      status: 'warning',
      score: 74,
      category: 'Closed Yes/No Framing',
      matchedPhrase: trimmed.split(' ').slice(0, 2).join(' '),
      explanation:
        'Closed questions invite one-word answers. Open with "How", "What", or "Walk me through" to uncover behavioral context.',
      suggestion: `Walk me through what happened when you tried to ${trimmed
        .replace(/^(do|did|is|are|was|were|can|could)\s+you\s+/i, '')
        .replace(/\?$/, '')}.`,
    };
  }

  return {
    status: 'neutral',
    score: 96,
    category: 'Neutral & Open-Ended',
    explanation:
      'No leading language, emotional priming, or hypothetical framing detected. Ready for participant sessions.',
  };
}
