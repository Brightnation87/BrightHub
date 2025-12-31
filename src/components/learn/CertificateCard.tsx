import { motion } from "framer-motion";
import { Award, Download, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Certificate {
  id: string;
  courseName: string;
  earnedAt: string;
  courseIcon: React.ReactNode;
  color: string;
}

interface CertificateCardProps {
  certificate: Certificate;
  index?: number;
}

export function CertificateCard({ certificate, index = 0 }: CertificateCardProps) {
  const handleDownload = () => {
    toast.success("Certificate download started!");
  };

  const handleShare = () => {
    navigator.share?.({
      title: `${certificate.courseName} Certificate`,
      text: `I earned the ${certificate.courseName} certificate on BNCode!`,
      url: window.location.href,
    }).catch(() => {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="relative group"
    >
      {/* Certificate Frame */}
      <div className={cn(
        "relative overflow-hidden rounded-xl border-2 border-dashed p-6",
        "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
        "border-amber-300 dark:border-amber-700"
      )}>
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-amber-400 dark:border-amber-600 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-amber-400 dark:border-amber-600 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-amber-400 dark:border-amber-600 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-amber-400 dark:border-amber-600 rounded-br-lg" />

        <div className="relative text-center py-4">
          {/* Award icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Award className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Certificate text */}
          <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2">
            Certificate of Completion
          </p>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {certificate.courseName}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Earned on {new Date(certificate.earnedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>

          {/* Decorative seal */}
          <div className="inline-block p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">✓</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Empty state for certificates
export function EmptyCertificates() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
        <Award className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        Complete courses to earn certificates that showcase your skills.
        Your first certificate awaits!
      </p>
    </motion.div>
  );
}
