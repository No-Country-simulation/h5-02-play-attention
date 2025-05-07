"use client";

import { useState } from "react";
import { FileText, ImageIcon, Play, PlayCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import PlayTutorialButton from "@/shared/ui/hero-video-dialog";
import { ProgressBar } from "./ProgressBar";

export function ContentCard({ item, updateVideoProgress }) {
  const [isHovered, setIsHovered] = useState(false);

  const getTypeColor = (type) => {
    switch (type) {
      case "image":
        return "bg-blue-700";
      case "pdf":
        return "bg-red-700";
      case "video":
        return "bg-primary";
      default:
        return "bg-purple-700";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-12 w-12 text-white opacity-80" />;
      case "pdf":
        return <FileText className="h-12 w-12 text-white opacity-80" />;
      case "video":
        return <PlayCircle className="h-12 w-12 text-white opacity-80" />;
      default:
        return <ImageIcon className="h-12 w-12 text-white opacity-80" />;
    }
  };

  const getActionButton = (type, url) => {
    switch (type) {
      case "image":
        return (
          <Button
            className="bg-purple-800 hover:bg-purple-900 text-white"
            onClick={() => window.open(url, "_blank")}
          >
            <ImageIcon className="mr-2 h-4 w-4" /> Ver imagen
          </Button>
        );
      case "pdf":
        return (
          <Button
            className="bg-purple-800 hover:bg-purple-900 text-white"
            onClick={() => window.open(url, "_blank")}
          >
            <FileText className="mr-2 h-4 w-4" /> Ver PDF
          </Button>
        );
      case "video":
        return (
          <PlayTutorialButton
            videoSrc={url}
            buttonProps={{
              className: "bg-purple-800 hover:bg-purple-900 text-white",
              icon: <Play className="mr-2 h-4 w-4" />,
              text: "Reproducir",
            }}
            progress={item.progress}
            onProgressUpdate={(newProgress) =>
              updateVideoProgress(item.id, newProgress)
            }
          />
        );
      default:
        return (
          <Button
            className="bg-purple-800 hover:bg-purple-900 text-white"
            onClick={() => window.open(url, "_blank")}
          >
            Ver contenido
          </Button>
        );
    }
  };

  return (
    <Card
      className="overflow-hidden border border-primary/50 rounded-lg shadow-md w-full max-w-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Badge
          className={`absolute top-4 left-4 z-5 ${getTypeColor(
            item.type
          )} text-white border-none`}
        >
          {item.type === "image"
            ? "Imagen"
            : item.type === "pdf"
            ? "PDF"
            : "Video"}
        </Badge>

        <div
          className={`h-48 flex items-center justify-center ${
            item.type === "image"
              ? "bg-gradient-to-b from-secondary to-primary"
              : item.type === "pdf"
              ? "bg-gradient-to-b from-secondary to-primary"
              : "bg-gradient-to-b from-secondary to-primary"
          }`}
        >
          {item.type === "image" && !isHovered ? (
            <img
              src={item.url || "/placeholder.svg"}
              alt={item.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=200&width=400";
                e.currentTarget.className = "h-32 w-32 object-contain";
              }}
            />
          ) : (
            <div className="rounded-full bg-secondary bg-opacity-50 p-2">
              {getTypeIcon(item.type)}
            </div>
          )}
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <h3 className="text-xl font-bold">{item.title}</h3>
        <p className="text-gray-500 text-sm">{item.description}</p>
      </CardHeader>

      <CardContent className="p-4 pt-0 pb-2">
        <p className="text-gray-400">{item.date}</p>
        <div className="flex flex-wrap gap-2 my-3">
          {/* <Badge variant="outline" className="rounded-full z-5">
            {item.difficulty}
          </Badge>
          {item.author !== "Anónimo" && (
            <Badge variant="outline" className="rounded-full z-10">
              {item.author}
            </Badge>
          )} */}
        </div>       
      </CardContent>

      <CardFooter className="p-4 pt-2">
        {getActionButton(item.type, item.url)}
      </CardFooter>
    </Card>
  );
} 