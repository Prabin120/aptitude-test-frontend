"use client";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import SettingsModal from "./SettingsModal";
import { SiPython, SiJavascript, SiCplusplus, SiC, SiGo } from "react-icons/si";
import { FaJava } from "react-icons/fa";

const languages = [
    {
        id: "python",
        name: "Python",
        icon: <SiPython className="w-6 h-6" />,
        color: "text-blue-400 hover:text-blue-300",
    },
    {
        id: "javascript",
        name: "JavaScript",
        icon: <SiJavascript className="w-6 h-6" />,
        color: "text-yellow-400 hover:text-yellow-300",
    },
    {
        id: "java",
        name: "Java",
        icon: <FaJava className="w-6 h-6" />,
        color: "text-red-500 hover:text-red-400",
    },
    {
        id: "cpp",
        name: "C++",
        icon: <SiCplusplus className="w-6 h-6" />,
        color: "text-blue-500 hover:text-blue-400",
    },
    {
        id: "c",
        name: "C",
        icon: <SiC className="w-6 h-6" />,
        color: "text-blue-600 hover:text-blue-500",
    },
    {
        id: "go",
        name: "Go",
        icon: <SiGo className="w-7 h-7" />,
        color: "text-cyan-400 hover:text-cyan-300",
    },
];

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex w-16 flex-col items-center py-4 bg-zinc-950 border-r border-zinc-800 h-full justify-between">
            <div className="flex flex-col gap-6 mt-4">
                {languages.map((lang) => {
                    // Extract the last segment of pathname for exact matching
                    const pathLang = pathname?.split('/').pop();
                    const isActive = pathLang === lang.id;
                    return (
                        <Link
                            key={lang.id}
                            href={`/online-compiler/${lang.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-3 rounded-lg transition-all duration-200 group relative ${isActive ? "bg-zinc-800 text-white" : "text-zinc-500 hover:bg-zinc-900"}`}
                        >
                            <div className={`${isActive ? lang.color : "group-hover:" + lang.color} transition-colors`}>
                                {lang.icon}
                            </div>

                            {/* Tooltip */}
                            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-zinc-800">
                                {lang.name}
                            </span>

                            {/* Active Indicator */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                            )}
                        </Link>
                    )
                })}
            </div>
            <div>
                <SettingsModal>
                    <Button variant={"ghost"} className={`group relative text-zinc-500 hover:text-zinc-100 transition-colors p-1`}>
                        <Settings size={24} />
                        {/* Tooltip */}
                        <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-xs p-2  rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-zinc-800">
                            Settings
                        </span>
                    </Button>
                </SettingsModal>
            </div>
        </div>
    );
};

export default Sidebar;
