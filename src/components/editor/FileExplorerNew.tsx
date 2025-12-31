import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  FolderOpen,
  Plus,
  FolderPlus,
  Upload,
  MoreHorizontal,
  Trash2,
  Pencil,
  FileCode,
  FileJson,
  FileText,
  FileType,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { cn } from '@/lib/utils';
import { useFileSystem, FileNode } from '@/hooks/useFileSystem';
import { useAuth } from '@/hooks/useAuth';

// File icon based on language/extension
function getFileIcon(name: string, language?: string) {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  
  if (['js', 'jsx', 'ts', 'tsx'].includes(ext)) {
    return <FileCode className="h-4 w-4 text-yellow-400" />;
  }
  if (['html', 'htm'].includes(ext)) {
    return <FileCode className="h-4 w-4 text-orange-400" />;
  }
  if (['css', 'scss', 'sass', 'less'].includes(ext)) {
    return <FileCode className="h-4 w-4 text-blue-400" />;
  }
  if (['json'].includes(ext)) {
    return <FileJson className="h-4 w-4 text-yellow-300" />;
  }
  if (['md', 'txt'].includes(ext)) {
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
  if (['py'].includes(ext)) {
    return <FileCode className="h-4 w-4 text-green-400" />;
  }
  
  return <File className="h-4 w-4 text-muted-foreground" />;
}

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  selectedId: string | null;
  onSelect: (node: FileNode) => void;
  expandedFolders: Set<string>;
  toggleFolder: (id: string) => void;
}

function FileTreeItem({ 
  node, 
  depth, 
  selectedId, 
  onSelect,
  expandedFolders,
  toggleFolder
}: FileTreeItemProps) {
  const { renameFile, deleteFile, createFile, createFolder } = useFileSystem();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFolder = node.type === 'folder';
  const isOpen = expandedFolders.has(node.id);
  const isSelected = selectedId === node.id;

  const handleClick = () => {
    if (isFolder) {
      toggleFolder(node.id);
    } else {
      onSelect(node);
    }
  };

  const handleRename = () => {
    if (newName.trim() && newName !== node.name) {
      renameFile(node.id, newName.trim());
    }
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setNewName(node.name);
      setIsRenaming(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 cursor-pointer rounded-md transition-colors group",
          isSelected ? "bg-primary/20 text-primary" : "hover:bg-muted/50 text-foreground/80"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
      >
        {isFolder ? (
          <>
            {isOpen ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )}
            {isOpen ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-primary" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5" />
            {getFileIcon(node.name, node.language)}
          </>
        )}

        {isRenaming ? (
          <Input
            ref={inputRef}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className="h-6 px-1 py-0 text-xs flex-1"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-xs truncate flex-1">{node.name}</span>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {isFolder && (
              <>
                <DropdownMenuItem onClick={() => createFile('new-file.txt', node.id)}>
                  <Plus className="h-3.5 w-3.5 mr-2" />
                  New File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => createFolder('new-folder', node.id)}>
                  <FolderPlus className="h-3.5 w-3.5 mr-2" />
                  New Folder
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => {
              setIsRenaming(true);
              setTimeout(() => inputRef.current?.select(), 0);
            }}>
              <Pencil className="h-3.5 w-3.5 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => deleteFile(node.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence>
        {isFolder && isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <FileTreeItem
                key={child.id}
                node={child}
                depth={depth + 1}
                selectedId={selectedId}
                onSelect={onSelect}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface FileExplorerNewProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export function FileExplorerNew({ onClose, isMobile }: FileExplorerNewProps) {
  const { user } = useAuth();
  const { 
    getFileTree, 
    currentFile, 
    setCurrentFile, 
    createFile, 
    createFolder,
    importFiles,
    loading 
  } = useFileSystem();

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [newItemName, setNewItemName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileTree = getFileTree();

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelect = (node: FileNode) => {
    if (node.type === 'file') {
      setCurrentFile(node);
      if (isMobile && onClose) {
        onClose();
      }
    }
  };

  const handleCreate = async () => {
    if (!newItemName.trim()) return;
    
    if (createType === 'file') {
      const file = await createFile(newItemName.trim());
      if (file) setCurrentFile(file);
    } else {
      await createFolder(newItemName.trim());
    }
    
    setNewItemName('');
    setCreateDialogOpen(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await importFiles(Array.from(files));
    }
    e.target.value = '';
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Explorer
        </span>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => {
              setCreateType('file');
              setCreateDialogOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => {
              setCreateType('folder');
              setCreateDialogOpen(true);
            }}
          >
            <FolderPlus className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5" />
          </Button>
          {isMobile && onClose && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleImport}
          accept=".js,.jsx,.ts,.tsx,.html,.css,.json,.md,.txt,.py,.rb,.java,.c,.cpp,.h,.go,.rs,.php,.sql,.sh,.yaml,.yml,.xml,.vue,.svelte"
        />
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-auto py-2">
        {!user ? (
          <div className="px-4 py-8 text-center">
            <FileType className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">Sign in to save files</p>
          </div>
        ) : loading ? (
          <div className="px-4 py-8 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent mx-auto" />
          </div>
        ) : fileTree.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Folder className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-2">No files yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCreateType('file');
                setCreateDialogOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Create File
            </Button>
          </div>
        ) : (
          fileTree.map((node) => (
            <FileTreeItem
              key={node.id}
              node={node}
              depth={0}
              selectedId={currentFile?.id || null}
              onSelect={handleSelect}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
            />
          ))
        )}
      </div>

      {/* Create dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {createType === 'file' ? 'Create New File' : 'Create New Folder'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-4">
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={createType === 'file' ? 'filename.js' : 'folder-name'}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            <Button onClick={handleCreate} disabled={!newItemName.trim()}>
              Create {createType === 'file' ? 'File' : 'Folder'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
