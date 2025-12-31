import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Code2, Sparkles, BookOpen, Terminal, Bot, ChevronRight, Play, Zap, Globe, Layout, Palette, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
const features = [{
  icon: <Code2 className="h-6 w-6" />,
  title: "Powerful Code Editor",
  description: "Syntax highlighting, auto-complete, and smart indentation for HTML, CSS, and JavaScript."
}, {
  icon: <BookOpen className="h-6 w-6" />,
  title: "Interactive Learning",
  description: "Step-by-step tutorials from beginner to advanced with hands-on practice."
}, {
  icon: <Bot className="h-6 w-6" />,
  title: "AI Mentor",
  description: "Get instant help, code explanations, and personalized learning recommendations."
}, {
  icon: <Terminal className="h-6 w-6" />,
  title: "Built-in Terminal",
  description: "Full terminal access with common commands and package management."
}, {
  icon: <Globe className="h-6 w-6" />,
  title: "Live Preview",
  description: "See your changes instantly with responsive viewport testing."
}, {
  icon: <Zap className="h-6 w-6" />,
  title: "Fast & Responsive",
  description: "Optimized for speed with touch-friendly mobile experience."
}];
const learningPaths = [{
  name: "HTML Basics",
  lessons: 12,
  duration: "2 hours"
}, {
  name: "CSS Styling",
  lessons: 15,
  duration: "3 hours"
}, {
  name: "JavaScript Fundamentals",
  lessons: 20,
  duration: "5 hours"
}, {
  name: "Responsive Design",
  lessons: 8,
  duration: "2 hours"
}];
export default function Landing() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);
  return <div className="min-h-screen bg-background">
      <Header isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: "1s"
      }} />

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-center max-w-4xl mx-auto">
            <motion.div initial={{
            scale: 0.9,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} transition={{
            delay: 0.2
          }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Learn to code with AI-powered guidance
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="gradient-text">Code</span>, Learn, and
              <br />
              <span className="text-foreground">Build Amazing Websites</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              BrightHub is your complete platform for learning web development. 
              Write code, get instant feedback, and master HTML, CSS, and JavaScript 
              with AI-powered mentoring.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/editor">
                <Button size="lg" className="gap-2 glow-primary text-base px-8">
                  <Play className="h-5 w-5" />
                  Start Coding Now
                </Button>
              </Link>
              <Link to="/learn">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                  <BookOpen className="h-5 w-5" />
                  Browse Lessons
                </Button>
              </Link>
            </div>

            {/* Stats */}
            
          </motion.div>

          {/* Editor Preview */}
          <motion.div initial={{
          opacity: 0,
          y: 50
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.5,
          duration: 0.6
        }} className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-xl border border-border bg-card shadow-2xl shadow-primary/10 overflow-hidden">
              {/* Window controls */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-4 text-xs text-muted-foreground font-mono">index.html — BrightHub</span>
              </div>
              
              {/* Code preview */}
              <div className="p-4 font-mono text-sm bg-editor-bg text-foreground overflow-hidden">
                <pre className="text-left">
                  <code>
                    <span className="text-syntax-tag">&lt;!DOCTYPE html&gt;</span>{"\n"}
                    <span className="text-syntax-tag">&lt;html</span> <span className="text-syntax-attribute">lang</span>=<span className="text-syntax-string">"en"</span><span className="text-syntax-tag">&gt;</span>{"\n"}
                    <span className="text-syntax-tag">&lt;head&gt;</span>{"\n"}
                    {"  "}<span className="text-syntax-tag">&lt;title&gt;</span>My First Website<span className="text-syntax-tag">&lt;/title&gt;</span>{"\n"}
                    <span className="text-syntax-tag">&lt;/head&gt;</span>{"\n"}
                    <span className="text-syntax-tag">&lt;body&gt;</span>{"\n"}
                    {"  "}<span className="text-syntax-tag">&lt;h1&gt;</span>Hello, World!<span className="text-syntax-tag">&lt;/h1&gt;</span>{"\n"}
                    {"  "}<span className="text-syntax-tag">&lt;p&gt;</span>Welcome to BrightHub<span className="text-syntax-tag">&lt;/p&gt;</span>{"\n"}
                    <span className="text-syntax-tag">&lt;/body&gt;</span>{"\n"}
                    <span className="text-syntax-tag">&lt;/html&gt;</span>
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Learn Code</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete development environment with learning tools, AI assistance, 
              and professional features—all in your browser.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Structured <span className="gradient-text">Learning Paths</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Follow our carefully crafted curriculum to go from complete beginner 
                to confident web developer. Each lesson builds on the previous one.
              </p>
              
              <div className="space-y-3">
                {learningPaths.map((path, index) => <motion.div key={index} initial={{
                opacity: 0,
                x: -20
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: index * 0.1
              }} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium group-hover:text-primary transition-colors">{path.name}</h4>
                      <p className="text-xs text-muted-foreground">{path.lessons} lessons • {path.duration}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </motion.div>)}
              </div>

              <Link to="/learn">
                <Button className="mt-6 gap-2">
                  View All Courses
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <div className="relative bg-card rounded-2xl border border-border p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">AI Mentor</h4>
                    <p className="text-xs text-muted-foreground">Always here to help</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-secondary text-sm">
                    "Can you explain how CSS flexbox works?"
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 text-sm">
                    Flexbox is a CSS layout model that makes it easy to design flexible, responsive layouts. Here's a quick example...
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/50">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your <span className="gradient-text">Coding Journey</span>?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of learners who are building their skills with BrightHub. 
              No setup required—start coding in seconds.
            </p>
            <Link to="/editor">
              <Button size="lg" className="gap-2 glow-primary text-base px-8">
                <Code2 className="h-5 w-5" />
                Launch Editor
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">
                <span className="gradient-text">Bright</span>Hub
              </span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 Bright Nation. Bright ideas for a digital world .</p>
          </div>
        </div>
      </footer>
    </div>;
}