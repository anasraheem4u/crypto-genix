"use client";

import { X, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
    const [copied, setCopied] = useState(false);

    const depositInfo = {
        name: "Ethereum",
        symbol: "ETH",
        address: "0xBB346AF1687d4c930f0e55DE7B2fbf83c56d6890",
        qrImage: "/QR-Code.jpg",
        color: "text-blue-400",
        warning: "Only supports Ethereum (ERC20) assets. Sending other assets may result in permanent loss.",
        trustWalletLink: "https://link.trustwallet.com/send?coin=60&address=0xBB346AF1687d4c930f0e55DE7B2fbf83c56d6890"
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(depositInfo.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-md bg-dark-card border border-dark-border rounded-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <ShieldCheck className="text-emerald-500 w-6 h-6" />
                                Deposit Funds
                            </h2>
                            <p className="text-sm text-gray-400 mb-6">
                                Scan the QR code or copy the address below to deposit cryptocurrency.
                            </p>

                            {/* QR Code */}
                            <div className="flex flex-col items-center justify-center mb-6 rounded-lg w-64 h-64 mx-auto overflow-hidden relative bg-white p-2 border border-dark-border">
                                <Image
                                    src={depositInfo.qrImage}
                                    alt={`${depositInfo.name} QR Code`}
                                    width={250}
                                    height={250}
                                    className="w-full h-full object-contain"
                                    priority
                                />
                            </div>

                            {/* Wallet Address */}
                            <div className="bg-dark-hover p-4 rounded-lg border border-dark-border mb-4">
                                <p className="text-xs text-gray-500 mb-1">
                                    {depositInfo.name} Wallet Address
                                </p>
                                <div className="flex items-center justify-between gap-2">
                                    <code className={`text-sm ${depositInfo.color} break-all font-mono`}>
                                        {depositInfo.address}
                                    </code>
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 hover:bg-dark-card rounded-lg transition-colors text-gray-400 hover:text-white flex-shrink-0"
                                        title="Copy Address"
                                    >
                                        {copied ? (
                                            <span className="text-green-500 text-xs whitespace-nowrap">Copied!</span>
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Trust Wallet Link */}
                            <a
                                href={depositInfo.trustWalletLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full p-3 mb-4 bg-[#3375Pg] hover:bg-[#2D66C8] bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Pay via Trust Wallet
                            </a>

                            {/* Warning */}
                            <div className="text-xs text-center text-yellow-500/80 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                                {depositInfo.warning}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
