import { motion } from "framer-motion";
import { 
  Flame, 
  Trophy, 
  Target, 
  Calendar,
  Award,
  BookOpen,
  Clock,
  ExternalLink,
  Star,
  Filter
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { courses } from "@/data/coursesData";
import { allBadges, badgeCategories, getTotalXP, BadgeCategory } from "@/data/badgesData";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  stats: {
    currentStreak: number;
    longestStreak: number;
    coursesCompleted: number;
    lessonsCompleted: number;
    hoursLearned: number;
    badges: typeof allBadges;
  };
}

export function Dashboard({ stats }: DashboardProps) {
  const { user } = useAuth();
  const { progress, getCourseProgress } = useProgress();
  const [selectedBadgeCategory, setSelectedBadgeCategory] = useState<BadgeCategory | "all">("all");

  // Calculate real stats from progress
  const lessonsCompleted = Object.values(progress).filter(p => p.is_completed).length;
  const coursesCompleted = courses.filter(course => {
    const lessonIds = course.lessons.map(l => l.id);
    const { percentage } = getCourseProgress(lessonIds);
    return percentage === 100;
  }).length;

  // Get recently accessed lessons
  const recentLessons = Object.entries(progress)
    .sort((a, b) => new Date(b[1].last_accessed).getTime() - new Date(a[1].last_accessed).getTime())
    .slice(0, 3);

  // Find in-progress courses
  const inProgressCourses = courses.filter(course => {
    const lessonIds = course.lessons.map(l => l.id);
    const { percentage } = getCourseProgress(lessonIds);
    return percentage > 0 && percentage < 100;
  }).slice(0, 3);

  const earnedBadges = stats.badges.filter(b => !b.isLocked);
  const totalXP = getTotalXP(stats.badges);
  
  // Filter badges by category
  const filteredBadges = selectedBadgeCategory === "all" 
    ? stats.badges 
    : stats.badges.filter(b => b.category === selectedBadgeCategory);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-6"
        >
          <h2 className="text-xl font-bold mb-2">Welcome to Learning Hub!</h2>
          <p className="text-muted-foreground mb-4">
            Sign in to track your progress, earn certificates, and continue where you left off.
          </p>
          <Link to="/auth">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Sign In to Get Started
            </button>
          </Link>
        </motion.div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 p-4"
        >
          <div className="absolute top-2 right-2">
            <Flame className="h-8 w-8 text-orange-500" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Streak</p>
            <p className="text-3xl font-bold text-orange-500">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
        </motion.div>

        {/* Lessons Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 p-4"
        >
          <div className="absolute top-2 right-2">
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Lessons</p>
            <p className="text-3xl font-bold text-blue-500">{lessonsCompleted}</p>
            <p className="text-xs text-muted-foreground">completed</p>
          </div>
        </motion.div>

        {/* Courses Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 p-4"
        >
          <div className="absolute top-2 right-2">
            <Trophy className="h-8 w-8 text-green-500" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Courses</p>
            <p className="text-3xl font-bold text-green-500">{coursesCompleted}</p>
            <p className="text-xs text-muted-foreground">completed</p>
          </div>
        </motion.div>

        {/* Hours Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-4"
        >
          <div className="absolute top-2 right-2">
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Learning</p>
            <p className="text-3xl font-bold text-purple-500">{stats.hoursLearned}</p>
            <p className="text-xs text-muted-foreground">hours</p>
          </div>
        </motion.div>

        {/* XP Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 p-4 col-span-2 md:col-span-1"
        >
          <div className="absolute top-2 right-2">
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Total XP</p>
            <p className="text-3xl font-bold text-yellow-500">{totalXP.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">points</p>
          </div>
        </motion.div>
      </div>

      {/* Continue Learning */}
      {inProgressCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl bg-card border border-border p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <span className="font-semibold">Continue Learning</span>
          </div>
          
          <div className="space-y-3">
            {inProgressCourses.map((course) => {
              const lessonIds = course.lessons.map(l => l.id);
              const { completed, total, percentage } = getCourseProgress(lessonIds);
              const IconComponent = course.icon;
              
              return (
                <Link
                  key={course.id}
                  to={`/learn/course/${course.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", course.bgGradient)}>
                    <IconComponent className={cn("h-5 w-5", course.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{course.title}</h4>
                    <p className="text-xs text-muted-foreground">{completed}/{total} lessons</p>
                  </div>
                  <div className="w-20">
                    <Progress value={percentage} className="h-2" />
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Badges Section with Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl bg-card border border-border p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <span className="font-semibold">Achievement Badges</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {earnedBadges.length} / {stats.badges.length} earned
            </span>
            <span className="text-sm font-medium text-yellow-500">
              {totalXP.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Badge Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          <Button
            variant={selectedBadgeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedBadgeCategory("all")}
            className="flex-shrink-0"
          >
            <Filter className="h-3 w-3 mr-1" />
            All
          </Button>
          {badgeCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedBadgeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedBadgeCategory(cat.id)}
              className="flex-shrink-0"
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {filteredBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.02 }}
              className={cn(
                "relative group flex flex-col items-center p-2 rounded-lg transition-all cursor-pointer",
                badge.isLocked 
                  ? "opacity-40 grayscale" 
                  : "hover:scale-110"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg",
                badge.isLocked 
                  ? "bg-muted" 
                  : `bg-gradient-to-br ${badge.color}`
              )}>
                {badge.isLocked ? "🔒" : badge.icon}
              </div>
              
              {/* XP indicator for earned badges */}
              {!badge.isLocked && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-yellow-500 text-yellow-950">
                  +{badge.xp}
                </span>
              )}
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap min-w-[150px]">
                <p className="font-semibold text-sm">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] uppercase text-muted-foreground">{badge.category}</span>
                  <span className="text-xs font-medium text-yellow-500">+{badge.xp} XP</span>
                </div>
                {badge.isLocked && (
                  <p className="text-xs text-primary mt-1 border-t border-border pt-1">{badge.requirement}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredBadges.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No badges in this category yet</p>
          </div>
        )}
      </motion.div>

      {/* Weekly Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl bg-card border border-border p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="font-semibold">This Week</span>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const isToday = i === new Date().getDay() - 1;
            return (
              <div key={day} className="flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{day}</span>
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all",
                  isToday && "bg-primary text-primary-foreground ring-2 ring-primary/50",
                  !isToday && "bg-muted text-muted-foreground"
                )}>
                  {isToday ? "•" : ""}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
