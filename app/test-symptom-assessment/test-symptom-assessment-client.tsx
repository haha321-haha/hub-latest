'use client';

import React, { useState } from 'react';
import { useSymptomAssessment } from '../[locale]/interactive-tools/shared/hooks/useSymptomAssessment';
import { AssessmentAnswer } from '../[locale]/interactive-tools/shared/types';

export default function TestSymptomAssessmentClient() {
  const {
    currentSession,
    currentQuestion,
    currentQuestionIndex,
    isComplete,
    progress,
    totalQuestions,
    startAssessment,
    answerQuestion,
    goToPreviousQuestion,
    goToNextQuestion,
    resetAssessment,
    completeAssessment
  } = useSymptomAssessment();

  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: string | number) => {
    if (currentQuestion) {
      const answer: AssessmentAnswer = {
        questionId: currentQuestion.id,
        value: value,
        timestamp: new Date().toISOString()
      };
      answerQuestion(answer);
    }
  };

  const handleComplete = () => {
    const results = completeAssessment();
    setShowResults(true);
  };

  const handleReset = () => {
    resetAssessment();
    setShowResults(false);
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Symptom Assessment</h1>
          <p className="text-gray-600 mb-6">This is a test page for the symptom assessment functionality.</p>
          <button
            onClick={() => startAssessment('en')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Test Assessment
          </button>
        </div>
      </div>
    );
  }

  if (isComplete && showResults) {
    const results = completeAssessment();
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Assessment Results</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Summary</h2>
                <p className="text-blue-800">
                  Assessment completed successfully. This is a test environment.
                </p>
                {results && (
                  <div className="mt-4">
                    <p className="text-blue-800">Severity: {results.severity}</p>
                    <p className="text-blue-800">Type: {results.type}</p>
                    <p className="text-blue-800">Score: {results.score}/{results.maxScore}</p>
                    <p className="text-blue-800">Percentage: {results.percentage}%</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Details</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">Progress: {progress}%</p>
                  <p className="text-gray-700">Questions Completed: {currentQuestionIndex} / {totalQuestions}</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Reset Assessment
                </button>
                <button
                  onClick={() => setShowResults(false)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Test Symptom Assessment</h2>
          
          {currentQuestion && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">
                  Question {currentQuestionIndex + 1}
                </h2>
                <p className="text-blue-800 text-lg">
                  {currentQuestion.title}
                </p>
              </div>

              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Progress: {progress}% ({currentQuestionIndex + 1} / {totalQuestions})
                </div>
                <div className="flex space-x-2">
                  {currentQuestionIndex > 0 && (
                    <button
                      onClick={goToPreviousQuestion}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  {currentQuestionIndex < totalQuestions - 1 && (
                    <button
                      onClick={goToNextQuestion}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next
                    </button>
                  )}
                  {isComplete && (
                    <button
                      onClick={handleComplete}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Complete Assessment
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
