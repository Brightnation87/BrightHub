import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink, Smartphone, Monitor, Tablet, Code, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ConsoleLog } from './ConsolePanel';

interface FileContent {
  html: string;
  css: string;
  js: string;
}

interface EnhancedPreviewProps {
  files: FileContent;
  onConsoleLog?: (log: ConsoleLog) => void;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

const viewportSizes: Record<ViewportSize, { width: string; icon: React.ReactNode; label: string }> = {
  mobile: { width: '375px', icon: <Smartphone className="h-4 w-4" />, label: 'Mobile' },
  tablet: { width: '768px', icon: <Tablet className="h-4 w-4" />, label: 'Tablet' },
  desktop: { width: '100%', icon: <Monitor className="h-4 w-4" />, label: 'Desktop' },
};

export function EnhancedPreview({ files, onConsoleLog }: EnhancedPreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [key, setKey] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const buildHtml = useCallback(() => {
    const { html, css, js } = files;
    
    // Check if HTML already has full structure
    const hasDoctype = html.toLowerCase().includes('<!doctype');
    const hasHtmlTag = html.toLowerCase().includes('<html');
    
    if (hasDoctype || hasHtmlTag) {
      // Inject CSS and JS into existing HTML
      let modifiedHtml = html;
      
      // Add console capture script
      const consoleCapture = `
        <script>
          (function() {
            const originalConsole = {
              log: console.log,
              error: console.error,
              warn: console.warn,
              info: console.info
            };
            
            function sendToParent(type, args) {
              try {
                const message = Array.from(args).map(arg => {
                  if (typeof arg === 'object') {
                    try {
                      return JSON.stringify(arg, null, 2);
                    } catch (e) {
                      return String(arg);
                    }
                  }
                  return String(arg);
                }).join(' ');
                
                window.parent.postMessage({
                  type: 'console',
                  logType: type,
                  message: message
                }, '*');
              } catch (e) {}
            }
            
            console.log = function() {
              sendToParent('log', arguments);
              originalConsole.log.apply(console, arguments);
            };
            
            console.error = function() {
              sendToParent('error', arguments);
              originalConsole.error.apply(console, arguments);
            };
            
            console.warn = function() {
              sendToParent('warn', arguments);
              originalConsole.warn.apply(console, arguments);
            };
            
            console.info = function() {
              sendToParent('info', arguments);
              originalConsole.info.apply(console, arguments);
            };
            
            window.onerror = function(msg, url, line, col, error) {
              sendToParent('error', [msg + ' at line ' + line]);
              return false;
            };
            
            window.onunhandledrejection = function(event) {
              sendToParent('error', ['Unhandled Promise Rejection: ' + event.reason]);
            };
          })();
        </script>
      `;
      
      // Inject console capture into head
      if (modifiedHtml.includes('</head>')) {
        modifiedHtml = modifiedHtml.replace('</head>', consoleCapture + '</head>');
      } else if (modifiedHtml.includes('<body')) {
        modifiedHtml = modifiedHtml.replace('<body', consoleCapture + '<body');
      }
      
      // Add external CSS if provided and not already in HTML
      if (css.trim() && !modifiedHtml.includes(css.trim().substring(0, 50))) {
        const styleTag = `<style>\n${css}\n</style>`;
        if (modifiedHtml.includes('</head>')) {
          modifiedHtml = modifiedHtml.replace('</head>', styleTag + '</head>');
        } else if (modifiedHtml.includes('<body')) {
          modifiedHtml = modifiedHtml.replace('<body', styleTag + '<body');
        }
      }
      
      // Add external JS if provided
      if (js.trim()) {
        const scriptTag = `<script>\n${js}\n</script>`;
        if (modifiedHtml.includes('</body>')) {
          modifiedHtml = modifiedHtml.replace('</body>', scriptTag + '</body>');
        } else {
          modifiedHtml += scriptTag;
        }
      }
      
      return modifiedHtml;
    }
    
    // Build full HTML document
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script>
    (function() {
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
      };
      
      function sendToParent(type, args) {
        try {
          const message = Array.from(args).map(arg => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch (e) {
                return String(arg);
              }
            }
            return String(arg);
          }).join(' ');
          
          window.parent.postMessage({
            type: 'console',
            logType: type,
            message: message
          }, '*');
        } catch (e) {}
      }
      
      console.log = function() {
        sendToParent('log', arguments);
        originalConsole.log.apply(console, arguments);
      };
      
      console.error = function() {
        sendToParent('error', arguments);
        originalConsole.error.apply(console, arguments);
      };
      
      console.warn = function() {
        sendToParent('warn', arguments);
        originalConsole.warn.apply(console, arguments);
      };
      
      console.info = function() {
        sendToParent('info', arguments);
        originalConsole.info.apply(console, arguments);
      };
      
      window.onerror = function(msg, url, line, col, error) {
        sendToParent('error', [msg + ' at line ' + line]);
        return false;
      };
      
      window.onunhandledrejection = function(event) {
        sendToParent('error', ['Unhandled Promise Rejection: ' + event.reason]);
      };
    })();
  </script>
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    ${js}
  </script>
</body>
</html>`;
  }, [files]);

  const refresh = () => setKey((k) => k + 1);

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'console') {
        onConsoleLog?.({
          id: Date.now().toString() + Math.random(),
          type: event.data.logType,
          message: event.data.message,
          timestamp: new Date(),
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleLog]);

  const htmlContent = buildHtml();
  const blobUrl = URL.createObjectURL(new Blob([htmlContent], { type: 'text/html' }));

  useEffect(() => {
    return () => URL.revokeObjectURL(blobUrl);
  }, [blobUrl]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col bg-card border-l border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Preview</span>
          <div className="flex items-center rounded-md border border-border bg-background p-0.5">
            {(Object.entries(viewportSizes) as [ViewportSize, typeof viewportSizes[ViewportSize]][]).map(([size, config]) => (
              <Button
                key={size}
                variant="ghost"
                size="icon"
                className={cn(
                  'h-6 w-6 rounded-sm',
                  viewport === size && 'bg-primary text-primary-foreground'
                )}
                onClick={() => setViewport(size)}
              >
                {config.icon}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-7 w-7", showCode && "bg-primary/20")}
            onClick={() => setShowCode(!showCode)}
          >
            {showCode ? <Eye className="h-3.5 w-3.5" /> : <Code className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={refresh}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => window.open(blobUrl, '_blank')}>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Preview content */}
      <div className="flex-1 bg-muted/30 overflow-auto flex items-start justify-center p-4">
        {showCode ? (
          <div className="w-full h-full overflow-auto">
            <pre className="p-4 text-xs font-mono text-muted-foreground whitespace-pre-wrap">
              {htmlContent}
            </pre>
          </div>
        ) : (
          <div
            className={cn(
              'h-full bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300',
              viewport !== 'desktop' && 'border border-border'
            )}
            style={{ 
              width: viewportSizes[viewport].width,
              maxWidth: '100%'
            }}
          >
            <iframe
              ref={iframeRef}
              key={key}
              src={blobUrl}
              className="w-full h-full border-0"
              title="Preview"
              sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
