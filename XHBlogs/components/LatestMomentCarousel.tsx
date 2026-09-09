"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareQuote, Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function LatestMomentCarousel({ moments }: { moments: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (moments.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % moments.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [moments.length]);

  if (!moments || moments.length === 0) {
    return (
      <div className="w-full h-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden relative p-6 md:p-8 flex flex-col justify-center min-h-[220px]">
        <div className="flex items-center gap-2 text-indigo-500 mb-2">
          <MessageSquareQuote size={20} />
          <span className="text-xs font-black uppercase tracking-widest">Moments</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">暂无最新说说，去记录美好瞬间吧~</p>
      </div>
    );
  }

  const currentMoment = moments[currentIndex];
  const hasCover = currentMoment.images && currentMoment.images.length > 0;
  const coverImage = hasCover ? currentMoment.images[0] : null;

  const holoVariants = {
    initial: { opacity: 0, scale: 0.96, filter: "blur(8px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 1.04, filter: "blur(8px)" },
  };

  return (
    <div className="w-full h-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden relative group min-h-[220px] flex flex-col">
      <Link href="/moments" className="absolute inset-0 z-20" aria-label="查看说说动态" />

      {coverImage ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMoment.id || currentIndex}
            variants={holoVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <img src={coverImage} className="w-full h-full object-cover opacity-75 dark:opacity-50 transition-transform duration-1000 group-hover:scale-105" alt="Moment Cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-slate-900/30"></div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-900/20 dark:via-purple-900/15 dark:to-pink-900/15" />
      )}

      <div className="relative z-10 flex flex-col justify-between p-6 md:p-8 h-full pointer-events-none w-full md:w-[88%]">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center gap-1.5 text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest bg-white/60 dark:bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-indigo-500/20 shadow-sm">
              <MessageSquareQuote size={12} />
              瞬息说说
            </span>

            {currentMoment.date && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-slate-600 dark:text-slate-300 drop-shadow-sm">
                <Calendar size={11} className="opacity-70" />
                {currentMoment.date}
              </span>
            )}

            {currentMoment.location && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 drop-shadow-sm truncate max-w-[120px]">
                <MapPin size={11} className="opacity-70" />
                {currentMoment.location}
              </span>
            )}
          </div>

          <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white leading-relaxed line-clamp-3 drop-shadow-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
            {currentMoment.content}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-1 text-xs font-bold text-indigo-500 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
          <span>阅读全部说说</span>
          <ArrowRight size={14} />
        </div>
      </div>

      {moments.length > 1 && (
        <div className="absolute bottom-5 right-6 z-30 flex gap-1.5">
          {moments.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
              className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${i === currentIndex ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-400/40 hover:bg-slate-400/80 dark:bg-white/30 dark:hover:bg-white/60'}`}
              aria-label={`跳转到第 ${i + 1} 条说说`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
