// Comprehensive badge system with 55+ achievements
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt?: string;
  isLocked: boolean;
  requirement: string;
  category: BadgeCategory;
  xp: number;
}

export type BadgeCategory = 
  | "progress" 
  | "streak" 
  | "course" 
  | "category_mastery" 
  | "skill" 
  | "special" 
  | "community" 
  | "challenge";

export const badgeCategories: { id: BadgeCategory; label: string; icon: string }[] = [
  { id: "progress", label: "Progress", icon: "📈" },
  { id: "streak", label: "Streaks", icon: "🔥" },
  { id: "course", label: "Courses", icon: "📚" },
  { id: "category_mastery", label: "Mastery", icon: "🏆" },
  { id: "skill", label: "Skills", icon: "⚡" },
  { id: "special", label: "Special", icon: "✨" },
  { id: "community", label: "Community", icon: "🤝" },
  { id: "challenge", label: "Challenges", icon: "🎯" },
];

export const allBadges: Badge[] = [
  // ===== PROGRESS BADGES (10) =====
  { 
    id: "first-lesson", 
    name: "First Steps", 
    description: "Complete your first lesson", 
    icon: "🎯", 
    color: "from-blue-500 to-cyan-500", 
    isLocked: true, 
    requirement: "Complete 1 lesson",
    category: "progress",
    xp: 10
  },
  { 
    id: "lessons-5", 
    name: "Getting Started", 
    description: "Complete 5 lessons", 
    icon: "📖", 
    color: "from-teal-500 to-emerald-500", 
    isLocked: true, 
    requirement: "Complete 5 lessons",
    category: "progress",
    xp: 25
  },
  { 
    id: "lessons-10", 
    name: "Dedicated Learner", 
    description: "Complete 10 lessons", 
    icon: "📚", 
    color: "from-green-500 to-lime-500", 
    isLocked: true, 
    requirement: "Complete 10 lessons",
    category: "progress",
    xp: 50
  },
  { 
    id: "lessons-25", 
    name: "Knowledge Seeker", 
    description: "Complete 25 lessons", 
    icon: "🧠", 
    color: "from-emerald-500 to-teal-500", 
    isLocked: true, 
    requirement: "Complete 25 lessons",
    category: "progress",
    xp: 100
  },
  { 
    id: "lessons-50", 
    name: "Half Century", 
    description: "Complete 50 lessons", 
    icon: "⭐", 
    color: "from-yellow-500 to-amber-500", 
    isLocked: true, 
    requirement: "Complete 50 lessons",
    category: "progress",
    xp: 200
  },
  { 
    id: "lessons-100", 
    name: "Century Club", 
    description: "Complete 100 lessons", 
    icon: "💯", 
    color: "from-amber-500 to-orange-500", 
    isLocked: true, 
    requirement: "Complete 100 lessons",
    category: "progress",
    xp: 500
  },
  { 
    id: "hours-5", 
    name: "Time Investor", 
    description: "Spend 5 hours learning", 
    icon: "⏱️", 
    color: "from-slate-500 to-zinc-500", 
    isLocked: true, 
    requirement: "Learn for 5 hours",
    category: "progress",
    xp: 50
  },
  { 
    id: "hours-10", 
    name: "Time Master", 
    description: "Spend 10 hours learning", 
    icon: "⏰", 
    color: "from-gray-500 to-slate-500", 
    isLocked: true, 
    requirement: "Learn for 10 hours",
    category: "progress",
    xp: 100
  },
  { 
    id: "hours-25", 
    name: "Marathon Learner", 
    description: "Spend 25 hours learning", 
    icon: "🕐", 
    color: "from-indigo-500 to-blue-500", 
    isLocked: true, 
    requirement: "Learn for 25 hours",
    category: "progress",
    xp: 250
  },
  { 
    id: "hours-50", 
    name: "Learning Legend", 
    description: "Spend 50 hours learning", 
    icon: "🏅", 
    color: "from-purple-500 to-indigo-500", 
    isLocked: true, 
    requirement: "Learn for 50 hours",
    category: "progress",
    xp: 500
  },

  // ===== STREAK BADGES (8) =====
  { 
    id: "streak-3", 
    name: "On Fire", 
    description: "3 day learning streak", 
    icon: "🔥", 
    color: "from-orange-500 to-red-500", 
    isLocked: true, 
    requirement: "Maintain 3 day streak",
    category: "streak",
    xp: 30
  },
  { 
    id: "streak-7", 
    name: "Week Warrior", 
    description: "7 day learning streak", 
    icon: "⚡", 
    color: "from-yellow-500 to-orange-500", 
    isLocked: true, 
    requirement: "Maintain 7 day streak",
    category: "streak",
    xp: 70
  },
  { 
    id: "streak-14", 
    name: "Fortnight Fighter", 
    description: "14 day learning streak", 
    icon: "💪", 
    color: "from-red-500 to-rose-500", 
    isLocked: true, 
    requirement: "Maintain 14 day streak",
    category: "streak",
    xp: 140
  },
  { 
    id: "streak-30", 
    name: "Monthly Master", 
    description: "30 day learning streak", 
    icon: "🌟", 
    color: "from-amber-500 to-yellow-500", 
    isLocked: true, 
    requirement: "Maintain 30 day streak",
    category: "streak",
    xp: 300
  },
  { 
    id: "streak-60", 
    name: "Unstoppable", 
    description: "60 day learning streak", 
    icon: "💎", 
    color: "from-cyan-500 to-blue-500", 
    isLocked: true, 
    requirement: "Maintain 60 day streak",
    category: "streak",
    xp: 600
  },
  { 
    id: "streak-90", 
    name: "Legendary Learner", 
    description: "90 day learning streak", 
    icon: "👑", 
    color: "from-yellow-400 to-amber-600", 
    isLocked: true, 
    requirement: "Maintain 90 day streak",
    category: "streak",
    xp: 1000
  },
  { 
    id: "streak-180", 
    name: "Half Year Hero", 
    description: "180 day learning streak", 
    icon: "🦅", 
    color: "from-violet-500 to-purple-600", 
    isLocked: true, 
    requirement: "Maintain 180 day streak",
    category: "streak",
    xp: 2000
  },
  { 
    id: "streak-365", 
    name: "Year of Dedication", 
    description: "365 day learning streak", 
    icon: "🏆", 
    color: "from-yellow-500 to-gold-500", 
    isLocked: true, 
    requirement: "Maintain 365 day streak",
    category: "streak",
    xp: 5000
  },

  // ===== COURSE COMPLETION BADGES (8) =====
  { 
    id: "course-1", 
    name: "Graduate", 
    description: "Complete your first course", 
    icon: "🎓", 
    color: "from-purple-500 to-pink-500", 
    isLocked: true, 
    requirement: "Complete 1 course",
    category: "course",
    xp: 100
  },
  { 
    id: "course-3", 
    name: "Triple Threat", 
    description: "Complete 3 courses", 
    icon: "🎖️", 
    color: "from-blue-500 to-cyan-500", 
    isLocked: true, 
    requirement: "Complete 3 courses",
    category: "course",
    xp: 300
  },
  { 
    id: "course-5", 
    name: "Scholar", 
    description: "Complete 5 courses", 
    icon: "📚", 
    color: "from-indigo-500 to-purple-500", 
    isLocked: true, 
    requirement: "Complete 5 courses",
    category: "course",
    xp: 500
  },
  { 
    id: "course-10", 
    name: "Academic", 
    description: "Complete 10 courses", 
    icon: "🎓", 
    color: "from-green-500 to-emerald-500", 
    isLocked: true, 
    requirement: "Complete 10 courses",
    category: "course",
    xp: 1000
  },
  { 
    id: "course-15", 
    name: "Professor", 
    description: "Complete 15 courses", 
    icon: "👨‍🏫", 
    color: "from-teal-500 to-cyan-500", 
    isLocked: true, 
    requirement: "Complete 15 courses",
    category: "course",
    xp: 1500
  },
  { 
    id: "course-20", 
    name: "Dean's List", 
    description: "Complete 20 courses", 
    icon: "📜", 
    color: "from-amber-500 to-yellow-500", 
    isLocked: true, 
    requirement: "Complete 20 courses",
    category: "course",
    xp: 2000
  },
  { 
    id: "perfect-course", 
    name: "Perfectionist", 
    description: "Score 100% on a course quiz", 
    icon: "💯", 
    color: "from-pink-500 to-rose-500", 
    isLocked: true, 
    requirement: "Get 100% on any course",
    category: "course",
    xp: 150
  },
  { 
    id: "speed-course", 
    name: "Speed Runner", 
    description: "Complete a course in one day", 
    icon: "⚡", 
    color: "from-yellow-500 to-orange-500", 
    isLocked: true, 
    requirement: "Finish a course in 24 hours",
    category: "course",
    xp: 200
  },

  // ===== CATEGORY MASTERY BADGES (10) =====
  { 
    id: "cyber-beginner", 
    name: "Cyber Rookie", 
    description: "Complete a cybersecurity course", 
    icon: "🔐", 
    color: "from-red-500 to-orange-500", 
    isLocked: true, 
    requirement: "Complete 1 cybersecurity course",
    category: "category_mastery",
    xp: 100
  },
  { 
    id: "cyber-expert", 
    name: "Cyber Guardian", 
    description: "Complete all cybersecurity courses", 
    icon: "🛡️", 
    color: "from-red-600 to-rose-600", 
    isLocked: true, 
    requirement: "Complete all cybersecurity courses",
    category: "category_mastery",
    xp: 500
  },
  { 
    id: "frontend-beginner", 
    name: "UI Explorer", 
    description: "Complete a frontend course", 
    icon: "🎨", 
    color: "from-orange-500 to-amber-500", 
    isLocked: true, 
    requirement: "Complete 1 frontend course",
    category: "category_mastery",
    xp: 100
  },
  { 
    id: "frontend-master", 
    name: "Code Artist", 
    description: "Complete all frontend courses", 
    icon: "💻", 
    color: "from-blue-500 to-indigo-500", 
    isLocked: true, 
    requirement: "Complete all frontend courses",
    category: "category_mastery",
    xp: 500
  },
  { 
    id: "backend-beginner", 
    name: "Server Starter", 
    description: "Complete a backend course", 
    icon: "⚙️", 
    color: "from-green-500 to-teal-500", 
    isLocked: true, 
    requirement: "Complete 1 backend course",
    category: "category_mastery",
    xp: 100
  },
  { 
    id: "backend-master", 
    name: "Backend Boss", 
    description: "Complete all backend courses", 
    icon: "🖥️", 
    color: "from-emerald-500 to-green-600", 
    isLocked: true, 
    requirement: "Complete all backend courses",
    category: "category_mastery",
    xp: 500
  },
  { 
    id: "ai-beginner", 
    name: "AI Curious", 
    description: "Complete an AI course", 
    icon: "🤖", 
    color: "from-violet-500 to-purple-500", 
    isLocked: true, 
    requirement: "Complete 1 AI course",
    category: "category_mastery",
    xp: 100
  },
  { 
    id: "ai-pioneer", 
    name: "AI Pioneer", 
    description: "Complete all AI courses", 
    icon: "🧠", 
    color: "from-purple-600 to-pink-600", 
    isLocked: true, 
    requirement: "Complete all AI courses",
    category: "category_mastery",
    xp: 500
  },
  { 
    id: "devops-beginner", 
    name: "DevOps Initiate", 
    description: "Complete a DevOps course", 
    icon: "🔧", 
    color: "from-gray-500 to-slate-600", 
    isLocked: true, 
    requirement: "Complete 1 DevOps course",
    category: "category_mastery",
    xp: 100
  },
  { 
    id: "devops-ninja", 
    name: "DevOps Ninja", 
    description: "Complete all DevOps courses", 
    icon: "🥷", 
    color: "from-slate-600 to-zinc-700", 
    isLocked: true, 
    requirement: "Complete all DevOps courses",
    category: "category_mastery",
    xp: 500
  },

  // ===== SKILL BADGES (10) =====
  { 
    id: "html-master", 
    name: "HTML Hero", 
    description: "Master HTML fundamentals", 
    icon: "📄", 
    color: "from-orange-500 to-red-500", 
    isLocked: true, 
    requirement: "Complete HTML & CSS course",
    category: "skill",
    xp: 100
  },
  { 
    id: "css-wizard", 
    name: "CSS Wizard", 
    description: "Master CSS styling", 
    icon: "🎨", 
    color: "from-blue-500 to-cyan-500", 
    isLocked: true, 
    requirement: "Complete CSS lessons",
    category: "skill",
    xp: 100
  },
  { 
    id: "js-ninja", 
    name: "JavaScript Ninja", 
    description: "Master JavaScript", 
    icon: "⚡", 
    color: "from-yellow-500 to-amber-500", 
    isLocked: true, 
    requirement: "Complete JavaScript course",
    category: "skill",
    xp: 150
  },
  { 
    id: "react-pro", 
    name: "React Pro", 
    description: "Master React.js", 
    icon: "⚛️", 
    color: "from-cyan-400 to-blue-500", 
    isLocked: true, 
    requirement: "Complete React course",
    category: "skill",
    xp: 200
  },
  { 
    id: "node-expert", 
    name: "Node Expert", 
    description: "Master Node.js", 
    icon: "🟢", 
    color: "from-green-500 to-emerald-500", 
    isLocked: true, 
    requirement: "Complete Node.js course",
    category: "skill",
    xp: 200
  },
  { 
    id: "sql-master", 
    name: "SQL Sorcerer", 
    description: "Master database queries", 
    icon: "🗃️", 
    color: "from-blue-600 to-indigo-600", 
    isLocked: true, 
    requirement: "Complete Database course",
    category: "skill",
    xp: 150
  },
  { 
    id: "git-guru", 
    name: "Git Guru", 
    description: "Master version control", 
    icon: "🔀", 
    color: "from-orange-600 to-red-600", 
    isLocked: true, 
    requirement: "Complete Git course",
    category: "skill",
    xp: 100
  },
  { 
    id: "python-champion", 
    name: "Python Champion", 
    description: "Master Python programming", 
    icon: "🐍", 
    color: "from-yellow-500 to-green-500", 
    isLocked: true, 
    requirement: "Complete Python course",
    category: "skill",
    xp: 200
  },
  { 
    id: "typescript-pro", 
    name: "TypeScript Pro", 
    description: "Master TypeScript", 
    icon: "📘", 
    color: "from-blue-600 to-blue-700", 
    isLocked: true, 
    requirement: "Complete TypeScript course",
    category: "skill",
    xp: 150
  },
  { 
    id: "api-architect", 
    name: "API Architect", 
    description: "Master API design", 
    icon: "🔌", 
    color: "from-indigo-500 to-purple-500", 
    isLocked: true, 
    requirement: "Complete API lessons",
    category: "skill",
    xp: 150
  },

  // ===== SPECIAL BADGES (5) =====
  { 
    id: "early-bird", 
    name: "Early Bird", 
    description: "Complete a lesson before 7 AM", 
    icon: "🌅", 
    color: "from-orange-400 to-yellow-500", 
    isLocked: true, 
    requirement: "Learn before 7 AM",
    category: "special",
    xp: 50
  },
  { 
    id: "night-owl", 
    name: "Night Owl", 
    description: "Complete a lesson after 11 PM", 
    icon: "🦉", 
    color: "from-indigo-600 to-purple-700", 
    isLocked: true, 
    requirement: "Learn after 11 PM",
    category: "special",
    xp: 50
  },
  { 
    id: "weekend-warrior", 
    name: "Weekend Warrior", 
    description: "Learn on both weekend days", 
    icon: "🎮", 
    color: "from-pink-500 to-rose-500", 
    isLocked: true, 
    requirement: "Learn on Saturday and Sunday",
    category: "special",
    xp: 75
  },
  { 
    id: "comeback-kid", 
    name: "Comeback Kid", 
    description: "Return after 7+ days away", 
    icon: "🔄", 
    color: "from-teal-500 to-cyan-500", 
    isLocked: true, 
    requirement: "Resume after a week break",
    category: "special",
    xp: 50
  },
  { 
    id: "explorer", 
    name: "Explorer", 
    description: "Start courses in 3+ categories", 
    icon: "🧭", 
    color: "from-emerald-500 to-green-600", 
    isLocked: true, 
    requirement: "Explore 3+ categories",
    category: "special",
    xp: 100
  },

  // ===== COMMUNITY BADGES (5) =====
  { 
    id: "helper", 
    name: "Helpful Hand", 
    description: "Help another learner", 
    icon: "🤝", 
    color: "from-blue-500 to-cyan-500", 
    isLocked: true, 
    requirement: "Assist a fellow learner",
    category: "community",
    xp: 75
  },
  { 
    id: "feedback-giver", 
    name: "Feedback Friend", 
    description: "Give course feedback", 
    icon: "💬", 
    color: "from-green-500 to-teal-500", 
    isLocked: true, 
    requirement: "Submit course feedback",
    category: "community",
    xp: 25
  },
  { 
    id: "bug-reporter", 
    name: "Bug Hunter", 
    description: "Report a platform bug", 
    icon: "🐛", 
    color: "from-red-500 to-orange-500", 
    isLocked: true, 
    requirement: "Report a valid bug",
    category: "community",
    xp: 100
  },
  { 
    id: "social-sharer", 
    name: "Social Star", 
    description: "Share your progress", 
    icon: "📱", 
    color: "from-pink-500 to-purple-500", 
    isLocked: true, 
    requirement: "Share on social media",
    category: "community",
    xp: 25
  },
  { 
    id: "referral", 
    name: "Ambassador", 
    description: "Invite a friend who joins", 
    icon: "🌟", 
    color: "from-yellow-500 to-orange-500", 
    isLocked: true, 
    requirement: "Refer a new user",
    category: "community",
    xp: 200
  },

  // ===== CHALLENGE BADGES (4) =====
  { 
    id: "daily-double", 
    name: "Daily Double", 
    description: "Complete 2 lessons in one day", 
    icon: "✌️", 
    color: "from-violet-500 to-purple-500", 
    isLocked: true, 
    requirement: "2 lessons in 24 hours",
    category: "challenge",
    xp: 30
  },
  { 
    id: "triple-play", 
    name: "Triple Play", 
    description: "Complete 3 lessons in one day", 
    icon: "🎯", 
    color: "from-blue-500 to-indigo-500", 
    isLocked: true, 
    requirement: "3 lessons in 24 hours",
    category: "challenge",
    xp: 50
  },
  { 
    id: "category-hopper", 
    name: "Category Hopper", 
    description: "Complete lessons in 3 categories in one day", 
    icon: "🦘", 
    color: "from-amber-500 to-orange-500", 
    isLocked: true, 
    requirement: "3 categories in 24 hours",
    category: "challenge",
    xp: 75
  },
  { 
    id: "completionist", 
    name: "Completionist", 
    description: "Unlock all other badges", 
    icon: "🏅", 
    color: "from-yellow-400 to-amber-500", 
    isLocked: true, 
    requirement: "Earn all badges",
    category: "challenge",
    xp: 10000
  },
];

export const getBadgesByCategory = (category: BadgeCategory): Badge[] => {
  return allBadges.filter(badge => badge.category === category);
};

export const getTotalXP = (badges: Badge[]): number => {
  return badges.filter(b => !b.isLocked).reduce((sum, b) => sum + b.xp, 0);
};

export const getNextBadges = (badges: Badge[], limit = 3): Badge[] => {
  return badges.filter(b => b.isLocked).slice(0, limit);
};
