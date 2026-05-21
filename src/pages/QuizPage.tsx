import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LoadingState } from '../components/LoadingState';
import { QuestionBlock } from '../components/QuestionBlock';
import { Timer } from '../components/Timer';
import { useAttempts } from '../hooks/useAttempts';
import { useQuizzes } from '../hooks/useQuizzes';
import { gradeQuiz } from '../lib/scoring';
import type { Quiz } from '../types/quiz';

export function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { addAttempt } = useAttempts();
  const { quizzes, loading } = useQuizzes();

  const quiz: Quiz | undefined = quizzes.find((q) => q.id === quizId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const startedAtRef = useRef(Date.now());
  const submittedRef = useRef(false);

  const totalSeconds = (quiz?.timeLimitMinutes ?? 0) * 60;

  const answersRef = useRef(answers);
  answersRef.current = answers;

  const submitQuiz = useCallback(async () => {
    if (!quiz || submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);

    const { score, total } = gradeQuiz(quiz, answersRef.current);
    const now = Date.now();
    const attempt = {
      id: crypto.randomUUID(),
      quizId: quiz.id,
      answers: { ...answersRef.current },
      score,
      total,
      startedAt: new Date(startedAtRef.current).toISOString(),
      completedAt: new Date(now).toISOString(),
      timeSpentSeconds: Math.round((now - startedAtRef.current) / 1000),
    };

    try {
      await addAttempt(attempt);
      navigate(`/results/${attempt.id}`);
    } catch {
      submittedRef.current = false;
      setSubmitting(false);
    }
  }, [quiz, addAttempt, navigate]);

  const handleExpire = useCallback(() => {
    void submitQuiz();
  }, [submitQuiz]);

  useEffect(() => {
    submittedRef.current = false;
    setSubmitting(false);
    setCurrentIndex(0);
    setAnswers({});
    startedAtRef.current = Date.now();
  }, [quizId]);

  if (loading) {
    return <LoadingState message="Loading quiz..." />;
  }

  if (!quiz) {
    return (
      <div className="empty-state">
        <h3>Quiz not found</h3>
        <p>This quiz may have been deleted.</p>
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

  const question = quiz.questions[currentIndex];
  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);
  const isLast = currentIndex === quiz.questions.length - 1;

  const handleSelect = (index: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: index }));
  };

  return (
    <div>
      <div className="quiz-header">
        <div>
          <h1 className="page-title">{quiz.title}</h1>
          <p className="quiz-progress">
            Question {currentIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        <Timer
          totalSeconds={totalSeconds}
          onExpire={handleExpire}
          running={!submitting}
        />
      </div>

      <QuestionBlock
        question={question}
        selectedIndex={answers[question.id]}
        onSelect={handleSelect}
      />

      <div className="quiz-nav">
        <button
          type="button"
          className="btn-secondary"
          disabled={currentIndex === 0 || submitting}
          onClick={() => setCurrentIndex((i) => i - 1)}
        >
          Previous
        </button>

        <div className="action-row" style={{ marginTop: 0 }}>
          {!isLast ? (
            <button
              type="button"
              className="btn-primary"
              disabled={answers[question.id] === undefined || submitting}
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              disabled={!allAnswered || submitting}
              onClick={() => void submitQuiz()}
            >
              {submitting ? 'Submitting...' : 'Submit quiz'}
            </button>
          )}
        </div>
      </div>

      {!allAnswered && isLast && (
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Answer all questions before submitting.
        </p>
      )}
    </div>
  );
}
