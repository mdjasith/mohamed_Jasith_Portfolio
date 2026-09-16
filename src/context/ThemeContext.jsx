import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "portfolio-theme-settings";

const DEFAULT_SETTINGS = {
  theme: "cyberpunk",
  accent: "cyan",
  glow: "high",
  animations: true,
};

const ThemeContext = createContext(null);

function getInitialSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(saved),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(
    getInitialSettings
  );

  useLayoutEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = settings.theme;
    root.dataset.accent = settings.accent;
    root.dataset.glow = settings.glow;
    root.dataset.animations = settings.animations
      ? "on"
      : "off";

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );
  }, [settings]);

  const changeTheme = (theme) => {
    setSettings((previous) => ({
      ...previous,
      theme,
    }));
  };

  const changeAccent = (accent) => {
    setSettings((previous) => ({
      ...previous,
      accent,
    }));
  };

  const changeGlow = (glow) => {
    setSettings((previous) => ({
      ...previous,
      glow,
    }));
  };

  const toggleAnimations = () => {
    setSettings((previous) => ({
      ...previous,
      animations: !previous.animations,
    }));
  };

  const resetTheme = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const value = useMemo(
    () => ({
      settings,
      changeTheme,
      changeAccent,
      changeGlow,
      toggleAnimations,
      resetTheme,
    }),
    [settings]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}