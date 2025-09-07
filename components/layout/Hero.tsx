import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles, Heart, Users, BookOpen } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="relative text-white min-h-screen flex items-center overflow-hidden" style={{
      background: 'linear-gradient(135deg, #db2777 0%, #7e22ce 50%, #9333ea 100%)'
    }}>
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white/5 opacity-20"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-pink-300/50 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-blue-300/40 rounded-full animate-ping"></div>
        
        {/* Gradient halos */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left content */}
          <div className="text-center lg:text-left">
            {/* Welcome badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{t('welcomeBadge')}</span>
            </div>

            {/* Main title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent">
                {t('title')}
              </span>
              <br />
              <span className="text-4xl md:text-5xl lg:text-6xl font-medium">
                {t('titleHighlight')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed font-normal">
              {t('subtitle')}
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{t('features.personalizedRecord')}</span>
                  <span className="text-xs opacity-80">{t('features.personalizedRecordDesc')}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{t('features.evidenceBasedGuide')}</span>
                  <span className="text-xs opacity-80">{t('features.evidenceBasedGuideDesc')}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{t('features.privacyFirst')}</span>
                  <span className="text-xs opacity-80">{t('features.privacyFirstDesc')}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{t('features.precisionPrediction')}</span>
                  <span className="text-xs opacity-80">{t('features.precisionPredictionDesc')}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href={`/${locale}/immediate-relief`}>
                <Button 
                  size="lg" 
                  className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 min-w-[200px] group"
                >
                  {t('immediateRelief')}
                  <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={`/${locale}/interactive-tools`}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 min-w-[200px]"
                >
                  {t('cta.primary')}
                </Button>
              </Link>
              <Link href={`/${locale}/health-guide`}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 min-w-[200px]"
                >
                  {t('cta.secondary')}
                </Button>
              </Link>
            </div>

            {/* Statistics */}
            <div className="flex items-center justify-center lg:justify-start space-x-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {t('toolsCount')}
                </div>
                <div className="text-sm opacity-80">{t('stats.tools')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {t('articlesCount')}
                </div>
                <div className="text-sm opacity-80">{t('stats.content')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm opacity-80">{t('stats.support')}</div>
              </div>
            </div>
          </div>

          {/* Right visual elements */}
          <div className="hidden lg:block relative">
            <div className="relative">
              {/* Main visual card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  {/* Tool card */}
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">{t('toolCards.painTracker')}</div>
                        <div className="text-sm opacity-80">{t('toolCards.painTrackerDesc')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Cycle tracker card */}
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">{t('toolCards.cycleTracker')}</div>
                        <div className="text-sm opacity-80">{t('toolCards.cycleTrackerDesc')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Constitution test card */}
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">{t('toolCards.constitutionTest')}</div>
                        <div className="text-sm opacity-80">{t('toolCards.constitutionTestDesc')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400/30 to-purple-600/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}