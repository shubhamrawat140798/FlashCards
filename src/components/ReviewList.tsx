import type { ReviewItem } from '../types/quiz';

type ReviewListProps = {
  items: ReviewItem[];
};

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
            {item.selected !== undefined
              ? item.question.options[item.selected]
              : 'Not answered'}
          </p>
          {!item.correct && (
            <p className="review-answer">
              <span>Correct answer: </span>
              {item.question.options[item.question.correctIndex]}
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
