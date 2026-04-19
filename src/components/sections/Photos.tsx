"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Photo } from "@/types";
import { CameraIcon } from "@/components/ui/Icons";

const defaultPhotos: Photo[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800", caption: "Coding Setup", category: "work", created_at: "" },
  { id: "2", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800", caption: "Development", category: "work", created_at: "" },
  { id: "3", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800", caption: "Workspace", category: "work", created_at: "" },
  { id: "4", url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800", caption: "Programming", category: "work", created_at: "" },
];

interface PhotosProps {
  photos?: Photo[];
}

export default function Photos({ photos = [] }: PhotosProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const displayPhotos = useMemo(() => photos.length > 0 ? photos : defaultPhotos, [photos]);

  const filteredPhotos = filter === "all" 
    ? displayPhotos 
    : displayPhotos.filter(p => p.category === filter);

  const categories = ["all", ...new Set(displayPhotos.map(p => p.category).filter(Boolean))];

  return (
    <section id="photos" className="py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <CameraIcon className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Photos</h2>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  filter === cat
                    ? "bg-primary text-background"
                    : "bg-surface text-text-secondary hover:text-foreground"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <Image
                  src={photo.url}
                  alt={photo.caption || "Photo"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium">{photo.caption}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-primary"
            >
              Close
            </button>
            <Image
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || "Photo"}
              width={800}
              height={600}
              className="max-h-[80vh] rounded-lg"
              unoptimized
            />
            {selectedPhoto.caption && (
              <p className="mt-4 text-center text-white">{selectedPhoto.caption}</p>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}