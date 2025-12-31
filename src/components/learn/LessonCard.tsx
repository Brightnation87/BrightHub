import { motion } from "framer-motion";
import { Clock, BarChart, Play, Lock, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  progress: number;
  isLocked?: boolean;
  isCompleted?: boolean;
  thumbnail?: string;
  category: string;
}

const difficultyColors = {
  beginner: "text-green-500 bg-green-500/10",
  intermediate: "text-yellow-500 bg-yellow-500/10",
  advanced: "text-red-500 bg-red-500/10",
};

export function LessonCard({
  id,
  title,
  description,
  duration,
  difficulty,
  progress,
  isLocked = false,
  isCompleted = false,
  category,
}: LessonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={isLocked ? "#" : `/learn/${id}`}
        className={cn(
          "block group relative rounded-xl border border-border bg-card transition-all duration-300 h-auto",
          !isLocked && "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
          isLocked && "opacity-60 cursor-not-allowed"
        )}
      >
        {/* Progress bar */}
        {progress > 0 && !isCompleted && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted rounded-t-xl overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            <div className="flex-1">
              {/* Category badge */}
              <span className="inline-block px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary mb-2">
                {category}
              </span>

              {/* Title - no truncation, wraps naturally */}
              <h3 className="font-semibold text-base sm:text-lg mb-2 group-hover:text-primary transition-colors leading-snug">
                {title}
              </h3>

              {/* Description - full text, no line clamp */}
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {description}
              </p>

              {/* Meta info - stacks on small mobile */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                  {duration}
                </span>
                <span className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full", difficultyColors[difficulty])}>
                  <BarChart className="h-3.5 w-3.5 flex-shrink-0" />
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              </div>
            </div>

            {/* Status icon - positioned absolutely on mobile for better layout */}
            <div className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 flex-shrink-0">
              {isLocked ? (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
              ) : isCompleted ? (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                </div>
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary group-hover:text-primary-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Action hint */}
          {!isLocked && (
            <div className="mt-4 pt-3 sm:pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {isCompleted ? "Review lesson" : progress > 0 ? "Continue learning" : "Start lesson"}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
