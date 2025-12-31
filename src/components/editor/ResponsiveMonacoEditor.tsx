import { useRef, useCallback, useEffect, useState } from 'react';
import Editor, { OnMount, OnChange, Monaco } from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Loader2, Maximize2, Minimize2, Settings2 } from 'lucide-react';
import { getSnippetsForLanguage } from '@/data/codeSnippets';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ResponsiveMonacoEditorProps {
  value: string;
  language?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  fileName?: string;
  onSave?: () => void;
}

// Self-closing HTML tags
const SELF_CLOSING_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

// HTML tags that commonly have specific attributes
const TAG_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'target', 'rel', 'download'],
  img: ['src', 'alt', 'width', 'height', 'loading'],
  input: ['type', 'name', 'placeholder', 'value', 'required', 'disabled'],
  button: ['type', 'disabled', 'onclick'],
  form: ['action', 'method', 'enctype'],
  link: ['rel', 'href', 'type'],
  script: ['src', 'type', 'async', 'defer'],
  meta: ['name', 'content', 'charset', 'http-equiv'],
  div: ['class', 'id', 'style'],
  span: ['class', 'id', 'style'],
  video: ['src', 'controls', 'autoplay', 'loop', 'muted', 'poster'],
  audio: ['src', 'controls', 'autoplay', 'loop', 'muted'],
  iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
  table: ['border', 'cellpadding', 'cellspacing'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan', 'scope'],
  select: ['name', 'multiple', 'required', 'disabled'],
  option: ['value', 'selected', 'disabled'],
  textarea: ['name', 'rows', 'cols', 'placeholder', 'required'],
  label: ['for'],
  canvas: ['width', 'height'],
  svg: ['width', 'height', 'viewBox', 'xmlns'],
};

