import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  parentId?: string | null;
  children?: FileNode[];
  isOpen?: boolean;
}

interface FileSystemContextType {
  files: FileNode[];
  currentFile: FileNode | null;
  loading: boolean;
  setCurrentFile: (file: FileNode | null) => void;
  createFile: (name: string, parentId?: string | null, content?: string) => Promise<FileNode | null>;
  createFolder: (name: string, parentId?: string | null) => Promise<FileNode | null>;
  updateFile: (id: string, content: string) => Promise<void>;
  renameFile: (id: string, newName: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  importFiles: (files: File[], parentId?: string | null) => Promise<void>;
  refreshFiles: () => Promise<void>;
  getFileTree: () => FileNode[];
}

const FileSystemContext = createContext<FileSystemContextType | null>(null);

// Helper to detect language from file extension
function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const langMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    json: 'json',
    md: 'markdown',
    py: 'python',
    rb: 'ruby',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    h: 'c',
    hpp: 'cpp',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    php: 'php',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    svg: 'xml',
    vue: 'vue',
    svelte: 'svelte',
    swift: 'swift',
    kt: 'kotlin',
    dart: 'dart',
    r: 'r',
    lua: 'lua',
    perl: 'perl',
    txt: 'plaintext',
  };
  return langMap[ext] || 'plaintext';
}

// Build tree structure from flat array
function buildFileTree(files: FileNode[]): FileNode[] {
  const map = new Map<string, FileNode>();
  const roots: FileNode[] = [];

  // First pass: create map
  files.forEach(file => {
    map.set(file.id, { ...file, children: [] });
  });

  // Second pass: build tree
  files.forEach(file => {
    const node = map.get(file.id)!;
    if (file.parentId && map.has(file.parentId)) {
      map.get(file.parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  // Sort: folders first, then alphabetically
  const sortNodes = (nodes: FileNode[]): FileNode[] => {
    return nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    }).map(node => ({
      ...node,
      children: node.children ? sortNodes(node.children) : undefined
    }));
  };

  return sortNodes(roots);
}

export function FileSystemProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileNode[]>([]);
  const [currentFile, setCurrentFile] = useState<FileNode | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFiles = useCallback(async () => {
    if (!user) {
      setFiles([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_files')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;

      const fileNodes: FileNode[] = (data || []).map((file: any) => ({
        id: file.id,
        name: file.name,
        path: file.path,
        type: file.type,
        content: file.content,
        language: file.language,
        parentId: file.parent_id,
      }));

      setFiles(fileNodes);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const createFile = async (name: string, parentId?: string | null, content = ''): Promise<FileNode | null> => {
    if (!user) {
      toast.error('Please sign in to create files');
      return null;
    }

    const language = getLanguageFromFilename(name);
    const parent = parentId ? files.find(f => f.id === parentId) : null;
    const path = parent ? `${parent.path}/${name}` : `/${name}`;

    try {
      const { data, error } = await supabase
        .from('user_files')
        .insert({
          user_id: user.id,
          name,
          path,
          type: 'file',
          content,
          language,
          parent_id: parentId || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newFile: FileNode = {
        id: data.id,
        name: data.name,
        path: data.path,
        type: 'file',
        content: data.content,
        language: data.language,
        parentId: data.parent_id,
      };

      setFiles(prev => [...prev, newFile]);
      toast.success(`Created ${name}`);
      return newFile;
    } catch (error: any) {
      console.error('Error creating file:', error);
      toast.error('Failed to create file');
      return null;
    }
  };

  const createFolder = async (name: string, parentId?: string | null): Promise<FileNode | null> => {
    if (!user) {
      toast.error('Please sign in to create folders');
      return null;
    }

    const parent = parentId ? files.find(f => f.id === parentId) : null;
    const path = parent ? `${parent.path}/${name}` : `/${name}`;

    try {
      const { data, error } = await supabase
        .from('user_files')
        .insert({
          user_id: user.id,
          name,
          path,
          type: 'folder',
          parent_id: parentId || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newFolder: FileNode = {
        id: data.id,
        name: data.name,
        path: data.path,
        type: 'folder',
        parentId: data.parent_id,
      };

      setFiles(prev => [...prev, newFolder]);
      toast.success(`Created folder ${name}`);
      return newFolder;
    } catch (error: any) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
      return null;
    }
  };

  const updateFile = async (id: string, content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_files')
        .update({ content })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setFiles(prev => prev.map(f => f.id === id ? { ...f, content } : f));
      if (currentFile?.id === id) {
        setCurrentFile({ ...currentFile, content });
      }
    } catch (error: any) {
      console.error('Error updating file:', error);
      toast.error('Failed to save file');
    }
  };

  const renameFile = async (id: string, newName: string) => {
    if (!user) return;

    const file = files.find(f => f.id === id);
    if (!file) return;

    const parent = file.parentId ? files.find(f => f.id === file.parentId) : null;
    const newPath = parent ? `${parent.path}/${newName}` : `/${newName}`;
    const language = file.type === 'file' ? getLanguageFromFilename(newName) : undefined;

    try {
      const { error } = await supabase
        .from('user_files')
        .update({ name: newName, path: newPath, language })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setFiles(prev => prev.map(f => f.id === id ? { ...f, name: newName, path: newPath, language } : f));
      if (currentFile?.id === id) {
        setCurrentFile({ ...currentFile, name: newName, path: newPath, language });
      }
      toast.success(`Renamed to ${newName}`);
    } catch (error: any) {
      console.error('Error renaming file:', error);
      toast.error('Failed to rename');
    }
  };

  const deleteFile = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_files')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remove file and all children
      const idsToRemove = new Set<string>();
      const addChildren = (fileId: string) => {
        idsToRemove.add(fileId);
        files.filter(f => f.parentId === fileId).forEach(f => addChildren(f.id));
      };
      addChildren(id);

      setFiles(prev => prev.filter(f => !idsToRemove.has(f.id)));
      if (currentFile && idsToRemove.has(currentFile.id)) {
        setCurrentFile(null);
      }
      toast.success('Deleted successfully');
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete');
    }
  };

  const importFiles = async (importedFiles: File[], parentId?: string | null) => {
    if (!user) {
      toast.error('Please sign in to import files');
      return;
    }

    for (const file of importedFiles) {
      const content = await file.text();
      await createFile(file.name, parentId, content);
    }
  };

  const getFileTree = () => buildFileTree(files);

  const refreshFiles = async () => {
    await fetchFiles();
  };

  return (
    <FileSystemContext.Provider
      value={{
        files,
        currentFile,
        loading,
        setCurrentFile,
        createFile,
        createFolder,
        updateFile,
        renameFile,
        deleteFile,
        importFiles,
        refreshFiles,
        getFileTree,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
}

export function useFileSystem() {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
}
