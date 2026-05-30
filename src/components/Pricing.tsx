'use client';

import React from 'react';
import { Check, ShieldAlert } from 'lucide-react';

interface PricingProps {
  onSelectPlan: (plan: string, credits: number) => void;
}

export default function Pricing({ onSelectPlan }: PricingProps) {
  return (
    <section id="pricing" className="relative z-10 py-24 bg-[#030303]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-xs font-semibold tracking-wider text-brand-blue uppercase mb-3">Transparent Plans</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Select Your Humanization Scale
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-brand-purple to-brand-blue mx-auto mt-4 rounded-full" />
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Free Plan */}
          <div className="flex flex-col justify-between p-8 rounded-2xl glass-panel border border-white/5 bg-white/2 relative">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Starter</span>
              <h3 className="text-2xl font-bold text-white mt-2">Free</h3>
              <p className="text-xs text-gray-400 mt-2">Perfect for brief documents or testing features.</p>
              
              <div className="mt-6 flex items-baseline text-white">
                <span className="text-4xl font-extrabold tracking-tight">$0</span>
                <span className="ml-1 text-xs text-gray-500">/ forever</span>
              </div>
              
              <ul className="mt-8 space-y-4 text-xs">
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="w-4 h-4 text-brand-purple" />
                  <span>5,000 Words / month</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="w-4 h-4 text-brand-purple" />
                  <span>Standard Bypass Engine</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="w-4 h-4 text-brand-purple" />
                  <span>TXT & DOCX formats</span>
                </li>
                <li className="flex items-center gap-3 text-gray-500 line-through">
                  <ShieldAlert className="w-4 h-4 opacity-50" />
                  <span>PDF structure preservation</span>
                </li>
                <li className="flex items-center gap-3 text-gray-500 line-through">
                  <ShieldAlert className="w-4 h-4 opacity-50" />
                  <span>Premium Tones & Citations</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={() => onSelectPlan('Free', 50)}
              className="mt-8 w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Pro Plan - Glowing Gradient Border */}
          <div className="flex flex-col justify-between p-8 rounded-2xl relative gradient-border-glow shadow-[0_0_50px_rgba(139,92,246,0.15)] transform md:-translate-y-2">
            {/* Best Value Badge */}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-white bg-gradient-to-r from-brand-purple to-brand-blue uppercase tracking-wider">
              Most Popular
            </span>
            
            <div>
              <span className="text-xs font-semibold text-brand-purple uppercase tracking-widest">Professional</span>
              <h3 className="text-2xl font-bold text-white mt-2">Pro SaaS</h3>
              <p className="text-xs text-gray-300 mt-2">Designed for students, content writers, and professionals.</p>
              
              <div className="mt-6 flex items-baseline text-white">
                <span className="text-4xl font-extrabold tracking-tight">$19</span>
                <span className="ml-1 text-xs text-gray-400">/ month</span>
              </div>
              
              <ul className="mt-8 space-y-4 text-xs">
                <li className="flex items-center gap-3 text-gray-200">
                  <Check className="w-4 h-4 text-brand-purple" />
                  <span>100,000 Words / month</span>
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <Check className="w-4 h-4 text-brand-purple" />
                  <span>Max Bypass Bypass-4 Engine</span>
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <Check className="w-4 h-4 text-brand-purple" />
                  <span>TXT, DOCX, & PDF inputs</span>
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <Check className="w-4 h-4 text-brand-purple" />
                  <span>Layout & Spacing preservation</span>
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <Check className="w-4 h-4 text-brand-purple" />
                  <span>Priority fast processing</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={() => onSelectPlan('Pro', 1000)}
              className="mt-8 w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-purple to-brand-blue shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:opacity-90 transition-all cursor-pointer"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="flex flex-col justify-between p-8 rounded-2xl glass-panel border border-white/5 bg-white/2 relative">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Business</span>
              <h3 className="text-2xl font-bold text-white mt-2">Enterprise</h3>
              <p className="text-xs text-gray-400 mt-2">For large content organizations and universities.</p>
              
              <div className="mt-6 flex items-baseline text-white">
                <span className="text-4xl font-extrabold tracking-tight">$89</span>
                <span className="ml-1 text-xs text-gray-500">/ month</span>
              </div>
              
              <ul className="mt-8 space-y-4 text-xs">
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="w-4 h-4 text-brand-purple" />
                  <span>Unlimited Words</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="w-4 h-4 text-brand-purple" />
                  <span>Custom fine-tuned bypass models</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="w-4 h-4 text-brand-purple" />
                  <span>Full API Access & Keys</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="w-4 h-4 text-brand-purple" />
                  <span>Dedicated support manager</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="w-4 h-4 text-brand-purple" />
                  <span>White-label dashboard portals</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={() => onSelectPlan('Enterprise', 99999)}
              className="mt-8 w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
            >
              Contact Sales
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
