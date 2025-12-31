import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Lock, Trophy, Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Course, Lesson } from "@/data/coursesData";
import { useProgress } from "@/hooks/useProgress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface LessonSidebarProps {
  course: Course;
  currentLessonId: string;
  onClose?: () => void;
}

export function LessonSidebar({ course, currentLessonId, onClose }: LessonSidebarProps) {
  const { isLessonCompleted, getLessonProgress } = useProgress();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // Group lessons by difficulty/section
  const groupedLessons = groupLessonsBySections(course.lessons);
  
  // Calculate overall course progress
  const completedCount = course.lessons.filter(l => isLessonCompleted(l.id)).length;
  const progressPercent = (completedCount / course.lessons.length) * 100;
  
  // Calculate XP earned
  const xpPerLesson = 50;
  const totalXP = completedCount * xpPerLesson;

  // Auto-expand section containing current lesson
  useEffect(() => {
    const currentSection = Object.entries(groupedLessons).find(([_, lessons]) => 
      lessons.some(l => l.id === currentLessonId)
    );
    if (currentSection) {
      setExpandedSections(prev => ({ ...prev, [currentSection[0]]: true }));
    }
  }, [currentLessonId]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Course Header with Progress */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center gap-2 mb-2">
          <course.icon className={cn("h-5 w-5", course.color)} />
          <h2 className="font-bold text-sm truncate">{course.title}</h2>
        </div>
        
        {/* Progress Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completedCount}/{course.lessons.length} lessons</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          
          {/* Gamification Stats */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-1 text-xs">
              <Zap className="h-3.5 w-3.5 text-yellow-500" />
              <span className="font-medium">{totalXP} XP</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-medium">{Math.floor(totalXP / 200)} badges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {Object.entries(groupedLessons).map(([section, lessons], sectionIndex) => (
            <div key={section} className="mb-1">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  {expandedSections[section] ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {section}
                  </span>
                </div>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {lessons.filter(l => isLessonCompleted(l.id)).length}/{lessons.length}
                </Badge>
              </button>

              {/* Lessons in Section */}
              {expandedSections[section] && (
                <div className="ml-2 border-l-2 border-border pl-2 space-y-0.5">
                  {lessons.map((lesson, index) => {
                    const isActive = lesson.id === currentLessonId;
                    const isCompleted = isLessonCompleted(lesson.id);
                    const progress = getLessonProgress(lesson.id);

                    return (
                      <Link
                        key={lesson.id}
                        to={`/learn/lesson/${lesson.id}`}
                        onClick={onClose}
                        className={cn(
                          "group flex items-start gap-2 px-3 py-2 rounded-md transition-all text-sm",
                          isActive 
                            ? "bg-primary/20 text-primary font-medium border-l-2 border-primary -ml-[2px] pl-[14px]" 
                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {/* Status Icon */}
                        <div className="mt-0.5 flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : progress > 0 ? (
                            <div className="relative">
                              <Circle className="h-4 w-4 text-primary" />
                              <div 
                                className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-primary"
                              >
                                {Math.round(progress)}
                              </div>
                            </div>
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground/50" />
                          )}
                        </div>

                        {/* Lesson Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={cn(
                              "truncate",
                              isActive && "text-foreground"
                            )}>
                              {lesson.title}
                            </span>
                            {lesson.hasPlayground && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 shrink-0">
                                Try it
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                            <span>{lesson.duration}</span>
                            <span>•</span>
                            <span className="capitalize">{lesson.difficulty}</span>
                            {isCompleted && (
                              <>
                                <span>•</span>
                                <span className="text-green-500 font-medium">+{xpPerLesson} XP</span>
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Bottom CTA */}
      {progressPercent === 100 && (
        <div className="p-4 border-t border-border bg-gradient-to-r from-green-500/10 to-emerald-500/10">
          <div className="flex items-center gap-2 text-green-500">
            <Trophy className="h-5 w-5" />
            <span className="font-semibold text-sm">Course Complete!</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            You earned {totalXP} XP and unlocked the course badge!
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function to group lessons into sections
function groupLessonsBySections(lessons: Lesson[]): Record<string, Lesson[]> {
  const sections: Record<string, Lesson[]> = {};
  
  // Group by difficulty levels
  const beginnerLessons = lessons.filter(l => l.difficulty === "beginner");
  const intermediateLessons = lessons.filter(l => l.difficulty === "intermediate");
  const advancedLessons = lessons.filter(l => l.difficulty === "advanced");
  
  if (beginnerLessons.length > 0) {
    sections["Getting Started"] = beginnerLessons;
  }
  if (intermediateLessons.length > 0) {
    sections["Core Concepts"] = intermediateLessons;
  }
  if (advancedLessons.length > 0) {
    sections["Advanced Topics"] = advancedLessons;
  }
  
  // If no grouping possible, just put all in one section
  if (Object.keys(sections).length === 0) {
    sections["Lessons"] = lessons;
  }
  
  return sections;
}
