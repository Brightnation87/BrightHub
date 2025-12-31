import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
}

const sampleCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Website</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
    }
    .container {
      background: white;
      padding: 2rem 3rem;
      border-radius: 16px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.25);
      text-align: center;
    }
    h1 {
      color: #333;
      margin-bottom: 0.5rem;
    }
    p {
      color: #666;
    }
    button {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to BNCode!</h1>
    <p>Start building amazing websites today.</p>
    <button onclick="alert('Hello, World!')">Click Me</button>
  </div>
</body>
</html>`;

// Simple line renderer without complex highlighting
function renderLines(code: string): React.ReactNode[] {
  const lines = code.split('\n');
  
  return lines.map((line, lineIndex) => {
    // Apply simple syntax classes
    let processedLine = line
      // Escape HTML first
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Keywords
    processedLine = processedLine.replace(
      /\b(const|let|var|function|return|if|else|for|while|class|import|export|default|from)\b/g,
      '<span class="text-syntax-keyword">$1</span>'
    );
    
    // Strings (double and single quotes)
    processedLine = processedLine.replace(
      /(&quot;|"|')((?:(?!\1)[^\\]|\\.)*)(\1)/g,
      '<span class="text-syntax-string">$1$2$3</span>'
    );
    
    // HTML tags (after escaping)
    processedLine = processedLine.replace(
      /(&lt;\/?)([\w-]+)/g,
      '<span class="text-syntax-tag">$1$2</span>'
    );
    
    // CSS properties
    processedLine = processedLine.replace(
      /(\s+)([\w-]+)(\s*:)/g,
      '$1<span class="text-syntax-variable">$2</span>$3'
    );
    
    // Numbers with units
    processedLine = processedLine.replace(
      /\b(\d+\.?\d*)(px|rem|em|%|vh|vw|deg|s|ms)?\b/g,
      '<span class="text-syntax-number">$1$2</span>'
    );
    
    // Comments
    processedLine = processedLine.replace(
      /(\/\/.*)$/gm,
      '<span class="text-syntax-comment">$1</span>'
    );
    
    return (
      <div key={lineIndex} className="flex hover:bg-editor-line/50 transition-colors">
        <span className="w-12 text-right pr-4 text-muted-foreground/40 select-none flex-shrink-0 text-xs">
          {lineIndex + 1}
        </span>
        <span 
          className="flex-1"
          dangerouslySetInnerHTML={{ __html: processedLine || '&nbsp;' }}
        />
      </div>
    );
  });
}

export function CodeEditor({ initialCode = sampleCode, language = "html", onChange, readOnly = false }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [cursorLine, setCursorLine] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onChange?.(newCode);
    
    // Update cursor line
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = newCode.substring(0, cursorPos);
    const lineNumber = textBeforeCursor.split('\n').length;
    setCursorLine(lineNumber);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="editor-panel h-full flex flex-col"
    >
      {/* Editor header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30 bg-editor-gutter">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-muted-foreground ml-2 font-mono">index.html</span>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-0.5 rounded bg-primary/20 text-primary">{language.toUpperCase()}</span>
          <span>Line {cursorLine}</span>
        </div>
      </div>

      {/* Editor content */}
      <div className="flex-1 relative overflow-auto font-mono text-sm leading-6">
      {/* Highlighted code display */}
      <div className="absolute inset-0 p-4 pointer-events-none whitespace-pre overflow-hidden text-foreground">
        {renderLines(code)}
      </div>
        
        {/* Actual textarea for editing */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          className={cn(
            "absolute inset-0 w-full h-full p-4 pl-16 resize-none bg-transparent text-transparent caret-primary focus:outline-none",
            "font-mono text-sm leading-6 whitespace-pre"
          )}
        />

        {/* Current line highlight */}
        <div 
          className="absolute left-0 right-0 h-6 bg-editor-line pointer-events-none transition-transform"
          style={{ transform: `translateY(${(cursorLine - 1) * 24 + 16}px)` }}
        />
      </div>
    </motion.div>
  );
}
