// Language-specific code snippets for Monaco Editor

export interface CodeSnippet {
  label: string;
  insertText: string;
  documentation: string;
  detail: string;
}

export const htmlSnippets: CodeSnippet[] = [
  {
    label: 'html5',
    insertText: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${1:Document}</title>
</head>
<body>
  \${2}
</body>
</html>`,
    documentation: 'HTML5 boilerplate template',
    detail: 'HTML5 Template'
  },
  {
    label: 'div',
    insertText: '<div class="\${1:class-name}">\n  \${2}\n</div>',
    documentation: 'Creates a div element with class',
    detail: 'Div with class'
  },
  {
    label: 'a',
    insertText: '<a href="\${1:#}">\${2:Link text}</a>',
    documentation: 'Creates an anchor link',
    detail: 'Anchor link'
  },
  {
    label: 'img',
    insertText: '<img src="\${1:url}" alt="\${2:description}" />',
    documentation: 'Creates an image element',
    detail: 'Image element'
  },
  {
    label: 'form',
    insertText: `<form action="\${1:#}" method="\${2:post}">
  <label for="\${3:input}">\${4:Label}</label>
  <input type="\${5:text}" id="\${3:input}" name="\${3:input}" />
  <button type="submit">Submit</button>
</form>`,
    documentation: 'Creates a form with input and submit button',
    detail: 'Form template'
  },
  {
    label: 'ul',
    insertText: `<ul>
  <li>\${1:Item 1}</li>
  <li>\${2:Item 2}</li>
  <li>\${3:Item 3}</li>
</ul>`,
    documentation: 'Creates an unordered list',
    detail: 'Unordered list'
  },
  {
    label: 'table',
    insertText: `<table>
  <thead>
    <tr>
      <th>\${1:Header 1}</th>
      <th>\${2:Header 2}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>\${3:Data 1}</td>
      <td>\${4:Data 2}</td>
    </tr>
  </tbody>
</table>`,
    documentation: 'Creates a table with headers',
    detail: 'Table template'
  },
  {
    label: 'nav',
    insertText: `<nav>
  <ul>
    <li><a href="\${1:#}">Home</a></li>
    <li><a href="\${2:#}">About</a></li>
    <li><a href="\${3:#}">Contact</a></li>
  </ul>
</nav>`,
    documentation: 'Creates a navigation menu',
    detail: 'Navigation menu'
  },
  {
    label: 'section',
    insertText: `<section id="\${1:section-id}">
  <h2>\${2:Section Title}</h2>
  <p>\${3:Content}</p>
</section>`,
    documentation: 'Creates a section element',
    detail: 'Section element'
  },
  {
    label: 'video',
    insertText: `<video controls width="\${1:640}" height="\${2:360}">
  <source src="\${3:video.mp4}" type="video/mp4" />
  Your browser does not support video.
</video>`,
    documentation: 'Creates a video element',
    detail: 'Video element'
  },
  {
    label: 'meta',
    insertText: '<meta name="\${1:description}" content="\${2:content}" />',
    documentation: 'Creates a meta tag',
    detail: 'Meta tag'
  },
  {
    label: 'link-css',
    insertText: '<link rel="stylesheet" href="\${1:styles.css}" />',
    documentation: 'Links an external CSS file',
    detail: 'CSS Link'
  },
  {
    label: 'script-src',
    insertText: '<script src="\${1:script.js}"></script>',
    documentation: 'Links an external JavaScript file',
    detail: 'Script Link'
  },
  {
    label: 'button',
    insertText: '<button type="\${1:button}" onclick="\${2:handleClick()}">\${3:Click me}</button>',
    documentation: 'Creates a button element',
    detail: 'Button element'
  },
  {
    label: 'input',
    insertText: '<input type="\${1:text}" id="\${2:input}" name="\${2:input}" placeholder="\${3:Enter value}" />',
    documentation: 'Creates an input element',
    detail: 'Input element'
  },
];

export const cssSnippets: CodeSnippet[] = [
  {
    label: 'flexbox',
    insertText: `display: flex;
justify-content: \${1:center};
align-items: \${2:center};
gap: \${3:1rem};`,
    documentation: 'Flexbox container properties',
    detail: 'Flexbox layout'
  },
  {
    label: 'grid',
    insertText: `display: grid;
grid-template-columns: repeat(\${1:3}, 1fr);
gap: \${2:1rem};`,
    documentation: 'CSS Grid layout',
    detail: 'Grid layout'
  },
  {
    label: 'center',
    insertText: `display: flex;
justify-content: center;
align-items: center;`,
    documentation: 'Center content with flexbox',
    detail: 'Center content'
  },
  {
    label: 'transition',
    insertText: 'transition: \${1:all} \${2:0.3s} \${3:ease};',
    documentation: 'CSS transition property',
    detail: 'Transition'
  },
  {
    label: 'animation',
    insertText: `@keyframes \${1:animationName} {
  0% {
    \${2:opacity: 0;}
  }
  100% {
    \${3:opacity: 1;}
  }
}

.\${4:element} {
  animation: \${1:animationName} \${5:1s} ease forwards;
}`,
    documentation: 'CSS keyframe animation',
    detail: 'Keyframe animation'
  },
  {
    label: 'gradient',
    insertText: 'background: linear-gradient(\${1:135deg}, \${2:#667eea} 0%, \${3:#764ba2} 100%);',
    documentation: 'Linear gradient background',
    detail: 'Linear gradient'
  },
  {
    label: 'shadow',
    insertText: 'box-shadow: \${1:0} \${2:4px} \${3:20px} rgba(\${4:0}, \${5:0}, \${6:0}, \${7:0.1});',
    documentation: 'Box shadow property',
    detail: 'Box shadow'
  },
  {
    label: 'media',
    insertText: `@media (max-width: \${1:768px}) {
  \${2}
}`,
    documentation: 'Media query for responsive design',
    detail: 'Media query'
  },
  {
    label: 'hover',
    insertText: `&:hover {
  \${1:transform: translateY(-2px);}
  \${2:box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);}
}`,
    documentation: 'Hover state styles',
    detail: 'Hover effect'
  },
  {
    label: 'reset',
    insertText: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}`,
    documentation: 'CSS reset for consistent styling',
    detail: 'CSS Reset'
  },
  {
    label: 'card',
    insertText: `.\${1:card} {
  background: \${2:#ffffff};
  border-radius: \${3:12px};
  padding: \${4:1.5rem};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}`,
    documentation: 'Card component styles',
    detail: 'Card component'
  },
  {
    label: 'button',
    insertText: `.\${1:btn} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: \${2:12px 24px};
  border: none;
  border-radius: \${3:8px};
  background: \${4:#667eea};
  color: \${5:#ffffff};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.\${1:btn}:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}`,
    documentation: 'Button component styles',
    detail: 'Button styles'
  },
  {
    label: 'text-gradient',
    insertText: `background: linear-gradient(\${1:135deg}, \${2:#667eea}, \${3:#764ba2});
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;`,
    documentation: 'Gradient text effect',
    detail: 'Text gradient'
  },
  {
    label: 'absolute-center',
    insertText: `position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);`,
    documentation: 'Absolute center positioning',
    detail: 'Absolute center'
  },
  {
    label: 'scrollbar',
    insertText: `::-webkit-scrollbar {
  width: \${1:8px};
}

::-webkit-scrollbar-track {
  background: \${2:#f1f1f1};
}

::-webkit-scrollbar-thumb {
  background: \${3:#888};
  border-radius: \${4:4px};
}

::-webkit-scrollbar-thumb:hover {
  background: \${5:#555};
}`,
    documentation: 'Custom scrollbar styles',
    detail: 'Custom scrollbar'
  },
];

