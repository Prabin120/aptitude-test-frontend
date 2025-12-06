import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Best Online Code Compiler - Run Python, Java, C++, Go & C Online | AptiCode',
    description: 'Free online code compiler and IDE to run Python, Java, C++, C, and Go code online. Features intelligent autocomplete, syntax highlighting, and instant execution. Best online code editor for students and developers.',
    keywords: ['online compiler', 'online code editor', 'python online compiler', 'java online compiler', 'run code online', 'online ide', 'c++ online compiler', 'free code editor'],
    openGraph: {
        title: 'Best Online Code Compiler - Run Code Online Free | AptiCode',
        description: 'Run Python, Java, C++, C, and Go code instantly in your browser. Free online IDE with intelligent autocomplete.',
        type: 'website',
    }
};

const languages = [
    { id: 'python', name: 'Python', color: 'bg-yellow-500', description: 'Run Python code with full IntelliSense support. Best for data science and scripting.' },
    { id: 'cpp', name: 'C++', color: 'bg-blue-500', description: 'Compile C++ code instantly. Perfect for competitive programming and learning algorithms.' },
    { id: 'c', name: 'C', color: 'bg-blue-600', description: 'Fast C compiler with standard input support. Ideal for system programming basics.' },
    { id: 'java', name: 'Java', color: 'bg-red-500', description: 'Online Java IDE with class support. Run object-oriented code seamlessly.' },
    { id: 'go', name: 'Go', color: 'bg-cyan-500', description: 'Execute Go code with fast compilation. Great for learning concurrency and backend systems.' },
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
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-8 text-center bg-black text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
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
                        className="group flex flex-col items-center p-6 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-800/50 transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className={`w-12 h-12 rounded-full ${lang.color} mb-4 opacity-80 group-hover:opacity-100 transition-opacity shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]`} />
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
                        <h3 className="text-xl font-semibold text-purple-400 mb-2">⚡ Instant Execution</h3>
                        <p className="text-zinc-400 text-sm">Compile and run your code in milliseconds. Our high-performance backend ensures zero lag for Python, C++, Java, and more.</p>
                    </div>
                    <div className="bg-zinc-900/30 p-6 rounded-lg border border-zinc-800/50">
                        <h3 className="text-xl font-semibold text-purple-400 mb-2">🧠 Intelligent Autocomplete</h3>
                        <p className="text-zinc-400 text-sm">Code faster with smart suggestions. Our editor understands your variable types, class methods, and standard libraries.</p>
                    </div>
                    <div className="bg-zinc-900/30 p-6 rounded-lg border border-zinc-800/50">
                        <h3 className="text-xl font-semibold text-purple-400 mb-2">💻 Multi-Language Support</h3>
                        <p className="text-zinc-400 text-sm">Switch seamlessly between Python, C++, C, Java, and Go. Perfect for polyglot developers and learning new syntax.</p>
                    </div>
                    <div className="bg-zinc-900/30 p-6 rounded-lg border border-zinc-800/50">
                        <h3 className="text-xl font-semibold text-purple-400 mb-2">🛡️ Isolated Environment</h3>
                        <p className="text-zinc-400 text-sm">Your code runs in secure Docker containers, ensuring safety and consistency regardless of your local setup.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
