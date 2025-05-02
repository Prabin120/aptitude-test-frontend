"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import CircleLoading from "@/components/ui/circleLoading"
import { checkAuthorization } from "@/utils/authorization"
import { useAppDispatch } from "@/redux/store"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Form } from "@/components/ui/form"
import BasicInfoStep from "./steps/basic-info-step"
import SampleTestCasesStep from "./steps/sample-testcases-step"
import CodeTemplatesStep from "./steps/code-templates-step"
import SolutionStep from "./steps/solution-step"
import TestConfigStep from "./steps/test-config-step"
import { type FormValues, defaultValues, steps as formSteps } from "./form-schema"
import {
    saveFormProgress,
    getFormProgress,
    clearFormProgress,
    saveCurrentStep,
    getCurrentStep,
} from "./progress-service"
import { toast } from "sonner"
import { addQuestion, updateQuestion } from "../apiCalls"
import TestCasesStep from "./steps/test-cases-step"

interface FormContainerProps {
    mode?: "create" | "edit"
    questionId?: string
    initialData?: Partial<FormValues>
}

export default function FormContainer({ mode = "create", questionId = "", initialData = {}}: FormContainerProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [isFullSolutionVerified, setIsFullSolutionVerified] = useState(false)

    // Initialize form with saved progress if available
    const form = useForm<FormValues>({
        resolver: zodResolver(formSteps[currentStep].schema),
        defaultValues: { ...defaultValues },
        mode: "onChange",
    })

    const dispatch = useAppDispatch()
    const router = useRouter()

    const getStorageKey = () => {
        return mode === "edit" && questionId ? `question_edit_${questionId}` : "question_create"
    }

    // Load saved progress on initial render
    useEffect(() => {
        const loadData = async () => {
            const storageKey = getStorageKey()
            const savedProgress = getFormProgress(storageKey)
            // If in edit mode and we have initialData, use that
            if (Object.keys(savedProgress).length > 0) {
                form.reset({ ...defaultValues, ...savedProgress })
                setCurrentStep(getCurrentStep(storageKey))
            } else {
                if (mode === "edit" && initialData) {
                    const formattedData = { ...initialData }
                    if (Array.isArray(formattedData.tags)) {
                        formattedData.tags = formattedData.tags.join(", ")
                    }
                    if(Array.isArray(formattedData.companies)){
                        formattedData.companies = formattedData.companies.join(", ")
                    }
                    form.reset({ ...defaultValues, ...formattedData })
                    // return
                }
            }
        }
        loadData()
    }, [form, initialData, mode, questionId])

    const onSubmit = async () => {
        setLoading(true)
        try {
            const allValues = form.getValues(); // Get all form values
            const tags = allValues.tags.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag !== "");
            const companies = allValues.companies.split(",").map((company: string) => company.trim()).filter((company: string) => company !== "");
            const simpleTestCases = JSON.parse(allValues.simpleTestCases);
            const mediumTestCases = JSON.parse(allValues.mediumTestCases);
            const largeTestCases = JSON.parse(allValues.largeTestCases);
            const data = {
                question: {...allValues, tags, companies, questionNo: initialData.questionNo},
                testCase: {simpleTestCases, mediumTestCases, largeTestCases}
            }
            let response;
            if (mode === "edit") {
                response = await updateQuestion(questionId, data);
            } else {
                response = await addQuestion(data);
            }
            await checkAuthorization(response, dispatch, router, true);
            alert(response + ". It will be updated after admin approval");
            // Clear saved progress after successful submission
            clearLocalData();
            router.back();
        } catch (error) {
            console.error("Error submitting question:", error);
            alert("Failed to submit question. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const saveProgress = async () => {
        try {
            // Get current form values
            const currentValues = form.getValues()

            // Save to localStorage
            saveFormProgress(currentValues, getStorageKey())
            saveCurrentStep(currentStep, getStorageKey())
            toast("Progress saved")
        } catch (error) {
            console.error("Error saving progress:", error)
            toast("Error saving progress")
        }
    }

    const clearLocalData = () => {
        clearFormProgress(getStorageKey())
        setCurrentStep(0)
        toast("Local data cleared, Please reload the page to get the latest data")
    }

    const nextStep = async () => {
        // Get the schema for the current step
        const currentSchema = formSteps[currentStep].schema
        // Validate only the fields in the current step
        const currentValues = form.getValues()
        const currentStepValues = Object.keys(currentSchema.shape).reduce(
            (acc, key) => {
                acc[key] = currentValues[key as keyof FormValues]
                return acc
            },
            {} as Record<string, unknown>,
        )
        // Parse with the current step's schema
        const result = currentSchema.safeParse(currentStepValues)
        console.log("Validation result:", result);
        
        if (result.success) {
            console.log("Step validated successfully");
            
            // Save progress before moving to next step
            await saveProgress()

            // Move to next step
            setCurrentStep((prev) => {
                const nextStep = Math.min(prev + 1, formSteps.length - 1)
                saveCurrentStep(nextStep)
                return nextStep
            })

            // Update form resolver for the new step
            form.clearErrors()
        } else {
            // Trigger validation to show errors
            console.error("Validation failed:", result.error.format());
            form.trigger()
        }
    }

    const prevStep = () => {
        setCurrentStep((prev) => {
            const prevStep = Math.max(prev - 1, 0)
            saveCurrentStep(prevStep)
            return prevStep
        })
    }

    const isLastStep = currentStep === formSteps.length - 1
    const isFullSolutionStep = currentStep === 4
    const isFirstStep = currentStep === 0

    // Render the current step component
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <BasicInfoStep form={form} isEditMode={mode === "edit"} />
            case 1:
                return <SampleTestCasesStep form={form} />
            case 2:
                return <CodeTemplatesStep form={form} />
            case 3:
                return <TestCasesStep form={form} />
            case 4:
                return <SolutionStep form={form} setIsFullSolutionVerified={setIsFullSolutionVerified} />
            case 5:
                return <TestConfigStep form={form} />
            default:
                return null
        }
    }

    return (
        <div className="container my-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between ">
                            <Button type="button" variant="outline" onClick={prevStep} disabled={isFirstStep}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                            </Button>
                            <CardTitle>{mode === "edit" ? "Edit Question" : "Submit New Question"}</CardTitle>
                        </CardHeader>

                        {/* Progress Bar */}
                        <div className="px-6">
                            <div className="relative">
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                                    <div
                                        style={{ width: `${(currentStep / (formSteps.length - 1)) * 100}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                                    ></div>
                                </div>
                                <div className="flex justify-between">
                                    {formSteps.map((step, index) => (
                                        <div key={step.id} className="flex flex-col items-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // Only allow going back or to completed steps
                                                    if (index <= currentStep) {
                                                        setCurrentStep(index)
                                                        saveCurrentStep(index, getStorageKey())
                                                    }
                                                }}
                                                className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                                                    index < currentStep
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : index === currentStep
                                                            ? "border-primary text-primary"
                                                            : "border-gray-300 dark:border-gray-600 text-gray-400",
                                                )}
                                            >
                                                {index < currentStep ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                                            </button>
                                            <span
                                                className={cn(
                                                    "text-xs mt-1 hidden sm:block",
                                                    index <= currentStep ? "text-primary font-medium" : "text-gray-500",
                                                )}
                                            >
                                                {step.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <CardContent className="space-y-4 pt-6">{renderStepContent()}</CardContent>

                        <CardFooter className="flex justify-between pt-2">
                            <Button type="button" variant="outline" onClick={prevStep} disabled={isFirstStep}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                            </Button>

                            {isLastStep ? (
                                loading ? (
                                    <Button type="submit" disabled>
                                        <CircleLoading color="bg-neutral-50" />
                                    </Button>
                                ) : (
                                    <Button type="submit">{mode === "edit" ? "Update Question" : "Submit Question"}</Button>
                                )
                            ) : (
                                <div className="flex gap-3">
                                    <Button type="button" variant="outline" onClick={clearLocalData}>Clear Local Data</Button>
                                    {/* <Button type="button" variant="outline" onClick={saveProgress} disabled={savingProgress}>
                                        {savingProgress ? (
                                            <CircleLoading color="bg-primary" />
                                        ) : (
                                            <Save className="mr-2 h-4 w-4" />
                                        )}
                                        Save Progress in Local
                                    </Button> */}
                                    <Button type="button" disabled={isFullSolutionStep && !isFullSolutionVerified} onClick={nextStep}>
                                        Save & Next <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    )
}

