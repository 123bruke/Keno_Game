export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    setText: (text: string) => void;
    setParams: (params: { text?: string; color?: string; text_color?: string; is_active?: boolean; is_visible?: boolean }) => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const getTelegramWebApp = (): TelegramWebApp | null => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

// Safe wrapper for Telegram functionalities
export const tgWebApp = {
  isAvailable: (): boolean => !!getTelegramWebApp(),
  
  ready: () => {
    getTelegramWebApp()?.ready();
  },

  expand: () => {
    getTelegramWebApp()?.expand();
  },

  getUser: () => {
    const tg = getTelegramWebApp();
    if (tg?.initDataUnsafe?.user) {
      return tg.initDataUnsafe.user;
    }
    // Fallback mock user for development
    return {
      id: 88888888,
      first_name: 'Casino',
      last_name: 'Player',
      username: 'keno_champion',
      photo_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80',
    };
  },

  getThemeParams: () => {
    return getTelegramWebApp()?.themeParams || {};
  },

  haptic: {
    impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
      getTelegramWebApp()?.HapticFeedback.impactOccurred(style);
    },
    notification: (type: 'error' | 'success' | 'warning') => {
      getTelegramWebApp()?.HapticFeedback.notificationOccurred(type);
    },
    selection: () => {
      getTelegramWebApp()?.HapticFeedback.selectionChanged();
    }
  },

  mainButton: {
    show: (text: string, onClick: () => void, color?: string) => {
      const tg = getTelegramWebApp();
      if (!tg) return;
      tg.MainButton.setParams({
        text,
        is_visible: true,
        is_active: true,
        color: color || '#8B5CF6', // Purple-500
      });
      tg.MainButton.onClick(onClick);
    },
    hide: () => {
      const tg = getTelegramWebApp();
      if (!tg) return;
      tg.MainButton.hide();
    },
    setLoading: (loading: boolean) => {
      const tg = getTelegramWebApp();
      if (!tg) return;
      if (loading) {
        tg.MainButton.showProgress(false);
      } else {
        tg.MainButton.hideProgress();
      }
    }
  },

  backButton: {
    show: (onClick: () => void) => {
      const tg = getTelegramWebApp();
      if (!tg) return;
      tg.BackButton.show();
      tg.BackButton.onClick(onClick);
    },
    hide: () => {
      const tg = getTelegramWebApp();
      if (!tg) return;
      tg.BackButton.hide();
    }
  }
};
