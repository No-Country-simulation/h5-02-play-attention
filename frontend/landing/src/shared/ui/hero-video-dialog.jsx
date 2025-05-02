/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  X,
  Subtitles,
} from "lucide-react";
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
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
};

const CustomSubtitles = ({ subtitles, currentTime }) => {
  if (!subtitles || subtitles.length === 0) return null;

  const currentSubtitle = subtitles.find(
    (sub) => currentTime >= sub.start && currentTime <= sub.end
  );

  if (!currentSubtitle) return null;

  return (
    <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
      <div className="mx-auto max-w-3xl rounded bg-black/70 px-4 py-2 text-white text-lg font-medium">
        {currentSubtitle.text}
      </div>
    </div>
  );
};

const parseVTT = (vttContent) => {
  const lines = vttContent.split("\n");
  const subtitles = [];
  let currentSub = null;

  for (const line of lines) {
    if (line.includes("-->")) {
      if (currentSub) subtitles.push(currentSub);
      const [start, end] = line.split(" --> ").map((time) => {
        const parts = time.split(":");
        if (parts.length === 3) {
          const [h, m, s] = parts;
          return parseFloat(h) * 3600 + parseFloat(m) * 60 + parseFloat(s);
        } else {
          const [m, s] = parts;
          return parseFloat(m) * 60 + parseFloat(s);
        }
      });
      currentSub = { start, end, text: "" };
    } else if (currentSub && line.trim() && !line.startsWith("WEBVTT")) {
      currentSub.text += (currentSub.text ? "\n" : "") + line.trim();
    }
  }

  if (currentSub) subtitles.push(currentSub);
  return subtitles;
};

export default function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
  customSubtitles = [],
  config = {
    youtube: {
      playerVars: {
        autoplay: 1,
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
      tracks: [],
    },
  },
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeSubtitle, setActiveSubtitle] = useState(
    Array.isArray(customSubtitles) && customSubtitles.length > 0
      ? customSubtitles.findIndex((sub) => sub.default) ?? null
      : null
  );
  const [parsedSubtitles, setParsedSubtitles] = useState([]);
  const playerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const controlsRef = useRef(null);

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
    setProgress(state.played * 100);
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

  const handleSubtitleChange = (index) => {
    setActiveSubtitle(index);
  };

  useEffect(() => {
    const loadSubtitles = async () => {
      if (activeSubtitle === null || !customSubtitles[activeSubtitle]) {
        setParsedSubtitles([]);
        return;
      }

      try {
        const response = await fetch(customSubtitles[activeSubtitle].src);
        const vttContent = await response.text();
        const parsed = parseVTT(vttContent);
        setParsedSubtitles(parsed);
      } catch (error) {
        console.error("Error loading subtitles:", error);
        setParsedSubtitles([]);
      }
    };

    loadSubtitles();
  }, [activeSubtitle, customSubtitles]);

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className={cn("relative", className)}>
      <div
        className="group relative cursor-pointer"
        onClick={() => {
          setIsDialogOpen(true);
          setIsPlaying(true);
        }}
      >
        <img
          src={thumbnailSrc}
          alt={thumbnailAlt}
          width={1920}
          height={1080}
          className="w-full rounded-md border shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]"
        />
        <div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
          <div className="flex size-28 items-center justify-center rounded-full bg-primary-100 backdrop-blur-md">
            <div className="relative flex size-20 scale-100 items-center justify-center rounded-full bg-gradient-to-b from-primary/30 to-primary shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]">
              <Play
                className="size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                style={{
                  filter:
                    "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => {
              setIsDialogOpen(false);
              setIsPlaying(false);
            }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div
              {...animationVariants[animationStyle]}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative mx-4 w-full max-w-4xl md:mx-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-12 right-0 rounded-full bg-neutral-900/50 p-2 text-white backdrop-blur-md hover:bg-neutral-800/50 dark:bg-neutral-100/50 dark:text-black dark:hover:bg-neutral-200/50"
                onClick={() => {
                  setIsDialogOpen(false);
                  setIsPlaying(false);
                }}
              >
                <X className="size-5" />
              </Button>

              <div className="flex flex-col">
                <div
                  ref={videoContainerRef}
                  className="relative isolate aspect-video overflow-hidden rounded-t-2xl border-2 border-b-0 border-white bg-black"
                >
                  <ReactPlayer
                    ref={playerRef}
                    url={videoSrc}
                    width="100%"
                    height="100%"
                    playing={isPlaying}
                    controls={false}
                    config={config}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onProgress={handleProgress}
                    onDuration={setDuration}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    volume={volume}
                    muted={muted}
                    playbackRate={playbackRate}
                    loop={false}
                  />

                  <CustomSubtitles
                    subtitles={parsedSubtitles}
                    currentTime={currentTime}
                  />
                </div>

                {/* Controles personalizados */}
                <div
                  ref={controlsRef}
                  className={
                    "rounded-b-2xl border-2 border-t-0 border-white bg-neutral-black-500 p-4"
                  }
                >
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

                      <div className="items-center space-x-3 hidden sm:flex">
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
                      {customSubtitles.length > 0 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-10 text-white hover:bg-white/10"
                            >
                              {activeSubtitle !== null ? (
                                <div className="flex flex-col items-center">
                                  <Subtitles className="size-5 text-primary-200" />
                                </div>
                              ) : (
                                <Subtitles className="size-5" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              className="text-sm"
                              onClick={() => handleSubtitleChange(null)}
                            >
                              Desactivar
                            </DropdownMenuItem>
                            {customSubtitles.map((sub, index) => (
                              <DropdownMenuItem
                                key={index}
                                className="text-sm"
                                onClick={() => handleSubtitleChange(index)}
                              >
                                {sub.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}

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
