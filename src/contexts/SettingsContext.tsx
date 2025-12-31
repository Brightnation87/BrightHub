import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface UserSettings {
  // Appearance
  theme: "light" | "dark" | "system";
  editor_background: string;
  accent_color: string;
  // Editor
  font_size: number;
  tab_size: number;
  font_family: string;
  word_wrap: boolean;
  line_numbers: boolean;
  auto_complete: boolean;
  minimap: boolean;
  bracket_matching: boolean;
  // Auto Save
  auto_save: boolean;
  auto_save_delay: number;
  // AI
  ai_hints: boolean;
  ai_auto_suggest: boolean;
  // TTS
  tts_enabled: boolean;
  tts_voice: string;
  tts_rate: number;
  tts_pitch: number;
  // Notifications
  email_notifications: boolean;
  push_notifications: boolean;
  sound_effects: boolean;
  // Privacy
  show_activity_status: boolean;
  share_progress: boolean;
}

const defaultSettings: UserSettings = {
  theme: "dark",
  editor_background: "#1e1e1e",
  accent_color: "#0ea5e9",
  font_size: 14,
  tab_size: 2,
  font_family: "JetBrains Mono",
  word_wrap: true,
  line_numbers: true,
  auto_complete: true,
  minimap: true,
  bracket_matching: true,
  auto_save: true,
  auto_save_delay: 5,
  ai_hints: true,
  ai_auto_suggest: false,
  tts_enabled: false,
  tts_voice: "default",
  tts_rate: 1,
  tts_pitch: 1,
  email_notifications: true,
  push_notifications: false,
  sound_effects: true,
  show_activity_status: true,
  share_progress: false,
};

interface SettingsContextType {
  settings: UserSettings;
  loading: boolean;
  saving: boolean;
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  saveSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoggedIn: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load settings from database or localStorage
  const loadSettings = useCallback(async () => {
    // First try localStorage for immediate use
    const localSettings = localStorage.getItem("user_settings");
    if (localSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(localSettings) });
      } catch (e) {
        console.error("Error parsing local settings:", e);
      }
    }

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const loadedSettings: UserSettings = {
          theme: (data.theme as UserSettings["theme"]) || defaultSettings.theme,
          editor_background: data.editor_background || defaultSettings.editor_background,
          accent_color: defaultSettings.accent_color,
          font_size: data.font_size ?? defaultSettings.font_size,
          tab_size: data.tab_size ?? defaultSettings.tab_size,
          font_family: data.font_family || defaultSettings.font_family,
          word_wrap: data.word_wrap ?? defaultSettings.word_wrap,
          line_numbers: data.line_numbers ?? defaultSettings.line_numbers,
          auto_complete: data.auto_complete ?? defaultSettings.auto_complete,
          minimap: data.minimap ?? defaultSettings.minimap,
          bracket_matching: data.bracket_matching ?? defaultSettings.bracket_matching,
          auto_save: data.auto_save ?? defaultSettings.auto_save,
          auto_save_delay: data.auto_save_delay ?? defaultSettings.auto_save_delay,
          ai_hints: data.ai_hints ?? defaultSettings.ai_hints,
          ai_auto_suggest: data.ai_auto_suggest ?? defaultSettings.ai_auto_suggest,
          tts_enabled: defaultSettings.tts_enabled,
          tts_voice: defaultSettings.tts_voice,
          tts_rate: defaultSettings.tts_rate,
          tts_pitch: defaultSettings.tts_pitch,
          email_notifications: data.email_notifications ?? defaultSettings.email_notifications,
          push_notifications: data.push_notifications ?? defaultSettings.push_notifications,
          sound_effects: data.sound_effects ?? defaultSettings.sound_effects,
          show_activity_status: data.show_activity_status ?? defaultSettings.show_activity_status,
          share_progress: data.share_progress ?? defaultSettings.share_progress,
        };
        setSettings(loadedSettings);
        localStorage.setItem("user_settings", JSON.stringify(loadedSettings));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Save settings
  const saveSettings = useCallback(
    async (newSettings: Partial<UserSettings>) => {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem("user_settings", JSON.stringify(updatedSettings));

      if (!user) return;

      setSaving(true);
      try {
        const { data: existing } = await supabase
          .from("user_settings")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        const dbSettings = {
          theme: updatedSettings.theme,
          editor_background: updatedSettings.editor_background,
          font_size: updatedSettings.font_size,
          tab_size: updatedSettings.tab_size,
          font_family: updatedSettings.font_family,
          word_wrap: updatedSettings.word_wrap,
          line_numbers: updatedSettings.line_numbers,
          auto_complete: updatedSettings.auto_complete,
          minimap: updatedSettings.minimap,
          bracket_matching: updatedSettings.bracket_matching,
          auto_save: updatedSettings.auto_save,
          auto_save_delay: updatedSettings.auto_save_delay,
          ai_hints: updatedSettings.ai_hints,
          ai_auto_suggest: updatedSettings.ai_auto_suggest,
          email_notifications: updatedSettings.email_notifications,
          push_notifications: updatedSettings.push_notifications,
          sound_effects: updatedSettings.sound_effects,
          show_activity_status: updatedSettings.show_activity_status,
          share_progress: updatedSettings.share_progress,
        };

        if (existing) {
          await supabase
            .from("user_settings")
            .update(dbSettings)
            .eq("user_id", user.id);
        } else {
          await supabase
            .from("user_settings")
            .insert({ user_id: user.id, ...dbSettings });
        }
      } catch (error) {
        console.error("Error saving settings:", error);
      } finally {
        setSaving(false);
      }
    },
    [user, settings]
  );

  const updateSetting = useCallback(
    <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
      saveSettings({ [key]: value } as Partial<UserSettings>);
    },
    [saveSettings]
  );

  const resetSettings = useCallback(async () => {
    setSettings(defaultSettings);
    localStorage.setItem("user_settings", JSON.stringify(defaultSettings));

    if (!user) return;

    setSaving(true);
    try {
      await supabase
        .from("user_settings")
        .update(defaultSettings)
        .eq("user_id", user.id);
    } catch (error) {
      console.error("Error resetting settings:", error);
    } finally {
      setSaving(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      loadSettings();
    }
  }, [authLoading, loadSettings]);

  // Apply theme
  useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (settings.theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, [settings.theme]);

  // Apply accent color
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-custom", settings.accent_color);
  }, [settings.accent_color]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading: loading || authLoading,
        saving,
        updateSetting,
        saveSettings,
        resetSettings,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
