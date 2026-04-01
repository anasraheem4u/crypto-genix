"use client";

import { X, Copy, ExternalLink, ShieldCheck, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NETWORKS = [
    {
        id: "ERC20",
        name: "Ethereum",
        symbol: "ETH",
        address: "0xAaf41E3890aaD87b4422A9FF161F9DC1559a00Cf",
        color: "text-blue-400",
        activeBadge: "border-blue-500/50 bg-blue-500/10 text-blue-400",
        dot: "bg-blue-400",
        qrFg: "#1d4ed8",
        warning: "Only supports Ethereum assets (ERC20). Sending other assets may result in permanent loss.",
        trustWalletLink: "https://link.trustwallet.com/send?coin=60&address=0xAaf41E3890aaD87b4422A9FF161F9DC1559a00Cf",
    },
    {
        id: "BTC",
        name: "Bitcoin",
        symbol: "BTC",
        address: "bc1ps5vhpm5eh38d4u0k293gf0jn5lde2xa3m2qgve6hye2rrt07xzzqy7vpr5",
        color: "text-amber-400",
        activeBadge: "border-amber-500/50 bg-amber-500/10 text-amber-400",
        dot: "bg-amber-400",
        qrFg: "#d97706",
        warning: "Only supports Bitcoin assets. Ordinals and inscription assets are not supported.",
        trustWalletLink: "https://link.trustwallet.com/send?coin=0&address=bc1ps5vhpm5eh38d4u0k293gf0jn5lde2xa3m2qgve6hye2rrt07xzzqy7vpr5",
    },
    {
        id: "TRC20",
        name: "Tron",
        symbol: "TRX",
        address: "TEtm4iiWK2QC3L6rC6jZy5AZ424cpW7YJV",
        color: "text-red-400",
        activeBadge: "border-red-500/50 bg-red-500/10 text-red-400",
        dot: "bg-red-400",
        qrFg: "#dc2626",
        warning: "Only supports Tron assets (TRC10/TRC20). Sending other assets may result in permanent loss.",
        trustWalletLink: "https://link.trustwallet.com/send?coin=195&address=TEtm4iiWK2QC3L6rC6jZy5AZ424cpW7YJV",
    },
];

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
    const [copied, setCopied] = useState(false);
    const [selectedId, setSelectedId] = useState("ERC20");

    const network = NETWORKS.find((n) => n.id === selectedId)!;

    const handleCopy = () => {
        navigator.clipboard.writeText(network.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleNetworkSwitch = (id: string) => {
        setSelectedId(id);
        setCopied(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 24 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-sm bg-dark-card border border-dark-border rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header */}
                            <div className="mb-5">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                                    <ShieldCheck className="text-emerald-500 w-5 h-5" />
                                    Deposit Crypto
                                </h2>
                                <p className="text-xs text-gray-400">
                                    Select network · Scan QR or copy address
                                </p>
                            </div>

                            {/* Network Tabs */}
                            <div className="grid grid-cols-3 gap-2 mb-5">
                                {NETWORKS.map((n) => (
                                    <button
                                        key={n.id}
                                        onClick={() => handleNetworkSwitch(n.id)}
                                        className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                                            selectedId === n.id
                                                ? `${n.activeBadge} scale-[1.04] shadow-lg`
                                                : "border-dark-border bg-dark-hover text-gray-500 hover:text-gray-300 hover:border-gray-600"
                                        }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${n.dot}`} />
                                        <span>{n.name}</span>
                                        <span className="opacity-50 text-[10px]">{n.id}</span>
                                    </button>
                                ))}
                            </div>

                            {/* QR Code — generated dynamically, always scannable */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedId}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col items-center mb-5"
                                >
                                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                                        <QRCodeSVG
                                            value={network.address}
                                            size={192}
                                            fgColor={network.qrFg}
                                            bgColor="#ffffff"
                                            level="H"
                                            includeMargin={false}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Scan with your crypto wallet app
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            {/* Wallet Address */}
                            <div className="bg-dark-hover rounded-xl border border-dark-border p-3 mb-4">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
                                    {network.name} ({network.id}) Address
                                </p>
                                <div className="flex items-start justify-between gap-3">
                                    <code className={`text-xs ${network.color} break-all font-mono leading-relaxed flex-1`}>
                                        {network.address}
                                    </code>
                                    <button
                                        onClick={handleCopy}
                                        className="p-1.5 hover:bg-dark-card rounded-lg transition-colors text-gray-400 hover:text-white flex-shrink-0 mt-0.5"
                                        title="Copy Address"
                                    >
                                        {copied
                                            ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                                            : <Copy className="w-4 h-4" />
                                        }
                                    </button>
                                </div>
                                {copied && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-emerald-400 mt-2"
                                    >
                                        ✓ Address copied!
                                    </motion.p>
                                )}
                            </div>

                            {/* Trust Wallet CTA */}
                            <a
                                href={network.trustWalletLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 mb-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl transition-colors font-semibold text-sm"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Open in Trust Wallet
                            </a>

                            {/* Warning */}
                            <div className="text-xs text-center text-yellow-500/80 bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20 leading-relaxed">
                                ⚠️ {network.warning}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
