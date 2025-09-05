import Link from 'next/link';

interface RecommendationItem {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: 'blue' | 'green' | 'purple';
}

interface BottomRecommendationsProps {
  currentPage: string;
}

const BottomRecommendations = ({ currentPage }: BottomRecommendationsProps) => {
  const recommendations: Record<string, RecommendationItem[]> = {
    'natural-therapies': [
      {
        title: '场景解决方案',
        description: '从居家到外出，全方位经期不适解决方案',
        icon: '🏠',
        link: '/scenario-solutions',
        color: 'blue'
      },
      {
        title: '症状评估工具',
        description: '科学评估经期症状，获取个性化建议',
        icon: '📊',
        link: '/interactive-tools/symptom-assessment',
        color: 'green'
      }
    ],
    'health-guide': [
      {
        title: '场景解决方案',
        description: '从居家到外出，全方位经期不适解决方案',
        icon: '🏠',
        link: '/scenario-solutions',
        color: 'blue'
      },
      {
        title: '症状评估工具',
        description: '科学评估经期症状，获取个性化建议',
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
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">相关工具</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {currentRecommendations.map((rec, index) => (
            <RecommendationCard key={index} {...rec} />
          ))}
        </div>
      </div>
    </section>
  );
};

const RecommendationCard = ({ title, description, icon, link, color }: RecommendationItem) => {
  // 根据卡片类型设置不同的图标组合
  const getIcons = () => {
    if (title === '场景解决方案') {
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
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{description}</p>
        <div className="flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
          <span className="text-base mr-2">{actionIcon}</span>
          {title === '场景解决方案' ? '生活场景全覆盖' : '个性化症状分析'}
        </div>
      </div>
    </Link>
  );
};

export default BottomRecommendations;
