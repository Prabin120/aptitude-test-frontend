import { Metadata } from 'next';
import CompilerEditor from '../components/CompilerEditor';
import Sidebar from '../components/Sidebar';

// Page for specific language compiler

interface Props {
    params: {
        language: string;
    };
}

const getLanguageName = (slug: string) => {
    const map: Record<string, string> = {
        'python': 'Python',
        'cpp': 'C++',
        'c': 'C',
        'java': 'Java',
        'go': 'Go',
        'js': 'JavaScript',
        'javascript': 'JavaScript'
    };
    return map[slug.toLowerCase()] || slug.charAt(0).toUpperCase() + slug.slice(1);
};

export function generateMetadata({ params }: Props): Metadata {
    const languageName = getLanguageName(params.language);
    return {
        title: `AI-Powered Online ${languageName} Compiler - Run ${languageName} on Mobile | AptiCode`,
        description: `Best AI-enabled online ${languageName} compiler and IDE. Write, debug, and execute ${languageName} code with intelligent autocomplete. Perfect for placement prep and competitive programming.`,
        keywords: [
            `online ${languageName.toLowerCase()} compiler`,
            `ai ${languageName.toLowerCase()} coding`,
            `run ${languageName.toLowerCase()} online`,
            `mobile ${languageName.toLowerCase()} ide`,
            `placement preparation ${languageName}`,
            `interview practice ${languageName}`,
            'free online compiler'
        ],
        openGraph: {
            title: `AI-Powered Online ${languageName} Compiler | AptiCode`,
            description: `Run ${languageName} code instantly with AI assistance. Mobile-optimized IDE for placement preparation and learning.`,
            type: 'website',
            url: `https://apticode.in/online-compiler/${params.language}`,
        }
    };
}

const supportedLanguages = ['python', 'cpp', 'c', 'java', 'go', 'js', 'javascript'];

export default function LanguageCompilerPage({ params }: Props) {
    const { language } = params;
    const languageName = getLanguageName(language);

    // JSON-LD for Software Application
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': `Online ${languageName} Compiler`,
        'applicationCategory': 'DeveloperTool',
        'operatingSystem': 'Any',
        'description': `A free online compiler for ${languageName}. Run, debug, and test ${languageName} code in your browser.`,
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
        },
        'featureList': `Intelligent ${languageName} Autocomplete, Syntax Highlighting, Instant Execution, Standard Input Support`,
    };

    if (!supportedLanguages.includes(language.toLowerCase())) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-bold mb-4">Language Not Supported</h1>
                <p>Sorry, strict support for {language} is not verified, but you can try.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen h-[100vh] overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="flex h-full">
                <Sidebar />
                <CompilerEditor language={language} />
            </div>
        </div>
    );
}
