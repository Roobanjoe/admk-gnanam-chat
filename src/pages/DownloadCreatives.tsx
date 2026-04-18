import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

import { Navigation } from "@/components/navigation";
import ParticleBackground from "@/components/ParticleBackground";
import { type Language } from "@/components/language-toggle";
import { creativeFolders } from "@/data/creatives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
} from "@/components/ui/glass-card";

const preferredFolderOrder = [
  "aiadmk ads",
  "aiadmk manifesto",
  "all for errattai ilai",
  "books",
  "campaign",
  "candidate lists",
  "edapadiyaar branding",
  "eps creatives",
  "errattai ilai alanum",
  "fanmade reel",
  "infographics",
  "josiyam pakkalamaa",
  "josiyar",
  "makkalukaaga eps",
  "manifesto testimonials",
  "reel",
  "songs",
  "tholpaavai",
  "videos fan made",
];

const normalizeFolderName = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export default function DownloadCreatives() {
  const [language, setLanguage] = useState<Language>("en");

  const openFolder = (driveFolderLink: string) => {
    window.open(driveFolderLink, "_blank", "noopener,noreferrer");
  };

  const sortedFolders = [...creativeFolders].sort((leftFolder, rightFolder) => {
    const leftName = normalizeFolderName(leftFolder.name);
    const rightName = normalizeFolderName(rightFolder.name);
    const leftIndex = preferredFolderOrder.findIndex((name) => leftName.includes(name));
    const rightIndex = preferredFolderOrder.findIndex((name) => rightName.includes(name));

    if (leftIndex === -1 && rightIndex === -1) {
      return leftFolder.name.localeCompare(rightFolder.name);
    }

    if (leftIndex === -1) {
      return 1;
    }

    if (rightIndex === -1) {
      return -1;
    }

    if (leftIndex !== rightIndex) {
      return leftIndex - rightIndex;
    }

    return leftFolder.name.localeCompare(rightFolder.name);
  });

  return (
    <div className="relative min-h-screen w-full">
      <ParticleBackground />
      <Navigation language={language} onLanguageChange={setLanguage} />

      <div className="relative z-10 container mx-auto px-4 pb-24 pt-8 lg:px-8">
        <GlassCard variant="neon" padding="lg" className="mb-10 mt-4 shadow-neon/40">
          <GlassCardHeader>
            <Badge
              variant="secondary"
              className="mb-2 bg-gradient-to-r from-neon to-cyan-400 text-white shadow-neon/30"
            >
              AI Powered Resource Hub
            </Badge>
            <GlassCardTitle className="mb-2 text-3xl font-extrabold tracking-tight text-neon drop-shadow-neon md:text-4xl lg:text-5xl">
              Download Creatives
            </GlassCardTitle>
            <GlassCardDescription className="text-lg text-muted-foreground/80 md:text-xl">
              Access official campaign creatives, posters, and media assets
            </GlassCardDescription>
          </GlassCardHeader>
        </GlassCard>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neon">Folders</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <AnimatePresence>
            {sortedFolders.map((folder, index) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.07, duration: 0.4, type: "spring" }}
              >
                <GlassCard
                  variant="neon"
                  padding="lg"
                  role="button"
                  tabIndex={0}
                  className="group h-full cursor-pointer border-2 border-transparent transition-all duration-300 hover:scale-[1.03] hover:border-neon/80 hover:shadow-neon/60"
                  onClick={() => openFolder(folder.driveFolderLink)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openFolder(folder.driveFolderLink);
                    }
                  }}
                >
                  <div className="mb-3 flex items-center gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-xl border border-neon/30 bg-black/30 shadow-[0_0_20px_rgba(34,211,238,0.18)]">
                      <img
                        src={folder.thumbnailSrc}
                        alt={folder.thumbnailAlt}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0">
                      <div
                        className="mb-1 truncate text-lg font-bold text-neon drop-shadow-neon"
                        title={folder.name}
                      >
                        {folder.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{folder.description}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-neon/40 text-neon hover:bg-neon/10 hover:text-neon"
                      onClick={(event) => {
                        event.stopPropagation();
                        openFolder(folder.driveFolderLink);
                      }}
                    >
                      <ExternalLink className="mr-1 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
