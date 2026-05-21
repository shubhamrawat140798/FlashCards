import { formatDuration, formatPercent } from '../lib/scoring';

type ResultsSummaryProps = {
  score: number;
  total: number;
  timeSpentSeconds: number;
  quizTitle: string;
};

export function ResultsSummary({
  score,
  total,
  timeSpentSeconds,
  quizTitle,
}: ResultsSummaryProps) {
  return (
    <div className="results-summary">
      <p style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{quizTitle}</p>
      <div className="results-score">
        {score} / {total}
      </div>
      <div className="results-percent">{formatPercent(score, total)}</div>
      <div className="results-meta">
        Time spent: {formatDuration(timeSpentSeconds)}
      </div>
    </div>
  );
}
