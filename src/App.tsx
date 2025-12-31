import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProgressProvider } from "@/hooks/useProgress";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { useEffect } from "react";
import Index from "./pages/Index";
import EditorNew from "./pages/EditorNew";
import Learn from "./pages/Learn";
import CourseDetail from "./pages/CourseDetail";
import LessonDetail from "./pages/LessonDetail";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Register service worker for offline support
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration.scope);
        })
        .catch((error) => {
          console.log("SW registration failed:", error);
        });
    });
  }
}

const App = () => {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <ProgressProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/editor" element={<EditorNew />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/learn/course/:courseId" element={<CourseDetail />} />
                  <Route path="/learn/lesson/:lessonId" element={<LessonDetail />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/ai" element={<AIAssistant />} />
                  <Route path="/projects" element={<EditorNew />} />
                  <Route path="/terminal" element={<EditorNew />} />
                  <Route path="/progress" element={<Learn />} />
                  <Route path="/themes" element={<Settings />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ProgressProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
