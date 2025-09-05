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
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
    green: 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
    purple: 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100'
  };

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
      <div className={`p-4 sm:p-6 rounded-lg border-2 ${colorClasses[color]} transition-all duration-200 group-hover:shadow-lg`}>
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-3">{mainIcon}</span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-sm mb-4 opacity-90 leading-relaxed">{description}</p>
        <div className="flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
          <span className="text-base mr-2">{actionIcon}</span>
          {title === '场景解决方案' ? '生活场景全覆盖' : '个性化症状分析'}
        </div>
      </div>
    </Link>
  );
};

export default BottomRecommendations;