export const javascriptSnippets: CodeSnippet[] = [
  {
    label: 'log',
    insertText: "console.log('\${1:message}', \${2:value});",
    documentation: 'Console log statement',
    detail: 'Console log'
  },
  {
    label: 'func',
    insertText: `function \${1:functionName}(\${2:params}) {
  \${3}
}`,
    documentation: 'Function declaration',
    detail: 'Function'
  },
  {
    label: 'arrow',
    insertText: 'const \${1:name} = (\${2:params}) => {\n  \${3}\n};',
    documentation: 'Arrow function',
    detail: 'Arrow function'
  },
  {
    label: 'arrowone',
    insertText: 'const \${1:name} = (\${2:param}) => \${3:expression};',
    documentation: 'Single expression arrow function',
    detail: 'Arrow (single)'
  },
  {
    label: 'async',
    insertText: `async function \${1:functionName}(\${2:params}) {
  try {
    \${3}
  } catch (error) {
    console.error(error);
  }
}`,
    documentation: 'Async function with try-catch',
    detail: 'Async function'
  },
  {
    label: 'fetch',
    insertText: `fetch('\${1:url}')
  .then(response => response.json())
  .then(data => {
    \${2:console.log(data);}
  })
  .catch(error => console.error('Error:', error));`,
    documentation: 'Fetch API call',
    detail: 'Fetch request'
  },
  {
    label: 'fetchasync',
    insertText: `const \${1:fetchData} = async () => {
  try {
    const response = await fetch('\${2:url}');
    const data = await response.json();
    \${3:console.log(data);}
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};`,
    documentation: 'Async fetch function',
    detail: 'Async fetch'
  },
  {
    label: 'class',
    insertText: `class \${1:ClassName} {
  constructor(\${2:params}) {
    \${3}
  }
  
  \${4:methodName}() {
    \${5}
  }
}`,
    documentation: 'Class declaration',
    detail: 'Class'
  },
  {
    label: 'for',
    insertText: `for (let \${1:i} = 0; \${1:i} < \${2:array}.length; \${1:i}++) {
  \${3}
}`,
    documentation: 'For loop',
    detail: 'For loop'
  },
  {
    label: 'forof',
    insertText: `for (const \${1:item} of \${2:array}) {
  \${3}
}`,
    documentation: 'For...of loop',
    detail: 'For of'
  },
  {
    label: 'foreach',
    insertText: '\${1:array}.forEach((\${2:item}) => {\n  \${3}\n});',
    documentation: 'Array forEach method',
    detail: 'forEach'
  },
  {
    label: 'map',
    insertText: 'const \${1:result} = \${2:array}.map((\${3:item}) => {\n  return \${4:item};\n});',
    documentation: 'Array map method',
    detail: 'Array map'
  },
  {
    label: 'filter',
    insertText: 'const \${1:result} = \${2:array}.filter((\${3:item}) => \${4:condition});',
    documentation: 'Array filter method',
    detail: 'Array filter'
  },
  {
    label: 'reduce',
    insertText: 'const \${1:result} = \${2:array}.reduce((acc, \${3:item}) => {\n  return acc + \${3:item};\n}, \${4:0});',
    documentation: 'Array reduce method',
    detail: 'Array reduce'
  },
  {
    label: 'promise',
    insertText: `new Promise((resolve, reject) => {
  \${1}
});`,
    documentation: 'Promise constructor',
    detail: 'Promise'
  },
  {
    label: 'trycatch',
    insertText: `try {
  \${1}
} catch (error) {
  console.error(error);
}`,
    documentation: 'Try-catch block',
    detail: 'Try-catch'
  },
  {
    label: 'iife',
    insertText: `(function() {
  \${1}
})();`,
    documentation: 'Immediately invoked function expression',
    detail: 'IIFE'
  },
  {
    label: 'ternary',
    insertText: '\${1:condition} ? \${2:trueValue} : \${3:falseValue}',
    documentation: 'Ternary operator',
    detail: 'Ternary'
  },
  {
    label: 'destructure',
    insertText: 'const { \${1:prop1}, \${2:prop2} } = \${3:object};',
    documentation: 'Object destructuring',
    detail: 'Destructure'
  },
  {
    label: 'spread',
    insertText: 'const \${1:newArray} = [...\${2:array}, \${3:newItem}];',
    documentation: 'Spread operator',
    detail: 'Spread'
  },
  {
    label: 'timeout',
    insertText: `setTimeout(() => {
  \${1}
}, \${2:1000});`,
    documentation: 'setTimeout function',
    detail: 'setTimeout'
  },
  {
    label: 'interval',
    insertText: `const \${1:intervalId} = setInterval(() => {
  \${2}
}, \${3:1000});`,
    documentation: 'setInterval function',
    detail: 'setInterval'
  },
  {
    label: 'eventlistener',
    insertText: `document.querySelector('\${1:selector}').addEventListener('\${2:click}', (event) => {
  \${3}
});`,
    documentation: 'Add event listener',
    detail: 'Event listener'
  },
  {
    label: 'qs',
    insertText: "document.querySelector('\${1:selector}')",
    documentation: 'Query selector',
    detail: 'querySelector'
  },
  {
    label: 'qsa',
    insertText: "document.querySelectorAll('\${1:selector}')",
    documentation: 'Query selector all',
    detail: 'querySelectorAll'
  },
  {
    label: 'geid',
    insertText: "document.getElementById('\${1:id}')",
    documentation: 'Get element by ID',
    detail: 'getElementById'
  },
  {
    label: 'ce',
    insertText: "document.createElement('\${1:div}')",
    documentation: 'Create element',
    detail: 'createElement'
  },
  {
    label: 'storage-set',
    insertText: "localStorage.setItem('\${1:key}', JSON.stringify(\${2:value}));",
    documentation: 'Set localStorage item',
    detail: 'localStorage set'
  },
  {
    label: 'storage-get',
    insertText: "const \${1:data} = JSON.parse(localStorage.getItem('\${2:key}'));",
    documentation: 'Get localStorage item',
    detail: 'localStorage get'
  },
  {
    label: 'module',
    insertText: `export const \${1:moduleName} = {
  \${2:method}() {
    \${3}
  }
};`,
    documentation: 'ES6 module export',
    detail: 'Module export'
  },
  {
    label: 'import',
    insertText: "import { \${1:module} } from '\${2:./module}';",
    documentation: 'ES6 import',
    detail: 'Import'
  },
];

