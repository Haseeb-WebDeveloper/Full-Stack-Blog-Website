"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 2000);
    }, 1000);
  };

  return (
    <section className="relative top-0 overflow-hidden bg-background py-20 ">
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 ">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="pb-2 text-foreground text-4xl font-bold tracking-tight leading-relaxed sm:text-6xl max-w-3xl mx-auto">
                Your Go-To Spot for Stories 
            </h1>
            <h1 className="text-foreground text-4xl font-bold tracking-tight leading-relaxed sm:text-6xl max-w-3xl mx-auto">
            That Stick With You
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl mx-auto">
              Join our community of thinkers, creators, and innovators. Get the latest insights 
              delivered straight to your inbox.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10"
          >
            <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-x-4 font-mono">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-w-0 flex-auto rounded-lg border border-input bg-background px-3.5 py-2 text-foreground shadow-sm  sm:leading-6"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex-none rounded-lg bg-foreground/90 px-6 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-foreground/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span>Subscribing...</span>
                  </div>
                ) : status === 'success' ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Subscribed!</span>
                  </div>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {[
              ['10K+', 'Active Readers'],
              ['500+', 'Articles'],
              ['100+', 'Contributors'],
              ['4.9/5', 'Average Rating'],
            ].map(([stat, label]) => (
              <div key={label} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-muted-foreground">{label}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-foreground">
                  {stat}
                </dd>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Gradient Effect */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
    </section>
  );
}
