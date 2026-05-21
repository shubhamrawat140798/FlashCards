import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoryFilter } from '../components/CategoryFilter';
import { LoadingState } from '../components/LoadingState';
import { QuizCard } from '../components/QuizCard';
import { useAttempts } from '../hooks/useAttempts';
import { useQuizzes } from '../hooks/useQuizzes';
import { getBestScoreForQuiz } from '../lib/dataStore';

export function HomePage() {
  const { quizzes, loading, error } = useQuizzes();
  const { attempts } = useAttempts();
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(quizzes.map((q) => q.category))].sort(),
    [quizzes]
  );

  const filtered = useMemo(
    () =>
      category === null
        ? quizzes
        : quizzes.filter((q) => q.category === category),
    [quizzes, category]
  );

  if (loading) {
    return <LoadingState message="Loading quizzes..." />;
  }

  return (
    <div>
      <h1 className="page-title">Quizzes</h1>
      <p className="page-subtitle">
        Pick a category and start a timed multiple-choice test.
      </p>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="empty-state">
          <h3>No quizzes yet</h3>
          <p>Create your first quiz in the admin portal.</p>
          <Link
            to="/admin"
            className="btn-primary"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              textDecoration: 'none',
              color: 'white',
            }}
          >
            Open Admin Portal
          </Link>
        </div>
      ) : (
        <>
          <CategoryFilter
            categories={categories}
            selected={category}
            onSelect={setCategory}
          />
          {filtered.length === 0 ? (
            <div className="empty-state">
              <h3>No quizzes in this category</h3>
              <p>Try another category or clear the filter.</p>
            </div>
          ) : (
            <div className="quiz-grid">
              {filtered.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  bestScore={getBestScoreForQuiz(quiz.id, attempts)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
