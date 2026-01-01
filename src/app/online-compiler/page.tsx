import { Metadata } from 'next';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SiPython, SiJavascript, SiCplusplus, SiC, SiGo } from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

export const metadata: Metadata = {
    title: 'AI-Powered Online Code Compiler - Run Python, Java, C++, Go & C | AptiCode',
    description: 'Free AI-enabled online code compiler and IDE. Run Python, Java, C++, C, and Go code with intelligent autocomplete and AI assistance. Best mobile-friendly coding platform for placement prep.',
    keywords: [
        'online compiler', 'ai code editor', 'python online compiler', 'java online compiler',
        'c++ online compiler', 'run code online', 'online ide', 'mobile code editor',
        'placement preparation', 'coding interview practice', 'free compiler'
    ],
    openGraph: {
        title: 'Best AI-Powered Online Code Compiler | AptiCode',
        description: 'Run Python, Java, C++, C, and Go code instantly. Mobile-optimized IDE with AI autocomplete and code improvement.',
        type: 'website',
        url: 'https://apticode.in/online-compiler',
        siteName: 'AptiCode Online Compiler',
    },
    twitter: {
        card: "summary_large_image",
        title: "AI-Powered Mobile Compiler | AptiCode",
        description: "Code on the go! Run Python, Java, C++, and more with full AI assistance.",
    }
};

const languages = [
    { id: 'python', name: 'Python', icon: SiPython, color: 'text-[#3776AB]', description: 'Run Python code with full IntelliSense support. Best for data science and scripting.' },
    { id: 'javascript', name: 'JavaScript', icon: SiJavascript, color: 'text-[#F7DF1E]', description: 'Run JS on Node.js environment. Perfect for learning backend logical scripting.' },
    { id: 'cpp', name: 'C++', icon: SiCplusplus, color: 'text-[#00599C]', description: 'Compile C++ code instantly. Perfect for competitive programming and learning algorithms.' },
    { id: 'c', name: 'C', icon: SiC, color: 'text-[#A8B9CC]', description: 'Fast C compiler with standard input support. Ideal for system programming basics.' },
    { id: 'java', name: 'Java', icon: FaJava, color: 'text-[#007396]', description: 'Online Java IDE with class support. Run object-oriented code seamlessly.' },
    { id: 'go', name: 'Go', icon: SiGo, color: 'text-[#00ADD8]', description: 'Execute Go code with fast compilation. Great for learning concurrency and backend systems.' },
];

export default function OnlineCompilerPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'AptiCode Online Compiler',
        'applicationCategory': 'DeveloperTool',
        'operatingSystem': 'Any',
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
        },
        'description': 'A free, fast, and intelligent online code compiler supporting Python, Java, C++, C, and Go.',
        'featureList': 'Intelligent Autocomplete, Syntax Highlighting, Multiple Language Support, Dark Mode, Instant Execution',
        'browserRequirements': 'Requires JavaScript. Works in all modern browsers.'
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-black text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-foreground/80">
                Online Code Compiler & IDE
            </h1>

            <p className="max-w-2xl text-lg text-zinc-400 mb-12">
                Run, compile, and execute code instantly in 5+ languages.
                The best free <span className="text-zinc-200 font-semibold">online code editor</span> with intelligent autocomplete,
                syntax highlighting, and standard input support. No setup required.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-6xl">
                {languages.map((lang) => (
                    <Link
                        key={lang.id}
                        href={`/online-compiler/${lang.id}`}
                        className="group flex flex-col items-center p-6 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-primary/50 hover:bg-zinc-800/50 transition-all duration-300 hover:-translate-y-1"
                    >
                        <lang.icon className={cn("w-12 h-12 mb-4 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]", lang.color)} />
                        <span className="font-bold text-lg mb-2">{lang.name} Compiler</span>
                        <span className="text-xs text-zinc-500 group-hover:text-zinc-400 line-clamp-2 md:line-clamp-none hidden md:block px-2">
                            {lang.description}
                        </span>
                    </Link>
                ))}
            </div>

            <section className="mt-20 max-w-4xl text-left prose prose-invert">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 to-zinc-400">Why Use AptiCode&apos;s Online Compiler?</h2>
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <div className="bg-zinc-900/30 p-6 rounded-lg border border-zinc-800/50">
                        <h3 className="text-xl font-semibold text-primary mb-2">⚡ Instant Execution</h3>
                        <p className="text-zinc-400 text-sm">Compile and run your code in milliseconds. Our high-performance backend ensures zero lag for Python, C++, Java, and more.</p>
                    </div>
                    <div className="bg-zinc-900/30 p-6 rounded-lg border border-zinc-800/50">
                        <h3 className="text-xl font-semibold text-primary mb-2">🧠 Intelligent Autocomplete</h3>
                        <p className="text-zinc-400 text-sm">Code faster with smart suggestions. Our editor understands your variable types, class methods, and standard libraries.</p>
                    </div>
                    <div className="bg-zinc-900/30 p-6 rounded-lg border border-zinc-800/50">
                        <h3 className="text-xl font-semibold text-primary mb-2">💻 Multi-Language Support</h3>
                        <p className="text-zinc-400 text-sm">Switch seamlessly between Python, C++, C, Java, and Go. Perfect for polyglot developers and learning new syntax.</p>
                    </div>
                    <div className="bg-zinc-900/30 p-6 rounded-lg border border-zinc-800/50">
                        <h3 className="text-xl font-semibold text-primary mb-2">🛡️ Isolated Environment</h3>
                        <p className="text-zinc-400 text-sm">Your code runs in secure Docker containers, ensuring safety and consistency regardless of your local setup.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
