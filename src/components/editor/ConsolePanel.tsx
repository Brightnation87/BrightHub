import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  X, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  Code,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface ConsoleLog {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info' | 'success';
  message: string;
  timestamp: Date;
  stack?: string;
}

interface ConsolePanelProps {
  logs: ConsoleLog[];
  onClear: () => void;
  isExpanded?: boolean;
  onToggle?: () => void;
  onRunCommand?: (command: string) => void;
}

const LogIcon = ({ type }: { type: ConsoleLog['type'] }) => {
  switch (type) {
    case 'error':
      return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
    case 'warn':
      return <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />;
    case 'info':
      return <Info className="h-3.5 w-3.5 text-blue-400" />;
    case 'success':
      return <CheckCircle className="h-3.5 w-3.5 text-green-500" />;
    default:
      return <Code className="h-3.5 w-3.5 text-muted-foreground" />;
  }
};

export function ConsolePanel({ 
  logs, 
  onClear, 
  isExpanded = true, 
  onToggle,
  onRunCommand 
}: ConsolePanelProps) {
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'console' | 'elements'>('console');
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter(log => 
    filter === '' || log.message.toLowerCase().includes(filter.toLowerCase())
  );

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    onRunCommand?.(command);
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    setCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' && commandHistory.length > 0) {
      e.preventDefault();
      const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  const errorCount = logs.filter(l => l.type === 'error').length;
  const warnCount = logs.filter(l => l.type === 'warn').length;

  return (
    <motion.div
      initial={{ height: 200 }}
      animate={{ height: isExpanded ? 200 : 36 }}
      className="flex flex-col border-t border-border bg-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/30 bg-secondary/30">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'console' | 'elements')}>
          <TabsList className="h-7 bg-transparent p-0 gap-2">
            <TabsTrigger 
              value="console" 
              className="h-6 px-2 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Terminal className="h-3.5 w-3.5 mr-1" />
              Console
              {errorCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px]">
                  {errorCount}
                </span>
              )}
              {warnCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 text-[10px]">
                  {warnCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="elements" 
              className="h-6 px-2 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Code className="h-3.5 w-3.5 mr-1" />
              Elements
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-1">
          {isExpanded && (
            <>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Filter..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="h-6 w-32 pl-7 text-xs bg-background/50"
                />
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClear}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onToggle}>
            {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'console' && (
            <>
              <ScrollArea className="flex-1">
                <div ref={scrollRef} className="p-2 space-y-1 font-mono text-xs">
                  {filteredLogs.length === 0 ? (
                    <div className="text-muted-foreground text-center py-4">
                      No console output yet. Run your code to see logs here.
                    </div>
                  ) : (
                    filteredLogs.map((log) => (
                      <div
                        key={log.id}
                        className={cn(
                          "flex items-start gap-2 px-2 py-1 rounded",
                          log.type === 'error' && "bg-destructive/10",
                          log.type === 'warn' && "bg-yellow-500/10",
                          log.type === 'info' && "bg-blue-500/10",
                          log.type === 'success' && "bg-green-500/10"
                        )}
                      >
                        <LogIcon type={log.type} />
                        <div className="flex-1 min-w-0">
                          <span className={cn(
                            "break-all",
                            log.type === 'error' && "text-destructive",
                            log.type === 'warn' && "text-yellow-500",
                            log.type === 'info' && "text-blue-400",
                            log.type === 'success' && "text-green-500"
                          )}>
                            {log.message}
                          </span>
                          {log.stack && (
                            <pre className="text-[10px] text-muted-foreground mt-1 whitespace-pre-wrap">
                              {log.stack}
                            </pre>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              
              {/* Command input */}
              <form onSubmit={handleCommand} className="border-t border-border/30 p-2 flex items-center gap-2">
                <span className="text-primary text-xs">{'>'}</span>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter JavaScript expression..."
                  className="flex-1 bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground"
                />
              </form>
            </>
          )}
          
          {activeTab === 'elements' && (
            <ScrollArea className="flex-1">
              <div className="p-2 font-mono text-xs text-muted-foreground">
                <p className="text-center py-4">
                  Elements inspector shows the DOM structure of your preview.
                  <br />
                  <span className="text-primary">Click on elements in the preview to inspect them.</span>
                </p>
              </div>
            </ScrollArea>
          )}
        </div>
      )}
    </motion.div>
  );
}
