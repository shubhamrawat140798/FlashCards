import { Link } from 'react-router-dom';
import { useAttempts } from '../hooks/useAttempts';
import { useQuizzes } from '../hooks/useQuizzes';
import { formatDuration, formatPercent } from '../lib/scoring';

export function HistoryPage() {
  const { attempts } = useAttempts();
  const { quizzes } = useQuizzes();

  const sorted = [...attempts].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const getQuizTitle = (quizId: string) =>
    quizzes.find((q) => q.id === quizId)?.title ?? 'Unknown quiz';

  return (
    <div>
      <h1 className="page-title">History</h1>
      <p className="page-subtitle">Past quiz attempts saved in this browser.</p>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <h3>No attempts yet</h3>
          <p>Complete a quiz to see your results here.</p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
            Browse quizzes
          </Link>
        </div>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Score</th>
              <th>Time</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((attempt) => (
              <tr key={attempt.id}>
                <td>{getQuizTitle(attempt.quizId)}</td>
                <td>
                  {attempt.score}/{attempt.total} ({formatPercent(attempt.score, attempt.total)})
                </td>
                <td>{formatDuration(attempt.timeSpentSeconds)}</td>
                <td>
                  {new Date(attempt.completedAt).toLocaleString()}
                </td>
                <td>
                  <Link to={`/results/${attempt.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
