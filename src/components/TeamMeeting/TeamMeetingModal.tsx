// src/components/TeamMeeting/TeamMeetingModal.tsx
// Modal for starting and viewing AI Employee Team Meetings

import React, { useState } from 'react';
import { teamMeetingService, TeamMeetingResult } from '../../services/teamMeetingService';

interface TeamMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

type MeetingStatus = 'idle' | 'starting' | 'running' | 'complete' | 'error';

export const TeamMeetingModal: React.FC<TeamMeetingModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState<MeetingStatus>('idle');
  const [result, setResult] = useState<TeamMeetingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);

  const handleStartMeeting = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setStatus('starting');
    setError(null);
    setResult(null);

    try {
      // Start the meeting
      const execId = await teamMeetingService.startMeeting({
        question: question.trim(),
        userId,
      });

      setExecutionId(execId);
      setStatus('running');

      // Poll for results
      const meetingResult = await teamMeetingService.pollForResult(execId);
      setResult(meetingResult);
      setStatus('complete');
    } catch (err) {
      console.error('[TeamMeetingModal] Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setQuestion('');
    setStatus('idle');
    setResult(null);
    setError(null);
    setExecutionId(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              AI Employee Team Meeting
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Get advice from your AI executive team (CEO, CTO, CFO, VP Sales, Head of Product)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === 'idle' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What business decision do you need help with?
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="E.g., Should we hire a VP of Marketing now or wait 6 months?"
              />

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  How it works:
                </h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Your AI executive team discusses the question (5 employees)</li>
                  <li>CEO analyzes team consensus</li>
                  <li>If needed, consults advisory board members</li>
                  <li>CEO synthesizes final decision with action items</li>
                </ol>
                <p className="text-xs text-blue-700 mt-3">
                  ⏱️ Takes ~25-30 seconds | 💰 Costs ~$0.02 per meeting
                </p>
              </div>

              <button
                onClick={handleStartMeeting}
                disabled={!question.trim()}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Start Team Meeting
              </button>
            </div>
          )}

          {status === 'starting' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-lg font-medium text-gray-900">Calling your executive team...</p>
              <p className="text-sm text-gray-600 mt-2">This will take about 25-30 seconds</p>
            </div>
          )}

          {status === 'running' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <div>
                  <p className="text-lg font-medium text-gray-900">Team meeting in progress...</p>
                  <p className="text-sm text-gray-600">
                    Execution ID: {executionId?.split(':').pop()?.substring(0, 20)}...
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-700">📋 <strong>Question:</strong> {question}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="animate-pulse">⏳</div>
                  <span>Analyzing consensus and consulting advisors if needed...</span>
                </div>
              </div>
            </div>
          )}

          {status === 'complete' && result && (
            <div className="space-y-6">
              {/* Decision */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-900 mb-2">✅ Decision</h3>
                <p className="text-gray-900 font-medium">{result.finalDecision.decision}</p>
                <div className="mt-3 flex items-center space-x-4">
                  <span className="text-sm text-green-700">
                    🎯 Confidence: <strong>{result.finalDecision.confidence_level}</strong>
                  </span>
                  <span className="text-sm text-green-700">
                    📊 Consensus: <strong>{result.consensusResult.consensusScore}%</strong>
                  </span>
                </div>
              </div>

              {/* Rationale */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-2">📋 Rationale</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{result.finalDecision.rationale}</p>
              </div>

              {/* Action Items */}
              {result.finalDecision.action_items.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">
                    📝 Action Items ({result.finalDecision.action_items.length})
                  </h3>
                  <div className="space-y-3">
                    {result.finalDecision.action_items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {item.assignee}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  item.priority === 'high'
                                    ? 'bg-red-100 text-red-700'
                                    : item.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {item.priority.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{item.action}</p>
                          </div>
                          <span className="text-xs text-gray-500 ml-4">
                            Due: {item.deadline}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Discussion */}
              {result.teamResponses && result.teamResponses.length > 0 && (
                <details className="border border-gray-200 rounded-lg">
                  <summary className="cursor-pointer px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg font-medium text-gray-900">
                    👥 View Team Discussion ({result.teamResponses.length} employees)
                  </summary>
                  <div className="p-4 space-y-4">
                    {result.teamResponses.map((response, idx) => (
                      <div key={idx} className="border-l-4 border-blue-500 pl-4">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {response.employee_name} ({response.employee_role})
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {response.response.substring(0, 300)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              {/* Board Advisors */}
              {result.boardResponses && result.boardResponses.length > 0 && (
                <details className="border border-gray-200 rounded-lg">
                  <summary className="cursor-pointer px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg font-medium text-gray-900">
                    🐻 Advisory Board Consulted ({result.boardResponses.length} advisors)
                  </summary>
                  <div className="p-4 space-y-4">
                    {result.boardResponses.map((response, idx) => (
                      <div key={idx} className="border-l-4 border-purple-500 pl-4">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {response.advisor_name} - {response.advisor_role}
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {response.response.substring(0, 300)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Ask Another Question
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-red-900 mb-2">❌ Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={handleReset}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
