import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Play, Save, Download, Settings, Share2, RotateCcw, LogIn, LogOut, FolderOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ResponsiveMonacoEditor } from "@/components/editor/ResponsiveMonacoEditor";
import { useIsMobile } from "@/hooks/use-mobile";
import { EnhancedFileExplorer, FileItem } from "@/components/editor/EnhancedFileExplorer";
import { ConsolePanel, ConsoleLog } from "@/components/editor/ConsolePanel";
import { EnhancedPreview } from "@/components/editor/EnhancedPreview";
import { AIMentor } from "@/components/ai/AIMentor";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useProjects, Project } from "@/hooks/useProjects";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Website</title>
</head>
<body>
  <div class="container">
    <h1>Welcome to BNCode!</h1>
    <p>Start building amazing websites today with our powerful code editor.</p>
    <button onclick="showMessage()">Get Started</button>
    <div class="features">
      <span class="feature">HTML</span>
      <span class="feature">CSS</span>
      <span class="feature">JavaScript</span>
    </div>
  </div>
</body>
</html>`;

const defaultCss = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
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
  padding: 3rem 4rem;
  border-radius: 24px;
  text-align: center;
  max-width: 500px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #0078d4, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: rgba(255,255,255,0.7);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

button {
  background: linear-gradient(135deg, #0078d4, #00a8ff);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 120, 212, 0.4);
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 120, 212, 0.6);
}

.features {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.feature {
  background: rgba(0,120,212,0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #0078d4;
}`;

const defaultJs = `function showMessage() {
  alert('🎉 Awesome! You just ran your first JavaScript code!');
  console.log('Button clicked!');
}

// Log when page loads
console.log('Welcome to BNCode Editor!');
console.info('Your code is ready to run.');`;

const initialFiles: FileItem[] = [
  {
    id: "root",
    name: "my-project",
    type: "folder",
    children: [
      { id: "1", name: "index.html", type: "file", language: "html", content: defaultHtml },
      { id: "2", name: "styles.css", type: "file", language: "css", content: defaultCss },
      { id: "3", name: "script.js", type: "file", language: "javascript", content: defaultJs },
    ],
  },
];

type Tab = "editor" | "preview" | "ai";