export function ResponsiveMonacoEditor({ 
  value, 
  language = 'html', 
  onChange, 
  readOnly = false,
  fileName = 'untitled',
  onSave
}: ResponsiveMonacoEditorProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const isMobile = useIsMobile();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(isMobile ? 12 : 14);
  const [showMinimap, setShowMinimap] = useState(!isMobile);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('on');

  // Register comprehensive snippets for a language
  const registerSnippets = useCallback((monaco: Monaco, lang: string) => {
    const snippets = getSnippetsForLanguage(lang);
    if (snippets.length === 0) return;

    monaco.languages.registerCompletionItemProvider(lang, {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = snippets.map((snippet) => ({
          label: snippet.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: snippet.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: snippet.documentation,
          detail: snippet.detail,
          range,
          sortText: '0' + snippet.label, // Prioritize snippets
        }));

        return { suggestions };
      },
    });
  }, []);

  // Register HTML auto-closing tags and Emmet-like completions
  const registerHTMLCompletions = useCallback((monaco: Monaco) => {
    // Auto-close tags on typing '>'
    monaco.languages.registerCompletionItemProvider('html', {
      triggerCharacters: ['>'],
      provideCompletionItems: (model, position) => {
        const lineContent = model.getLineContent(position.lineNumber);
        const textBeforeCursor = lineContent.substring(0, position.column - 1);
        
        // Match opening tag
        const match = textBeforeCursor.match(/<(\w+)(?:\s[^>]*)?>$/);
        
        if (match) {
          const tag = match[1].toLowerCase();
          
          // Don't auto-close self-closing tags
          if (SELF_CLOSING_TAGS.has(tag)) {
            return { suggestions: [] };
          }

          return {
            suggestions: [{
              label: `</${tag}>`,
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: `$0</${tag}>`,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Auto-close tag',
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column,
                endColumn: position.column,
              },
              sortText: '0', // Highest priority
            }],
          };
        }
        return { suggestions: [] };
      },
    });

    // HTML tag completions with attributes
    monaco.languages.registerCompletionItemProvider('html', {
      triggerCharacters: ['<'],
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const tags = Object.keys(TAG_ATTRIBUTES);
        const suggestions = tags.map(tag => {
          const isSelfClosing = SELF_CLOSING_TAGS.has(tag);
          const attrs = TAG_ATTRIBUTES[tag] || [];
          const attrHint = attrs.slice(0, 2).join(', ');
          
          return {
            label: tag,
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: isSelfClosing 
              ? `${tag} $0 />`
              : `${tag}>$0</${tag}>`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: isSelfClosing ? 'Self-closing tag' : `<${tag}>...</${tag}>`,
            documentation: attrs.length > 0 ? `Common attributes: ${attrHint}...` : undefined,
            range,
          };
        });

        return { suggestions };
      },
    });

    // Attribute suggestions when inside a tag
    monaco.languages.registerCompletionItemProvider('html', {
      triggerCharacters: [' ', '"', "'"],
      provideCompletionItems: (model, position) => {
        const lineContent = model.getLineContent(position.lineNumber);
        const textBeforeCursor = lineContent.substring(0, position.column - 1);
        
        // Check if we're inside a tag
        const tagMatch = textBeforeCursor.match(/<(\w+)(?:\s[^>]*)?$/);
        
        if (tagMatch) {
          const tag = tagMatch[1].toLowerCase();
          const attrs = TAG_ATTRIBUTES[tag] || [];
          
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const suggestions = attrs.map(attr => ({
            label: attr,
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: `${attr}="$0"`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: `${tag} attribute`,
            range,
          }));

          return { suggestions };
        }
        return { suggestions: [] };
      },
    });
  }, []);

  // Register CSS completions
  const registerCSSCompletions = useCallback((monaco: Monaco) => {
    const cssProperties = [
      'display', 'flex', 'grid', 'position', 'margin', 'padding', 'width', 'height',
      'background', 'background-color', 'background-image', 'color', 'font-size',
      'font-weight', 'font-family', 'border', 'border-radius', 'box-shadow',
      'text-align', 'justify-content', 'align-items', 'gap', 'flex-direction',
      'transform', 'transition', 'animation', 'opacity', 'z-index', 'overflow',
      'max-width', 'min-height', 'line-height', 'letter-spacing', 'cursor',
    ];

    monaco.languages.registerCompletionItemProvider('css', {
      triggerCharacters: [':'],
      provideCompletionItems: (model, position) => {
        const lineContent = model.getLineContent(position.lineNumber);
        const textBeforeCursor = lineContent.substring(0, position.column - 1);
        
        // Property value suggestions
        if (textBeforeCursor.includes(':')) {
          const propMatch = textBeforeCursor.match(/(\w+(?:-\w+)*)\s*:$/);
          if (propMatch) {
            const prop = propMatch[1];
            const values = getPropertyValues(prop);
            
            return {
              suggestions: values.map(val => ({
                label: val,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: ` ${val};`,
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endColumn: position.column,
                },
              })),
            };
          }
        }
        return { suggestions: [] };
      },
    });

    function getPropertyValues(prop: string): string[] {
      const valueMap: Record<string, string[]> = {
        display: ['flex', 'grid', 'block', 'inline-block', 'inline', 'none', 'inline-flex'],
        position: ['relative', 'absolute', 'fixed', 'sticky', 'static'],
        'justify-content': ['center', 'flex-start', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
        'align-items': ['center', 'flex-start', 'flex-end', 'stretch', 'baseline'],
        'flex-direction': ['row', 'column', 'row-reverse', 'column-reverse'],
        'text-align': ['center', 'left', 'right', 'justify'],
        cursor: ['pointer', 'default', 'grab', 'grabbing', 'not-allowed', 'crosshair'],
        overflow: ['hidden', 'auto', 'scroll', 'visible'],
        'font-weight': ['400', '500', '600', '700', 'bold', 'normal'],
      };
      return valueMap[prop] || [];
    }
  }, []);

  // Register JavaScript/TypeScript completions
  const registerJSCompletions = useCallback((monaco: Monaco) => {
    const languages = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'];
    
    languages.forEach(lang => {
      // Console methods
      monaco.languages.registerCompletionItemProvider(lang, {
        triggerCharacters: ['.'],
        provideCompletionItems: (model, position) => {
          const lineContent = model.getLineContent(position.lineNumber);
          const textBeforeCursor = lineContent.substring(0, position.column - 1);
          
          if (textBeforeCursor.endsWith('console.')) {
            const methods = ['log', 'error', 'warn', 'info', 'table', 'group', 'groupEnd', 'time', 'timeEnd', 'clear'];
            return {
              suggestions: methods.map(method => ({
                label: method,
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: method === 'log' || method === 'error' || method === 'warn' || method === 'info'
                  ? `${method}($0)`
                  : `${method}()`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: `console.${method}()`,
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endColumn: position.column,
                },
              })),
            };
          }

          // Array methods
          if (textBeforeCursor.match(/\]\s*\.$/)) {
            const arrayMethods = ['map', 'filter', 'reduce', 'forEach', 'find', 'findIndex', 'some', 'every', 'includes', 'indexOf', 'push', 'pop', 'shift', 'unshift', 'slice', 'splice', 'join', 'sort', 'reverse', 'flat', 'flatMap'];
            return {
              suggestions: arrayMethods.map(method => ({
                label: method,
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: ['push', 'pop', 'shift', 'unshift', 'join', 'sort', 'reverse', 'flat'].includes(method)
                  ? `${method}()`
                  : `${method}(($0) => )`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: `Array.${method}()`,
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endColumn: position.column,
                },
              })),
            };
          }

          return { suggestions: [] };
        },
      });
    });
  }, []);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Configure responsive editor options
    editor.updateOptions({
      fontSize,
      lineHeight: isMobile ? 20 : 22,
      minimap: { enabled: showMinimap, scale: 1 },
      scrollBeyondLastLine: false,
      wordWrap,
      automaticLayout: true,
      padding: { top: isMobile ? 8 : 16, bottom: isMobile ? 8 : 16 },
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
        verticalScrollbarSize: isMobile ? 6 : 10,
        horizontalScrollbarSize: isMobile ? 6 : 10,
      },
      lineNumbers: isMobile ? 'off' : 'on',
      renderLineHighlight: 'all',
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
      tabSize: 2,
      insertSpaces: true,
      formatOnPaste: true,
      formatOnType: true,
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoClosingDelete: 'always',
      autoSurround: 'languageDefined',
      autoIndent: 'full',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
        highlightActiveBracketPair: true,
        highlightActiveIndentation: true,
      },
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showClasses: true,
        showFunctions: true,
        showVariables: true,
        showMethods: true,
        showProperties: true,
        showColors: true,
        showFiles: true,
        showReferences: true,
        showOperators: true,
        showUnits: true,
        showValues: true,
        showConstants: true,
        showEnumMembers: true,
        showEnums: true,
        showEvents: true,
        showFolders: true,
        showInterfaces: true,
        showModules: true,
        showStructs: true,
        showTypeParameters: true,
        showWords: true,
        preview: true,
        shareSuggestSelections: true,
        insertMode: 'insert',
        filterGraceful: true,
        snippetsPreventQuickSuggestions: false,
      },
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true,
      },
      acceptSuggestionOnEnter: 'on',
      tabCompletion: 'on',
      wordBasedSuggestions: 'currentDocument',
      parameterHints: { enabled: true, cycle: true },
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      matchBrackets: 'always',
      renderWhitespace: 'selection',
      links: true,
      colorDecorators: true,
      linkedEditing: true, // Auto-rename paired HTML tags
      // Touch support for mobile
      dragAndDrop: true,
      emptySelectionClipboard: true,
    });

    // Define custom theme
    monaco.editor.defineTheme('bncode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a7a8a', fontStyle: 'italic' },
        { token: 'keyword', foreground: '66b3ff' },
        { token: 'keyword.control', foreground: 'c792ea' },
        { token: 'string', foreground: '98c379' },
        { token: 'string.html', foreground: '98c379' },
        { token: 'number', foreground: 'e5c07b' },
        { token: 'tag', foreground: 'e06c75' },
        { token: 'tag.html', foreground: 'e06c75' },
        { token: 'attribute.name', foreground: 'e5c07b' },
        { token: 'attribute.name.html', foreground: 'e5c07b' },
        { token: 'attribute.value', foreground: '98c379' },
        { token: 'attribute.value.html', foreground: '98c379' },
        { token: 'delimiter', foreground: 'abb2bf' },
        { token: 'delimiter.html', foreground: 'abb2bf' },
        { token: 'type', foreground: 'c792ea' },
        { token: 'type.identifier', foreground: 'e5c07b' },
        { token: 'variable', foreground: '61dafb' },
        { token: 'variable.parameter', foreground: 'e06c75' },
        { token: 'function', foreground: '61dafb' },
        { token: 'operator', foreground: '56b6c2' },
        { token: 'property', foreground: 'e06c75' },
        { token: 'regexp', foreground: 'e06c75' },
        { token: 'constant', foreground: 'e5c07b' },
      ],
      colors: {
        'editor.background': '#1a1d24',
        'editor.foreground': '#e6e6e6',
        'editor.lineHighlightBackground': '#2a2d3540',
        'editor.lineHighlightBorder': '#3a8cff30',
        'editor.selectionBackground': '#3a8cff44',
        'editor.selectionHighlightBackground': '#3a8cff22',
        'editorCursor.foreground': '#3a8cff',
        'editorLineNumber.foreground': '#4a5568',
        'editorLineNumber.activeForeground': '#a0aec0',
        'editor.inactiveSelectionBackground': '#3a3d42',
        'editorIndentGuide.background': '#2d3748',
        'editorIndentGuide.activeBackground': '#4a5568',
        'editorBracketMatch.background': '#3a8cff30',
        'editorBracketMatch.border': '#3a8cff',
        'editorBracketHighlight.foreground1': '#f8c555',
        'editorBracketHighlight.foreground2': '#ff75b5',
        'editorBracketHighlight.foreground3': '#45a9f9',
        'editorGutter.background': '#1a1d24',
        'editorWidget.background': '#1e2128',
        'editorWidget.border': '#3a3d42',
        'editorSuggestWidget.background': '#1e2128',
        'editorSuggestWidget.border': '#3a3d42',
        'editorSuggestWidget.selectedBackground': '#3a8cff30',
        'editorSuggestWidget.highlightForeground': '#3a8cff',
        'editorHoverWidget.background': '#1e2128',
        'editorHoverWidget.border': '#3a3d42',
        'minimap.background': '#1a1d24',
        'scrollbar.shadow': '#00000050',
        'scrollbarSlider.background': '#4a556850',
        'scrollbarSlider.hoverBackground': '#4a556880',
        'scrollbarSlider.activeBackground': '#4a5568',
        'editorError.foreground': '#f44747',
        'editorWarning.foreground': '#ff8800',
        'editorInfo.foreground': '#3a8cff',
      },
    });
    
    monaco.editor.setTheme('bncode-dark');

    // Register all language completions
    ['html', 'css', 'javascript', 'typescript', 'javascriptreact', 'typescriptreact'].forEach((lang) => {
      registerSnippets(monaco, lang);
    });

    // Register language-specific completions
    registerHTMLCompletions(monaco);
    registerCSSCompletions(monaco);
    registerJSCompletions(monaco);

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.();
    });

    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.formatDocument')?.run();
    });

    // Duplicate line shortcut
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, () => {
      editor.getAction('editor.action.copyLinesDownAction')?.run();
    });

    // Focus editor
    if (!isMobile) {
      editor.focus();
    }
  };

  const handleChange: OnChange = useCallback((newValue) => {
    if (newValue !== undefined && onChange) {
      onChange(newValue);
    }
  }, [onChange]);

  // Update editor options when settings change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize,
        minimap: { enabled: showMinimap },
        wordWrap,
        lineNumbers: isMobile ? 'off' : 'on',
      });
    }
  }, [fontSize, showMinimap, wordWrap, isMobile]);

  // Update language when it changes
  useEffect(() => {
    if (monacoRef.current && editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  const getLanguageIcon = () => {
    switch (language) {
      case 'html': return '🌐';
      case 'css': return '🎨';
      case 'javascript': return '⚡';
      case 'typescript': return '📘';
      case 'python': return '🐍';
      default: return '📄';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full w-full flex flex-col bg-[hsl(var(--editor-bg))] ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      {/* Editor header */}
      <div className="flex items-center gap-2 px-2 sm:px-4 py-2 border-b border-border/30 bg-[hsl(var(--editor-gutter))] shrink-0">
        {/* Traffic lights - hidden on mobile */}
        <div className="hidden sm:flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/80 hover:bg-destructive transition-colors" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
        </div>
        
        {/* File name */}
        <span className="text-xs text-muted-foreground ml-0 sm:ml-2 font-mono truncate flex items-center gap-1.5">
          <span>{getLanguageIcon()}</span>
          <span className="truncate max-w-[120px] sm:max-w-none">{fileName}</span>
        </span>
        
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Language badge */}
          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-primary/20 text-primary uppercase text-[10px] sm:text-xs font-medium">
            {language}
          </span>
          
          {/* Settings dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Settings2 className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Editor Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFontSize(f => Math.max(10, f - 1))}>
                Decrease Font Size ({fontSize}px)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFontSize(f => Math.min(24, f + 1))}>
                Increase Font Size ({fontSize}px)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowMinimap(!showMinimap)}>
                {showMinimap ? '✓ ' : '  '}Minimap
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setWordWrap(w => w === 'on' ? 'off' : 'on')}>
                {wordWrap === 'on' ? '✓ ' : '  '}Word Wrap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Fullscreen toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={handleChange}
          onMount={handleEditorMount}
          loading={
            <div className="h-full w-full flex items-center justify-center bg-[hsl(var(--editor-bg))]">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Loading editor...</span>
              </div>
            </div>
          }
          options={{
            readOnly,
            domReadOnly: readOnly,
          }}
        />
      </div>
    </motion.div>
  );
}
