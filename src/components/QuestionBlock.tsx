import type { Question } from '../types/quiz';

type QuestionBlockProps = {
  question: Question;
  selectedIndex: number | undefined;
  onSelect: (index: number) => void;
};

export function QuestionBlock({
  question,
  selectedIndex,
  onSelect,
}: QuestionBlockProps) {
  return (
    <div className="question-block">
      <p className="question-text">{question.text}</p>
      <ul className="options-list">
        {question.options.map((option, index) => (
          <li key={index}>
            <label
              className={`option-item ${selectedIndex === index ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={selectedIndex === index}
                onChange={() => onSelect(index)}
              />
              <span>{option}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
