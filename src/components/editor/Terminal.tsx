import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal as TerminalIcon, X, Minus, Square, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TerminalLine {
  id: number;
  type: "input" | "output" | "error" | "success";
  content: string;
  timestamp: Date;
}

const welcomeMessage = `Welcome to BNCode Terminal v1.0.0
Type 'help' for available commands.

`;

const helpText = `Available commands:
  help      - Show this help message
  clear     - Clear the terminal
  echo      - Echo text back
  date      - Show current date/time
  ls        - List files
  pwd       - Print working directory
  whoami    - Display current user
  version   - Show BNCode version
`;

interface TerminalProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function Terminal({ isExpanded = true, onToggle }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 0, type: "output", content: welcomeMessage, timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const processCommand = (cmd: string): { type: TerminalLine["type"]; content: string } => {
    const trimmed = cmd.trim().toLowerCase();
    const parts = cmd.trim().split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    switch (command) {
      case "help":
        return { type: "output", content: helpText };
      case "clear":
        setLines([]);
        return { type: "output", content: "" };
      case "echo":
        return { type: "output", content: args || "" };
      case "date":
        return { type: "output", content: new Date().toLocaleString() };
      case "ls":
        return { type: "output", content: "index.html  styles.css  script.js  assets/" };
      case "pwd":
        return { type: "output", content: "/home/user/my-project" };
      case "whoami":
        return { type: "output", content: "guest" };
      case "version":
        return { type: "success", content: "BNCode v1.0.0 - Bright Nation Code Editor" };
      case "":
        return { type: "output", content: "" };
      default:
        return { type: "error", content: `Command not found: ${command}. Type 'help' for available commands.` };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && input !== "") return;

    const inputLine: TerminalLine = {
      id: Date.now(),
      type: "input",
      content: `$ ${input}`,
      timestamp: new Date(),
    };

    const result = processCommand(input);
    
    if (result.content || input.trim().toLowerCase() !== "clear") {
      const outputLine: TerminalLine = {
        id: Date.now() + 1,
        type: result.type,
        content: result.content,
        timestamp: new Date(),
      };

      setLines((prev) => [...prev, inputLine, ...(result.content ? [outputLine] : [])]);
    }

    if (input.trim()) {
      setHistory((prev) => [...prev, input]);
    }
    setHistoryIndex(-1);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <motion.div
      initial={{ height: 200 }}
      animate={{ height: isExpanded ? 200 : 36 }}
      className="terminal-panel flex flex-col border-t border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/30 bg-terminal-bg">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Terminal</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={onToggle}
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <Minus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <Square className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-3 text-sm"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line) => (
            <div
              key={line.id}
              className={cn(
                "whitespace-pre-wrap",
                line.type === "input" && "text-primary",
                line.type === "output" && "text-foreground",
                line.type === "error" && "text-destructive",
                line.type === "success" && "text-green-400"
              )}
            >
              {line.content}
            </div>
          ))}
          
          {/* Input line */}
          <form onSubmit={handleSubmit} className="flex items-center">
            <span className="text-primary mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-foreground caret-primary"
              autoFocus
            />
          </form>
        </div>
      )}
    </motion.div>
  );
}
