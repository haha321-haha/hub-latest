import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface RecommendationItem {
  titleKey: string;
  descriptionKey: string;
  actionTextKey: string;
  icon: string;
  link: string;
  color: 'blue' | 'green' | 'purple';
}

interface BottomRecommendationsProps {
  currentPage: string;
}

const BottomRecommendations = ({ currentPage }: BottomRecommendationsProps) => {
  const t = useTranslations('bottomRecommendations');
  
  const recommendations: Record<string, RecommendationItem[]> = {
    'natural-therapies': [
      {
        titleKey: 'scenarioSolutions.title',
        descriptionKey: 'scenarioSolutions.description',
        actionTextKey: 'scenarioSolutions.actionText',
        icon: '🏠',
        link: '/scenario-solutions',
        color: 'blue'
      },
      {
        titleKey: 'symptomAssessment.title',
        descriptionKey: 'symptomAssessment.description',
        actionTextKey: 'symptomAssessment.actionText',
        icon: '📊',
        link: '/interactive-tools/symptom-assessment',
        color: 'green'
      }
    ],
    'health-guide': [
      {
        titleKey: 'scenarioSolutions.title',
        descriptionKey: 'scenarioSolutions.description',
        actionTextKey: 'scenarioSolutions.actionText',
        icon: '🏠',
        link: '/scenario-solutions',
        color: 'blue'
      },
      {
        titleKey: 'symptomAssessment.title',
        descriptionKey: 'symptomAssessment.description',
        actionTextKey: 'symptomAssessment.actionText',
        icon: '📊',
        link: '/interactive-tools/symptom-assessment',
        color: 'green'
      }
    ]
  };

  const currentRecommendations = recommendations[currentPage] || [];

  if (currentRecommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">{t('title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {currentRecommendations.map((rec, index) => (
            <RecommendationCard key={index} {...rec} />
          ))}
        </div>
      </div>
    </section>
  );
};

const RecommendationCard = ({ titleKey, descriptionKey, actionTextKey, icon, link, color }: RecommendationItem) => {
  const t = useTranslations('bottomRecommendations');
  
  // 根据卡片类型设置不同的图标组合
  const getIcons = () => {
    if (titleKey === 'scenarioSolutions.title') {
      return { mainIcon: '🏠', actionIcon: '🏡' };
    } else {
      return { mainIcon: '📊', actionIcon: '📈' };
    }
  };

  const { mainIcon, actionIcon } = getIcons();

  return (
    <Link href={link} className="block group">
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-3">{mainIcon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{t(titleKey)}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{t(descriptionKey)}</p>
        <div className="flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
          <span className="text-base mr-2">{actionIcon}</span>
          {t(actionTextKey)}
        </div>
      </div>
    </Link>
  );
};

export default BottomRecommendations;
