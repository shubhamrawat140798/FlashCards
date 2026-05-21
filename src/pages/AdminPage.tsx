import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QuestionEditor } from '../components/QuestionEditor';
import { useAuth } from '../hooks/useAuth';
import { useQuizzes } from '../hooks/useQuizzes';
import { validateQuiz } from '../lib/validation';
import type { Question, Quiz } from '../types/quiz';

function emptyQuestion(): Question {
  return {
    id: crypto.randomUUID(),
    text: '',
    options: ['', '', '', ''],
    correctIndex: 0,
  };
}

function emptyQuiz(): Quiz {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    category: '',
    timeLimitMinutes: 10,
    questions: [emptyQuestion()],
  };
}

export function AdminPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { quizzes, save, remove } = useQuizzes();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Quiz | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (selectedId && quizzes.find((q) => q.id === selectedId)) {
      const q = quizzes.find((x) => x.id === selectedId)!;
      setDraft(structuredClone(q));
    }
  }, [selectedId, quizzes]);

  const startNew = () => {
    const q = emptyQuiz();
    setSelectedId(q.id);
    setDraft(q);
    setErrors([]);
    setSuccess('');
  };

  const selectQuiz = (id: string) => {
    setSelectedId(id);
    setErrors([]);
    setSuccess('');
  };

  const updateDraft = (patch: Partial<Quiz>) => {
    setDraft((d) => (d ? { ...d, ...patch } : d));
  };

  const updateQuestion = (index: number, patch: Partial<Question>) => {
    setDraft((d) => {
      if (!d) return d;
      const questions = [...d.questions];
      questions[index] = { ...questions[index], ...patch };
      return { ...d, questions };
    });
  };

  const addQuestion = () => {
    setDraft((d) =>
      d ? { ...d, questions: [...d.questions, emptyQuestion()] } : d
    );
  };

  const removeQuestion = (index: number) => {
    if (!draft || draft.questions.length <= 1) return;
    if (!window.confirm('Remove this question?')) return;
    setDraft({
      ...draft,
      questions: draft.questions.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    if (!draft) return;
    const validationErrors = validateQuiz(draft);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSuccess('');
      return;
    }
    save(draft);
    setSelectedId(draft.id);
    setErrors([]);
    setSuccess('Quiz saved. Questions are now available on the home page.');
  };

  const handleDelete = () => {
    if (!draft || !selectedId) return;
    const existing = quizzes.find((q) => q.id === selectedId);
    if (!existing) return;
    if (!window.confirm(`Delete "${draft.title}"? This cannot be undone.`)) {
      return;
    }
    remove(selectedId);
    setSelectedId(null);
    setDraft(null);
    setErrors([]);
    setSuccess('Quiz deleted.');
  };

  const isNew = draft && !quizzes.some((q) => q.id === draft.id);

  return (
    <div className="admin-portal">
      <div className="admin-portal-header">
        <div>
          <h1 className="page-title">Admin Portal</h1>
          <p className="page-subtitle">
            Create quizzes and add questions with multiple answers. Pick the correct answer for each question.
          </p>
        </div>
        <div className="admin-portal-actions">
          <Link to="/" className="btn-secondary" style={{ textDecoration: 'none' }}>
            View quizzes
          </Link>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              logout();
              navigate('/admin/login', { replace: true });
            }}
          >
            Log out
          </button>
        </div>
      </div>

      <div className="admin-layout">
        <aside className="admin-list">
          <div className="admin-list-toolbar">
            <button type="button" className="btn-primary" style={{ width: '100%' }} onClick={startNew}>
              + New quiz
            </button>
          </div>
          <p className="admin-list-label">Your quizzes</p>
          {quizzes.length === 0 ? (
            <p className="admin-list-empty">No quizzes yet. Click “New quiz” to start.</p>
          ) : (
            quizzes.map((q) => (
              <div
                key={q.id}
                className={`admin-list-item ${selectedId === q.id ? 'active' : ''}`}
                onClick={() => selectQuiz(q.id)}
                onKeyDown={(e) => e.key === 'Enter' && selectQuiz(q.id)}
                role="button"
                tabIndex={0}
              >
                <span className="admin-list-item-title">{q.title || 'Untitled'}</span>
                <span className="admin-list-item-meta">
                  {q.questions.length} Q · {q.category}
                </span>
              </div>
            ))
          )}
        </aside>

        <section className="admin-main">
          {!draft ? (
            <div className="empty-state">
              <h3>Admin Portal</h3>
              <p>Select a quiz to edit its questions and answers, or create a new quiz.</p>
              <button type="button" className="btn-primary" onClick={startNew}>
                Create new quiz
              </button>
            </div>
          ) : (
            <div className="admin-form">
              <h2>{isNew ? 'New quiz' : `Edit: ${draft.title || 'Untitled'}`}</h2>

              {errors.length > 0 && (
                <div className="alert alert-error" role="alert">
                  <strong>Fix these issues:</strong>
                  <ul>
                    {errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="status">
                  {success}
                </div>
              )}

              <section className="admin-section">
                <h3>Quiz details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Quiz title</label>
                    <input
                      id="title"
                      value={draft.title}
                      placeholder="e.g. JavaScript Basics"
                      onChange={(e) => updateDraft({ title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input
                      id="category"
                      value={draft.category}
                      placeholder="e.g. JavaScript"
                      onChange={(e) => updateDraft({ category: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    rows={2}
                    placeholder="Short description for students..."
                    value={draft.description}
                    onChange={(e) => updateDraft({ description: e.target.value })}
                  />
                </div>
                <div className="form-group form-group-inline">
                  <label htmlFor="timeLimit">Time limit (minutes)</label>
                  <input
                    id="timeLimit"
                    type="number"
                    min={1}
                    style={{ maxWidth: '120px' }}
                    value={draft.timeLimitMinutes}
                    onChange={(e) =>
                      updateDraft({
                        timeLimitMinutes: parseInt(e.target.value, 10) || 1,
                      })
                    }
                  />
                </div>
              </section>

              <section className="admin-section">
                <div className="admin-section-header">
                  <h3>Questions &amp; answers</h3>
                  <button type="button" className="btn-secondary btn-sm" onClick={addQuestion}>
                    + Add question
                  </button>
                </div>

                {draft.questions.map((question, qIndex) => (
                  <QuestionEditor
                    key={question.id}
                    question={question}
                    index={qIndex}
                    canRemove={draft.questions.length > 1}
                    onChange={(patch) => updateQuestion(qIndex, patch)}
                    onRemove={() => removeQuestion(qIndex)}
                  />
                ))}
              </section>

              <div className="form-actions">
                <button type="button" className="btn-primary" onClick={handleSave}>
                  Save quiz
                </button>
                {!isNew && (
                  <button type="button" className="btn-danger" onClick={handleDelete}>
                    Delete quiz
                  </button>
                )}
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    setDraft(null);
                    setSelectedId(null);
                    setErrors([]);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
