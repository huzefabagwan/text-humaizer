'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const TESTIMONIALS_DATA = [
  {
    name: "Alex Rivera",
    role: "Senior Copywriter at Stripe",
    quote: "Keeping layout intact was my biggest headache when cleaning AI drafts. HumanDoc AI solved it completely. My DOCX templates look exactly the same before and after humanizing.",
    rating: 5,
    avatar: "AR"
  },
  {
    name: "Dr. Sarah Chen",
    role: "Postdoctoral Researcher",
    quote: "I was skeptical about how it would handle my citations and footnotes. It bypassed GPTZero while leaving all my bracketed bibliography entirely unchanged. Absolutely brilliant academic saver.",
    rating: 5,
    avatar: "SC"
  },
  {
    name: "Marcus Vance",
    role: "SEO Growth Manager",
    quote: "Our articles are structured with complex tables and product listings. Other tools stripped them completely. HumanDoc AI kept every cell, border, and link perfectly. Highly recommended.",
    rating: 5,
    avatar: "MV"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative z-10 py-24 bg-[#030303]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-xs font-semibold tracking-wider text-brand-pink uppercase mb-3">User Love</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trusted by Modern Professionals
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-brand-purple to-brand-blue mx-auto mt-4 rounded-full" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {TESTIMONIALS_DATA.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative p-8 rounded-2xl glass-panel border border-white/5 bg-white/2 hover:border-brand-purple/20 transition-all flex flex-col justify-between"
            >
              {/* Quote Mark */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5 pointer-events-none" />

              {/* Rating stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-purple text-brand-purple" />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-sm text-gray-300 italic mb-8 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center font-bold text-white text-xs">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
