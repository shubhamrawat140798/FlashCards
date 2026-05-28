import type { Question } from '../types/quiz';

type QuestionEditorProps = {
  question: Question;
  index: number;
  canRemove: boolean;
  onChange: (patch: Partial<Question>) => void;
  onRemove: () => void;
};

export function QuestionEditor({
  question,
  index,
  canRemove,
  onChange,
  onRemove,
}: QuestionEditorProps) {
  const correctSet = new Set(question.correctIndexes ?? []);

  const setOption = (oIndex: number, value: string) => {
    const options = [...question.options];
    options[oIndex] = value;
    onChange({ options });
  };

  const addOption = () => {
    if (question.options.length >= 6) return;
    onChange({ options: [...question.options, ''] });
  };

  const removeOption = (oIndex: number) => {
    if (question.options.length <= 2) return;
    const options = question.options.filter((_, i) => i !== oIndex);
    const nextCorrect = (question.correctIndexes ?? [])
      .filter((idx) => idx !== oIndex)
      .map((idx) => (idx > oIndex ? idx - 1 : idx))
      .filter((idx) => idx >= 0 && idx < options.length);

    onChange({
      options,
      correctIndexes: nextCorrect.length > 0 ? Array.from(new Set(nextCorrect)).sort((a, b) => a - b) : [0],
    });
  };

  const toggleCorrect = (oIndex: number) => {
    const next = new Set(question.correctIndexes ?? []);
    if (next.has(oIndex)) next.delete(oIndex);
    else next.add(oIndex);
    const arr = Array.from(next).sort((a, b) => a - b);
    onChange({ correctIndexes: arr.length > 0 ? arr : [oIndex] });
  };

  return (
    <div className="question-editor">
      <div className="question-editor-header">
        <h4>Question {index + 1}</h4>
        <button
          type="button"
          className="btn-ghost"
          disabled={!canRemove}
          onClick={onRemove}
        >
          Remove question
        </button>
      </div>

      <div className="form-group">
        <label htmlFor={`q-text-${question.id}`}>Question</label>
        <textarea
          id={`q-text-${question.id}`}
          rows={2}
          placeholder="Enter the question..."
          value={question.text}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </div>

      <fieldset className="answers-fieldset">
        <legend>Answers — select all correct options</legend>
        {question.options.map((opt, oIndex) => (
          <div key={oIndex} className="answer-row">
            <label className="answer-correct-label" title="Mark as correct answer">
              <input
                type="checkbox"
                checked={correctSet.has(oIndex)}
                onChange={() => toggleCorrect(oIndex)}
              />
              <span className="answer-correct-text">Correct</span>
            </label>
            <input
              type="text"
              className="answer-input"
              value={opt}
              placeholder={`Answer ${oIndex + 1}`}
              onChange={(e) => setOption(oIndex, e.target.value)}
            />
            <button
              type="button"
              className="btn-ghost answer-remove-btn"
              disabled={question.options.length <= 2}
              onClick={() => removeOption(oIndex)}
              title="Remove this answer"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary btn-sm"
          disabled={question.options.length >= 6}
          onClick={addOption}
        >
          + Add answer option
        </button>
      </fieldset>
    </div>
  );
}
