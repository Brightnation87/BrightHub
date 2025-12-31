import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ExternalLink, Smartphone, Monitor, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PreviewProps {
  code: string;
}

type ViewportSize = "mobile" | "tablet" | "desktop";

const viewportSizes: Record<ViewportSize, { width: string; icon: React.ReactNode; label: string }> = {
  mobile: { width: "375px", icon: <Smartphone className="h-4 w-4" />, label: "Mobile" },
  tablet: { width: "768px", icon: <Tablet className="h-4 w-4" />, label: "Tablet" },
  desktop: { width: "100%", icon: <Monitor className="h-4 w-4" />, label: "Desktop" },
};

export function Preview({ code }: PreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [key, setKey] = useState(0);

  const refresh = () => setKey((k) => k + 1);

  // Create a blob URL for the HTML content
  const blobUrl = URL.createObjectURL(
    new Blob([code], { type: "text/html" })
  );

  useEffect(() => {
    return () => URL.revokeObjectURL(blobUrl);
  }, [blobUrl]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col bg-card border-l border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Preview</span>
          <div className="flex items-center rounded-md border border-border bg-background p-0.5">
            {(Object.entries(viewportSizes) as [ViewportSize, typeof viewportSizes[ViewportSize]][]).map(([size, config]) => (
              <Button
                key={size}
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 rounded-sm",
                  viewport === size && "bg-primary text-primary-foreground"
                )}
                onClick={() => setViewport(size)}
              >
                {config.icon}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={refresh}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => window.open(blobUrl, '_blank')}>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Preview content */}
      <div className="flex-1 bg-muted/30 overflow-auto flex items-start justify-center p-4">
        <div
          className={cn(
            "h-full bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300",
            viewport !== "desktop" && "border border-border"
          )}
          style={{ 
            width: viewportSizes[viewport].width,
            maxWidth: "100%"
          }}
        >
          <iframe
            key={key}
            src={blobUrl}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </motion.div>
  );
}
