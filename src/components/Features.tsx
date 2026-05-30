'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  UserCheck, 
  TrendingUp, 
  BookOpen, 
  Gauge, 
  Lock, 
  Globe 
} from 'lucide-react';

const FEATURES_DATA = [
  {
    icon: ShieldCheck,
    title: "Preserve Formatting",
    description: "Intelligently identifies tables, headings, spacing, and bullet structures, rebuilding files pixel-perfect.",
    color: "from-brand-purple/20 to-brand-purple/5"
  },
  {
    icon: Zap,
    title: "AI Detection Bypass",
    description: "Systematically alters sentences to completely disable detection on Turnitin, GPTZero, and Originality AI.",
    color: "from-brand-blue/20 to-brand-blue/5"
  },
  {
    icon: UserCheck,
    title: "Human-Level Rewriting",
    description: "Adds syntax variation, removes repetitive framing, and incorporates natural contractions automatically.",
    color: "from-brand-pink/20 to-brand-pink/5"
  },
  {
    icon: TrendingUp,
    title: "SEO Optimization",
    description: "Enhances keyword density and structural readability flow, ensuring high Google search ranks.",
    color: "from-brand-purple/20 to-brand-purple/5"
  },
  {
    icon: BookOpen,
    title: "Academic Friendly",
    description: "Preserves in-text Harvard/APA citations, references, and quotes while rewriting denser literature.",
    color: "from-brand-blue/20 to-brand-blue/5"
  },
  {
    icon: Gauge,
    title: "Fast Processing",
    description: "Rewrite multi-page PDF and DOCX structures in less than 30 seconds with responsive progress tracking.",
    color: "from-brand-pink/20 to-brand-pink/5"
  },
  {
    icon: Lock,
    title: "Secure Uploads",
    description: "All files are encrypted in transit and automatically deleted from our caches after downloads finish.",
    color: "from-brand-purple/20 to-brand-purple/5"
  },
  {
    icon: Globe,
    title: "Multi-language Support",
    description: "Supports humanization rewriting in over 25 languages including Spanish, French, German, and Japanese.",
    color: "from-brand-blue/20 to-brand-blue/5"
  }
];

export default function Features() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section id="features" className="relative z-10 py-24 bg-[#030303]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-xs font-semibold tracking-wider text-brand-purple uppercase mb-3">Enterprise Capabilities</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered to Rewrite, Built to Protect
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-brand-purple to-brand-blue mx-auto mt-4 rounded-full" />
        </div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURES_DATA.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative group p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between aspect-square"
              >
                {/* Background Accent glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                
                {/* Top Half */}
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-brand-purple/20 group-hover:bg-brand-purple/5 transition-all duration-300">
                    <Icon className="w-5 h-5 text-brand-purple group-hover:text-brand-blue transition-colors duration-300" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight group-hover:text-brand-purple transition-colors duration-300">
                    {feat.title}
                  </h3>
                </div>

                {/* Bottom Half */}
                <p className="text-xs text-gray-400 leading-relaxed mt-4">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
