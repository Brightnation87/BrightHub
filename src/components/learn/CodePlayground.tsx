import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Copy, Check, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ResponsiveMonacoEditor } from "@/components/editor/ResponsiveMonacoEditor";
import { useIsMobile } from "@/hooks/use-mobile";

interface CodePlaygroundProps {
  initialCode?: string;
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  language?: "html" | "css" | "javascript" | "multi";
  title?: string;
  expectedOutput?: string;
  onComplete?: () => void;
}

type TabType = "html" | "css" | "js";

export function CodePlayground({ 
  initialCode = "", 
  initialHtml = "",
  initialCss = "",
  initialJs = "",
  language = "multi",
  title = "Try it yourself!",
  expectedOutput,
  onComplete
}: CodePlaygroundProps) {
  const isMulti = language === "multi" || (initialHtml || initialCss || initialJs);
  const isMobile = useIsMobile();
  
  const [htmlCode, setHtmlCode] = useState(initialHtml || initialCode);
  const [cssCode, setCssCode] = useState(initialCss);
  const [jsCode, setJsCode] = useState(initialJs);
  const [activeTab, setActiveTab] = useState<TabType>("html");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showPreview, setShowPreview] = useState(!isMobile);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const buildOutput = () => {
    if (isMulti) {
      return `
<!DOCTYPE html>
<html>
<head>
  <style>${cssCode}</style>
</head>
<body>
  ${htmlCode.replace(/<!DOCTYPE html>|<\/?html>|<\/?head>|<\/?body>|<title>.*<\/title>/gi, '')}
  <script>${jsCode}<\/script>
</body>
</html>`;
    } else if (language === "html" || language === "css") {
      const cssWrapper = language === "css" 
        ? `<style>${htmlCode}</style><div class="preview">Your styled content here</div>`
        : htmlCode;
      return cssWrapper;
    }
    return "";
  };

  const runCode = () => {
    if (!isMulti && language === "javascript") {
      try {
        const logs: string[] = [];
        const mockConsole = {
          log: (...args: any[]) => logs.push(args.map(a => 
            typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
          ).join(" ")),
          error: (...args: any[]) => logs.push(`Error: ${args.join(" ")}`),
          warn: (...args: any[]) => logs.push(`Warning: ${args.join(" ")}`),
        };
        
        const func = new Function('console', htmlCode);
        func(mockConsole);
        setOutput(logs.join("\n") || "// No console output");
      } catch (error: any) {
        setOutput(`Error: ${error.message}`);
      }
    } else {
      setOutput(buildOutput());
    }

    if (expectedOutput && output.includes(expectedOutput)) {
      setIsCorrect(true);
      onComplete?.();
      toast.success("Correct! Great job!");
    }
  };

  const resetCode = () => {
    setHtmlCode(initialHtml || initialCode);
    setCssCode(initialCss);
    setJsCode(initialJs);
    setOutput("");
    setIsCorrect(false);
  };

  const getCurrentCode = () => {
    if (activeTab === "html") return htmlCode;
    if (activeTab === "css") return cssCode;
    return jsCode;
  };

  const setCurrentCode = (code: string) => {
    if (activeTab === "html") setHtmlCode(code);
    else if (activeTab === "css") setCssCode(code);
    else setJsCode(code);
  };

  const getLanguageForTab = (): string => {
    if (activeTab === "html") return "html";
    if (activeTab === "css") return "css";
    return "javascript";
  };

  const getFileNameForTab = (): string => {
    if (activeTab === "html") return "index.html";
    if (activeTab === "css") return "styles.css";
    return "script.js";
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(getCurrentCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Code copied!");
  };

  // Auto-run for HTML/CSS
  useEffect(() => {
    const timer = setTimeout(() => {
      runCode();
    }, 500);
    return () => clearTimeout(timer);
  }, [htmlCode, cssCode, jsCode]);

  const tabs: { id: TabType; label: string }[] = [
    { id: "html", label: "HTML" },
    { id: "css", label: "CSS" },
    { id: "js", label: "JS" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col h-full bg-card overflow-hidden rounded-lg border border-border",
        isFullscreen && "fixed inset-0 z-50 rounded-none"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-secondary/50 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs sm:text-sm font-medium sm:ml-2 truncate max-w-[140px] sm:max-w-none">{title}</span>
          {isCorrect && (
            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 text-xs font-medium whitespace-nowrap">
              ✓ Done
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1">
          {isMobile && (
            <Button 
              variant={showPreview ? "secondary" : "ghost"} 
              size="icon" 
              className="h-7 w-7 sm:h-8 sm:w-8" 
              onClick={() => setShowPreview(!showPreview)}
            >
              <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={copyCode}>
            {copied ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" /> : <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={resetCode}>
            <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Code Editor Section */}
        <div className={cn(
          "flex flex-col min-h-0",
          isMobile && showPreview ? "hidden" : "flex-1 lg:w-1/2"
        )}>
          {/* Tabs */}
          {isMulti && (
            <div className="flex border-b border-border bg-muted/30">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-background text-foreground border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Monaco Editor */}
          <div className="flex-1 min-h-[200px] sm:min-h-[300px]">
            <ResponsiveMonacoEditor
              value={getCurrentCode()}
              language={getLanguageForTab()}
              fileName={getFileNameForTab()}
              onChange={(code) => setCurrentCode(code)}
            />
          </div>

          {/* Run button for JavaScript */}
          {!isMulti && language === "javascript" && (
            <div className="p-2 border-t border-border bg-muted/30">
              <Button onClick={runCode} size="sm" className="w-full sm:w-auto">
                <Play className="h-4 w-4 mr-1" />
                Run Code
              </Button>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className={cn(
          "border-t lg:border-t-0 lg:border-l border-border",
          isMobile && !showPreview ? "hidden" : "flex-1 lg:w-1/2 min-h-[200px] lg:min-h-0"
        )}>
          <div className="h-full flex flex-col">
            <div className="px-3 py-1.5 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground">
              Preview
            </div>
            <div className="flex-1 bg-white">
              <iframe
                ref={iframeRef}
                srcDoc={output}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {expectedOutput && !isCorrect && (
        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-primary/5 border-t border-border flex-shrink-0">
          <p className="text-xs sm:text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Goal:</span> {expectedOutput}
          </p>
        </div>
      )}
    </motion.div>
  );
}
