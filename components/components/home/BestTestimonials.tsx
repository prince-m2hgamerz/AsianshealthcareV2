"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Play, X, ArrowRight } from "lucide-react";

interface Testimonial {
  name: string;
  country: string;
  treatment: string;
  text: string;
  rating: number;
  image_url?: string;
  videoId?: string;
  video_url?: string;
}

export default function BestTestimonials({ testimonials = [] }: { testimonials?: Testimonial[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const markFailed = (key: string) => setFailedImages(prev => new Set(prev).add(key));
  const closeVideo = () => { setActiveVideo(null); setActiveVideoUrl(null); };

  if (testimonials.length === 0) return null;

  const sorted = [...testimonials].sort((a, b) => {
    const aScore = ((a.videoId || a.video_url) ? 2 : 0) + (a.image_url ? 1 : 0);
    const bScore = ((b.videoId || b.video_url) ? 2 : 0) + (b.image_url ? 1 : 0);
    return bScore - aScore;
  });

  const visible = sorted.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-canvas-night via-canvas-night to-surface py-12 sm:py-huge">
      <div className="container-cinematic relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="pill-tag mb-4 inline-block">Real Stories</span>
          <h2 className="font-display text-display-md lg:text-display-lg text-white mt-4">
            Trusted by Patients Worldwide
          </h2>
          <p className="text-body-lg text-white/60 max-w-2xl mx-auto mt-4">
            Real patients sharing their medical tourism experience in India
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:bg-white/[0.08] transition-all duration-300"
            >
              {/* Visual First: Video or Image */}
              {(t.videoId || t.video_url) ? (
                <div
                  className="relative aspect-video cursor-pointer overflow-hidden"
                  onClick={() => {
                    if (t.videoId) setActiveVideo(t.videoId);
                    else if (t.video_url) setActiveVideoUrl(t.video_url);
                  }}
                >
                  {!failedImages.has(`video-${i}`) && (
                    <img
                      src={t.image_url || `https://img.youtube.com/vi/${t.videoId}/hqdefault.jpg`}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => markFailed(`video-${i}`)}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play size={28} className="text ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-accent/90 text-xs font-semibold text-white">
                    Video
                  </div>
                </div>
              ) : t.image_url && !failedImages.has(`img-${i}`) ? (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={t.image_url}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={() => markFailed(`img-${i}`)}
                  />
                </div>
              ) : null}

              {/* Text Below Visual */}
              <div className="p-5 sm:p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, ri) => (
                    <Star key={ri} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-body-md text-white/80 leading-relaxed mb-4 line-clamp-3">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-body-md font-medium text-white">{t.name}</p>
                  <p className="text-caption text-white/50">{t.country} &middot; {t.treatment}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 text-button-md font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            View All Patient Stories
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>

      {(activeVideo || activeVideoUrl) && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4"
          onClick={closeVideo}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-4xl aspect-video max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors"
              aria-label="Close video"
            >
              <X size={32} />
            </button>
            {activeVideo ? (
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="Patient Testimonial Video"
                className="w-full h-full rounded-xl"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video
                src={activeVideoUrl!}
                className="w-full h-full rounded-xl bg-black"
                controls
                autoPlay
                playsInline
              />
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}
