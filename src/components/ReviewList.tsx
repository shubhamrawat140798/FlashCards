import type { ReviewItem } from '../types/quiz';

type ReviewListProps = {
  items: ReviewItem[];
};

function formatOptionList(options: string[], indexes: number[] | undefined): string {
  if (!indexes || indexes.length === 0) return 'Not answered';
  return indexes
    .map((i) => options[i])
    .filter((v) => typeof v === 'string' && v.trim().length > 0)
    .join(', ');
}

export function ReviewList({ items }: ReviewListProps) {
  return (
    <div className="review-list">
      {items.map((item, i) => (
        <div
          key={item.question.id}
          className={`review-item ${item.correct ? 'correct' : 'incorrect'}`}
        >
          <p className="review-question">
            {i + 1}. {item.question.text}
          </p>
          <p className="review-answer">
            <span>Your answer: </span>
            {formatOptionList(item.question.options, item.selected)}
          </p>
          {!item.correct && (
            <p className="review-answer">
              <span>Correct answer: </span>
              {formatOptionList(item.question.options, item.question.correctIndexes)}
            </p>
          )}
          <span className={`review-badge ${item.correct ? 'correct' : 'incorrect'}`}>
            {item.correct ? 'Correct' : 'Incorrect'}
          </span>
        </div>
      ))}
    </div>
  );
}
