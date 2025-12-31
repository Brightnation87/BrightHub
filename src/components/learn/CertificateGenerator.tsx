import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Download, Share2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CertificateGeneratorProps {
  courseName: string;
  courseId: string;
  earnedAt: string;
  onClose?: () => void;
}

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  country: string | null;
}

export function CertificateGenerator({ courseName, courseId, earnedAt, onClose }: CertificateGeneratorProps) {
  const { user } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [certificateNumber, setCertificateNumber] = useState<string>("");

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrCreateCertificate();
    }
  }, [user, courseId]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, display_name, country')
      .eq('id', user.id)
      .single();
    
    if (!error && data) {
      setProfile(data);
    }
  };

  const fetchOrCreateCertificate = async () => {
    if (!user) return;
    
    // First, try to fetch existing certificate
    const { data: existing } = await supabase
      .from('certificates')
      .select('certificate_number')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();
    
    if (existing) {
      setCertificateNumber(existing.certificate_number);
      return;
    }
    
    // Create new certificate
    const newCertNumber = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const { data: created, error } = await supabase
      .from('certificates')
      .insert({
        user_id: user.id,
        course_id: courseId,
        course_name: courseName,
        certificate_number: newCertNumber,
      })
      .select('certificate_number')
      .single();
    
    if (!error && created) {
      setCertificateNumber(created.certificate_number);
    }
  };

  const recipientName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.display_name || user?.email?.split('@')[0] || 'Learner';

  const formattedDate = new Date(earnedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    
    try {
      // Use html2canvas-like approach with canvas API
      const element = certificateRef.current;
      const canvas = document.createElement('canvas');
      const scale = 2; // Higher resolution
      canvas.width = element.offsetWidth * scale;
      canvas.height = element.offsetHeight * scale;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Draw certificate background
      ctx.scale(scale, scale);
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, element.offsetWidth, element.offsetHeight);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, element.offsetWidth, element.offsetHeight);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
      ctx.fillStyle = gradient;
      ctx.fillRect(20, 20, element.offsetWidth - 40, element.offsetHeight - 40);
      
      // Draw border
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, element.offsetWidth - 60, element.offsetHeight - 60);
      
      // Draw decorative corners
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 4;
      const cornerSize = 50;
      // Top left
      ctx.beginPath();
      ctx.moveTo(35, 35 + cornerSize);
      ctx.lineTo(35, 35);
      ctx.lineTo(35 + cornerSize, 35);
      ctx.stroke();
      // Top right
      ctx.beginPath();
      ctx.moveTo(element.offsetWidth - 35 - cornerSize, 35);
      ctx.lineTo(element.offsetWidth - 35, 35);
      ctx.lineTo(element.offsetWidth - 35, 35 + cornerSize);
      ctx.stroke();
      // Bottom left
      ctx.beginPath();
      ctx.moveTo(35, element.offsetHeight - 35 - cornerSize);
      ctx.lineTo(35, element.offsetHeight - 35);
      ctx.lineTo(35 + cornerSize, element.offsetHeight - 35);
      ctx.stroke();
      // Bottom right
      ctx.beginPath();
      ctx.moveTo(element.offsetWidth - 35 - cornerSize, element.offsetHeight - 35);
      ctx.lineTo(element.offsetWidth - 35, element.offsetHeight - 35);
      ctx.lineTo(element.offsetWidth - 35, element.offsetHeight - 35 - cornerSize);
      ctx.stroke();
      
      // Draw text
      ctx.textAlign = 'center';
      
      // Company name
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 24px Georgia';
      ctx.fillText('BRIGHT NATION', element.offsetWidth / 2, 80);
      
      // Certificate title
      ctx.fillStyle = '#00d4ff';
      ctx.font = '16px Georgia';
      ctx.fillText('CERTIFICATE OF COMPLETION', element.offsetWidth / 2, 120);
      
      // This certifies
      ctx.fillStyle = '#888';
      ctx.font = '14px Arial';
      ctx.fillText('This is to certify that', element.offsetWidth / 2, 160);
      
      // Recipient name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Georgia';
      ctx.fillText(recipientName, element.offsetWidth / 2, 200);
      
      // Has completed
      ctx.fillStyle = '#888';
      ctx.font = '14px Arial';
      ctx.fillText('has successfully completed the course', element.offsetWidth / 2, 240);
      
      // Course name
      ctx.fillStyle = '#00d4ff';
      ctx.font = 'bold 24px Georgia';
      ctx.fillText(courseName, element.offsetWidth / 2, 280);
      
      // Date
      ctx.fillStyle = '#888';
      ctx.font = '14px Arial';
      ctx.fillText(`Issued on ${formattedDate}`, element.offsetWidth / 2, 330);
      
      // Certificate number
      ctx.font = '12px monospace';
      ctx.fillText(`Certificate ID: ${certificateNumber}`, element.offsetWidth / 2, 360);
      
      // Founder signature
      ctx.fillStyle = '#ffd700';
      ctx.font = 'italic 16px Georgia';
      ctx.fillText('Olayode Clement Olayinka', element.offsetWidth / 2, 420);
      ctx.fillStyle = '#888';
      ctx.font = '12px Arial';
      ctx.fillText('Founder, BRIGHT NATION', element.offsetWidth / 2, 440);
      
      // Draw award icon (simplified circle)
      ctx.beginPath();
      ctx.arc(element.offsetWidth / 2, 480, 25, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700';
      ctx.fill();
      ctx.fillStyle = '#1a1a2e';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('✓', element.offsetWidth / 2, 488);
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${courseName.replace(/\s+/g, '_')}_Certificate.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success("Certificate downloaded successfully!");
        }
      }, 'image/png');
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download certificate. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareText = `🎉 I just earned my ${courseName} certificate from BRIGHT NATION's BrightHub! #BrightNation #Learning #Achievement`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${courseName} Certificate`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Share text copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Certificate Preview */}
      <div
        ref={certificateRef}
        className="relative overflow-hidden rounded-xl border-2 border-primary/50 p-8 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]"
        style={{ aspectRatio: '1.4/1' }}
      >
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />

        {/* Inner border */}
        <div className="absolute inset-6 border-2 border-primary/30 rounded-lg" />

        <div className="relative text-center flex flex-col items-center justify-center h-full">
          {/* Company Name */}
          <h1 className="text-2xl md:text-3xl font-bold text-amber-400 tracking-widest mb-2">
            BRIGHT NATION
          </h1>
          
          {/* Certificate Title */}
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-primary mb-6">
            Certificate of Completion
          </p>

          {/* This certifies */}
          <p className="text-xs text-muted-foreground mb-2">This is to certify that</p>
          
          {/* Recipient Name */}
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2 font-serif">
            {recipientName}
          </h2>

          {/* Has completed */}
          <p className="text-xs text-muted-foreground mb-2">has successfully completed the course</p>
          
          {/* Course Name */}
          <h3 className="text-xl md:text-2xl font-bold text-primary mb-6">
            {courseName}
          </h3>

          {/* Date & Certificate Number */}
          <p className="text-xs text-muted-foreground mb-1">Issued on {formattedDate}</p>
          <p className="text-xs text-muted-foreground/70 font-mono mb-6">
            Certificate ID: {certificateNumber || 'Generating...'}
          </p>

          {/* Signature */}
          <div className="flex flex-col items-center">
            <p className="text-lg font-serif italic text-amber-400">Olayode Clement Olayinka</p>
            <p className="text-xs text-muted-foreground">Founder, BRIGHT NATION</p>
          </div>

          {/* Seal */}
          <div className="absolute bottom-8 right-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {isDownloading ? "Generating..." : "Download Certificate"}
        </Button>
        <Button
          variant="outline"
          onClick={handleShare}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </motion.div>
  );
}

export default CertificateGenerator;