import type { Question } from '../types/quiz';

type QuestionBlockProps = {
  question: Question;
  selectedIndexes: number[] | undefined;
  onToggle: (index: number) => void;
};

export function QuestionBlock({
  question,
  selectedIndexes,
  onToggle,
}: QuestionBlockProps) {
  const selectedSet = new Set(selectedIndexes ?? []);

  return (
    <div className="question-block">
      <p className="question-text">{question.text}</p>
      <ul className="options-list">
        {question.options.map((option, index) => (
          <li key={index}>
            <label
              className={`option-item ${selectedSet.has(index) ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                name={`question-${question.id}`}
                checked={selectedSet.has(index)}
                onChange={() => onToggle(index)}
              />
              <span>{option}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
