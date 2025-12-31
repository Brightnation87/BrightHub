import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  Terminal as TerminalIcon,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  content: string;
  timestamp: Date;
}

const COMMANDS: Record<string, (args: string[], lines: TerminalLine[], setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>) => void> = {
  help: (_, lines, setLines) => {
    setLines(prev => [...prev, {
      type: 'info',
      content: `Available commands:
  help          - Show this help message
  clear         - Clear terminal
  pwd           - Print working directory
  ls            - List files
  cd <dir>      - Change directory
  mkdir <name>  - Create directory
  touch <file>  - Create file
  cat <file>    - Display file contents
  echo <text>   - Print text
  date          - Show current date
  whoami        - Show current user
  node -v       - Show Node.js version
  npm -v        - Show npm version
  git --version - Show git version`,
      timestamp: new Date()
    }]);
  },
  clear: (_, lines, setLines) => {
    setLines([{
      type: 'info',
      content: 'Terminal cleared',
      timestamp: new Date()
    }]);
  },
  pwd: (_, lines, setLines) => {
    setLines(prev => [...prev, {
      type: 'output',
      content: '/home/user/project',
      timestamp: new Date()
    }]);
  },
  ls: (args, lines, setLines) => {
    const files = ['index.html', 'style.css', 'script.js', 'README.md', 'package.json', 'node_modules/', 'src/'];
    setLines(prev => [...prev, {
      type: 'output',
      content: files.join('  '),
      timestamp: new Date()
    }]);
  },
  cd: (args, lines, setLines) => {
    const dir = args[0] || '~';
    setLines(prev => [...prev, {
      type: 'success',
      content: `Changed directory to ${dir}`,
      timestamp: new Date()
    }]);
  },
  mkdir: (args, lines, setLines) => {
    if (!args[0]) {
      setLines(prev => [...prev, {
        type: 'error',
        content: 'mkdir: missing operand',
        timestamp: new Date()
      }]);
      return;
    }
    setLines(prev => [...prev, {
      type: 'success',
      content: `Created directory: ${args[0]}`,
      timestamp: new Date()
    }]);
  },
  touch: (args, lines, setLines) => {
    if (!args[0]) {
      setLines(prev => [...prev, {
        type: 'error',
        content: 'touch: missing file operand',
        timestamp: new Date()
      }]);
      return;
    }
    setLines(prev => [...prev, {
      type: 'success',
      content: `Created file: ${args[0]}`,
      timestamp: new Date()
    }]);
  },
  cat: (args, lines, setLines) => {
    if (!args[0]) {
      setLines(prev => [...prev, {
        type: 'error',
        content: 'cat: missing file operand',
        timestamp: new Date()
      }]);
      return;
    }
    setLines(prev => [...prev, {
      type: 'output',
      content: `// Contents of ${args[0]}\nconsole.log("Hello, World!");`,
      timestamp: new Date()
    }]);
  },
  echo: (args, lines, setLines) => {
    setLines(prev => [...prev, {
      type: 'output',
      content: args.join(' '),
      timestamp: new Date()
    }]);
  },
  date: (_, lines, setLines) => {
    setLines(prev => [...prev, {
      type: 'output',
      content: new Date().toString(),
      timestamp: new Date()
    }]);
  },
  whoami: (_, lines, setLines) => {
    setLines(prev => [...prev, {
      type: 'output',
      content: 'user',
      timestamp: new Date()
    }]);
  },
  node: (args, lines, setLines) => {
    if (args[0] === '-v' || args[0] === '--version') {
      setLines(prev => [...prev, {
        type: 'output',
        content: 'v20.10.0',
        timestamp: new Date()
      }]);
    } else {
      setLines(prev => [...prev, {
        type: 'info',
        content: 'Node.js REPL (simulated)',
        timestamp: new Date()
      }]);
    }
  },
  npm: (args, lines, setLines) => {
    if (args[0] === '-v' || args[0] === '--version') {
      setLines(prev => [...prev, {
        type: 'output',
        content: '10.2.3',
        timestamp: new Date()
      }]);
    } else if (args[0] === 'install' || args[0] === 'i') {
      const pkg = args[1] || 'dependencies';
      setLines(prev => [...prev, {
        type: 'info',
        content: `Installing ${pkg}...`,
        timestamp: new Date()
      }]);
      setTimeout(() => {
        setLines(prev => [...prev, {
          type: 'success',
          content: `✓ Installed ${pkg} successfully`,
          timestamp: new Date()
        }]);
      }, 1000);
    } else if (args[0] === 'run') {
      const script = args[1] || 'start';
      setLines(prev => [...prev, {
        type: 'info',
        content: `Running script: ${script}`,
        timestamp: new Date()
      }]);
    } else {
      setLines(prev => [...prev, {
        type: 'info',
        content: 'npm - Node Package Manager',
        timestamp: new Date()
      }]);
    }
  },
  git: (args, lines, setLines) => {
    if (args[0] === '--version') {
      setLines(prev => [...prev, {
        type: 'output',
        content: 'git version 2.42.0',
        timestamp: new Date()
      }]);
    } else if (args[0] === 'clone') {
      const repo = args[1] || 'repository';
      setLines(prev => [...prev, {
        type: 'info',
        content: `Cloning ${repo}...`,
        timestamp: new Date()
      }]);
      setTimeout(() => {
        setLines(prev => [...prev, {
          type: 'success',
          content: `✓ Cloned ${repo} successfully`,
          timestamp: new Date()
        }]);
      }, 1500);
    } else if (args[0] === 'status') {
      setLines(prev => [...prev, {
        type: 'output',
        content: 'On branch main\nYour branch is up to date.\n\nnothing to commit, working tree clean',
        timestamp: new Date()
      }]);
    } else if (args[0] === 'init') {
      setLines(prev => [...prev, {
        type: 'success',
        content: 'Initialized empty Git repository',
        timestamp: new Date()
      }]);
    } else {
      setLines(prev => [...prev, {
        type: 'info',
        content: 'git - distributed version control',
        timestamp: new Date()
      }]);
    }
  },
};

