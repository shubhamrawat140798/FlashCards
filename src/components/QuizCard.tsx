import { Link } from 'react-router-dom';
import { getBestScoreForQuiz } from '../lib/storage';
import type { Quiz } from '../types/quiz';

type QuizCardProps = {
  quiz: Quiz;
};

export function QuizCard({ quiz }: QuizCardProps) {
  const best = getBestScoreForQuiz(quiz.id);

  return (
    <article className="quiz-card">
      <span className="quiz-card-category">{quiz.category}</span>
      <h3 className="quiz-card-title">{quiz.title}</h3>
      <p>{quiz.description}</p>
      <div className="quiz-card-meta">
        <span>{quiz.questions.length} questions</span>
        <span>{quiz.timeLimitMinutes} min limit</span>
        {best !== null && (
          <span>
            Best: {best}/{quiz.questions.length}
          </span>
        )}
      </div>
      <div className="quiz-card-actions">
        <Link
          to={`/quiz/${quiz.id}`}
          className="btn-primary"
          style={{ display: 'inline-block', textDecoration: 'none', color: 'white' }}
        >
          Start quiz
        </Link>
      </div>
    </article>
  );
}
