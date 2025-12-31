import { 
  Code2, 
  BookOpen, 
  FolderTree, 
  Terminal, 
  Bot, 
  Settings,
  Home,
  Trophy,
  Palette,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  badge?: string;
}

function SidebarItem({ icon, label, to, badge }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
        isActive
          ? "bg-primary text-primary-foreground shadow-md"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground">
          {badge}
        </span>
      )}
      <ChevronRight className={cn(
        "h-4 w-4 transition-all",
        isActive ? "opacity-50" : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
      )} />
    </Link>
  );
}

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ isOpen = true, onClose }: AppSidebarProps) {
  const sidebarItems = [
    { icon: <Home className="h-4 w-4" />, label: "Home", to: "/" },
    { icon: <Code2 className="h-4 w-4" />, label: "Editor", to: "/editor" },
    { icon: <BookOpen className="h-4 w-4" />, label: "Learn", to: "/learn", badge: "New" },
    { icon: <FolderTree className="h-4 w-4" />, label: "Projects", to: "/projects" },
    { icon: <Terminal className="h-4 w-4" />, label: "Terminal", to: "/terminal" },
    { icon: <Bot className="h-4 w-4" />, label: "AI Mentor", to: "/ai" },
    { icon: <Trophy className="h-4 w-4" />, label: "Progress", to: "/progress" },
  ];

  const bottomItems = [
    { icon: <Palette className="h-4 w-4" />, label: "Themes", to: "/themes" },
    { icon: <Settings className="h-4 w-4" />, label: "Settings", to: "/settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col",
          "md:translate-x-0"
        )}
      >
        {/* Logo & Project Name */}
        <div className="h-16 border-b border-sidebar-border flex items-center px-4 gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
            <Code2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-sidebar-foreground leading-tight">
              <span className="gradient-text">BN</span>Code
            </h1>
            <p className="text-xs text-sidebar-foreground/60 truncate">Bright Nation Learning Hub</p>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="mb-4">
            <p className="px-3 mb-2 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
              Workspace
            </p>
            {sidebarItems.map((item) => (
              <SidebarItem key={item.to} {...item} />
            ))}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          {bottomItems.map((item) => (
            <SidebarItem key={item.to} {...item} />
          ))}
        </div>

        {/* User section */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Guest User</p>
              <p className="text-xs text-sidebar-foreground/60">1,250 XP</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
