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
    let correctIndex = question.correctIndex;
    if (oIndex === correctIndex) {
      correctIndex = 0;
    } else if (oIndex < correctIndex) {
      correctIndex -= 1;
    }
    onChange({ options, correctIndex });
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
        <legend>Answers — select the correct one</legend>
        {question.options.map((opt, oIndex) => (
          <div key={oIndex} className="answer-row">
            <label className="answer-correct-label" title="Mark as correct answer">
              <input
                type="radio"
                name={`correct-${question.id}`}
                checked={question.correctIndex === oIndex}
                onChange={() => onChange({ correctIndex: oIndex })}
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
