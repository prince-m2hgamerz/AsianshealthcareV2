"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
import Image from "next/image";

const videos = [
  {
    id: "N2qUIJLwS0A",
    title: "Patient from South Sudan - Paediatric Gastroenterology Treatment",
    thumbnail: "https://img.youtube.com/vi/N2qUIJLwS0A/hqdefault.jpg",
    patient: "Guest from South Sudan",
    treatment: "Paediatric Gastroenterology",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Successful Heart Surgery - Patient Testimonial",
    thumbnail: "https://img.youtube.com/vi/N2qUIJLwS0A/hqdefault.jpg",
    patient: "Patient from Nigeria",
    treatment: "Cardiac Surgery",
  },
  {
    id: "jNQXAC9IVRw",
    title: "Knee Replacement Success Story",
    thumbnail: "https://img.youtube.com/vi/N2qUIJLwS0A/hqdefault.jpg",
    patient: "Patient from Kenya",
    treatment: "Knee Replacement",
  },
];

export default function VideoTestimonials() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="bg-surface py-12 sm:py-huge">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="pill-tag mb-4 inline-block">Happy Patients</span>
          <h2 className="font-display text-display-md lg:text-display-lg text mt-4">
            Watch Our Patient Stories
          </h2>
          <p className="text-body-lg text-shade-50 max-w-2xl mx-auto mt-4">
            Real patients sharing their medical tourism experience in India
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group cursor-pointer"
              onClick={() => setActiveVideo(video.id)}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden border border-hairline-light shadow-sm group-hover:shadow-elevation-3 transition-all duration-300">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play size={28} className="text ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-display text-heading-sm text group-hover:text-shade-60 transition-colors">
                  {video.patient}
                </h3>
                <p className="text-caption text-shade-50 mt-1">{video.treatment}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-4xl aspect-video max-h-[80vh]"
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-accent transition-colors"
              aria-label="Close video"
            >
              <X size={32} />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
              title="Patient Testimonial Video"
              className="w-full h-full rounded-xl"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </motion.div>
        </div>
      )}
    </section>
  );
}
