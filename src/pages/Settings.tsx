import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Palette, 
  Type, 
  Code2, 
  Keyboard, 
  Save, 
  Bot, 
  RotateCcw,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  Menu,
  Bell,
  Shield,
  User,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { cn } from "@/lib/utils";
import { useSettings, UserSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const settingSections: SettingSection[] = [
  { id: "appearance", title: "Appearance", icon: <Palette className="h-5 w-5" />, description: "Theme, colors, and visual settings" },
  { id: "editor", title: "Editor", icon: <Code2 className="h-5 w-5" />, description: "Code editor preferences" },
  { id: "font", title: "Font & Text", icon: <Type className="h-5 w-5" />, description: "Typography settings" },
  { id: "keyboard", title: "Keyboard", icon: <Keyboard className="h-5 w-5" />, description: "Shortcuts and key bindings" },
  { id: "autosave", title: "Auto Save", icon: <Save className="h-5 w-5" />, description: "Automatic saving options" },
  { id: "ai", title: "AI Preferences", icon: <Bot className="h-5 w-5" />, description: "AI assistant settings" },
  { id: "notifications", title: "Notifications", icon: <Bell className="h-5 w-5" />, description: "Email and push notification preferences" },
  { id: "privacy", title: "Privacy", icon: <Shield className="h-5 w-5" />, description: "Control your data and visibility" },
  { id: "account", title: "Account", icon: <User className="h-5 w-5" />, description: "Profile and account settings" },
];

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("appearance");
  const { settings, updateSetting, resetSettings, loading, saving, isLoggedIn } = useSettings();
  const { user } = useAuth();

  const renderSettings = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    switch (activeSection) {
      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Theme</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "light", label: "Light", icon: <Sun className="h-5 w-5" /> },
                  { id: "dark", label: "Dark", icon: <Moon className="h-5 w-5" /> },
                  { id: "system", label: "System", icon: <Monitor className="h-5 w-5" /> },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => updateSetting("theme", t.id as UserSettings["theme"])}
                    disabled={saving}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all",
                      settings.theme === t.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50",
                      saving && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {t.icon}
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Editor Background</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { color: "#1e1e1e", name: "VS Code" },
                  { color: "#0d1117", name: "GitHub" },
                  { color: "#282a36", name: "Dracula" },
                  { color: "#1a1b26", name: "Tokyo Night" },
                ].map((bg) => (
                  <button
                    key={bg.color}
                    onClick={() => updateSetting("editor_background", bg.color)}
                    disabled={saving}
                    className={cn(
                      "h-16 sm:h-12 rounded-lg border transition-colors flex flex-col items-center justify-center gap-1",
                      settings.editor_background === bg.color
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-primary/50"
                    )}
                    style={{ backgroundColor: bg.color }}
                  >
                    <span className="text-xs text-white/70">{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "editor":
        return (
          <div className="space-y-6">
            <SettingToggle
              label="Line Numbers"
              description="Show line numbers in the editor"
              checked={settings.line_numbers}
              onCheckedChange={(val) => updateSetting("line_numbers", val)}
              disabled={saving}
            />
            <SettingToggle
              label="Word Wrap"
              description="Wrap long lines to fit the editor width"
              checked={settings.word_wrap}
              onCheckedChange={(val) => updateSetting("word_wrap", val)}
              disabled={saving}
            />
            <SettingToggle
              label="Auto Complete"
              description="Show code suggestions while typing"
              checked={settings.auto_complete}
              onCheckedChange={(val) => updateSetting("auto_complete", val)}
              disabled={saving}
            />
            <SettingToggle
              label="Minimap"
              description="Show code overview minimap on the right"
              checked={settings.minimap}
              onCheckedChange={(val) => updateSetting("minimap", val)}
              disabled={saving}
            />
            <SettingToggle
              label="Bracket Matching"
              description="Highlight matching brackets when cursor is near"
              checked={settings.bracket_matching}
              onCheckedChange={(val) => updateSetting("bracket_matching", val)}
              disabled={saving}
            />
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-sm font-medium">Tab Size</h3>
                  <p className="text-xs text-muted-foreground">Number of spaces per tab</p>
                </div>
                <span className="text-sm font-mono bg-secondary px-2 py-1 rounded w-fit">{settings.tab_size}</span>
              </div>
              <Slider
                value={[settings.tab_size]}
                onValueChange={([val]) => updateSetting("tab_size", val)}
                min={2}
                max={8}
                step={2}
                className="w-full"
                disabled={saving}
              />
            </div>
          </div>
        );

      case "font":
        return (
          <div className="space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-sm font-medium">Font Size</h3>
                  <p className="text-xs text-muted-foreground">Editor font size in pixels</p>
                </div>
                <span className="text-sm font-mono bg-secondary px-2 py-1 rounded w-fit">{settings.font_size}px</span>
              </div>
              <Slider
                value={[settings.font_size]}
                onValueChange={([val]) => updateSetting("font_size", val)}
                min={10}
                max={24}
                step={1}
                className="w-full"
                disabled={saving}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Font Family</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {["JetBrains Mono", "Fira Code", "Monaco", "Consolas"].map((font) => (
                  <button
                    key={font}
                    onClick={() => updateSetting("font_family", font)}
                    disabled={saving}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-colors",
                      settings.font_family === font
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                    style={{ fontFamily: font }}
                  >
                    <span className="text-sm">{font}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-secondary font-mono text-sm overflow-x-auto" style={{ fontSize: settings.font_size, fontFamily: settings.font_family }}>
              <span className="text-primary">const</span>{" "}
              <span className="text-foreground">message</span> ={" "}
              <span className="text-green-400">"Preview text"</span>;
            </div>
          </div>
        );

      case "autosave":
        return (
          <div className="space-y-6">
            <SettingToggle
              label="Auto Save"
              description="Automatically save your work"
              checked={settings.auto_save}
              onCheckedChange={(val) => updateSetting("auto_save", val)}
              disabled={saving}
            />
            {settings.auto_save && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-medium">Save Delay</h3>
                    <p className="text-xs text-muted-foreground">Seconds after last edit</p>
                  </div>
                  <span className="text-sm font-mono bg-secondary px-2 py-1 rounded w-fit">{settings.auto_save_delay}s</span>
                </div>
                <Slider
                  value={[settings.auto_save_delay]}
                  onValueChange={([val]) => updateSetting("auto_save_delay", val)}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                  disabled={saving}
                />
              </div>
            )}
          </div>
        );

      case "ai":
        return (
          <div className="space-y-6">
            <SettingToggle
              label="AI Hints"
              description="Show helpful hints while coding"
              checked={settings.ai_hints}
              onCheckedChange={(val) => updateSetting("ai_hints", val)}
              disabled={saving}
            />
            <SettingToggle
              label="Auto Suggestions"
              description="Automatically suggest code completions using AI"
              checked={settings.ai_auto_suggest}
              onCheckedChange={(val) => updateSetting("ai_auto_suggest", val)}
              disabled={saving}
            />
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <SettingToggle
              label="Email Notifications"
              description="Receive updates and announcements via email"
              checked={settings.email_notifications}
              onCheckedChange={(val) => updateSetting("email_notifications", val)}
              disabled={saving}
            />
            <SettingToggle
              label="Push Notifications"
              description="Get browser notifications for important updates"
              checked={settings.push_notifications}
              onCheckedChange={(val) => updateSetting("push_notifications", val)}
              disabled={saving}
            />
            <SettingToggle
              label="Sound Effects"
              description="Play sounds for notifications and actions"
              checked={settings.sound_effects}
              onCheckedChange={(val) => updateSetting("sound_effects", val)}
              disabled={saving}
            />
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <SettingToggle
              label="Show Activity Status"
              description="Let others see when you're active on the platform"
              checked={settings.show_activity_status}
              onCheckedChange={(val) => updateSetting("show_activity_status", val)}
              disabled={saving}
            />
            <SettingToggle
              label="Share Learning Progress"
              description="Allow your learning progress to be visible to others"
              checked={settings.share_progress}
              onCheckedChange={(val) => updateSetting("share_progress", val)}
              disabled={saving}
            />
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <h4 className="text-sm font-medium mb-2">Data & Privacy</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Your data is stored securely and never shared with third parties without your consent.
              </p>
              <Button variant="outline" size="sm">
                Download My Data
              </Button>
            </div>
          </div>
        );

      case "account":
        return (
          <div className="space-y-6">
            {isLoggedIn ? (
              <>
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <h4 className="text-sm font-medium mb-2">Signed in as</h4>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/profile">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-4 rounded-lg bg-secondary/50 border border-border text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Sign in to save your settings and sync across devices
                </p>
                <Button asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        );

      case "keyboard":
        return (
          <div className="space-y-3">
            {[
              { keys: "Ctrl + S", action: "Save file" },
              { keys: "Ctrl + Z", action: "Undo" },
              { keys: "Ctrl + Shift + Z", action: "Redo" },
              { keys: "Ctrl + /", action: "Toggle comment" },
              { keys: "Ctrl + D", action: "Duplicate line" },
              { keys: "Ctrl + F", action: "Find" },
              { keys: "Tab", action: "Indent" },
              { keys: "Shift + Tab", action: "Outdent" },
              { keys: "Ctrl + Shift + F", action: "Format code" },
              { keys: "Ctrl + G", action: "Go to line" },
            ].map((shortcut, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-secondary/50">
                <span className="text-sm">{shortcut.action}</span>
                <kbd className="px-2 py-1 rounded bg-background border border-border text-xs font-mono w-fit">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card px-4 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden flex-shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">Settings</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Customize your experience</p>
            </div>
            {saving && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Mobile nav - horizontal scrolling */}
          <div className="md:hidden border-b border-border overflow-x-auto flex-shrink-0">
            <div className="flex p-2 gap-1 min-w-max">
              {settingSections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  size="sm"
                  className="flex-shrink-0 gap-1.5"
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.icon}
                  <span className="text-xs">{section.title}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Desktop Settings navigation */}
          <nav className="w-64 border-r border-border p-4 overflow-y-auto hidden md:block flex-shrink-0">
            <div className="space-y-1">
              {settingSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {section.icon}
                  <span className="flex-1 truncate">{section.title}</span>
                  <ChevronRight className="h-4 w-4 opacity-50 flex-shrink-0" />
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <Button 
                variant="outline" 
                className="w-full gap-2" 
                size="sm"
                onClick={resetSettings}
                disabled={saving || !isLoggedIn}
              >
                <RotateCcw className="h-4 w-4" />
                Reset All Settings
              </Button>
            </div>
          </nav>

          {/* Settings content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto md:mx-0"
            >
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-1">
                  {settingSections.find((s) => s.id === activeSection)?.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {settingSections.find((s) => s.id === activeSection)?.description}
                </p>
              </div>

              {renderSettings()}

              {/* Mobile reset button */}
              <div className="md:hidden mt-8 pt-6 border-t border-border">
                <Button 
                  variant="outline" 
                  className="w-full gap-2" 
                  size="sm"
                  onClick={resetSettings}
                  disabled={saving || !isLoggedIn}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset All Settings
                </Button>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start sm:items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium">{label}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onCheckedChange} 
        disabled={disabled}
        className="flex-shrink-0"
      />
    </div>
  );
}
