"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Key, Terminal } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { getAIApiKey, setAIApiKey } from "../api";

interface SettingsModalProps {
    children: React.ReactNode;
}

const SettingsModal = ({ children }: SettingsModalProps) => {
    const [activeTab, setActiveTab] = useState("api-key");
    const [apiKey, setApiKey] = useState("");

    const handleSaveApiKey = () => {
        // Here you would typically save to localStorage or backend
        setAIApiKey(apiKey);
        toast.success("API Key saved successfully");
    };

    // Load API key on mount if available
    React.useEffect(() => {
        const storedKey = getAIApiKey();
        if (storedKey) setApiKey(storedKey);
    }, []);

    const menuItems = [
        { id: "api-key", label: "API Key Setup", icon: <Terminal className="w-4 h-4" /> },
        { id: "shortcuts", label: "Shortcut Keys", icon: <Key className="w-4 h-4" /> },
    ];

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-3xl gap-0 p-0 overflow-hidden bg-zinc-950 border-zinc-800 text-zinc-100">
                <div className="grid grid-cols-4 h-[500px]">
                    {/* Sidebar */}
                    <div className="col-span-1 border-r border-zinc-800 bg-zinc-900/50 p-4 space-y-2">
                        <div className="mb-6 px-2">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Settings
                            </h2>
                        </div>
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${activeTab === item.id
                                    ? "bg-zinc-800 text-white font-medium"
                                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="col-span-3 p-6 overflow-y-auto">
                        {activeTab === "api-key" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-medium mb-1">API Key Setup</h3>
                                    <p className="text-sm text-zinc-400">Add API key to access the AptiCode AI for free.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="api-key" className="text-zinc-300">API Key (Google Gemini)</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="api-key"
                                                value={apiKey}
                                                onChange={(e) => setApiKey(e.target.value)}
                                                type="password"
                                                placeholder="AI..."
                                                className="bg-zinc-900 border-zinc-700 focus-visible:ring-purple-500"
                                            />
                                            <Button onClick={handleSaveApiKey} className="bg-purple-600 hover:bg-purple-700 text-white">
                                                Save
                                            </Button>
                                        </div>
                                        <p className="text-xs text-zinc-500">
                                            Your API key is stored locally in your browser. We will not store your API key anywhere. Read our <Link href="/privacy-policy" className="text-purple-400 hover:text-purple-300 underline underline-offset-4">Privacy Policy</Link> for more details.
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-zinc-800">
                                        <h4 className="text-sm font-medium mb-2 text-zinc-300">How to get an API Key?</h4>
                                        {/* <p className="text-sm text-zinc-400 mb-2">
                                            You can get a free API key by signing up on our developer portal.
                                        </p> */}
                                        <Link
                                            href="/blogs/how-to-use-unlimited-ai-without-premium"
                                            className="text-sm text-purple-400 hover:text-purple-300 underline underline-offset-4"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Get Free API Key &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "shortcuts" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-medium mb-1">Keyboard Shortcuts</h3>
                                    <p className="text-sm text-zinc-400">Boost your productivity with these shortcuts.</p>
                                </div>

                                <div className="grid gap-2">
                                    {[
                                        { action: "Run Code", keys: ["Ctrl", "R"] },
                                        { action: "Save File", keys: ["Ctrl", "S"] },
                                        { action: "Format Code", keys: ["Ctrl", "Alt", "F"] },
                                    ].map((shortcut, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                                            <span className="text-sm text-zinc-300">{shortcut.action}</span>
                                            <div className="flex gap-1">
                                                {shortcut.keys.map((key, k) => (
                                                    <kbd key={k} className="px-2 py-1 text-xs font-mono font-medium bg-zinc-800 border-b-2 border-zinc-700 rounded text-zinc-400">
                                                        {key}
                                                    </kbd>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsModal;
