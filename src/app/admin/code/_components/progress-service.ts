import type { FormValues } from "./form-schema"

// Default keys for localStorage
const DEFAULT_FORM_PROGRESS_KEY = "question_form_progress"
const DEFAULT_IS_VERIFIED_KEY = "is_verified_status";

// Save form progress to localStorage
export const saveFormProgress = (values: Partial<FormValues>, storageKey = DEFAULT_FORM_PROGRESS_KEY): void => {
  try {
    const existingProgress = getFormProgress(storageKey)
    const updatedProgress = { ...existingProgress, ...values }
    localStorage.setItem(storageKey, JSON.stringify(updatedProgress))
  } catch (error) {
    console.error("Error saving form progress:", error)
  }
}

// Get form progress from localStorage
export const getFormProgress = (storageKey = DEFAULT_FORM_PROGRESS_KEY): Partial<FormValues> => {
  try {
    const progress = localStorage.getItem(storageKey)
    return progress ? JSON.parse(progress) : {}
  } catch (error) {
    console.error("Error getting form progress:", error)
    return {}
  }
}

// Clear form progress from localStorage
export const clearFormProgress = (storageKey = DEFAULT_FORM_PROGRESS_KEY): void => {
  try {
    localStorage.removeItem(storageKey)
    localStorage.removeItem(getStepKey(storageKey))
    localStorage.removeItem(DEFAULT_IS_VERIFIED_KEY)
    removeIsVerifiedStatus()
  } catch (error) {
    console.error("Error clearing form progress:", error)
  }
}

// Get the step key based on the progress key
const getStepKey = (progressKey: string): string => {
  return progressKey + "_step"
}

// Save current step to localStorage
export const saveCurrentStep = (step: number, storageKey = DEFAULT_FORM_PROGRESS_KEY): void => {
  try {
    localStorage.setItem(getStepKey(storageKey), step.toString())
  } catch (error) {
    console.error("Error saving current step:", error)
  }
}

// Get current step from localStorage
export const getCurrentStep = (storageKey = DEFAULT_FORM_PROGRESS_KEY): number => {
  try {
    const step = localStorage.getItem(getStepKey(storageKey))
    return step ? Number.parseInt(step, 10) : 0
  } catch (error) {
    console.error("Error getting current step:", error)
    return 0
  }
}

// Save isVerified status to localStorage
export const saveIsVerifiedStatus = (status: { [key: string]: boolean }, storageKey = DEFAULT_IS_VERIFIED_KEY): void => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(status));
  } catch (error) {
    console.error("Error saving isVerified status:", error);
  }
};

// Get isVerified status from localStorage
export const getIsVerifiedStatus = (storageKey = DEFAULT_IS_VERIFIED_KEY): { [key: string]: boolean } => {
  try {
    const status = localStorage.getItem(storageKey);
    return status ? JSON.parse(status) : {};
  } catch (error) {
    console.error("Error getting isVerified status:", error);
    return {};
  }
};

// Reset isVerified status for a specific language
export const resetIsVerifiedForLanguage = (lang: string, storageKey = DEFAULT_IS_VERIFIED_KEY): void => {
  try {
    const status = getIsVerifiedStatus(storageKey);
    status[lang] = false;
    saveIsVerifiedStatus(status, storageKey);
  } catch (error) {
    console.error("Error resetting isVerified status for language:", error);
  }
};

const removeIsVerifiedStatus = (storageKey = DEFAULT_IS_VERIFIED_KEY): void => {
  try {
    const status = getIsVerifiedStatus(storageKey);
    localStorage.removeItem(storageKey);
    saveIsVerifiedStatus(status, storageKey);
  } catch (error) {
    console.error("Error removing isVerified status for language:", error);
  }
}
