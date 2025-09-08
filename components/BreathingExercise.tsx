'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface BreathingExerciseProps {
  locale: string;
}

interface Phase {
  name: string;
  nameEn: string;
  duration: number;
  color: string;
}

export default function BreathingExercise({ locale }: BreathingExerciseProps) {
  const t = useTranslations('breathingExercise');
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const phases: Phase[] = [
    {
      name: t('phases.inhale'),
      nameEn: 'Inhale',
      duration: 4,
      color: 'bg-blue-600'
    },
    {
      name: t('phases.hold'),
      nameEn: 'Hold',
      duration: 7,
      color: 'bg-purple-600'
    },
    {
      name: t('phases.exhale'),
      nameEn: 'Exhale',
      duration: 8,
      color: 'bg-pink-600'
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (currentPhase < phases.length - 1) {
        // Move to next phase
        setTimeout(() => {
          setCurrentPhase(currentPhase + 1);
          setTimeLeft(phases[currentPhase + 1].duration);
        }, 500);
      } else {
        // Complete the cycle
        setIsActive(false);
        setIsComplete(true);
        setCurrentPhase(0);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentPhase, phases]);

  const startExercise = () => {
    setIsActive(true);
    setIsComplete(false);
    setCurrentPhase(0);
    setTimeLeft(phases[0].duration);
  };

  const resetExercise = () => {
    setIsActive(false);
    setIsComplete(false);
    setCurrentPhase(0);
    setTimeLeft(0);
  };

  const getCurrentPhase = () => phases[currentPhase];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🫁</span>
        </div>
        <h3 className="text-2xl font-bold text-blue-800 mb-2">
          {t('title')}
        </h3>
        <p className="text-blue-600 text-sm">
          {t('subtitle')}
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-800 mb-2">
          {t('instructions.title')}
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold text-blue-600">4</span>
            </div>
            <p className="text-blue-700">
              {t('instructions.inhale')}
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold text-purple-600">7</span>
            </div>
            <p className="text-purple-700">
              {t('instructions.hold')}
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold text-pink-600">8</span>
            </div>
            <p className="text-pink-700">
              {t('instructions.exhale')}
            </p>
          </div>
        </div>
      </div>

      {/* Exercise Display */}
      <div className="text-center mb-6">
        {isActive ? (
          <div className="space-y-4">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto transition-all duration-1000 ${getCurrentPhase().color}`}>
              <div className="text-white text-center">
                <div className="text-3xl font-bold">{timeLeft}</div>
                <div className="text-sm">
                  {locale === 'zh' ? getCurrentPhase().name : getCurrentPhase().nameEn}
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              {t('currentPhase')} {getCurrentPhase().name}
            </p>
          </div>
        ) : (
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl text-gray-400">🫁</span>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="text-center space-y-3">
        {!isActive && !isComplete && (
          <button
            onClick={startExercise}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full"
          >
{t('buttons.startPractice')}
          </button>
        )}

        {isComplete && (
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 font-medium">
                {t('buttons.oneCycleCompleted')}
              </p>
            </div>
            <button
              onClick={startExercise}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors w-full"
            >
{t('buttons.practiceAgain')}
            </button>
          </div>
        )}

        {isActive && (
          <button
            onClick={resetExercise}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
{t('buttons.stopPractice')}
          </button>
        )}
      </div>

      {/* Benefits */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <h5 className="font-semibold text-gray-800 mb-2">
          {t('benefits.title')}
        </h5>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div>
            <div className="text-lg font-bold text-blue-600">-40%</div>
            <div className="text-gray-600">
              {t('benefits.painPerception')}
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">-35%</div>
            <div className="text-gray-600">
              {t('benefits.muscleTension')}
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-pink-600">+60%</div>
            <div className="text-gray-600">
              {t('benefits.relaxation')}
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 text-xs text-gray-600">
        <p>
          {t('tip')}
        </p>
      </div>
    </div>
  );
}
