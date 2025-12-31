import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Project {
  id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const saveProject = async (name: string, code: string, existingId?: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your projects.",
        variant: "destructive",
      });
      return null;
    }

    try {
      if (existingId) {
        // Update existing project
        const { data, error } = await supabase
          .from("projects")
          .update({ name, code, updated_at: new Date().toISOString() })
          .eq("id", existingId)
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;

        setProjects((prev) =>
          prev.map((p) => (p.id === existingId ? data : p))
        );

        toast({
          title: "Project saved",
          description: `"${name}" has been updated.`,
        });

        return data;
      } else {
        // Create new project
        const { data, error } = await supabase
          .from("projects")
          .insert({ user_id: user.id, name, code })
          .select()
          .single();

        if (error) throw error;

        setProjects((prev) => [data, ...prev]);

        toast({
          title: "Project created",
          description: `"${name}" has been saved.`,
        });

        return data;
      }
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast({
        title: "Error saving project",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setProjects((prev) => prev.filter((p) => p.id !== id));

      toast({
        title: "Project deleted",
        description: "The project has been removed.",
      });
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error deleting project",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  return {
    projects,
    isLoading,
    saveProject,
    deleteProject,
    refreshProjects: fetchProjects,
  };
}
