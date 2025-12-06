import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { type FormValues, languageOptions } from "../form-schema"

interface CodeTemplatesStepProps {
    form: UseFormReturn<FormValues>
}

export default function CodeTemplatesStep({ form }: CodeTemplatesStepProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Code Templates</h3>
            <div className="space-y-6">
                {languageOptions.map((lang) => (
                    <div key={lang} className="p-4 border rounded-lg dark:border-gray-700">
                        <h3 className="text-md font-semibold mb-3">{lang.toUpperCase()}</h3>
                        <div className="space-y-4">
                            {["precode", "template", "postcode"].map((fieldType) => (
                                <FormField
                                    key={`${lang}-${fieldType}`}
                                    control={form.control}
                                    name={`codeTemplates.${lang}.${fieldType}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

