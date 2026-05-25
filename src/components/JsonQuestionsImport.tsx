import { useState } from 'react';
import {
  parseQuestionsJson,
  QUESTION_JSON_EXAMPLE,
} from '../lib/parseQuestionsJson';
import type { Question } from '../types/quiz';

type JsonQuestionsImportProps = {
  disabled?: boolean;
  onAdd: (questions: Question[]) => void;
  onReplace: (questions: Question[]) => void;
};

export function JsonQuestionsImport({
  disabled,
  onAdd,
  onReplace,
}: JsonQuestionsImportProps) {
  const [open, setOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const handleParse = (): Question[] | null => {
    setParseError(null);
    try {
      return parseQuestionsJson(jsonText);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'Failed to parse JSON');
      return null;
    }
  };

  const handleAdd = () => {
    const questions = handleParse();
    if (!questions) return;
    onAdd(questions);
    setParseError(null);
    setLocalSuccess(`Added ${questions.length} question(s).`);
  };

  const handleReplace = () => {
    const questions = handleParse();
    if (!questions) return;
    if (
      !window.confirm(
        `Replace all existing questions with ${questions.length} imported question(s)?`
      )
    ) {
      return;
    }
    onReplace(questions);
    setParseError(null);
    setLocalSuccess(`Replaced with ${questions.length} question(s).`);
  };

  const loadExample = () => {
    setJsonText(QUESTION_JSON_EXAMPLE);
    setParseError(null);
    setLocalSuccess(null);
  };

  return (
    <div className="json-import">
      <button
        type="button"
        className="json-import-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? '▼' : '▶'} Add questions from JSON
      </button>

      {open && (
        <div className="json-import-panel">
          <p className="json-import-hint">
            Paste a single question, an array of questions, or{' '}
            <code>{'{ "questions": [...] }'}</code>. Each question needs{' '}
            <code>text</code>, <code>options</code> (min 2), and{' '}
            <code>correctIndex</code> (0-based). <code>id</code> is optional.
          </p>

          <textarea
            className="json-import-textarea"
            rows={10}
            placeholder={QUESTION_JSON_EXAMPLE}
            value={jsonText}
            disabled={disabled}
            onChange={(e) => {
              setJsonText(e.target.value);
              setParseError(null);
              setLocalSuccess(null);
            }}
          />

          {parseError && (
            <div className="alert alert-error" role="alert">
              {parseError}
            </div>
          )}

          {localSuccess && (
            <div className="alert alert-success" role="status">
              {localSuccess}
            </div>
          )}

          <div className="json-import-actions">
            <button
              type="button"
              className="btn-secondary btn-sm"
              disabled={disabled}
              onClick={loadExample}
            >
              Load example
            </button>
            <button
              type="button"
              className="btn-primary btn-sm"
              disabled={disabled || !jsonText.trim()}
              onClick={handleAdd}
            >
              Append to quiz
            </button>
            <button
              type="button"
              className="btn-secondary btn-sm"
              disabled={disabled || !jsonText.trim()}
              onClick={handleReplace}
            >
              Replace all questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
