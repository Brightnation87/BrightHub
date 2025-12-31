import { useState, useRef } from 'react';
import { 
  ChevronRight, 
  File, 
  Folder, 
  FolderOpen, 
  Plus, 
  MoreVertical,
  Upload,
  FolderPlus,
  FilePlus,
  Trash2,
  Edit2,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileItem[];
  language?: string;
}

const fileIcons: Record<string, string> = {
  html: 'text-orange-400',
  htm: 'text-orange-400',
  css: 'text-blue-400',
  scss: 'text-pink-400',
  js: 'text-yellow-400',
  javascript: 'text-yellow-400',
  ts: 'text-blue-500',
  typescript: 'text-blue-500',
  jsx: 'text-cyan-400',
  tsx: 'text-cyan-500',
  json: 'text-green-400',
  md: 'text-gray-400',
  py: 'text-green-500',
  default: 'text-muted-foreground',
};

function getFileIconColor(file: FileItem): string {
  if (file.type === 'folder') return '';
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  return fileIcons[file.language || ext] || fileIcons.default;
}

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
    json: 'json',
    md: 'markdown',
    py: 'python',
  };
  return langMap[ext] || 'plaintext';
}

interface FileTreeItemProps {
  item: FileItem;
  depth?: number;
  selectedId?: string;
  onSelect?: (item: FileItem) => void;
  onRename?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
  onCreateFile?: (parentId: string | null) => void;
  onCreateFolder?: (parentId: string | null) => void;
}

function FileTreeItem({ 
  item, 
  depth = 0, 
  selectedId, 
  onSelect,
  onRename,
  onDelete,
  onCreateFile,
  onCreateFolder
}: FileTreeItemProps) {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const isFolder = item.type === 'folder';
  const isSelected = selectedId === item.id;

  const handleRename = () => {
    if (newName.trim() && newName !== item.name) {
      onRename?.(item.id, newName.trim());
    }
    setIsRenaming(false);
  };

  return (
    <div>
      <div className="group relative">
        <button
          onClick={() => {
            if (isFolder) setIsOpen(!isOpen);
            onSelect?.(item);
          }}
          className={cn(
            'w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors',
            'hover:bg-secondary',
            isSelected && 'bg-primary/10 text-primary'
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {isFolder ? (
            <>
              <ChevronRight 
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform',
                  isOpen && 'rotate-90'
                )} 
              />
              {isOpen ? (
                <FolderOpen className="h-4 w-4 text-primary" />
              ) : (
                <Folder className="h-4 w-4 text-primary" />
              )}
            </>
          ) : (
            <>
              <span className="w-4" />
              <File className={cn('h-4 w-4', getFileIconColor(item))} />
            </>
          )}
          
          {isRenaming ? (
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') {
                  setNewName(item.name);
                  setIsRenaming(false);
                }
              }}
              className="h-5 py-0 px-1 text-sm"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="truncate">{item.name}</span>
          )}
        </button>
        
        {/* Context menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {isFolder && (
              <>
                <DropdownMenuItem onClick={() => onCreateFile?.(item.id)}>
                  <FilePlus className="h-4 w-4 mr-2" />
                  New File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCreateFolder?.(item.id)}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Folder
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => setIsRenaming(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete?.(item.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence>
        {isFolder && isOpen && item.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {item.children.map((child) => (
              <FileTreeItem
                key={child.id}
                item={child}
                depth={depth + 1}
                selectedId={selectedId}
                onSelect={onSelect}
                onRename={onRename}
                onDelete={onDelete}
                onCreateFile={onCreateFile}
                onCreateFolder={onCreateFolder}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface EnhancedFileExplorerProps {
  files: FileItem[];
  selectedId?: string;
  onFileSelect?: (file: FileItem) => void;
  onCreateFile?: (name: string, parentId: string | null, content?: string) => void;
  onCreateFolder?: (name: string, parentId: string | null) => void;
  onRenameFile?: (id: string, newName: string) => void;
  onDeleteFile?: (id: string) => void;
  onImportFiles?: (files: File[]) => void;
}

export function EnhancedFileExplorer({ 
  files,
  selectedId,
  onFileSelect,
  onCreateFile,
  onCreateFolder,
  onRenameFile,
  onDeleteFile,
  onImportFiles
}: EnhancedFileExplorerProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [parentId, setParentId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    if (!newItemName.trim()) return;
    
    if (createType === 'file') {
      onCreateFile?.(newItemName.trim(), parentId, '');
    } else {
      onCreateFolder?.(newItemName.trim(), parentId);
    }
    
    setCreateDialogOpen(false);
    setNewItemName('');
    setParentId(null);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const importedFiles = e.target.files;
    if (importedFiles) {
      onImportFiles?.(Array.from(importedFiles));
    }
    e.target.value = '';
  };

  const openCreateDialog = (type: 'file' | 'folder', parent: string | null = null) => {
    setCreateType(type);
    setParentId(parent);
    setNewItemName(type === 'file' ? 'untitled.html' : 'new-folder');
    setCreateDialogOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Explorer
        </span>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => openCreateDialog('file')}
            title="New File"
          >
            <FilePlus className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => openCreateDialog('folder')}
            title="New Folder"
          >
            <FolderPlus className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => fileInputRef.current?.click()}
            title="Import Files"
          >
            <Upload className="h-3.5 w-3.5" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleImport}
            accept=".html,.htm,.css,.js,.ts,.jsx,.tsx,.json,.md,.txt"
          />
        </div>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No files yet</p>
            <p className="text-xs mt-1">Create a file or import one to get started</p>
          </div>
        ) : (
          files.map((file) => (
            <FileTreeItem
              key={file.id}
              item={file}
              selectedId={selectedId}
              onSelect={onFileSelect}
              onRename={onRenameFile}
              onDelete={onDeleteFile}
              onCreateFile={(pid) => openCreateDialog('file', pid)}
              onCreateFolder={(pid) => openCreateDialog('folder', pid)}
            />
          ))
        )}
      </div>

      {/* Create dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              Create New {createType === 'file' ? 'File' : 'Folder'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={createType === 'file' ? 'filename.html' : 'folder-name'}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
