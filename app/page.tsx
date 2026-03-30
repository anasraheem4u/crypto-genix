"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Globe,
  ArrowRight,
  CheckCircle,
  Bitcoin,
  Wallet,
  Lock,
  Cpu,
  Activity,
} from "lucide-react";
import LandingTerminal from "@/components/LandingTerminal";
import { useRef, useEffect, useState } from "react";

// --- Live Ticker Component ---
const cryptoTicker = [
  { symbol: "BTC", price: "67,234.50", change: "+2.41%", up: true },
  { symbol: "ETH", price: "3,521.80", change: "+1.87%", up: true },
  { symbol: "BNB", price: "589.20", change: "-0.54%", up: false },
  { symbol: "SOL", price: "178.90", change: "+4.12%", up: true },
  { symbol: "XRP", price: "0.6284", change: "+0.93%", up: true },
  { symbol: "ADA", price: "0.4521", change: "-1.22%", up: false },
  { symbol: "DOGE", price: "0.1742", change: "+3.67%", up: true },
  { symbol: "AVAX", price: "38.45", change: "+2.08%", up: true },
  { symbol: "DOT", price: "7.23", change: "-0.31%", up: false },
  { symbol: "MATIC", price: "0.9841", change: "+1.55%", up: true },
];

function PriceTicker() {
  return (
    <div className="w-full overflow-hidden bg-black/40 border-y border-white/[0.06] py-3 relative">
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#080b14] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#080b14] to-transparent z-10 pointer-events-none" />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-8 whitespace-nowrap"
        style={{ width: "max-content" }}
      >
        {[...cryptoTicker, ...cryptoTicker].map((coin, i) => (
          <div key={i} className="flex items-center gap-2 px-2">
            <span className="text-xs font-bold text-white/70">{coin.symbol}</span>
            <span className="text-xs font-mono text-white">${coin.price}</span>
            <span className={`text-xs font-semibold ${coin.up ? "text-emerald-400" : "text-red-400"}`}>
              {coin.change}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// --- Animated Grid Background ---
function GridBackground() {
  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial fade over grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]" />
    </div>
  );
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const stats = [
    { value: "$24B+", label: "Monthly Volume", icon: Activity },
    { value: "4.2M+", label: "Verified Traders", icon: Wallet },
    { value: "180+", label: "Countries Active", icon: Globe },
    { value: "<30ms", label: "Execution Speed", icon: Zap },
  ];

  const features = [
    {
      icon: Bitcoin,
      title: "Spot & Crypto Trading",
      description:
        "Trade 500+ crypto pairs with institutional-grade depth and zero-slippage execution powered by our proprietary matching engine.",
      color: "from-amber-500/20 to-amber-500/5",
      accent: "text-amber-400",
      border: "group-hover:border-amber-500/30",
    },
    {
      icon: Shield,
      title: "Military-Grade Security",
      description:
        "Cold storage vaults, multi-signature authorization, and real-time anomaly detection protect every asset on the platform.",
      color: "from-sky-500/20 to-sky-500/5",
      accent: "text-sky-400",
      border: "group-hover:border-sky-500/30",
    },
    {
      icon: Zap,
      title: "Lightning Execution",
      description:
        "Sub-30ms order execution via our globally distributed server mesh. Never miss a market opportunity again.",
      color: "from-yellow-500/20 to-yellow-500/5",
      accent: "text-yellow-400",
      border: "group-hover:border-yellow-500/30",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Level 2 order books, custom indicators, heatmaps, and AI-driven signals built for serious traders.",
      color: "from-purple-500/20 to-purple-500/5",
      accent: "text-purple-400",
      border: "group-hover:border-purple-500/30",
    },
    {
      icon: Cpu,
      title: "Algorithmic Trading",
      description:
        "Build, test, and deploy automated strategies with our full-featured API and backtesting engine.",
      color: "from-emerald-500/20 to-emerald-500/5",
      accent: "text-emerald-400",
      border: "group-hover:border-emerald-500/30",
    },
    {
      icon: Globe,
      title: "DeFi & Web3 Access",
      description:
        "Bridge between CeFi and DeFi seamlessly. Access DEX liquidity, yield farming, and NFT markets in one hub.",
      color: "from-cyan-500/20 to-cyan-500/5",
      accent: "text-cyan-400",
      border: "group-hover:border-cyan-500/30",
    },
  ];

  const trustPoints = [
    "No Credit Card Required",
    "$10,000 Paper Trading Demo",
    "Withdraw Anytime",
    "24/7 Live Support",
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#080b14] text-gray-200 overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200"
    >
      {/* ── Ticker ── */}
      <PriceTicker />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#080b14]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-amber-500" />
                <Bitcoin className="relative h-5 w-5 text-white drop-shadow" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                <span className="text-white">Crypto</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-amber-400">
                  {" "}Genix
                </span>
              </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
              <Link href="/markets" className="hover:text-white transition-colors">Markets</Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/trade" className="hover:text-white transition-colors">Trade</Link>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="hidden sm:inline-block text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signin"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 text-black text-sm font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/50 hover:scale-105 transition-all active:scale-95"
              >
                Start Trading
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 px-4 overflow-hidden">
        <GridBackground />

        {/* Glows */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/20 rounded-full blur-[130px] -z-10"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-0 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-[110px] -z-10"
        />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.14 } },
            }}
          >
            {/* Live badge */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase">
                Live Markets · 500+ Crypto Pairs
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.95]"
            >
              Trade the{" "}
              <span className="relative inline-block">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400 bg-[length:200%] animate-shimmer">
                  Future
                </span>
              </span>
              <br className="hidden md:block" />
              {" "}of Finance
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Crypto Genix delivers institutional-grade trading with zero hidden fees, lightning-fast settlement, and bank-grade security — built for the next generation of digital asset traders.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/signin"
                className="w-full sm:w-auto group relative px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 text-black font-bold text-lg shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all overflow-hidden"
              >
                <span className="relative flex items-center gap-2 justify-center">
                  Start Trading Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/markets"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-bold text-lg hover:bg-white/[0.08] backdrop-blur-sm transition-all flex items-center justify-center gap-2 group"
              >
                Explore Markets
                <BarChart3 className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
              </Link>
            </motion.div>

            {/* Trust chips */}
            <motion.div
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500"
            >
              {trustPoints.map((point, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Terminal Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, type: "spring", bounce: 0.2 }}
          className="mt-20 max-w-5xl mx-auto relative z-20 group"
        >
          <div className="absolute -inset-px bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-700" />
          <div className="relative">
            <LandingTerminal />
          </div>
        </motion.div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="border-y border-white/[0.05] bg-white/[0.015] backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-4 group-hover:border-emerald-500/30 transition-colors">
                  <stat.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-3xl md:text-4xl font-black text-white mb-1 tabular-nums">
                  {stat.value}
                </h4>
                <p className="text-sm font-semibold text-amber-400 uppercase tracking-widest">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-28 px-4 relative overflow-hidden">
        {/* Section glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 block">Why Crypto Genix</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                Built for{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-amber-400">
                  Serious Traders
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Everything you need to analyze, execute, and scale your crypto portfolio in one unified, enterprise-grade ecosystem.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.09 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
                className={`relative group p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:-translate-y-2 transition-all duration-300 overflow-hidden ${feature.border}`}
              >
                {/* Card inner glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${feature.accent}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className={`text-lg font-bold text-white mb-3 group-hover:${feature.accent} transition-colors`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-white/[0.08] p-12 md:p-20 text-center overflow-hidden"
          >
            {/* BG gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10" />
            {/* Animated glow */}
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/15 blur-[100px] rounded-full -z-10"
            />
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative z-10">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-6 block">
                🚀 Join 4.2M+ Traders Worldwide
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                Ready to Maximize <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-amber-400">
                  Your Returns?
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Create your free Crypto Genix account in under 2 minutes. No credit card required — start with a $10k demo or go live instantly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signin"
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 text-black font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-emerald-500/25"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/markets"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-bold text-lg hover:bg-white/[0.08] transition-all"
                >
                  View Live Markets
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] bg-black/30 pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-14">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-amber-500" />
                <Bitcoin className="relative h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                <span className="text-white">Crypto</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-amber-400"> Genix</span>
              </span>
            </div>
            <p className="text-gray-500 max-w-xs mb-6 text-sm leading-relaxed">
              The world&apos;s most advanced crypto trading platform. Institutional-grade tools, zero-fee structure, and 24/7 global market access.
            </p>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-400">All Systems Operational</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              {["Markets", "Spot Trading", "Futures", "Copy Trading", "Earn"].map((item) => (
                <li key={item} className="hover:text-emerald-400 cursor-pointer transition-colors">{item}</li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              {["Help Center", "API Docs", "Fee Schedule", "Security", "Bug Bounty"].map((item) => (
                <li key={item} className="hover:text-emerald-400 cursor-pointer transition-colors">{item}</li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              {["About Us", "Blog", "Careers", "Press", "Contact"].map((item) => (
                <li key={item} className="hover:text-emerald-400 cursor-pointer transition-colors">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/[0.05] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© 2025 Crypto Genix. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Risk Disclosure</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
