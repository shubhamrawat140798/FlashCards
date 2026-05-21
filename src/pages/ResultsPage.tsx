import { Link, useParams } from 'react-router-dom';
import { ResultsSummary } from '../components/ResultsSummary';
import { ReviewList } from '../components/ReviewList';
import { useAttempts } from '../hooks/useAttempts';
import { useQuizzes } from '../hooks/useQuizzes';
import { gradeQuiz } from '../lib/scoring';
import { getAttemptById, getQuizById } from '../lib/storage';

export function ResultsPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { attempts } = useAttempts();
  const { quizzes } = useQuizzes();

  const attempt =
    attempts.find((a) => a.id === attemptId) ??
    (attemptId ? getAttemptById(attemptId) : undefined);

  const quiz =
    quizzes.find((q) => q.id === attempt?.quizId) ??
    (attempt ? getQuizById(attempt.quizId) : undefined);

  if (!attempt || !quiz) {
    return (
      <div className="empty-state">
        <h3>Results not found</h3>
        <p>This attempt may have been cleared from storage.</p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
          Back to home
        </Link>
      </div>
    );
  }

  const { review } = gradeQuiz(quiz, attempt.answers);

  return (
    <div>
      <h1 className="page-title">Your results</h1>
      <p className="page-subtitle">Review your answers below.</p>

      <ResultsSummary
        score={attempt.score}
        total={attempt.total}
        timeSpentSeconds={attempt.timeSpentSeconds}
        quizTitle={quiz.title}
      />

      <h2 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Answer review</h2>
      <ReviewList items={review} />

      <div className="action-row">
        <Link
          to={`/quiz/${quiz.id}`}
          className="btn-primary"
          style={{ textDecoration: 'none' }}
        >
          Retake quiz
        </Link>
        <Link to="/" className="btn-secondary" style={{ textDecoration: 'none' }}>
          Back to home
        </Link>
        <Link to="/history" className="btn-ghost" style={{ textDecoration: 'none' }}>
          View history
        </Link>
      </div>
    </div>
  );
}
