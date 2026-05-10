import { Correction, CorrectionType } from '../types';

interface CorrectionRule {
  pattern: RegExp;
  corrected: string;
  type: CorrectionType;
  explanation: string;
}

const correctionRules: CorrectionRule[] = [
  {
    pattern: /\bI am agree\b/gi,
    corrected: 'I agree',
    type: 'grammar',
    explanation: 'When using the verb "agree", you don\'t need "am". Just say "I agree".',
  },
  {
    pattern: /\bI want (a|an|the)\b/gi,
    corrected: 'I would like $1',
    type: 'style',
    explanation: '"I would like" sounds more polite than "I want" in most situations, especially when ordering or making requests.',
  },
  {
    pattern: /\bvery good\b/gi,
    corrected: 'really good or excellent',
    type: 'vocabulary',
    explanation: 'While "very good" is correct, native speakers often use "really good" or "excellent" to sound more natural.',
  },
  {
    pattern: /\byesterday I (go|goes|going|come|comes|coming)\b/gi,
    corrected: 'yesterday I went/came',
    type: 'tense',
    explanation: 'When talking about the past, use the past tense form. "Go" becomes "went", "come" becomes "came".',
  },
  {
    pattern: /\btomorrow I (go|goes|going|come|comes|coming)\b/gi,
    corrected: 'tomorrow I\'m going / I will go',
    type: 'tense',
    explanation: 'For future plans, use "going to" or "will". For example: "I\'m going to go" or "I will go".',
  },
  {
    pattern: /\bI think\s+(?:that\s+)?it('s| is)\s+(?:not|isn'?t)\s+good\b/gi,
    corrected: 'I don\'t think it\'s good / I think it\'s not good',
    type: 'grammar',
    explanation: 'In English, we usually say "I don\'t think it\'s good" rather than "I think it\'s not good".',
  },
  {
    pattern: /\bmore better\b/gi,
    corrected: 'better',
    type: 'grammar',
    explanation: '"More" and "-er" (comparative form) should not be used together. Just say "better".',
  },
  {
    pattern: /\bmore worse\b/gi,
    corrected: 'worse',
    type: 'grammar',
    explanation: '"More" and "-er" should not be combined. Use "worse" instead.',
  },
  {
    pattern: /\bI have (a|some|many)\ questions\b/gi,
    corrected: 'I have a question / I have some questions',
    type: 'grammar',
    explanation: '"Question" is usually singular, but "some questions" is correct for multiple questions.',
  },
  {
    pattern: /\bcan I\b(?=.*\?)/gi,
    corrected: 'Could I',
    type: 'style',
    explanation: '"Could I" sounds more polite and formal than "Can I".',
  },
  {
    pattern: /\bI no have\b/gi,
    corrected: 'I don\'t have',
    type: 'grammar',
    explanation: 'In English, we use "don\'t/doesn\'t" for negation. Say "I don\'t have" instead of "I no have".',
  },
  {
    pattern: /\bShe go\b/gi,
    corrected: 'She goes',
    type: 'grammar',
    explanation: 'With "she/he/it" (third person singular), add "s" or "es" to the verb.',
  },
  {
    pattern: /\bHe are\b/gi,
    corrected: 'He is',
    type: 'grammar',
    explanation: '"He" takes "is", not "are". "I am", "you are", "he/she/it is".',
  },
  {
    pattern: /\bmy friend (say|says)\s+(?:that\s+)?I\b/gi,
    corrected: 'my friend says I...',
    type: 'tense',
    explanation: 'When reporting what someone says, use "says" (not "say") in present tense.',
  },
  {
    pattern: /\bI am boring\b/gi,
    corrected: 'I am bored',
    type: 'vocabulary',
    explanation: '"Boring" describes something that makes you bored. "Bored" describes how you feel.',
  },
];

export const checkForCorrections = (text: string): Correction | null => {
  for (const rule of correctionRules) {
    const match = text.match(rule.pattern);
    if (match) {
      const correctedText = text.replace(rule.pattern, rule.corrected);
      return {
        original: match[0],
        corrected: correctedText,
        type: rule.type,
        explanation: rule.explanation,
      };
    }
  }
  return null;
};

export const getEncouragement = (): string => {
  const phrases = [
    'Great job! Your English is improving!',
    'Excellent! You\'re doing wonderfully!',
    'Perfect! That\'s exactly right!',
    'Wonderful! Keep up the good work!',
    'Amazing! You\'re a natural!',
    'Fantastic! Your pronunciation is getting better!',
    'Brilliant! That was well said!',
    'Superb! You\'re making great progress!',
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
};

export const generateSuggestions = (errorStats: Record<CorrectionType, number>): string[] => {
  const suggestions: string[] = [];
  
  const entries = Object.entries(errorStats) as [CorrectionType, number][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  
  if (sorted[0] && sorted[0][1] > 0) {
    const [type, count] = sorted[0];
    switch (type) {
      case 'grammar':
        suggestions.push(`You had ${count} grammar issue(s) today. Focus on verb conjugations and sentence structure.`);
        break;
      case 'vocabulary':
        suggestions.push(`You had ${count} vocabulary improvement(s) to make. Try learning more common phrases.`);
        break;
      case 'tense':
        suggestions.push(`You had ${count} tense error(s). Practice using past, present, and future tenses correctly.`);
        break;
      case 'style':
        suggestions.push(`You had ${count} style note(s). Try using more polite or natural expressions.`);
        break;
      case 'pronunciation':
        suggestions.push(`You had ${count} pronunciation note(s). Practice speaking slowly and clearly.`);
        break;
    }
  }
  
  if (sorted[1] && sorted[1][1] > 2) {
    const [type, count] = sorted[1];
    suggestions.push(`Also watch out for ${type} issues (${count} times today).`);
  }
  
  return suggestions;
};
