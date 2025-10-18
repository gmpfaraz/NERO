import type { EntryType } from '../types';

export interface SearchPattern {
  type: 'wildcard' | 'command' | 'exact';
  pattern: string;
  command?: string;
  value?: string;
}

// Parse search query into pattern
export const parseSearchPattern = (query: string): SearchPattern => {
  const trimmed = query.trim().toLowerCase();
  
  // Check for command-based search
  if (trimmed.includes(':')) {
    const [command, value] = trimmed.split(':');
    return {
      type: 'command',
      pattern: trimmed,
      command: command.trim(),
      value: value?.trim() || '',
    };
  }
  
  // Check for wildcard
  if (trimmed.includes('*')) {
    return {
      type: 'wildcard',
      pattern: trimmed,
    };
  }
  
  // Exact match
  return {
    type: 'exact',
    pattern: trimmed,
  };
};

// Match number against pattern
export const matchesPattern = (
  number: string,
  pattern: SearchPattern
): boolean => {
  const num = number.toLowerCase();
  
  switch (pattern.type) {
    case 'exact':
      return num.includes(pattern.pattern);
      
    case 'wildcard':
      return matchesWildcard(num, pattern.pattern);
      
    case 'command':
      return matchesCommand(num, pattern.command!, pattern.value!);
      
    default:
      return false;
  }
};

// Wildcard matching
const matchesWildcard = (number: string, pattern: string): boolean => {
  // Convert wildcard pattern to regex
  const regexPattern = '^' + pattern
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.') + '$';
  
  const regex = new RegExp(regexPattern);
  return regex.test(number);
};

// Command-based matching
const matchesCommand = (number: string, command: string, value: string): boolean => {
  switch (command) {
    case 'starts':
    case 'start':
    case 'begins':
    case 'begin':
      return number.startsWith(value);
      
    case 'ends':
    case 'end':
      return number.endsWith(value);
      
    case 'middle':
    case 'mid':
    case 'contains':
      // For middle, check if value is in the middle (not at start or end)
      if (command === 'middle' || command === 'mid') {
        const index = number.indexOf(value);
        return index > 0 && index < number.length - value.length;
      }
      return number.includes(value);
      
    case 'equals':
    case 'equal':
    case 'is':
      return number === value;
      
    case 'length':
    case 'len':
      return number.length === parseInt(value);
      
    case 'greater':
    case 'gt':
      return parseInt(number) > parseInt(value);
      
    case 'less':
    case 'lt':
      return parseInt(number) < parseInt(value);
      
    case 'between':
      // Format: between:10-20
      if (value.includes('-')) {
        const [min, max] = value.split('-').map(v => parseInt(v));
        const num = parseInt(number);
        return num >= min && num <= max;
      }
      return false;
      
    case 'even':
      return parseInt(number) % 2 === 0;
      
    case 'odd':
      return parseInt(number) % 2 !== 0;
      
    case 'sum':
      // Sum of digits equals value
      const sum = number.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
      return sum === parseInt(value);
      
    default:
      return false;
  }
};

// Get all numbers matching pattern
export const filterNumbersByPattern = (
  numbers: string[],
  query: string,
  _entryType?: EntryType // Reserved for future use
): string[] => {
  if (!query.trim()) return numbers;
  
  const pattern = parseSearchPattern(query);
  return numbers.filter(num => matchesPattern(num, pattern));
};

// Get pattern suggestions
export const getPatternSuggestions = (): string[] => {
  return [
    '* - All numbers',
    '1* - Starts with 1',
    '*5 - Ends with 5',
    '*3* - Contains 3',
    'starts:1 - Starts with 1',
    'ends:5 - Ends with 5',
    'middle:3 - Has 3 in middle',
    'contains:2 - Contains 2',
    'equals:23 - Equals 23',
    'between:10-20 - Between 10 and 20',
    'even: - Even numbers',
    'odd: - Odd numbers',
    'sum:5 - Digit sum equals 5',
    'length:2 - Length is 2',
    'greater:50 - Greater than 50',
    'less:50 - Less than 50',
  ];
};

// Validate pattern
export const validatePattern = (query: string): { valid: boolean; error?: string } => {
  if (!query.trim()) {
    return { valid: false, error: 'Pattern cannot be empty' };
  }
  
  const pattern = parseSearchPattern(query);
  
  if (pattern.type === 'command') {
    const validCommands = [
      'starts', 'start', 'begins', 'begin',
      'ends', 'end',
      'middle', 'mid', 'contains',
      'equals', 'equal', 'is',
      'length', 'len',
      'greater', 'gt',
      'less', 'lt',
      'between',
      'even', 'odd',
      'sum'
    ];
    
    if (!validCommands.includes(pattern.command!)) {
      return { valid: false, error: `Unknown command: ${pattern.command}` };
    }
    
    // Check if command requires value
    const requiresValue = !['even', 'odd'].includes(pattern.command!);
    if (requiresValue && !pattern.value) {
      return { valid: false, error: `Command '${pattern.command}' requires a value` };
    }
  }
  
  return { valid: true };
};

