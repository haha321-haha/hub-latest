'use client';

import React from 'react';
import { assessmentQuestions } from './shared/data/assessmentQuestions';

export default function TestAssessment() {
  const zhQuestions = assessmentQuestions.zh || [];
  const enQuestions = assessmentQuestions.en || [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Assessment Questions Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">中文问题 ({zhQuestions.length} 题)</h2>
        <ol className="list-decimal list-inside space-y-2">
          {zhQuestions.map((q, index) => (
            <li key={q.id} className="text-sm">
              {index + 1}. {q.title} (ID: {q.id})
            </li>
          ))}
        </ol>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">English Questions ({enQuestions.length} 题)</h2>
        <ol className="list-decimal list-inside space-y-2">
          {enQuestions.map((q, index) => (
            <li key={q.id} className="text-sm">
              {index + 1}. {q.title} (ID: {q.id})
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
