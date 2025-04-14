import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { FormValues, languageOptions } from "../form-schema"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { verifyCode } from "../../apiCalls"
import { getIsVerifiedStatus, resetIsVerifiedForLanguage, saveIsVerifiedStatus } from "../progress-service"

interface SolutionStepProps {
    form: UseFormReturn<FormValues>
    setIsFullSolutionVerified: (value: boolean) => void
}

export default function SolutionStep({ form, setIsFullSolutionVerified }: SolutionStepProps) {
    const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
    const [isVerified, setIsVerified] = useState<{ [key: string]: boolean }>(getIsVerifiedStatus());
    const [error, setError] = useState<{ [key: string]: string }>({});

    const checkAllSolutionsVerified = () => {
        const allVerified = languageOptions.every(lang => isVerified[lang]);
        setIsFullSolutionVerified(allVerified);
    }

    useEffect(() => {
        checkAllSolutionsVerified();
    }, [isVerified]);

    const verifySolution = async (lang: string) => {
        setIsLoading(prev => ({ ...prev, [lang]: true }));
        const precode = form.getValues(`codeTemplates.${lang}.precode`);
        const postcode = form.getValues(`codeTemplates.${lang}.postcode`);
        const solution = precode + "\n" + form.getValues(`fullSolutions.${lang}`) + "\n" + postcode;
        const testCases = [
            ...JSON.parse(form.getValues(`simpleTestCases`)),
            ...JSON.parse(form.getValues(`mediumTestCases`)),
            ...JSON.parse(form.getValues(`largeTestCases`)),
        ];
        const response = await verifyCode(solution, lang, testCases);
        if (response.success) {
            if (response.data.passed){
                setIsVerified(prev => {
                    const updated = { ...prev, [lang]: true };
                    saveIsVerifiedStatus(updated); // Save to localStorage
                    setError(prev => ({ ...prev, [lang]: "" }));
                    return updated;
                });
                // checkAllSolutionsVerified(); // Check if all solutions are verified
                form.setValue(`timeLimits.${lang}`, response.data.maxTimeTaken || 1);
                form.setValue(`memoryLimits.${lang}`, response.data.maxMemoryUsed || 1);
            } else{
                console.error("Failed test case", response.data);
                setError(prev => ({ ...prev, [lang]: "Failed test case\n"+{...response.data} }));
                setIsVerified(prev => ({ ...prev, [lang]: false }));
            }
        } else {
            setError(prev => ({ ...prev, [lang]: response.message }));
        }
        setIsLoading(prev => ({ ...prev, [lang]: false }));
    };

    return (
        <div className="space-y-4">
            {languageOptions.map((lang) => (
                <div key={lang}>
                    <FormField
                        key={lang}
                        control={form.control}
                        name={`fullSolutions.${lang}`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{lang.toUpperCase()} Full Solution template</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        className="min-h-[300px] font-mono"
                                        placeholder={`Enter ${lang.toUpperCase()} full solution, please complete the template function only, No need to write the precode and postcode`}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            resetIsVerifiedForLanguage(lang); // Reset isVerified on edit
                                            setIsVerified(prev => ({ ...prev, [lang]: false }));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {isVerified[lang] ? (
                        <p className="text-green-500">Solution verified</p>
                    ) : (
                        <Button
                            type="button"
                            disabled={isLoading[lang]}
                            onClick={() => {
                                verifySolution(lang);
                            }}
                        >
                            {isLoading[lang] ? <Loader2 className="w-4 h-4 mr-2" /> : "Verify Solution"}
                        </Button>
                    )}

                    {error[lang] && <p className="text-red-500">{error[lang]}</p>}
                </div>
            ))}
        </div>
    );
}

