import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight,
  Clock, 
  CheckCircle2, 
  Menu,
  BookOpen,
  Code2,
  Play,
  X,
  ChevronRight,
  Zap,
  Trophy,
  Target,
  Lightbulb,
  Volume2,
  VolumeX,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { LessonSidebar } from "@/components/learn/LessonSidebar";
import { CodePlayground } from "@/components/learn/CodePlayground";
import { TextToSpeechControls } from "@/components/learn/TextToSpeechControls";
import { cn } from "@/lib/utils";
import { courses, Lesson } from "@/data/coursesData";
import { lessonContents, LessonContent } from "@/data/lessonContents";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";

export default function LessonDetail() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings, updateSetting } = useSettings();
  const { updateProgress, getLessonProgress, isLessonCompleted } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lessonSidebarOpen, setLessonSidebarOpen] = useState(true);
  const [showPlayground, setShowPlayground] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [showTTSPanel, setShowTTSPanel] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [readingMode, setReadingMode] = useState<"read" | "listen">("read");

  // Find the lesson and its course
  let lesson: Lesson | undefined;
  let course = courses.find((c) => {
    lesson = c.lessons.find((l) => l.id === lessonId);
    return lesson !== undefined;
  });

  const lessonIndex = course?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  const prevLesson = lessonIndex > 0 ? course?.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < (course?.lessons.length ?? 0) - 1 ? course?.lessons[lessonIndex + 1] : null;

  // Get rich lesson content from lessonContents.ts
  const richContent = lessonContents[lessonId || ""];
  const currentProgress = getLessonProgress(lessonId || "");
  const completed = isLessonCompleted(lessonId || "");

  // XP calculation
  const xpPerLesson = 50;
  const earnedXP = completed ? xpPerLesson : 0;

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Mark lesson as started when viewing
  useEffect(() => {
    if (lessonId && user && currentProgress === 0) {
      updateProgress(lessonId, 25);
    }
  }, [lessonId, user]);

  // Track scroll for table of contents
  useEffect(() => {
    if (!richContent?.tableOfContents) return;
    
    const handleScroll = () => {
      const sections = richContent.tableOfContents.map(item => 
        document.getElementById(item.id)
      ).filter(Boolean);
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.getBoundingClientRect().top <= 150) {
          setActiveSection(richContent.tableOfContents[i].id);
          break;
        }
      }
    };

    const scrollArea = document.getElementById("lesson-scroll-area");
    scrollArea?.addEventListener("scroll", handleScroll);
    return () => scrollArea?.removeEventListener("scroll", handleScroll);
  }, [richContent]);

  const handleMarkComplete = async () => {
    if (lessonId && user) {
      await updateProgress(lessonId, 100, true);
      toast.success(`+${xpPerLesson} XP earned!`, {
        description: "Great job completing this lesson!",
        icon: <Zap className="h-4 w-4 text-yellow-500" />
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Extract plain text from HTML for TTS
  const extractTextFromHtml = (html: string): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    // Remove code blocks as they don't read well
    tempDiv.querySelectorAll("pre, code").forEach((el) => el.remove());
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  if (!lesson || !course) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Link to="/learn">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex min-w-0 overflow-hidden">
        {/* W3Schools-style Lesson Sidebar - Desktop */}
        <div className={cn(
          "hidden lg:block border-r border-border transition-all duration-300",
          lessonSidebarOpen ? "w-72" : "w-0"
        )}>
          {lessonSidebarOpen && (
            <LessonSidebar 
              course={course} 
              currentLessonId={lessonId || ""} 
            />
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="border-b border-border bg-card px-4 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Mobile Menu */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>

                {/* Toggle Lesson Sidebar - Desktop */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden lg:flex"
                  onClick={() => setLessonSidebarOpen(!lessonSidebarOpen)}
                >
                  <BookOpen className="h-5 w-5" />
                </Button>

                {/* Mobile Lesson Sidebar */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <BookOpen className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-72">
                    <LessonSidebar 
                      course={course} 
                      currentLessonId={lessonId || ""} 
                    />
                  </SheetContent>
                </Sheet>

                {/* Breadcrumb */}
                <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
                  <Link to="/learn" className="hover:text-foreground transition-colors">
                    Learn
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <Link to={`/learn/course/${course.id}`} className="hover:text-foreground transition-colors truncate max-w-[150px]">
                    {course.title}
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-foreground font-medium truncate max-w-[150px]">
                    {lesson.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Reading Mode Toggle */}
                <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-muted/50">
                  <Button
                    variant={readingMode === "read" ? "default" : "ghost"}
                    size="sm"
                    className="h-7 gap-1.5 text-xs"
                    onClick={() => setReadingMode("read")}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Read
                  </Button>
                  <Button
                    variant={readingMode === "listen" ? "default" : "ghost"}
                    size="sm"
                    className="h-7 gap-1.5 text-xs"
                    onClick={() => {
                      setReadingMode("listen");
                      setShowTTSPanel(true);
                    }}
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    Listen
                  </Button>
                </div>

                {/* TTS Toggle - Mobile */}
                <Button
                  variant={showTTSPanel ? "default" : "outline"}
                  size="icon"
                  className="sm:hidden h-8 w-8"
                  onClick={() => setShowTTSPanel(!showTTSPanel)}
                >
                  {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>

                {/* XP Badge */}
                {completed && (
                  <Badge variant="secondary" className="gap-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    <Zap className="h-3 w-3" />
                    +{xpPerLesson} XP
                  </Badge>
                )}

                {/* Try It Button */}
                {lesson.hasPlayground && (
                  <Button
                    variant={showPlayground ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowPlayground(!showPlayground)}
                  >
                    <Code2 className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {showPlayground ? "Hide Editor" : "Try It Yourself"}
                    </span>
                  </Button>
                )}
              </div>
            </div>

            {/* Lesson Info Bar */}
            <div className="mt-3 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Badge variant="outline" className="text-[10px]">
                    Lesson {lessonIndex + 1} of {course.lessons.length}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {lesson.duration}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-[10px]",
                      lesson.difficulty === "beginner" && "bg-green-500/10 text-green-500",
                      lesson.difficulty === "intermediate" && "bg-yellow-500/10 text-yellow-500",
                      lesson.difficulty === "advanced" && "bg-red-500/10 text-red-500"
                    )}
                  >
                    {lesson.difficulty}
                  </Badge>
                </div>
                <h1 className="text-xl font-bold">{lesson.title}</h1>
              </div>

              {/* Progress Ring */}
              {user && (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-muted-foreground">Progress</div>
                    <div className="text-sm font-medium">{completed ? 100 : Math.round(currentProgress)}%</div>
                  </div>
                  <div className="relative">
                    <svg className="h-12 w-12 -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-muted/30"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={125.6}
                        strokeDashoffset={125.6 - (125.6 * (completed ? 100 : currentProgress)) / 100}
                        className={completed ? "text-green-500" : "text-primary"}
                        strokeLinecap="round"
                      />
                    </svg>
                    {completed && (
                      <CheckCircle2 className="absolute inset-0 m-auto h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden flex">
            {/* Lesson Content */}
            <div className={cn(
              "flex-1 flex overflow-hidden",
              showPlayground && "hidden lg:flex lg:w-1/2"
            )}>
              {/* Table of Contents - Sticky Sidebar */}
              {richContent?.tableOfContents && richContent.tableOfContents.length > 0 && (
                <div className="hidden xl:block w-52 border-r border-border flex-shrink-0">
                  <div className="sticky top-0 p-4">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      On This Page
                    </h3>
                    <nav className="space-y-1">
                      {richContent.tableOfContents.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={cn(
                            "block w-full text-left text-xs py-1.5 px-2 rounded transition-colors",
                            activeSection === item.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          {item.title}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              )}

              {/* Main Article */}
              <ScrollArea id="lesson-scroll-area" className="flex-1">
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 max-w-4xl mx-auto"
                >
                  {/* TTS Controls Panel */}
                  <AnimatePresence>
                    {showTTSPanel && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 overflow-hidden"
                      >
                        <TextToSpeechControls
                          text={extractTextFromHtml(richContent?.content || getDefaultContent(lesson))}
                          enabled={ttsEnabled}
                          onEnabledChange={setTtsEnabled}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Learning Objectives */}
                  {richContent && (
                    <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        What You'll Learn
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {richContent.tableOfContents.slice(0, 4).map((item) => (
                          <li key={item.id} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            {item.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Lesson Content */}
                  <div 
                    className="prose prose-invert max-w-none lesson-content"
                    dangerouslySetInnerHTML={{ 
                      __html: richContent?.content || getDefaultContent(lesson)
                    }}
                  />

                  {/* Try It Yourself CTA */}
                  {lesson.hasPlayground && !showPlayground && (
                    <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold mb-1 flex items-center gap-2">
                            <Code2 className="h-5 w-5 text-primary" />
                            Try It Yourself!
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Practice what you've learned with our interactive code editor.
                          </p>
                        </div>
                        <Button onClick={() => setShowPlayground(true)} className="gap-2">
                          <Play className="h-4 w-4" />
                          Open Editor
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Quiz Section */}
                  {richContent?.quiz && richContent.quiz.length > 0 && (
                    <div className="mt-8 p-6 rounded-lg bg-card border border-border">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Quick Quiz
                      </h3>
                      <div className="space-y-4">
                        {richContent.quiz.map((q, i) => (
                          <QuizQuestion key={i} question={q} index={i} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation buttons */}
                  <div className="mt-8 pt-6 border-t border-border flex items-center justify-between gap-4">
                    {prevLesson ? (
                      <Link to={`/learn/lesson/${prevLesson.id}`}>
                        <Button variant="outline" className="gap-2">
                          <ArrowLeft className="h-4 w-4" />
                          <span className="hidden sm:inline">Previous</span>
                        </Button>
                      </Link>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-3">
                      {user && !completed && (
                        <Button 
                          variant="outline" 
                          className="gap-2"
                          onClick={handleMarkComplete}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Mark Complete</span>
                        </Button>
                      )}

                      {nextLesson ? (
                        <Button 
                          className="gap-2"
                          onClick={() => {
                            if (user && !completed) {
                              handleMarkComplete();
                            }
                            navigate(`/learn/lesson/${nextLesson.id}`);
                          }}
                        >
                          <span className="hidden sm:inline">Next Lesson</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Link to={`/learn/course/${course.id}`}>
                          <Button className="gap-2">
                            <Trophy className="h-4 w-4" />
                            Finish Course
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.article>
              </ScrollArea>
            </div>

            {/* Code Playground */}
            {showPlayground && (
              <div className={cn(
                "flex-1 lg:w-1/2 border-l border-border overflow-hidden flex flex-col"
              )}>
                <div className="p-2 border-b border-border bg-card flex items-center justify-between">
                  <span className="text-sm font-medium">Code Editor</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowPlayground(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <CodePlayground
                    initialHtml={richContent?.code?.html || getDefaultCode(lesson).html}
                    initialCss={richContent?.code?.css || getDefaultCode(lesson).css}
                    initialJs={richContent?.code?.js || getDefaultCode(lesson).js}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Quiz Question Component
function QuizQuestion({ question, index }: { question: { question: string; options: string[]; correctIndex: number }; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (optionIndex: number) => {
    setSelected(optionIndex);
    setShowResult(true);
  };

  const isCorrect = selected === question.correctIndex;

  return (
    <div className="p-4 rounded-lg bg-muted/50">
      <p className="font-medium mb-3">Q{index + 1}: {question.question}</p>
      <div className="space-y-2">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={showResult}
            className={cn(
              "w-full text-left p-3 rounded-md border transition-colors text-sm",
              showResult && i === question.correctIndex && "bg-green-500/10 border-green-500 text-green-500",
              showResult && selected === i && i !== question.correctIndex && "bg-red-500/10 border-red-500 text-red-500",
              !showResult && "hover:bg-muted border-border",
              !showResult && selected === i && "border-primary"
            )}
          >
            {option}
          </button>
        ))}
      </div>
      {showResult && (
        <p className={cn(
          "mt-3 text-sm font-medium",
          isCorrect ? "text-green-500" : "text-red-500"
        )}>
          {isCorrect ? "✅ Correct! Well done!" : "❌ Not quite. The correct answer is highlighted above."}
        </p>
      )}
    </div>
  );
}

// Default content for lessons without rich content
function getDefaultContent(lesson: Lesson): string {
  return `
    <section>
      <h2>${lesson.title}</h2>
      <p>${lesson.description}</p>
      <div class="info-box">
        <h4>📚 Coming Soon</h4>
        <p>Full lesson content is being developed. Check back soon!</p>
      </div>
    </section>
  `;
}

// Default code for playground
function getDefaultCode(lesson: Lesson) {
  return {
    html: `<!DOCTYPE html>
<html>
<head>
    <title>Practice: ${lesson.title}</title>
</head>
<body>
    <h1>Practice Area</h1>
    <p>Start coding here!</p>
</body>
</html>`,
    css: `body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background: #1a1a2e;
  color: #eee;
}

h1 {
  color: #00d9ff;
}`,
    js: `// JavaScript practice area
console.log("Ready to learn ${lesson.title}!");`
  };
}
