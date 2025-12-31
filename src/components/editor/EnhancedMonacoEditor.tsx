import { useRef, useCallback, useEffect } from 'react';
import Editor, { OnMount, OnChange, Monaco } from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { getSnippetsForLanguage } from '@/data/codeSnippets';

interface EnhancedMonacoEditorProps {
  value: string;
  language?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  fileName?: string;
  onSave?: () => void;
}

export function EnhancedMonacoEditor({ 
  value, 
  language = 'html', 
  onChange, 
  readOnly = false,
  fileName = 'untitled',
  onSave
}: EnhancedMonacoEditorProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);

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
        }));

        return { suggestions };
      },
    });
  }, []);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 22,
      minimap: { enabled: true, scale: 1 },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      padding: { top: 16, bottom: 16 },
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
      lineNumbers: 'on',
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
      autoIndent: 'full',
      bracketPairColorization: {
        enabled: true,
      },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showClasses: true,
        showFunctions: true,
        showVariables: true,
        showMethods: true,
        showProperties: true,
        preview: true,
        shareSuggestSelections: true,
      },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: true,
      },
      parameterHints: {
        enabled: true,
      },
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      matchBrackets: 'always',
      renderWhitespace: 'selection',
      links: true,
      colorDecorators: true,
    });

    // Define custom theme
    monaco.editor.defineTheme('brighthub-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a7a8a', fontStyle: 'italic' },
        { token: 'keyword', foreground: '66b3ff' },
        { token: 'string', foreground: '98c379' },
        { token: 'number', foreground: 'e5c07b' },
        { token: 'tag', foreground: 'e06c75' },
        { token: 'attribute.name', foreground: 'e5c07b' },
        { token: 'attribute.value', foreground: '98c379' },
        { token: 'delimiter', foreground: 'abb2bf' },
        { token: 'type', foreground: 'c792ea' },
        { token: 'variable', foreground: '61dafb' },
        { token: 'function', foreground: '61dafb' },
        { token: 'operator', foreground: '56b6c2' },
      ],
      colors: {
        'editor.background': '#1a1d24',
        'editor.foreground': '#e6e6e6',
        'editor.lineHighlightBackground': '#2a2d3540',
        'editor.lineHighlightBorder': '#3a8cff30',
        'editor.selectionBackground': '#3a8cff44',
        'editorCursor.foreground': '#3a8cff',
        'editorLineNumber.foreground': '#4a5568',
        'editorLineNumber.activeForeground': '#a0aec0',
        'editor.inactiveSelectionBackground': '#3a3d42',
        'editorIndentGuide.background': '#2d3748',
        'editorIndentGuide.activeBackground': '#4a5568',
        'editorBracketMatch.background': '#3a8cff30',
        'editorBracketMatch.border': '#3a8cff',
        'editorGutter.background': '#1a1d24',
        'editorWidget.background': '#1e2128',
        'editorWidget.border': '#3a3d42',
        'editorSuggestWidget.background': '#1e2128',
        'editorSuggestWidget.border': '#3a3d42',
        'editorSuggestWidget.selectedBackground': '#3a8cff30',
        'editorHoverWidget.background': '#1e2128',
        'editorHoverWidget.border': '#3a3d42',
        'minimap.background': '#1a1d24',
        'scrollbar.shadow': '#00000050',
        'scrollbarSlider.background': '#4a556850',
        'scrollbarSlider.hoverBackground': '#4a556880',
        'scrollbarSlider.activeBackground': '#4a5568',
      },
    });
    
    monaco.editor.setTheme('brighthub-dark');

    // Register snippets for all languages
    ['html', 'css', 'javascript', 'typescript'].forEach((lang) => {
      registerSnippets(monaco, lang);
    });

    // Add Emmet support for HTML
    if (language === 'html') {
      monaco.languages.registerCompletionItemProvider('html', {
        triggerCharacters: ['>'],
        provideCompletionItems: (model, position) => {
          const lineContent = model.getLineContent(position.lineNumber);
          const match = lineContent.match(/<(\w+)>$/);
          
          if (match) {
            const tag = match[1];
            return {
              suggestions: [{
                label: `Close </${tag}>`,
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: `$0</${tag}>`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endColumn: position.column,
                },
              }],
            };
          }
          return { suggestions: [] };
        },
      });
    }

    // Add save keyboard shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.();
    });

    // Add format document shortcut
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.formatDocument')?.run();
    });

    // Focus editor
    editor.focus();
  };

  const handleChange: OnChange = useCallback((newValue) => {
    if (newValue !== undefined && onChange) {
      onChange(newValue);
    }
  }, [onChange]);

  // Update language when it changes
  useEffect(() => {
    if (monacoRef.current && editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full flex flex-col bg-editor-bg"
    >
      {/* Editor header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30 bg-editor-gutter shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-muted-foreground ml-2 font-mono truncate">
          {fileName}
        </span>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-0.5 rounded bg-primary/20 text-primary uppercase">
            {language}
          </span>
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
            <div className="h-full w-full flex items-center justify-center bg-editor-bg">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
