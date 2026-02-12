import { useState, useEffect, useRef } from 'react';

// Simple hook to manage HTML5 Audio to avoid external dependency issues if use-sound has problems
export function useBackgroundAudio(url: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.3; // Gentle background volume
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [url]);

  const toggle = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const play = () => {
    if (!audioRef.current) return;
    audioRef.current.play().catch(e => console.log("Audio auto-play blocked:", e));
    setIsPlaying(true);
  };

  // Modern browsers block autoplay until interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        // Uncomment to auto-play on first click anywhere
        // play(); 
      }
    };

    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, [hasInteracted]);

  return { isPlaying, toggle, play };
}
