/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Pause, Volume2, Volume1, VolumeX, X, Subtitles } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactPlayer from "react-player";
import { Button } from "@/shared/ui/button";
import { Slider } from "@/shared/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

const animationVariants = {
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
};

export default function PlayTutorialButton({
  videoSrc,
  className,
  buttonProps = {
    className: "bg-purple-800 hover:bg-purple-900 text-white",
    icon: <Play className="mr-2 h-4 w-4" />,
    text: "Reproducir",
  },
  progress: initialProgress = 0,
  onProgressUpdate,
  config = {
    youtube: {
      playerVars: {
        autoplay: 1, // Cambiado a 1 para autoplay
        cc_load_policy: 1,
        cc_lang_pref: "es",
        subtitlesLang: "es",
        hl: "es",
        modestbranding: 1,
        rel: 0,
      },
    },
    file: {
      attributes: {
        controlsList: "nodownload",
        crossOrigin: "anonymous",           
      },
    },
  },
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(initialProgress);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [hasSeeked, setHasSeeked] = useState(false);
  const [isReady, setIsReady] = useState(false); // Nuevo estado para controlar cuando el player está listo
  const playerRef = useRef(null);

  useEffect(() => {
    if (isDialogOpen && playerRef.current && duration > 0 && !hasSeeked) {
      const seekTo = (initialProgress / 100) * duration;
      playerRef.current.seekTo(seekTo);
      setCurrentTime(seekTo);
      setHasSeeked(true);
    }
  }, [isDialogOpen, duration, initialProgress, hasSeeked]);

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    return seconds >= 3600
      ? date.toISOString().substr(11, 8)
      : date.toISOString().substr(14, 5);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (state) => {
    const newProgress = state.played * 100;
    setProgress(newProgress);
    setCurrentTime(state.playedSeconds);
  };

  const handleVolumeChange = (value) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleSeek = (value) => {
    const seekTo = (value[0] / 100) * duration;
    playerRef.current?.seekTo(seekTo);
    setCurrentTime(seekTo);
  };

  const handleClose = () => {
    const calculatedProgress = duration > 0 ? (currentTime / duration) * 100 : 0;
    setProgress(calculatedProgress);
    
    if (onProgressUpdate) {
      onProgressUpdate(calculatedProgress);
    }
    
    setHasSeeked(false);
    setIsDialogOpen(false);
    setIsPlaying(false);
    setIsReady(false); // Resetear el estado de listo al cerrar
  };

  const handleReady = () => {
    setIsReady(true);
    setIsPlaying(true); // Auto-play cuando está listo
  };

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className={className}>
      <Button 
        className={buttonProps.className} 
        onClick={() => setIsDialogOpen(true)}
      >
        {buttonProps.icon}
        {buttonProps.text}
      </Button>

      <AnimatePresence>
        {isDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleClose}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div
              {...animationVariants["from-center"]}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative mx-4 w-full max-w-4xl md:mx-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-12 right-0 rounded-full bg-neutral-900/50 p-2 text-white backdrop-blur-md hover:bg-neutral-800/50 dark:bg-neutral-100/50 dark:text-black dark:hover:bg-neutral-200/50"
                onClick={handleClose}
              >
                <X className="size-5" />
              </Button>

              <div className="flex flex-col">
                <div className="relative aspect-video overflow-hidden rounded-t-2xl border-2 border-b-0 border-white bg-black">
                  <ReactPlayer
                    ref={playerRef}
                    url={videoSrc}
                    width="100%"
                    height="100%"
                    playing={isPlaying && isReady} // Solo reproducir si está listo
                    controls={false}
                    config={config}
                    progressInterval={1000}
                    onProgress={handleProgress}
                    onDuration={setDuration}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => {
                      setProgress(100);
                      if (onProgressUpdate) onProgressUpdate(100);
                      setIsPlaying(false);
                    }}
                    onReady={handleReady} // Nuevo manejador para cuando el player está listo
                    volume={volume}
                    muted={muted}
                    playbackRate={playbackRate}
                    loop={false}
                  />
                </div>

                {/* Resto del código permanece igual */}
                <div className="rounded-b-2xl border-2 border-t-0 border-white bg-neutral-900 p-4">
                  <div className="mb-4 px-2">
                    <Slider
                      value={[progress]}
                      onValueChange={handleSeek}
                      max={100}
                      step={0.1}
                      className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-10 text-white hover:bg-white/10"
                        onClick={handlePlayPause}
                      >
                        {isPlaying ? (
                          <Pause className="size-5 fill-current" />
                        ) : (
                          <Play className="size-5 fill-current" />
                        )}
                      </Button>

                      <div className="hidden items-center space-x-3 sm:flex">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-10 text-white hover:bg-white/10"
                          onClick={() => setMuted(!muted)}
                        >
                          {muted ? (
                            <VolumeX className="size-5" />
                          ) : volume > 0.5 ? (
                            <Volume2 className="size-5" />
                          ) : (
                            <Volume1 className="size-5" />
                          )}
                        </Button>
                        <Slider
                          value={[muted ? 0 : volume * 100]}
                          onValueChange={handleVolumeChange}
                          max={100}
                          step={1}
                          className="w-24 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3"
                        />
                      </div>

                      <span className="text-sm text-white">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-10 text-sm text-white hover:bg-white/10"
                          >
                            {playbackRate}x
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {playbackRates.map((rate) => (
                            <DropdownMenuItem
                              key={rate}
                              className="text-sm"
                              onClick={() => setPlaybackRate(rate)}
                            >
                              {rate}x
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}