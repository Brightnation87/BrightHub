import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  Play, 
  Save, 
  Download, 
  Settings, 
  Share2, 
  RotateCcw, 
  LogIn, 
  LogOut, 
  FolderOpen, 
  User,
  Code,
  Eye,
  Terminal as TerminalIcon,
  Sparkles,
  FileCode,
  X,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveMonacoEditor } from "@/components/editor/ResponsiveMonacoEditor";
import { FileExplorerNew } from "@/components/editor/FileExplorerNew";
import { TerminalNew } from "@/components/editor/TerminalNew";
import { Preview } from "@/components/editor/Preview";
import { AIMentor } from "@/components/ai/AIMentor";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useFileSystem, FileSystemProvider } from "@/hooks/useFileSystem";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const defaultCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Website</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: linear-gradient(135deg, #0f0f23, #1a1a2e);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 3rem;
      border-radius: 24px;
      text-align: center;
      max-width: 500px;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #0078d4, #00d4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p { color: rgba(255,255,255,0.7); margin-bottom: 2rem; }
    button {
      background: linear-gradient(135deg, #0078d4, #00a8ff);
      color: white;
      border: none;
      padding: 14px 32px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    button:hover { transform: translateY(-3px); }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to BrightHub!</h1>
    <p>Start building amazing websites with our powerful code editor.</p>
    <button onclick="alert('🎉 Hello, World!')">Get Started</button>
  </div>
</body>
</html>`;

type MobileTab = "editor" | "preview" | "files";

function EditorContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { currentFile, setCurrentFile, updateFile, createFile } = useFileSystem();

  const [code, setCode] = useState(defaultCode);
  const [activeTab, setActiveTab] = useState<MobileTab>("editor");
  const [showTerminal, setShowTerminal] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync code with current file
  useEffect(() => {
    if (currentFile && currentFile.content !== undefined) {
      setCode(currentFile.content);
    }
  }, [currentFile]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your work.",
      });
      navigate("/auth");
      return;
    }

    setIsSaving(true);
    try {
      if (currentFile) {
        await updateFile(currentFile.id, code);
        toast({ title: "Saved", description: `${currentFile.name} saved successfully` });
      } else {
        const file = await createFile("untitled.html", null, code);
        if (file) {
          toast({ title: "Saved", description: "File created and saved" });
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile?.name || 'index.html';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: `${currentFile?.name || 'index.html'} downloaded` });
  };

  // Mobile bottom navigation tabs
  const mobileNavTabs = [
    { id: "files" as MobileTab, icon: FolderOpen, label: "Files" },
    { id: "editor" as MobileTab, icon: Code, label: "Editor" },
    { id: "preview" as MobileTab, icon: Eye, label: "Preview" },
  ];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header / Toolbar */}
      <header className="h-12 border-b border-border bg-card flex items-center justify-between px-2 sm:px-3 shrink-0 z-10">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop: Back button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Current file name */}
          {currentFile && (
            <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[120px]">
              {currentFile.name}
            </span>
          )}

          {/* Save button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 text-xs h-8" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
          </Button>

          {/* Reset button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 text-xs h-8" 
            onClick={() => {
              setCode(defaultCode);
              setCurrentFile(null);
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          {/* Run / Preview toggle (desktop) */}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs h-8 hidden md:flex"
            onClick={() => setActiveTab(activeTab === "preview" ? "editor" : "preview")}
          >
            <Play className="h-3.5 w-3.5" />
            <span>Run</span>
          </Button>

          {/* Terminal toggle */}
          <Button
            variant={showTerminal ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowTerminal(!showTerminal)}
          >
            <TerminalIcon className="h-4 w-4" />
          </Button>

          {/* AI toggle */}
          <Button
            variant={showAI ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowAI(!showAI)}
          >
            <Sparkles className="h-4 w-4" />
          </Button>

          {/* Download */}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/settings")}>
            <Settings className="h-4 w-4" />
          </Button>

          {/* Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs h-8"
              onClick={() => navigate("/auth")}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop: File Explorer sidebar */}
        <div className="hidden lg:block w-56 shrink-0 border-r border-border">
          <FileExplorerNew />
        </div>

        {/* Main editor/preview area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile: Tab content */}
          <div className="flex-1 overflow-hidden md:hidden">
            <AnimatePresence mode="wait">
              {activeTab === "files" && (
                <motion.div
                  key="files"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <FileExplorerNew 
                    isMobile 
                    onClose={() => setActiveTab("editor")} 
                  />
                </motion.div>
              )}
              {activeTab === "editor" && (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex-1 min-h-0">
                    <ResponsiveMonacoEditor
                      value={code}
                      language={currentFile?.language || "html"}
                      onChange={handleCodeChange}
                      fileName={currentFile?.name || "untitled.html"}
                    />
                  </div>
                  <TerminalNew 
                    isVisible={showTerminal} 
                    onToggle={() => setShowTerminal(!showTerminal)}
                    onClose={() => setShowTerminal(false)}
                  />
                </motion.div>
              )}
              {activeTab === "preview" && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full"
                >
                  <Preview code={code} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop: Split view */}
          <div className="hidden md:flex flex-1 overflow-hidden">
            {/* Editor */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-border">
              <div className="flex-1 min-h-0">
                <ResponsiveMonacoEditor
                  value={code}
                  language={currentFile?.language || "html"}
                  onChange={handleCodeChange}
                  fileName={currentFile?.name || "untitled.html"}
                />
              </div>
              <TerminalNew 
                isVisible={showTerminal} 
                onToggle={() => setShowTerminal(!showTerminal)}
              />
            </div>

            {/* Preview panel */}
            <div className="w-1/2 shrink-0 hidden xl:block">
              <Preview code={code} />
            </div>
          </div>
        </div>

        {/* AI Panel (desktop sidebar) */}
        <AnimatePresence>
          {showAI && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:block shrink-0 border-l border-border overflow-hidden"
            >
              <div className="w-80 h-full">
                <AIMentor />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: Bottom Navigation */}
      <nav className="md:hidden border-t border-border bg-card shrink-0 safe-area-bottom">
        <div className="flex items-center justify-around h-14">
          {mobileNavTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
          {/* Terminal quick toggle in nav */}
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
              showTerminal ? "text-primary" : "text-muted-foreground"
            )}
          >
            <TerminalIcon className="h-5 w-5" />
            <span className="text-[10px] font-medium">Terminal</span>
          </button>
          {/* AI quick toggle */}
          <button
            onClick={() => setShowAI(!showAI)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
              showAI ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-[10px] font-medium">AI</span>
          </button>
        </div>
      </nav>

      {/* Mobile AI Sheet */}
      <Sheet open={showAI} onOpenChange={setShowAI}>
        <SheetContent side="right" className="w-full sm:w-96 p-0">
          <AIMentor />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function EditorNew() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <FileSystemProvider>
      <EditorContent />
    </FileSystemProvider>
  );
}