export default function Editor() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [selectedFileId, setSelectedFileId] = useState("1");
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [consoleExpanded, setConsoleExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("editor");
  const [showPreview, setShowPreview] = useState(true);
  const [showAI, setShowAI] = useState(true);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

  const { user, signOut } = useAuth();
  const { projects, saveProject } = useProjects();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Find selected file recursively
  const findFile = useCallback((items: FileItem[], id: string): FileItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findFile(item.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const selectedFile = findFile(files, selectedFileId);

  // Get all file contents for preview
  const getFileContents = useCallback(() => {
    const findContent = (items: FileItem[], lang: string): string => {
      for (const item of items) {
        if (item.type === 'file' && item.language === lang && item.content) {
          return item.content;
        }
        if (item.children) {
          const found = findContent(item.children, lang);
          if (found) return found;
        }
      }
      return '';
    };

    return {
      html: findContent(files, 'html'),
      css: findContent(files, 'css'),
      js: findContent(files, 'javascript'),
    };
  }, [files]);

  // Update file content
  const updateFileContent = useCallback((id: string, content: string) => {
    const updateRecursive = (items: FileItem[]): FileItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, content };
        }
        if (item.children) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };
    setFiles(updateRecursive(files));
  }, [files]);

  // Create new file
  const createFile = (name: string, parentId: string | null, content = '') => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    const langMap: Record<string, string> = { js: 'javascript', html: 'html', css: 'css', ts: 'typescript' };
    const newFile: FileItem = {
      id: Date.now().toString(),
      name,
      type: 'file',
      language: langMap[ext] || 'plaintext',
      content,
    };

    if (parentId) {
      const addToParent = (items: FileItem[]): FileItem[] => {
        return items.map(item => {
          if (item.id === parentId && item.children) {
            return { ...item, children: [...item.children, newFile] };
          }
          if (item.children) {
            return { ...item, children: addToParent(item.children) };
          }
          return item;
        });
      };
      setFiles(addToParent(files));
    } else {
      setFiles([...files, newFile]);
    }
    setSelectedFileId(newFile.id);
  };

  // Create folder
  const createFolder = (name: string, parentId: string | null) => {
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name,
      type: 'folder',
      children: [],
    };

    if (parentId) {
      const addToParent = (items: FileItem[]): FileItem[] => {
        return items.map(item => {
          if (item.id === parentId && item.children) {
            return { ...item, children: [...item.children, newFolder] };
          }
          if (item.children) {
            return { ...item, children: addToParent(item.children) };
          }
          return item;
        });
      };
      setFiles(addToParent(files));
    } else {
      setFiles([...files, newFolder]);
    }
  };

  // Delete file
  const deleteFile = (id: string) => {
    const removeRecursive = (items: FileItem[]): FileItem[] => {
      return items.filter(item => item.id !== id).map(item => {
        if (item.children) {
          return { ...item, children: removeRecursive(item.children) };
        }
        return item;
      });
    };
    setFiles(removeRecursive(files));
    if (selectedFileId === id) {
      setSelectedFileId("1");
    }
  };

  // Rename file
  const renameFile = (id: string, newName: string) => {
    const ext = newName.split('.').pop()?.toLowerCase() || '';
    const langMap: Record<string, string> = { js: 'javascript', html: 'html', css: 'css', ts: 'typescript' };
    
    const renameRecursive = (items: FileItem[]): FileItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, name: newName, language: item.type === 'file' ? langMap[ext] || 'plaintext' : undefined };
        }
        if (item.children) {
          return { ...item, children: renameRecursive(item.children) };
        }
        return item;
      });
    };
    setFiles(renameRecursive(files));
  };

  // Import files
  const importFiles = async (importedFiles: File[]) => {
    for (const file of importedFiles) {
      const content = await file.text();
      createFile(file.name, "root", content);
    }
    toast({ title: "Files imported", description: `Imported ${importedFiles.length} file(s)` });
  };

  // Console log handler
  const handleConsoleLog = (log: ConsoleLog) => {
    setConsoleLogs(prev => [...prev.slice(-100), log]);
  };

  // Run console command
  const runCommand = (command: string) => {
    try {
      const result = eval(command);
      handleConsoleLog({
        id: Date.now().toString(),
        type: 'log',
        message: String(result),
        timestamp: new Date(),
      });
    } catch (error: any) {
      handleConsoleLog({
        id: Date.now().toString(),
        type: 'error',
        message: error.message,
        timestamp: new Date(),
      });
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to save your projects." });
      navigate("/auth");
      return;
    }
    if (currentProject) {
      await saveProject(currentProject.name, JSON.stringify(files), currentProject.id);
    } else {
      setSaveDialogOpen(true);
    }
  };

  const handleSaveNew = async () => {
    if (!projectName.trim()) {
      toast({ title: "Name required", description: "Please enter a project name.", variant: "destructive" });
      return;
    }
    const project = await saveProject(projectName.trim(), JSON.stringify(files));
    if (project) {
      setCurrentProject(project);
      setSaveDialogOpen(false);
      setProjectName("");
    }
  };

  const loadProject = (project: Project) => {
    try {
      const loadedFiles = JSON.parse(project.code);
      setFiles(loadedFiles);
      setCurrentProject(project);
      toast({ title: "Project loaded", description: `Loaded "${project.name}"` });
    } catch {
      toast({ title: "Error", description: "Failed to load project", variant: "destructive" });
    }
  };

  // Mobile view
  const MobileView = () => (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-border bg-card">
        {[{ id: "editor" as Tab, label: "Editor" }, { id: "preview" as Tab, label: "Preview" }, { id: "ai" as Tab, label: "AI" }].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn("flex-1 py-3 text-sm font-medium transition-colors", activeTab === tab.id ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground")}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTab === "editor" && (
          <div className="h-full flex flex-col">
            <ResponsiveMonacoEditor
              value={selectedFile?.content || ''}
              language={selectedFile?.language || 'html'}
              fileName={selectedFile?.name || 'untitled'}
              onChange={(content) => selectedFile && updateFileContent(selectedFile.id, content)}
              onSave={handleSave}
            />
            <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} isExpanded={consoleExpanded} onToggle={() => setConsoleExpanded(!consoleExpanded)} onRunCommand={runCommand} />
          </div>
        )}
        {activeTab === "preview" && <EnhancedPreview files={getFileContents()} onConsoleLog={handleConsoleLog} />}
        {activeTab === "ai" && <AIMentor />}
      </div>
    </div>
  );

  // Desktop view
  const DesktopView = () => (
    <div className="flex h-full">
      <div className="w-56 flex-shrink-0 hidden lg:block">
        <EnhancedFileExplorer
          files={files}
          selectedId={selectedFileId}
          onFileSelect={(file) => file.type === 'file' && setSelectedFileId(file.id)}
          onCreateFile={createFile}
          onCreateFolder={createFolder}
          onRenameFile={renameFile}
          onDeleteFile={deleteFile}
          onImportFiles={importFiles}
        />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex min-h-0">
          <div className={cn("flex-1 flex flex-col min-w-0", showPreview && "border-r border-border")}>
            <ResponsiveMonacoEditor
              value={selectedFile?.content || ''}
              language={selectedFile?.language || 'html'}
              fileName={selectedFile?.name || 'untitled'}
              onChange={(content) => selectedFile && updateFileContent(selectedFile.id, content)}
              onSave={handleSave}
            />
          </div>
          {showPreview && (
            <div className="w-1/2 flex-shrink-0 hidden xl:block">
              <EnhancedPreview files={getFileContents()} onConsoleLog={handleConsoleLog} />
            </div>
          )}
        </div>
        <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} isExpanded={consoleExpanded} onToggle={() => setConsoleExpanded(!consoleExpanded)} onRunCommand={runCommand} />
      </div>
      {showAI && <div className="w-80 flex-shrink-0 hidden lg:block"><AIMentor /></div>}
    </div>
  );

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 border-b border-border bg-card flex items-center justify-between px-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></Button>
            {currentProject && <span className="text-xs text-muted-foreground hidden sm:inline">{currentProject.name}</span>}
            <div className="flex items-center gap-1">
              <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={handleSave}><Save className="h-3.5 w-3.5" /><span className="hidden sm:inline">Save</span></Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Save Project</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2"><Label htmlFor="projectName">Project Name</Label><Input id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="My Awesome Project" /></div>
                    <Button onClick={handleSaveNew} className="w-full">Save Project</Button>
                  </div>
                </DialogContent>
              </Dialog>
              {user && projects.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="gap-1.5 text-xs"><FolderOpen className="h-3.5 w-3.5" /><span className="hidden sm:inline">Projects</span></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="start">{projects.map((project) => (<DropdownMenuItem key={project.id} onClick={() => loadProject(project)}>{project.name}</DropdownMenuItem>))}</DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => { setFiles(initialFiles); setCurrentProject(null); setSelectedFileId("1"); }}><RotateCcw className="h-3.5 w-3.5" /><span className="hidden sm:inline">Reset</span></Button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant={showPreview ? "secondary" : "ghost"} size="sm" className="gap-1.5 text-xs hidden md:flex" onClick={() => setShowPreview(!showPreview)}><Play className="h-3.5 w-3.5" />Preview</Button>
            <Button variant={showAI ? "secondary" : "ghost"} size="sm" className="gap-1.5 text-xs hidden md:flex" onClick={() => setShowAI(!showAI)}>AI</Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Share2 className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="h-4 w-4" /></Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><User className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground">{user.email}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}><LogOut className="h-4 w-4 mr-2" />Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => navigate("/auth")}><LogIn className="h-3.5 w-3.5" /><span className="hidden sm:inline">Sign In</span></Button>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <div className="md:hidden h-full"><MobileView /></div>
          <div className="hidden md:block h-full"><DesktopView /></div>
        </main>
      </div>
    </div>
  );
}
