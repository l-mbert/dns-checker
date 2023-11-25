import { Test } from '@/stores/testStore';

interface TestExplainerProps {
  test: Test;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
}

const _tailwindFontSizes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'];

export function TestExplainer({ test, fontSize = 'sm' }: TestExplainerProps) {
  let testExplainerStart = '';
  let testExplainerEnd = '';

  switch (test.type) {
    case 'contains':
      testExplainerStart = '*';
      testExplainerEnd = '*';
      break;
    case 'regex':
      testExplainerStart = '/';
      testExplainerEnd = '/';
      break;
    case 'equals':
      testExplainerStart = '"';
      testExplainerEnd = '"';
      break;
    case 'startsWith':
      testExplainerEnd = '*';
      break;
    case 'endsWith':
      testExplainerStart = '*';
      break;
  }

  const testExplainerColor = test.negated ? 'text-red-500' : 'text-green-500';

  return (
    <span className={`font-mono text-${fontSize}`}>
      {testExplainerStart !== '' && <span className={testExplainerColor}>{testExplainerStart}</span>}
      {test.value}
      {testExplainerEnd !== '' && <span className={testExplainerColor}>{testExplainerEnd}</span>}
    </span>
  );
}