interface TerminalNewProps {
  isVisible: boolean;
  onToggle: () => void;
  onClose?: () => void;
}

export function TerminalNew({ isVisible, onToggle, onClose }: TerminalNewProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'info', content: 'BrightHub Terminal v1.0.0', timestamp: new Date() },
    { type: 'info', content: 'Type "help" for available commands', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const processCommand = (cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0]?.toLowerCase();
    const args = parts.slice(1);

    if (!command) return;

    // Add input line
    setLines(prev => [...prev, {
      type: 'input',
      content: `$ ${cmd}`,
      timestamp: new Date()
    }]);

    // Process command
    if (COMMANDS[command]) {
      COMMANDS[command](args, lines, setLines);
    } else {
      setLines(prev => [...prev, {
        type: 'error',
        content: `Command not found: ${command}. Type "help" for available commands.`,
        timestamp: new Date()
      }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    processCommand(input);
    setHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return 'text-primary';
      case 'output': return 'text-foreground';
      case 'error': return 'text-destructive';
      case 'success': return 'text-green-400';
      case 'info': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="terminal-panel border-t border-border flex flex-col max-h-[40vh] md:max-h-[250px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/30 bg-terminal-bg shrink-0">
            <div className="flex items-center gap-2">
              <TerminalIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Terminal</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onToggle}>
                {isVisible ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
              </Button>
              {onClose && (
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Terminal content */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-auto p-3 text-sm font-mono bg-terminal-bg"
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line, i) => (
              <div key={i} className={cn('whitespace-pre-wrap break-all', getLineColor(line.type))}>
                {line.content}
              </div>
            ))}

            {/* Input line */}
            <form onSubmit={handleSubmit} className="flex items-center mt-1">
              <span className="text-primary mr-2">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-foreground caret-primary"
                autoFocus
                spellCheck={false}
              />
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
