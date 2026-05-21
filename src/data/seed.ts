import type { Quiz } from '../types/quiz';

export const seedQuizzes: Quiz[] = [
  {
    id: 'quiz-js-basics',
    title: 'JavaScript Basics',
    description: 'Core concepts: types, variables, and operators.',
    category: 'JavaScript',
    timeLimitMinutes: 10,
    questions: [
      {
        id: 'q-js-1',
        text: 'Which keyword declares a block-scoped variable?',
        options: ['var', 'let', 'function', 'const only for objects'],
        correctIndex: 1,
      },
      {
        id: 'q-js-2',
        text: 'What is the type of `typeof null` in JavaScript?',
        options: ['null', 'undefined', 'object', 'number'],
        correctIndex: 2,
      },
      {
        id: 'q-js-3',
        text: 'Which method adds an element to the end of an array?',
        options: ['pop', 'shift', 'push', 'unshift'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'quiz-react',
    title: 'React Fundamentals',
    description: 'Components, hooks, and rendering.',
    category: 'React',
    timeLimitMinutes: 15,
    questions: [
      {
        id: 'q-react-1',
        text: 'Which hook runs side effects after render?',
        options: ['useState', 'useMemo', 'useEffect', 'useRef'],
        correctIndex: 2,
      },
      {
        id: 'q-react-2',
        text: 'What does JSX compile to?',
        options: [
          'HTML strings only',
          'React.createElement calls',
          'Web Components',
          'Direct DOM nodes',
        ],
        correctIndex: 1,
      },
      {
        id: 'q-react-3',
        text: 'Which prop is required when rendering a list with .map()?',
        options: ['className', 'key', 'id', 'ref'],
        correctIndex: 1,
      },
      {
        id: 'q-react-4',
        text: 'State updates in React are:',
        options: [
          'Always synchronous',
          'Merged and may be batched',
          'Applied only on unmount',
          'Ignored in strict mode',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'quiz-math',
    title: 'Quick Math',
    description: 'Arithmetic and percentages.',
    category: 'Math',
    timeLimitMinutes: 5,
    questions: [
      {
        id: 'q-math-1',
        text: 'What is 15% of 200?',
        options: ['15', '20', '30', '25'],
        correctIndex: 2,
      },
      {
        id: 'q-math-2',
        text: 'Solve: 2x + 6 = 14',
        options: ['x = 2', 'x = 4', 'x = 6', 'x = 8'],
        correctIndex: 1,
      },
    ],
  },
];
