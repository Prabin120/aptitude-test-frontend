import { random } from "lodash"
import * as z from "zod"

export const languageOptions = ["py", "java", "c", "cpp", "go"]

export const defaultCodeTemplates = Object.fromEntries(
  languageOptions.map((lang) => [lang, { precode: "", template: "", postcode: "" }]),
)

const codeTemplateSchema = z.object({
  precode: z.string().optional(),
  template: z.string().optional(),
  postcode: z.string().optional(),
})

// Step 1: Basic Info Schema
export const basicInfoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.string().default(""),
  companies: z.string().default(""),
  questionNo: z.number().positive("Question number must be positive"),
})

// Step 2: Sample Test Cases Schema
export const sampleTestCasesSchema = z.object({
  testCaseVariableNames: z.string(),
  sampleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      }),
    )
    .min(1, "At least one sample test case is required"),
})

// Step 3: Code Templates Schema
export const codeTemplatesSchema = z.object({
  codeTemplates: z.record(codeTemplateSchema),
})

// Step 4: Solution Schema
export const solutionSchema = z.object({
  fullSolutions: z.record(z.string().min(1, "Solution is required")),
  timeLimits: z.record(z.number().positive("Time limit must be positive")),
  memoryLimits: z.record(z.number().positive("Memory limit must be positive")),
})

// Step 5: Test Configuration Schema
export const testConfigSchema = z.object({
  isPublic: z.boolean(),
})

// Step 5: Test Cases Schema (New)
export const testCasesSchema = z.object({
  simpleTestCases: z.string().min(1, "Simple test cases are required"),
  mediumTestCases: z.string().min(1, "Medium test cases are required"),
  largeTestCases: z.string().min(1, "Large test cases are required"),
})

// Combined schema for the entire form
export const formSchema = basicInfoSchema
  .merge(sampleTestCasesSchema)
  .merge(codeTemplatesSchema)
  .merge(solutionSchema)
  .merge(testCasesSchema)
  .merge(testConfigSchema)

// Types for each step
export type BasicInfoValues = z.infer<typeof basicInfoSchema>
export type SampleTestCasesValues = z.infer<typeof sampleTestCasesSchema>
export type CodeTemplatesValues = z.infer<typeof codeTemplatesSchema>
export type SolutionValues = z.infer<typeof solutionSchema>
export type TestCasesValues = z.infer<typeof testCasesSchema>
export type TestConfigValues = z.infer<typeof testConfigSchema>

// Type for the entire form
export type FormValues = z.infer<typeof formSchema>

// Default values for each step
export const defaultBasicInfo: BasicInfoValues = {
  title: "",
  description: "<p>You can start from here</p>",
  difficulty: "medium",
  tags: "",
  companies: "",
  questionNo: random(1, 100), 
}

export const defaultSampleTestCases: SampleTestCasesValues = {
  testCaseVariableNames: "",
  sampleTestCases: [{ input: "", output: "" }],
}

export const defaultCodeTemplatesValues: CodeTemplatesValues = {
  codeTemplates: Object.fromEntries(languageOptions.map((lang) => [lang, { precode: "", template: "", postcode: "" }])),
}

export const defaultSolution: SolutionValues = {
  fullSolutions: Object.fromEntries(languageOptions.map((lang) => [lang, ""])),
  timeLimits: Object.fromEntries(languageOptions.map((lang) => [lang, 1])), // Default time limit for each language
  memoryLimits: Object.fromEntries(languageOptions.map((lang) => [lang, 2])), // Default memory limit for each language
}

export const defaultTestConfig: TestConfigValues = {
  isPublic: true,
}

export const defaultTestCases: TestCasesValues = {
  simpleTestCases: JSON.stringify(
    [
      {
        input: "",
        output: "",
      },
    ],
    null,
    2,
  ),
  mediumTestCases: JSON.stringify(
    [
      {
        input: "",
        output: "",
      },
    ],
    null,
    2,
  ),
  largeTestCases: JSON.stringify(
    [
      {
        input: "",
        output: "",
      },
    ],
    null,
    2,
  ),
}

// Combined default values
export const defaultValues: FormValues = {
  ...defaultBasicInfo,
  ...defaultSampleTestCases,
  ...defaultCodeTemplatesValues,
  ...defaultSolution,
  ...defaultTestCases,
  ...defaultTestConfig,
}

// Step definitions with their schemas
export const steps = [
  {
    id: "basic-info",
    name: "Basic Info",
    schema: basicInfoSchema,
    defaultValues: defaultBasicInfo,
  },
  {
    id: "sample-testcases",
    name: "Sample Test Cases",
    schema: sampleTestCasesSchema,
    defaultValues: defaultSampleTestCases,
  },
  {
    id: "code-templates",
    name: "Code Templates",
    schema: codeTemplatesSchema,
    defaultValues: defaultCodeTemplatesValues,
  },
  {
    id: "test-cases",
    name: "Test Cases",
    schema: testCasesSchema,
    defaultValues: defaultTestCases,
  },
  {
    id: "solution",
    name: "Full Solution",
    schema: solutionSchema,
    defaultValues: defaultSolution,
  },
  {
    id: "test-config",
    name: "Test Configuration",
    schema: testConfigSchema,
    defaultValues: defaultTestConfig,
  },
]

