'use client';

import { useState, useEffect } from 'react';
import { Heart, Bookmark, Share2, Copy, Check, Eye } from 'lucide-react';

interface ArticleInteractionsProps {
  articleId: string;
  articleTitle: string;
  locale: 'zh' | 'en';
  className?: string;
}

export default function ArticleInteractions({ 
  articleId, 
  articleTitle, 
  locale,
  className = '' 
}: ArticleInteractionsProps) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [views, setViews] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // 初始化数据
  useEffect(() => {
    // 从 localStorage 获取数据
    const storedLikes = localStorage.getItem(`likes_${articleId}`);
    const storedIsLiked = localStorage.getItem(`liked_${articleId}`);
    const storedIsBookmarked = localStorage.getItem(`bookmarked_${articleId}`);
    const storedViews = localStorage.getItem(`views_${articleId}`);

    if (storedLikes) setLikes(parseInt(storedLikes));
    if (storedIsLiked) setIsLiked(storedIsLiked === 'true');
    if (storedIsBookmarked) setIsBookmarked(storedIsBookmarked === 'true');
    if (storedViews) {
      setViews(parseInt(storedViews));
    } else {
      // 首次访问，增加浏览量
      const newViews = Math.floor(Math.random() * 50) + 20; // 模拟初始浏览量
      setViews(newViews);
      localStorage.setItem(`views_${articleId}`, newViews.toString());
    }

    // 记录本次访问
    const currentViews = parseInt(localStorage.getItem(`views_${articleId}`) || '0');
    const newViews = currentViews + 1;
    setViews(newViews);
    localStorage.setItem(`views_${articleId}`, newViews.toString());
  }, [articleId]);

  // 点赞功能
  const handleLike = () => {
    const newLikedState = !isLiked;
    const newLikes = newLikedState ? likes + 1 : likes - 1;
    
    setIsLiked(newLikedState);
    setLikes(newLikes);
    
    localStorage.setItem(`liked_${articleId}`, newLikedState.toString());
    localStorage.setItem(`likes_${articleId}`, newLikes.toString());
  };

  // 收藏功能
  const handleBookmark = () => {
    const newBookmarkedState = !isBookmarked;
    setIsBookmarked(newBookmarkedState);
    
    localStorage.setItem(`bookmarked_${articleId}`, newBookmarkedState.toString());
    
    // 管理收藏列表
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (newBookmarkedState) {
      if (!bookmarks.includes(articleId)) {
        bookmarks.push(articleId);
      }
    } else {
      const index = bookmarks.indexOf(articleId);
      if (index > -1) {
        bookmarks.splice(index, 1);
      }
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  };

  // 复制链接
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // 分享到社交媒体
  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(articleTitle);
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${title} ${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${title}`
    };
    
    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const t = {
    zh: {
      like: '点赞文章',
      liked: '已点赞',
      bookmark: '收藏',
      bookmarked: '已收藏',
      share: '分享',
      views: '阅读量',
      likes: '点赞',
      copyLink: '复制链接',
      copied: '已复制',
      shareToFacebook: '分享到 Facebook',
      shareToTwitter: '分享到 Twitter',
      shareToLinkedIn: '分享到 LinkedIn',
      shareToWhatsApp: '分享到 WhatsApp',
      shareToTelegram: '分享到 Telegram'
    },
    en: {
      like: 'Like Article',
      liked: 'Liked',
      bookmark: 'Bookmark',
      bookmarked: 'Bookmarked',
      share: 'Share',
      views: 'Views',
      likes: 'Likes',
      copyLink: 'Copy Link',
      copied: 'Copied',
      shareToFacebook: 'Share to Facebook',
      shareToTwitter: 'Share to Twitter',
      shareToLinkedIn: 'Share to LinkedIn',
      shareToWhatsApp: 'Share to WhatsApp',
      shareToTelegram: 'Share to Telegram'
    }
  };

  const text = t[locale];

  return (
    <div className={`bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg p-4 sm:p-6 shadow-lg ${className}`}>
      {/* 统计信息 */}
      <div className="flex items-center justify-start mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-purple-500" />
            {views.toLocaleString()} {text.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-purple-500" />
            {likes} {text.likes}
          </span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-start flex-wrap gap-2 sm:gap-3">
        {/* 点赞按钮 */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
            isLiked
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-purple-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium hidden sm:inline">
            {isLiked ? text.liked : text.like}
          </span>
        </button>

        {/* 收藏按钮 */}
        <button
          onClick={handleBookmark}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
            isBookmarked
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-purple-200'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium hidden sm:inline">
            {isBookmarked ? text.bookmarked : text.bookmark}
          </span>
        </button>

        {/* 分享按钮 */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-600 border border-purple-200 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">{text.share}</span>
          </button>

          {/* 分享菜单 */}
          {showShareMenu && (
            <div className="absolute left-0 top-full mt-2 bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-xl py-2 z-10 min-w-48">
              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 transition-colors duration-200"
              >
                {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-purple-500" />}
                {copySuccess ? text.copied : text.copyLink}
              </button>
              <div className="border-t border-purple-100 my-1"></div>
              <button
                onClick={() => handleShare('facebook')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
              >
                📘 {text.shareToFacebook}
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
              >
                🐦 {text.shareToTwitter}
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
              >
                💼 {text.shareToLinkedIn}
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
              >
                💬 {text.shareToWhatsApp}
              </button>
              <button
                onClick={() => handleShare('telegram')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
              >
                ✈️ {text.shareToTelegram}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 点击外部关闭分享菜单 */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}
