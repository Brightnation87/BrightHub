import { motion } from "framer-motion";
import { Clock, Users, ChevronRight, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Course } from "@/data/coursesData";

interface CourseCardProps {
  course: Course;
  index?: number;
}

const difficultyColors = {
  beginner: "text-green-500 bg-green-500/10 border-green-500/20",
  intermediate: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  advanced: "text-red-500 bg-red-500/10 border-red-500/20",
};

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  const IconComponent = course.icon;
  const progress = (course.completedLessons / course.totalLessons) * 100;
  const isCompleted = progress === 100;
  const isStarted = progress > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/learn/course/${course.id}`}
        className={cn(
          "block group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300",
          "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
        )}
      >
        {/* Background gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-70",
          course.bgGradient
        )} />

        {/* Completion badge */}
        {isCompleted && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
              <Trophy className="h-3 w-3" />
              Completed
            </div>
          </div>
        )}

        <div className="relative p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={cn(
              "flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center",
              "bg-background/80 border border-border/50",
              "group-hover:scale-110 transition-transform duration-300"
            )}>
              <IconComponent className={cn("h-7 w-7", course.color)} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Category & Difficulty */}
              <div className="flex items-center gap-2 mb-2">
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

              {/* Title */}
              <h3 className="font-semibold text-lg mb-1 truncate group-hover:text-primary transition-colors">
                {course.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {course.description}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {course.estimatedTime}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {course.totalLessons} lessons
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {isStarted && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">
                  {course.completedLessons} / {course.totalLessons} lessons
                </span>
                <span className="font-medium text-primary">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Action hint */}
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {isCompleted ? "Review course" : isStarted ? "Continue learning" : "Start course"}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
