import { Metadata } from 'next';
import CompilerEditor from '../components/CompilerEditor';

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
        title: `Online ${languageName} Compiler - Run ${languageName} Code Online | AptiCode`,
        description: `Best free online ${languageName} compiler and IDE. Write, compile, and execute ${languageName} code instantly in your browser with intelligent autocomplete and syntax highlighting.`,
        keywords: [`online ${languageName.toLowerCase()} compiler`, `run ${languageName.toLowerCase()} code online`, `${languageName.toLowerCase()} online editor`, `online ${languageName.toLowerCase()} ide`, 'free code compiler'],
        openGraph: {
            title: `Online ${languageName} Compiler - Fast & Free | AptiCode`,
            description: `Run ${languageName} code instantly in your browser. Free online IDE with intelligent autocomplete.`,
            type: 'website',
        }
    };
}

const supportedLanguages = ['python', 'cpp', 'c', 'java', 'go', 'js'];

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
        <div className="min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CompilerEditor language={language} />
        </div>
    );
}