// TypeScript-specific snippets
export const typescriptSnippets: CodeSnippet[] = [
  ...javascriptSnippets,
  {
    label: 'interface',
    insertText: `interface \${1:InterfaceName} {
  \${2:property}: \${3:type};
}`,
    documentation: 'TypeScript interface',
    detail: 'Interface declaration'
  },
  {
    label: 'type',
    insertText: 'type \${1:TypeName} = \${2:type};',
    documentation: 'TypeScript type alias',
    detail: 'Type alias'
  },
  {
    label: 'enum',
    insertText: `enum \${1:EnumName} {
  \${2:Value1},
  \${3:Value2},
}`,
    documentation: 'TypeScript enum',
    detail: 'Enum declaration'
  },
  {
    label: 'generic',
    insertText: 'function \${1:functionName}<\${2:T}>(\${3:param}: \${2:T}): \${2:T} {\n  return \${3:param};\n}',
    documentation: 'Generic function',
    detail: 'Generic function'
  },
  {
    label: 'readonly',
    insertText: 'readonly \${1:property}: \${2:type};',
    documentation: 'Readonly property',
    detail: 'Readonly property'
  },
  {
    label: 'partial',
    insertText: 'Partial<\${1:Type}>',
    documentation: 'Partial utility type',
    detail: 'Partial<T>'
  },
  {
    label: 'pick',
    insertText: "Pick<\${1:Type}, '\${2:key}'>",
    documentation: 'Pick utility type',
    detail: 'Pick<T, K>'
  },
  {
    label: 'omit',
    insertText: "Omit<\${1:Type}, '\${2:key}'>",
    documentation: 'Omit utility type',
    detail: 'Omit<T, K>'
  },
  {
    label: 'record',
    insertText: 'Record<\${1:string}, \${2:any}>',
    documentation: 'Record utility type',
    detail: 'Record<K, V>'
  },
  {
    label: 'asyncarrow',
    insertText: 'const \${1:name} = async (\${2:params}): Promise<\${3:void}> => {\n  \${4}\n};',
    documentation: 'Async arrow function with type',
    detail: 'Typed async arrow'
  },
];

