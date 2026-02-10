import { useState } from 'react';

interface AIFeedbackProps {
  feedback: string;
  showDisclaimer?: boolean;
}

interface ParsedFeedback {
  summary?: string[];
  strengths?: string[];
  gaps?: string[];
  questions?: string[];
  other?: string[];
}

function parseFeedback(feedback: string): ParsedFeedback | null {
  try {
    const lines = feedback.split('\n').map(line => line.trim()).filter(Boolean);
    const parsed: ParsedFeedback = {};
    let currentSection: keyof ParsedFeedback | null = null;

    for (const line of lines) {
      const lower = line.toLowerCase();
      
      if (lower.includes('summary') || lower.includes('overview')) {
        currentSection = 'summary';
        parsed.summary = [];
        continue;
      } else if (lower.includes('strength') || lower.includes('positive')) {
        currentSection = 'strengths';
        parsed.strengths = [];
        continue;
      } else if (lower.includes('gap') || lower.includes('concern') || lower.includes('weakness') || lower.includes('area')) {
        currentSection = 'gaps';
        parsed.gaps = [];
        continue;
      } else if (lower.includes('question') || lower.includes('interview')) {
        currentSection = 'questions';
        parsed.questions = [];
        continue;
      }

      // Add line to current section
      if (currentSection && parsed[currentSection]) {
        const cleanedLine = line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '');
        if (cleanedLine) {
          parsed[currentSection]!.push(cleanedLine);
        }
      } else {
        if (!parsed.other) parsed.other = [];
        parsed.other.push(line);
      }
    }

    // Check if we successfully parsed anything
    if (Object.keys(parsed).length === 0 || (parsed.other && parsed.other.length === lines.length)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function AIFeedback({ feedback, showDisclaimer = true }: AIFeedbackProps) {
  const [showQuestions, setShowQuestions] = useState(false);
  const parsed = parseFeedback(feedback);

  if (!parsed) {
    // Fallback: display as formatted text
    return (
      <div className="space-y-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-purple-900 mb-2">AI Evaluation</h4>
              <p className="text-sm text-purple-800 whitespace-pre-line font-mono">{feedback}</p>
            </div>
          </div>
        </div>
        {showDisclaimer && (
          <p className="text-xs text-gray-500 italic">
            AI suggestions assist HR decisions. Final decision is made by the hiring team.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      {parsed.summary && parsed.summary.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-purple-900 mb-2">Summary</h4>
              <ul className="space-y-1 text-sm text-purple-800">
                {parsed.summary.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Strengths */}
      {parsed.strengths && parsed.strengths.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-2">Strengths</h4>
              <ul className="space-y-1 text-sm text-green-800">
                {parsed.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Gaps/Concerns */}
      {parsed.gaps && parsed.gaps.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-2">Gaps & Concerns</h4>
              <ul className="space-y-1 text-sm text-amber-800">
                {parsed.gaps.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600">⚠</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Interview Questions (Collapsible) */}
      {parsed.questions && parsed.questions.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg">
          <button
            onClick={() => setShowQuestions(!showQuestions)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-100 transition-colors rounded-lg"
          >
            <span className="font-semibold text-gray-900">Suggested Interview Questions</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${showQuestions ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showQuestions && (
            <div className="px-4 pb-4">
              <ul className="space-y-2 text-sm text-gray-700">
                {parsed.questions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gray-400">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Other content */}
      {parsed.other && parsed.other.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-700 space-y-1">
            {parsed.other.map((item, i) => (
              <p key={i}>{item}</p>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      {showDisclaimer && (
        <p className="text-xs text-gray-500 italic">
          AI suggestions assist HR decisions. Final decision is made by the hiring team.
        </p>
      )}
    </div>
  );
}
