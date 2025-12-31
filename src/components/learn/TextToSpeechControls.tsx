import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Settings2,
  ChevronDown,
  Mic2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface TextToSpeechControlsProps {
  text: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  className?: string;
}

export function TextToSpeechControls({
  text,
  enabled,
  onEnabledChange,
  className,
}: TextToSpeechControlsProps) {
  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
    isSpeaking,
    isPaused,
    isSupported,
    currentPosition,
    totalLength,
    speak,
    pause,
    resume,
    stop,
    getVoicesByAccent,
  } = useTextToSpeech();

  const [showSettings, setShowSettings] = useState(false);

  if (!isSupported) {
    return (
      <div className={cn("p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground", className)}>
        Text-to-Speech is not supported in this browser.
      </div>
    );
  }

  const voicesByAccent = getVoicesByAccent();
  const progress = totalLength > 0 ? (currentPosition / totalLength) * 100 : 0;

  const handlePlayPause = () => {
    if (isSpeaking) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(text);
    }
  };

  const handleStop = () => {
    stop();
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Mic2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Read Aloud</p>
            <p className="text-xs text-muted-foreground">Listen to lesson content</p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onEnabledChange} />
      </div>

      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {/* Playback Controls */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
              <Button
                variant={isSpeaking && !isPaused ? "default" : "outline"}
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={handlePlayPause}
              >
                {isSpeaking && !isPaused ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={handleStop}
                disabled={!isSpeaking}
              >
                <Square className="h-4 w-4" />
              </Button>

              {/* Progress Bar */}
              <div className="flex-1 mx-2">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Volume */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    {volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-3">
                  <Slider
                    value={[volume * 100]}
                    onValueChange={([v]) => setVolume(v / 100)}
                    max={100}
                    step={1}
                  />
                </PopoverContent>
              </Popover>

              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Voice Selection */}
            <div className="p-3 rounded-lg bg-card border border-border space-y-3">
              <Label className="text-sm font-medium">Voice</Label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {Object.entries(voicesByAccent).map(([accent, accentVoices]) => (
                    <SelectGroup key={accent}>
                      <SelectLabel className="flex items-center gap-2">
                        {accent}
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {accentVoices.length}
                        </Badge>
                      </SelectLabel>
                      {accentVoices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex items-center gap-2">
                            <span>{voice.name}</span>
                            {voice.lang && (
                              <span className="text-xs text-muted-foreground">
                                ({voice.lang})
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Settings */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 rounded-lg bg-card border border-border space-y-4 overflow-hidden"
                >
                  {/* Speed */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Speed</Label>
                      <span className="text-xs text-muted-foreground">{rate.toFixed(1)}x</span>
                    </div>
                    <Slider
                      value={[rate * 100]}
                      onValueChange={([v]) => setRate(v / 100)}
                      min={50}
                      max={200}
                      step={10}
                    />
                  </div>

                  {/* Pitch */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Pitch</Label>
                      <span className="text-xs text-muted-foreground">{pitch.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[pitch * 100]}
                      onValueChange={([v]) => setPitch(v / 100)}
                      min={50}
                      max={200}
                      step={10}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