// React/JSX snippets
export const reactSnippets: CodeSnippet[] = [
  ...typescriptSnippets,
  {
    label: 'rfc',
    insertText: `import React from 'react';

interface \${1:ComponentName}Props {
  \${2:prop}: \${3:string};
}

export function \${1:ComponentName}({ \${2:prop} }: \${1:ComponentName}Props) {
  return (
    <div>
      \${4}
    </div>
  );
}`,
    documentation: 'React functional component with TypeScript',
    detail: 'React FC (TypeScript)'
  },
  {
    label: 'rfce',
    insertText: `export function \${1:ComponentName}() {
  return (
    <div>
      \${2}
    </div>
  );
}`,
    documentation: 'React functional component export',
    detail: 'React FC Export'
  },
  {
    label: 'useState',
    insertText: 'const [\${1:state}, set\${1/(.*)/${1:/capitalize}/}] = useState<\${2:type}>(\${3:initialValue});',
    documentation: 'React useState hook',
    detail: 'useState Hook'
  },
  {
    label: 'useEffect',
    insertText: `useEffect(() => {
  \${1}
  
  return () => {
    \${2:// cleanup}
  };
}, [\${3:dependencies}]);`,
    documentation: 'React useEffect hook with cleanup',
    detail: 'useEffect Hook'
  },
  {
    label: 'useCallback',
    insertText: `const \${1:memoizedCallback} = useCallback(() => {
  \${2}
}, [\${3:dependencies}]);`,
    documentation: 'React useCallback hook',
    detail: 'useCallback Hook'
  },
  {
    label: 'useMemo',
    insertText: `const \${1:memoizedValue} = useMemo(() => {
  return \${2:computeExpensiveValue};
}, [\${3:dependencies}]);`,
    documentation: 'React useMemo hook',
    detail: 'useMemo Hook'
  },
  {
    label: 'useRef',
    insertText: 'const \${1:ref} = useRef<\${2:HTMLDivElement}>(null);',
    documentation: 'React useRef hook',
    detail: 'useRef Hook'
  },
  {
    label: 'useContext',
    insertText: 'const \${1:value} = useContext(\${2:MyContext});',
    documentation: 'React useContext hook',
    detail: 'useContext Hook'
  },
  {
    label: 'useReducer',
    insertText: `const [\${1:state}, dispatch] = useReducer(\${2:reducer}, \${3:initialState});`,
    documentation: 'React useReducer hook',
    detail: 'useReducer Hook'
  },
  {
    label: 'context',
    insertText: `interface \${1:Context}Type {
  \${2:value}: \${3:string};
}

const \${1:Context} = createContext<\${1:Context}Type | undefined>(undefined);

export function \${1:Context}Provider({ children }: { children: React.ReactNode }) {
  const value = { \${2:value}: '\${4:default}' };
  
  return (
    <\${1:Context}.Provider value={value}>
      {children}
    </\${1:Context}.Provider>
  );
}

export function use\${1:Context}() {
  const context = useContext(\${1:Context});
  if (!context) throw new Error('use\${1:Context} must be within Provider');
  return context;
}`,
    documentation: 'React Context with Provider and hook',
    detail: 'Context + Provider'
  },
  {
    label: 'fragment',
    insertText: '<>\n  \${1}\n</>',
    documentation: 'React Fragment shorthand',
    detail: 'Fragment'
  },
  {
    label: 'map',
    insertText: '{\${1:items}.map((\${2:item}) => (\n  <\${3:div} key={\${2:item}.id}>\n    {\${2:item}.\${4:name}}\n  </\${3:div}>\n))}',
    documentation: 'Map over array in JSX',
    detail: 'JSX Map'
  },
  {
    label: 'conditional',
    insertText: '{\${1:condition} && (\n  \${2:<div>Render if true</div>}\n)}',
    documentation: 'Conditional rendering',
    detail: 'Conditional render'
  },
  {
    label: 'ternary-jsx',
    insertText: '{\${1:condition} ? (\n  \${2:<div>True</div>}\n) : (\n  \${3:<div>False</div>}\n)}',
    documentation: 'Ternary in JSX',
    detail: 'JSX Ternary'
  },
  {
    label: 'handler',
    insertText: `const handle\${1:Click} = (e: React.MouseEvent<HTMLButtonElement>) => {
  \${2}
};`,
    documentation: 'Event handler function',
    detail: 'Event handler'
  },
  {
    label: 'form-handler',
    insertText: `const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  \${1}
};`,
    documentation: 'Form submit handler',
    detail: 'Form handler'
  },
  {
    label: 'input-handler',
    insertText: `const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  set\${1:Value}(e.target.value);
};`,
    documentation: 'Input change handler',
    detail: 'Input handler'
  },
];

