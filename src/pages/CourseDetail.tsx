import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Play,
  Lock,
  Menu,
  ChevronRight,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { cn } from "@/lib/utils";
import { courses } from "@/data/coursesData";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";

const difficultyColors = {
  beginner: "text-green-500 bg-green-500/10 border-green-500/20",
  intermediate: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  advanced: "text-red-500 bg-red-500/10 border-red-500/20",
};

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCourseProgress, isLessonCompleted, getLessonProgress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const course = courses.find((c) => c.id === courseId);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  if (!course) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Link to="/learn">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const lessonIds = course.lessons.map((l) => l.id);
  const { completed, total, percentage } = getCourseProgress(lessonIds);
  const IconComponent = course.icon;

  // Find the first incomplete lesson for "Continue" button
  const nextLesson = course.lessons.find((l, index) => {
    const isComplete = isLessonCompleted(l.id);
    const prevCompleted = index === 0 || isLessonCompleted(course.lessons[index - 1].id);
    return !isComplete && prevCompleted;
  });

  // All lessons are unlocked - no gating
  const isLessonUnlocked = (_index: number) => {
    return true;
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card px-4 py-4 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/learn">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Courses
              </Button>
            </Link>
          </div>

          <div className="flex items-start gap-4">
            <div className={cn(
              "flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center",
              "bg-gradient-to-br",
              course.bgGradient,
              "border border-border"
            )}>
              <IconComponent className={cn("h-8 w-8", course.color)} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-primary capitalize">
                  {course.category}
                </span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium border",
                  difficultyColors[course.difficulty]
                )}>
                  {course.difficulty}
                </span>
              </div>
              <h1 className="text-2xl font-bold mb-1">{course.title}</h1>
              <p className="text-sm text-muted-foreground">{course.description}</p>

              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.estimatedTime}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {total} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {completed} completed
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Course Progress</span>
              <span className="font-medium text-primary">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>

          {/* Continue button */}
          {nextLesson && user && (
            <div className="mt-4">
              <Button 
                className="w-full sm:w-auto gap-2" 
                onClick={() => navigate(`/learn/lesson/${nextLesson.id}`)}
              >
                <Play className="h-4 w-4" />
                {completed > 0 ? "Continue Learning" : "Start Course"}
              </Button>
            </div>
          )}

          {!user && (
            <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <Link to="/auth" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>{" "}
                to track your progress and earn certificates.
              </p>
            </div>
          )}
        </header>

        {/* Lessons List */}
        <main className="flex-1 overflow-y-auto p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Course Curriculum
          </h2>

          <div className="space-y-3">
            {course.lessons.map((lesson, index) => {
              const lessonCompleted = isLessonCompleted(lesson.id);
              const lessonProgress = getLessonProgress(lesson.id);
              const unlocked = isLessonUnlocked(index);

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={unlocked ? `/learn/lesson/${lesson.id}` : "#"}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border bg-card transition-all",
                      unlocked && "hover:border-primary/50 hover:shadow-md cursor-pointer",
                      !unlocked && "opacity-60 cursor-not-allowed",
                      lessonCompleted && "border-green-500/30 bg-green-500/5"
                    )}
                    onClick={(e) => !unlocked && e.preventDefault()}
                  >
                    {/* Lesson number / status */}
                    <div className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                      lessonCompleted && "bg-green-500 text-white",
                      !lessonCompleted && unlocked && "bg-primary/10 text-primary",
                      !unlocked && "bg-muted text-muted-foreground"
                    )}>
                      {lessonCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : !unlocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Lesson info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{lesson.title}</h3>
                        {lesson.hasPlayground && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-500">
                            Interactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {lesson.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.duration}
                        </span>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded",
                          difficultyColors[lesson.difficulty]
                        )}>
                          {lesson.difficulty}
                        </span>
                      </div>

                      {/* Progress bar for in-progress lessons */}
                      {lessonProgress > 0 && lessonProgress < 100 && (
                        <div className="mt-2">
                          <Progress value={lessonProgress} className="h-1" />
                        </div>
                      )}
                    </div>

                    {/* Arrow */}
                    {unlocked && (
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
