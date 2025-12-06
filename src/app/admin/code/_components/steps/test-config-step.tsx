"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import type { FormValues } from "../form-schema"

interface TestConfigStepProps {
    form: UseFormReturn<FormValues>
}


export default function TestConfigStep({ form }: TestConfigStepProps) {

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Test Configuration</h3>
            <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Make this question public</FormLabel>
                            <FormDescription>If checked, this question will be visible to all users.</FormDescription>
                        </div>
                    </FormItem>
                )}
            />
        </div>
    )
}

