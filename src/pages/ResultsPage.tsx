import { Link, useParams } from 'react-router-dom';
import { LoadingState } from '../components/LoadingState';
import { ResultsSummary } from '../components/ResultsSummary';
import { ReviewList } from '../components/ReviewList';
import { useAttempts } from '../hooks/useAttempts';
import { useQuizzes } from '../hooks/useQuizzes';
import { gradeQuiz } from '../lib/scoring';

export function ResultsPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { attempts, loading: attemptsLoading } = useAttempts();
  const { quizzes, loading: quizzesLoading } = useQuizzes();

  const loading = attemptsLoading || quizzesLoading;

  const attempt = attempts.find((a) => a.id === attemptId);
  const quiz = quizzes.find((q) => q.id === attempt?.quizId);

  if (loading) {
    return <LoadingState message="Loading results..." />;
  }

  if (!attempt || !quiz) {
    return (
      <div className="empty-state">
        <h3>Results not found</h3>
        <p>This attempt may have been cleared or is still syncing.</p>
        <Link
          to="/"
          className="btn-primary"
          style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}
        >
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
