import { useState, useEffect, useCallback, useRef } from "react";

export interface VoiceOption {
  id: string;
  name: string;
  lang: string;
  accent: string;
  native: SpeechSynthesisVoice | null;
}

// Predefined voice preferences for different accents
const voicePreferences: Record<string, string[]> = {
  "US English": ["en-US", "en_US"],
  "UK English": ["en-GB", "en_GB"],
  "Nigerian English": ["en-NG", "en-ng"],
  "Indian English": ["en-IN", "en_IN"],
  "Australian English": ["en-AU", "en_AU"],
  "Spanish": ["es-ES", "es-MX", "es"],
  "French": ["fr-FR", "fr"],
  "German": ["de-DE", "de"],
  "Portuguese": ["pt-BR", "pt-PT", "pt"],
  "Chinese": ["zh-CN", "zh-TW", "zh"],
  "Japanese": ["ja-JP", "ja"],
  "Korean": ["ko-KR", "ko"],
  "Arabic": ["ar-SA", "ar"],
  "Hindi": ["hi-IN", "hi"],
  "Yoruba": ["yo-NG", "yo"],
};

export function useTextToSpeech() {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("default");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef<string>("");

  // Load available voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      
      const voiceOptions: VoiceOption[] = availableVoices.map((voice) => {
        // Determine accent category
        let accent = "Other";
        for (const [accentName, langs] of Object.entries(voicePreferences)) {
          if (langs.some((lang) => voice.lang.startsWith(lang.split("-")[0]) || voice.lang === lang)) {
            accent = accentName;
            break;
          }
        }

        return {
          id: voice.voiceURI,
          name: voice.name,
          lang: voice.lang,
          accent,
          native: voice,
        };
      });

      // Sort by accent and name
      voiceOptions.sort((a, b) => {
        if (a.accent === b.accent) return a.name.localeCompare(b.name);
        return a.accent.localeCompare(b.accent);
      });

      // Add default option at the beginning
      setVoices([
        { id: "default", name: "System Default", lang: "", accent: "Default", native: null },
        ...voiceOptions,
      ]);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Get voices grouped by accent
  const getVoicesByAccent = useCallback(() => {
    const grouped: Record<string, VoiceOption[]> = {};
    voices.forEach((voice) => {
      if (!grouped[voice.accent]) {
        grouped[voice.accent] = [];
      }
      grouped[voice.accent].push(voice);
    });
    return grouped;
  }, [voices]);

  // Speak text
  const speak = useCallback(
    (text: string, startFromPosition = 0) => {
      if (!isSupported || !text) return;

      // Cancel any existing speech
      window.speechSynthesis.cancel();

      textRef.current = text;
      setTotalLength(text.length);

      // If starting from a position, slice the text
      const textToSpeak = startFromPosition > 0 ? text.slice(startFromPosition) : text;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance;

      // Set voice
      if (selectedVoice !== "default") {
        const voice = voices.find((v) => v.id === selectedVoice);
        if (voice?.native) {
          utterance.voice = voice.native;
        }
      }

      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentPosition(0);
      };

      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onboundary = (e) => {
        if (e.name === "word") {
          setCurrentPosition(startFromPosition + e.charIndex);
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, selectedVoice, voices, rate, pitch, volume]
  );

  // Pause speech
  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported]);

  // Resume speech
  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported]);

  // Stop speech
  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentPosition(0);
  }, [isSupported]);

  // Toggle play/pause
  const toggle = useCallback(() => {
    if (isSpeaking) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    }
  }, [isSpeaking, isPaused, pause, resume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
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
    toggle,
    getVoicesByAccent,
  };
}