// Python snippets
export const pythonSnippets: CodeSnippet[] = [
  {
    label: 'def',
    insertText: `def \${1:function_name}(\${2:params}):\n    \${3:pass}`,
    documentation: 'Python function definition',
    detail: 'Function'
  },
  {
    label: 'class',
    insertText: `class \${1:ClassName}:\n    def __init__(self, \${2:params}):\n        self.\${3:attr} = \${2:params}\n\n    def \${4:method}(self):\n        \${5:pass}`,
    documentation: 'Python class definition',
    detail: 'Class'
  },
  {
    label: 'for',
    insertText: `for \${1:item} in \${2:items}:\n    \${3:pass}`,
    documentation: 'Python for loop',
    detail: 'For loop'
  },
  {
    label: 'while',
    insertText: `while \${1:condition}:\n    \${2:pass}`,
    documentation: 'Python while loop',
    detail: 'While loop'
  },
  {
    label: 'if',
    insertText: `if \${1:condition}:\n    \${2:pass}`,
    documentation: 'Python if statement',
    detail: 'If statement'
  },
  {
    label: 'ifelse',
    insertText: `if \${1:condition}:\n    \${2:pass}\nelse:\n    \${3:pass}`,
    documentation: 'Python if-else statement',
    detail: 'If-else'
  },
  {
    label: 'try',
    insertText: `try:\n    \${1:pass}\nexcept \${2:Exception} as e:\n    print(f"Error: {e}")`,
    documentation: 'Python try-except block',
    detail: 'Try-except'
  },
  {
    label: 'with',
    insertText: `with open('\${1:filename}', '\${2:r}') as f:\n    \${3:content = f.read()}`,
    documentation: 'Python with statement',
    detail: 'With statement'
  },
  {
    label: 'lambda',
    insertText: 'lambda \${1:x}: \${2:x * 2}',
    documentation: 'Python lambda function',
    detail: 'Lambda'
  },
  {
    label: 'list-comp',
    insertText: '[\${1:x} for \${1:x} in \${2:items} if \${3:condition}]',
    documentation: 'List comprehension',
    detail: 'List comprehension'
  },
  {
    label: 'dict-comp',
    insertText: '{\${1:key}: \${2:value} for \${1:key}, \${2:value} in \${3:items}.items()}',
    documentation: 'Dictionary comprehension',
    detail: 'Dict comprehension'
  },
  {
    label: 'async-def',
    insertText: `async def \${1:function_name}(\${2:params}):\n    \${3:pass}`,
    documentation: 'Async function definition',
    detail: 'Async function'
  },
  {
    label: 'decorator',
    insertText: `def \${1:decorator}(func):\n    def wrapper(*args, **kwargs):\n        \${2:# before}\n        result = func(*args, **kwargs)\n        \${3:# after}\n        return result\n    return wrapper`,
    documentation: 'Python decorator',
    detail: 'Decorator'
  },
  {
    label: 'main',
    insertText: `def main():\n    \${1:pass}\n\nif __name__ == "__main__":\n    main()`,
    documentation: 'Python main entry point',
    detail: 'Main block'
  },
  {
    label: 'dataclass',
    insertText: `from dataclasses import dataclass\n\n@dataclass\nclass \${1:ClassName}:\n    \${2:field}: \${3:str}`,
    documentation: 'Python dataclass',
    detail: 'Dataclass'
  },
];

export const getSnippetsForLanguage = (language: string): CodeSnippet[] => {
  switch (language.toLowerCase()) {
    case 'html':
      return htmlSnippets;
    case 'css':
    case 'scss':
    case 'less':
      return cssSnippets;
    case 'javascript':
      return javascriptSnippets;
    case 'typescript':
      return typescriptSnippets;
    case 'javascriptreact':
    case 'jsx':
    case 'typescriptreact':
    case 'tsx':
      return reactSnippets;
    case 'python':
      return pythonSnippets;
    default:
      return [];
  }
};
