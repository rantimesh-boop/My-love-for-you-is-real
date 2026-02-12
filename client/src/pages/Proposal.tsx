import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Volume2, VolumeX, Share2, Heart, Copy } from "lucide-react";
import { FloatingHearts } from "@/components/FloatingHearts";
import { GameChallenge } from "@/components/GameChallenge";
import { MemeCarousel } from "@/components/MemeCarousel";
import { useCreateResponse } from "@/hooks/use-responses";
import { useBackgroundAudio } from "@/hooks/use-audio";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// MP3 URL for background music (royalty free romantic loop)
const BGM_URL =
  "https://cdn.pixabay.com/download/audio/2022/10/25/audio_24419574d3.mp3?filename=romantic-piano-125442.mp3";

export default function Proposal() {
  const recipientName = "Oyiza!!!";
  const [stage, setStage] = useState<"start" | "proposal" | "success">("start");
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });

  const noBtnRef = useRef<HTMLButtonElement>(null);
  const { isPlaying, toggle, play: playMusic } = useBackgroundAudio(BGM_URL);
  const { toast } = useToast();

  // Initialize stage
  useEffect(() => {
    setStage("proposal");
  }, []);

  // Prank Logic: Move "No" button
  const moveNoButton = () => {
    const btn = noBtnRef.current;
    if (!btn) return;

    const offsetX = (Math.random() - 0.5) * 500;
    const offsetY = (Math.random() - 0.5) * 500;

    setNoBtnPosition({ x: offsetX, y: offsetY });
  };

  const handleYes = async () => {
    // 1. Audio Effect
    playMusic();

    // 2. Confetti Explosion
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: [
          "#ff0000",
          "#ffa500",
          "#ffff00",
          "#008000",
          "#0000ff",
          "#4b0082",
          "#ee82ee",
        ],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // 3. Send Email Notification
    try {
      await fetch("/api/notify-acceptance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: recipientName }),
      });
    } catch (error) {
      console.error("Failed to send notification", error);
    }

    // 4. Change View
    setStage("success");
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center p-4">
      <FloatingHearts />

      {/* Audio Toggle */}
      <button
        onClick={toggle}
        className="fixed top-4 right-4 z-40 p-3 bg-white/50 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/80 transition-all"
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6 text-primary" />
        ) : (
          <VolumeX className="w-6 h-6 text-gray-500" />
        )}
      </button>

      {/* STAGE: PROPOSAL */}
      {stage === "proposal" && (
        <div className="z-10 text-center max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            {/* Header Image */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="inline-block mb-8"
            >
              <img
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWlxNHFpbXJ3NnZjZ3lobDA0Y2k5eWJ6aGpmaWt2dXMzc240MjBxYSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/901mxGLGQN2PyCQpoc/giphy.gif"
                alt="Cute Heart"
                className="w-48 h-48 object-contain mx-auto drop-shadow-xl"
              />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary mb-6 leading-tight drop-shadow-sm px-4">
              {recipientName} <br />
              Will you be my valentinie 🌹
            </h1>

            <p className="text-lg md:text-xl text-gray-600 font-medium max-w-md mx-auto">
              I promise to buy you cake and tie a ribbon on my you know what 🙃
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative min-h-[150px]">
            {/* YES Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 10px 15px -3px rgba(34, 197, 94, 0.3)",
                  "0 20px 25px -5px rgba(34, 197, 94, 0.5)",
                  "0 10px 15px -3px rgba(34, 197, 94, 0.3)",
                ],
              }}
              transition={{
                scale: { repeat: Infinity, duration: 1.5 },
                boxShadow: { repeat: Infinity, duration: 1.5 },
              }}
              onClick={handleYes}
              className="px-12 py-5 bg-green-500 hover:bg-green-600 text-white rounded-full text-2xl md:text-3xl font-bold shadow-green-500/30 shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-colors z-20"
            >
              YES 😍
            </motion.button>

            {/* NO Button (Wrapper for movement) */}
            <motion.div
              animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative z-10"
              onHoverStart={moveNoButton}
              onTouchStart={moveNoButton}
            >
              <button
                ref={noBtnRef}
                className="px-12 py-5 bg-red-400 text-white rounded-full text-2xl md:text-3xl font-bold shadow-lg opacity-80 cursor-not-allowed border-b-4 border-red-600"
                onClick={moveNoButton}
              >
                NO 😢
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {/* STAGE: SUCCESS */}
      {stage === "success" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-10 w-full max-w-2xl bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-4 border-white text-center"
        >
          <div className="mb-6">
            <img
              src="https://media.giphy.com/media/wLK6lCNLfMGDxBgCzh/giphy.gif"
              alt="Hugging"
              className="w-48 h-48 mx-auto object-contain"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
            Yay! I knew it! ❤️
          </h1>

          <p className="text-xl text-gray-700 mb-8 font-medium">
            You've made me the happiest person ever! Get ready for the best
            Valentine's Day! 🥂
          </p>

          <div className="w-full bg-white/50 rounded-2xl p-4 mb-8">
            <img
              src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NTFmbGh3ZzMweGtpcTNpeG9jZGc2aGxlZ3Z1cjZ3cXlxbGo3b2FheSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26hisuYcIdZsnVnIk/giphy.gif"
              alt="Celebration"
              className="w-full rounded-xl"
            />
          </div>
        </motion.div>
      )}

      {/* Footer Credits */}
      <div className="fixed bottom-2 left-0 right-0 text-center z-0 pointer-events-none opacity-40">
        <p className="text-xs font-mono text-gray-500">
          Made with ❤️ for {recipientName}
        </p>
      </div>
    </div>
  );
}
