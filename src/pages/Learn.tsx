import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Menu, LayoutDashboard, BookOpen, Award, Flame, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Dashboard } from "@/components/learn/Dashboard";
import { CourseCard } from "@/components/learn/CourseCard";
import { CertificateCard, EmptyCertificates } from "@/components/learn/CertificateCard";
import { ResourcesTab } from "@/components/learn/ResourcesTab";
import { cn } from "@/lib/utils";
import { courses, categories, defaultUserStats } from "@/data/coursesData";

type TabType = "dashboard" | "courses" | "certificates" | "resources";

export default function Learn() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = activeCategory === "all" || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Mock certificates (courses with 100% completion)
  const certificates = courses
    .filter(c => c.completedLessons === c.totalLessons && c.completedLessons > 0)
    .map(c => ({
      id: c.id,
      courseName: c.title,
      earnedAt: new Date().toISOString(),
      courseIcon: <c.icon className="h-6 w-6" />,
      color: c.color,
    }));

  const tabs = [
    { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
    { id: "courses" as TabType, label: "Courses", icon: BookOpen },
    { id: "certificates" as TabType, label: "Certificates", icon: Award },
    { id: "resources" as TabType, label: "Resources", icon: Link2 },
  ];

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card px-4 py-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  Learning Hub
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-500 text-sm font-medium">
                    <Flame className="h-4 w-4" />
                    {defaultUserStats.currentStreak}
                  </span>
                </h1>
                <p className="text-sm text-muted-foreground">Master new skills, earn badges, level up</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                className="gap-2 flex-shrink-0"
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Search & Filters (only for courses) */}
          {activeTab === "courses" && (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {categories.map((category) => {
                  const IconComp = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "outline"}
                      size="sm"
                      className="flex-shrink-0 gap-1.5"
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <IconComp className="h-4 w-4" />
                      {category.label}
                    </Button>
                  );
                })}
              </div>
            </>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {activeTab === "dashboard" && (
            <Dashboard stats={defaultUserStats} />
          )}

          {activeTab === "courses" && (
            <>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredCourses.length} of {courses.length} courses
                </p>
              </div>
              {filteredCourses.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredCourses.map((course, index) => (
                    <CourseCard key={course.id} course={course} index={index} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold text-lg mb-1">No courses found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "certificates" && (
            <>
              {certificates.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((cert, index) => (
                    <CertificateCard key={cert.id} certificate={cert} index={index} />
                  ))}
                </div>
              ) : (
                <EmptyCertificates />
              )}
            </>
          )}

          {activeTab === "resources" && (
            <ResourcesTab />
          )}
        </main>
      </div>
    </div>
  );
}
