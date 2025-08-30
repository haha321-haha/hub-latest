'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useAppStore } from '@/lib/stores/appStore';

// 模态框类型
export interface Modal {
  id: string;
  title?: string;
  content: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

// 模态框上下文
interface ModalContextType {
  modals: Modal[];
  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// 模态框Provider
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<Modal[]>([]);

  const openModal = useCallback((modal: Omit<Modal, 'id'>) => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newModal: Modal = {
      id,
      size: 'md',
      closable: true,
      confirmText: '确认',
      cancelText: '取消',
      type: 'info',
      ...modal
    };

    setModals(prev => [...prev, newModal]);

    // 记录到应用状态
    const { recordModalAction } = useAppStore.getState();
    recordModalAction({
      action: 'open',
      modalId: id,
      modalType: newModal.type || 'info',
      timestamp: new Date().toISOString()
    });

    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals(prev => prev.filter(modal => modal.id !== id));

    // 记录到应用状态
    const { recordModalAction } = useAppStore.getState();
    recordModalAction({
      action: 'close',
      modalId: id,
      timestamp: new Date().toISOString()
    });
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal, closeAllModals }}>
      {children}
      <ModalManager />
    </ModalContext.Provider>
  );
};

// 使用模态框Hook
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// 模态框管理器
export const ModalManager: React.FC = () => {
  const { modals, closeModal } = useModal();

  if (modals.length === 0) return null;

  return (
    <>
      {modals.map((modal) => (
        <ModalOverlay key={modal.id} modal={modal} onClose={() => closeModal(modal.id)} />
      ))}
    </>
  );
};

// 模态框覆盖层
interface ModalOverlayProps {
  modal: Modal;
  onClose: () => void;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ modal, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && modal.closable) {
      onClose();
    }
  };

  const handleConfirm = () => {
    modal.onConfirm?.();
    onClose();
  };

  const handleClose = () => {
    modal.onClose?.();
    onClose();
  };

  const getSizeClasses = () => {
    switch (modal.size) {
      case 'sm':
        return 'max-w-sm';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-full mx-4';
      default:
        return 'max-w-lg';
    }
  };

  const getTypeClasses = () => {
    switch (modal.type) {
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      case 'success':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className={`w-full ${getSizeClasses()} bg-white rounded-lg shadow-xl border ${getTypeClasses()}`}>
        {/* 头部 */}
        {modal.title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{modal.title}</h3>
            {modal.closable && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* 内容 */}
        <div className="p-4">
          {modal.content}
        </div>

        {/* 底部按钮 */}
        {(modal.onConfirm || modal.closable) && (
          <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
            {modal.closable && (
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {modal.cancelText}
              </button>
            )}
            {modal.onConfirm && (
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {modal.confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
