import { motion } from "framer-motion";
import { ExternalLink, Search, BookOpen, Code2, Shield, Brain, Server, Terminal, Smartphone, Database, Cloud, Globe, Video, FileText, Wrench, Users, GraduationCap, BookMarked } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { learningResources, LearningResource } from "@/data/learningResources";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, React.ReactNode> = {
  all: <Globe className="h-4 w-4" />,
  cybersecurity: <Shield className="h-4 w-4" />,
  ai: <Brain className="h-4 w-4" />,
  frontend: <Code2 className="h-4 w-4" />,
  backend: <Server className="h-4 w-4" />,
  devops: <Terminal className="h-4 w-4" />,
  mobile: <Smartphone className="h-4 w-4" />,
  data: <Database className="h-4 w-4" />,
  cloud: <Cloud className="h-4 w-4" />,
};

const typeColors: Record<LearningResource["type"], string> = {
  platform: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  documentation: "bg-green-500/20 text-green-400 border-green-500/30",
  tutorial: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  tool: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  community: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  course: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  book: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  video: "bg-red-500/20 text-red-400 border-red-500/30",
};

const typeIcons: Record<LearningResource["type"], React.ReactNode> = {
  platform: <GraduationCap className="h-3 w-3" />,
  documentation: <FileText className="h-3 w-3" />,
  tutorial: <BookOpen className="h-3 w-3" />,
  tool: <Wrench className="h-3 w-3" />,
  community: <Users className="h-3 w-3" />,
  course: <GraduationCap className="h-3 w-3" />,
  book: <BookMarked className="h-3 w-3" />,
  video: <Video className="h-3 w-3" />,
};

export function ResourcesTab() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState<LearningResource["type"] | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const categories = [
    { id: "all", label: "All" },
    { id: "cybersecurity", label: "Cybersecurity" },
    { id: "ai", label: "AI & ML" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "devops", label: "DevOps" },
    { id: "cloud", label: "Cloud" },
    { id: "mobile", label: "Mobile" },
    { id: "data", label: "Data" },
  ];

  const types: { id: LearningResource["type"] | "all"; label: string }[] = [
    { id: "all", label: "All Types" },
    { id: "platform", label: "Platforms" },
    { id: "documentation", label: "Docs" },
    { id: "tutorial", label: "Tutorials" },
    { id: "course", label: "Courses" },
    { id: "tool", label: "Tools" },
    { id: "community", label: "Communities" },
    { id: "book", label: "Books" },
    { id: "video", label: "Videos" },
  ];

  const filteredResources = learningResources.filter((resource) => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory || resource.category === "all";
    const matchesType = selectedType === "all" || resource.type === selectedType;
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFree = !showFreeOnly || resource.isFree;
    return matchesCategory && matchesType && matchesSearch && matchesFree;
  });

  const freeCount = learningResources.filter(r => r.isFree).length;
  const typeCount = new Set(learningResources.map(r => r.type)).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-6 w-6 text-indigo-400" />
          <h2 className="text-xl font-bold">Learning Resources</h2>
          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-sm font-medium">
            {learningResources.length}+ Resources
          </span>
        </div>
        <p className="text-muted-foreground">
          Curated collection of the best learning platforms, documentation, and tools to accelerate your learning journey.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="flex-shrink-0"
            >
              {categoryIcons[cat.id]}
              <span className="ml-1">{cat.label}</span>
            </Button>
          ))}
        </div>

        {/* Type Filter & Free Toggle */}
        <div className="flex flex-wrap gap-2 items-center">
          {types.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedType(type.id)}
              className="text-xs gap-1"
            >
              {type.id !== "all" && typeIcons[type.id]}
              {type.label}
            </Button>
          ))}
          <div className="ml-auto">
            <Button
              variant={showFreeOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFreeOnly(!showFreeOnly)}
              className="gap-1"
            >
              <span>🆓</span>
              Free Only
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredResources.length} of {learningResources.length} resources
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredResources.map((resource, index) => (
          <motion.a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.02, 0.5) }}
            className="group relative rounded-xl bg-card border border-border p-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">{resource.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                    {resource.name}
                  </h3>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {resource.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-medium rounded-full border flex items-center gap-1",
                    typeColors[resource.type]
                  )}>
                    {typeIcons[resource.type]}
                    {resource.type}
                  </span>
                  {resource.isFree && (
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                      Free
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg mb-1">No resources found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <div className="rounded-lg bg-secondary/50 p-4 text-center">
          <p className="text-2xl font-bold text-primary">{learningResources.length}</p>
          <p className="text-xs text-muted-foreground">Total Resources</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{freeCount}</p>
          <p className="text-xs text-muted-foreground">Free Resources</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">{typeCount}</p>
          <p className="text-xs text-muted-foreground">Resource Types</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-4 text-center">
          <p className="text-2xl font-bold text-purple-500">{categories.length - 1}</p>
          <p className="text-xs text-muted-foreground">Categories</p>
        </div>
      </motion.div>
    </div>
  );
}
