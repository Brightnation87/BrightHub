import { useState } from "react";
import { ChevronRight, File, Folder, FolderOpen, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
  language?: string;
}

const initialFiles: FileItem[] = [
  {
    id: "1",
    name: "my-project",
    type: "folder",
    children: [
      { id: "2", name: "index.html", type: "file", language: "html" },
      { id: "3", name: "styles.css", type: "file", language: "css" },
      { id: "4", name: "script.js", type: "file", language: "javascript" },
      {
        id: "5",
        name: "assets",
        type: "folder",
        children: [
          { id: "6", name: "logo.png", type: "file" },
          { id: "7", name: "background.jpg", type: "file" },
        ],
      },
    ],
  },
];

function getFileIcon(file: FileItem) {
  if (file.type === "folder") return null;
  
  const iconColors: Record<string, string> = {
    html: "text-orange-400",
    css: "text-blue-400",
    javascript: "text-yellow-400",
    js: "text-yellow-400",
    json: "text-green-400",
    default: "text-muted-foreground",
  };
  
  const ext = file.name.split('.').pop() || "";
  const colorClass = iconColors[file.language || ext] || iconColors.default;
  
  return <File className={cn("h-4 w-4", colorClass)} />;
}

interface FileTreeItemProps {
  item: FileItem;
  depth?: number;
  selectedId?: string;
  onSelect?: (item: FileItem) => void;
}

function FileTreeItem({ item, depth = 0, selectedId, onSelect }: FileTreeItemProps) {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const isFolder = item.type === "folder";
  const isSelected = selectedId === item.id;

  return (
    <div>
      <button
        onClick={() => {
          if (isFolder) {
            setIsOpen(!isOpen);
          }
          onSelect?.(item);
        }}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
          "hover:bg-secondary",
          isSelected && "bg-primary/10 text-primary"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {isFolder ? (
          <>
            <ChevronRight 
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                isOpen && "rotate-90"
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
            {getFileIcon(item)}
          </>
        )}
        <span className="truncate">{item.name}</span>
      </button>

      <AnimatePresence>
        {isFolder && isOpen && item.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
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
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FileExplorerProps {
  onFileSelect?: (file: FileItem) => void;
}

export function FileExplorer({ onFileSelect }: FileExplorerProps) {
  const [files] = useState(initialFiles);
  const [selectedId, setSelectedId] = useState("2");

  const handleSelect = (item: FileItem) => {
    setSelectedId(item.id);
    if (item.type === "file") {
      onFileSelect?.(item);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Explorer
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {files.map((file) => (
          <FileTreeItem
            key={file.id}
            item={file}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
