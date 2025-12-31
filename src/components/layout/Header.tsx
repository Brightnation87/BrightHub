import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code2, Menu, Moon, Sun, Settings, Sparkles, User, Bot, X, BookOpen, Home, FolderOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick?: () => void;
  isDark?: boolean;
  onThemeToggle?: () => void;
}

const navLinks = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/editor", icon: Code2, label: "Editor" },
  { to: "/learn", icon: BookOpen, label: "Learn" },
  { to: "/ai", icon: Bot, label: "AI Assistant" },
  { to: "/projects", icon: FolderOpen, label: "Projects" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Header({
  onMenuClick,
  isDark = true,
  onThemeToggle
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-14 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-50"
      >
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* App name/logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:glow-primary transition-all duration-300">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">
              <span className="gradient-text">Bright</span>Hub
            </span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button
                variant={location.pathname === link.to ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onThemeToggle} className="rounded-full">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link to="/auth">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/editor" className="hidden sm:block">
            <Button size="sm" className="gap-2 glow-primary">
              <Code2 className="h-4 w-4" />
              Start Coding
            </Button>
          </Link>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-14 z-40 md:hidden"
          >
            <div className="bg-card/95 backdrop-blur-xl border-b border-border shadow-lg">
              <nav className="flex flex-col p-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        location.pathname === link.to
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="font-medium">{link.label}</span>
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-background/50 -z-10"
              onClick={() => setMobileMenuOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
