
export const apiEntryPoint = process.env.NEXT_PUBLIC_API_ENDPOINT ?? "http://localhost:8000"
export const codeCompileApiEntryPoint = process.env.NEXT_PUBLIC_CODE_COMPILER_ENDPOINT ?? "http://localhost:8080"

// auth
export const loginEndpoint = '/api/v1/auth/login'   // post
export const signupEndpoint = '/api/v1/auth/signup'   // post
export const changePasswordEndpoint = '/api/v1/auth/change-password'   // post
export const logoutEndpoint = '/api/v1/auth/logout'   // post
export const forgotPassword = '/api/v1/auth/forgot-password'   // post
export const resetPassword = '/api/v1/auth/reset-password'   // post
export const checkTokenValidation = "/is-authenticated"     // go server call
export const refreshToken = "/api/v1/auth/refresh-token"   // post

// profile
export const editProfile = '/api/v1/user/profile'   // put

// code
export const codeRunCode = "/run-code"
export const codeSubmitCode = "/submit-code"
export const getCodeSubmissions = "/code-submissions"
export const codeQuestion = "/question"
export const codeQuestions = "/questions"
export const codeValidateQuestionIds = "/test/validate-questions"

// test cases
export const testCases = "/test-cases"

// apti question
export const addAptiQuestionEndpoint = '/api/v1/aptitude/questions'   // post
export const getAptiQuestionEndpoint = '/api/v1/aptitude/question'   // get
export const modifyAptiQuestionEndpoint = '/api/v1/aptitude/question'   // put
export const getAllAptiQuestionsEndpoint = '/api/v1/aptitude/questions'   // put
export const getAptiQuestionByCategoryEndpoint = '/api/v1/aptitude/questions/category'   // post
export const getAptiQuestionByTopicEndpoint = '/api/v1/aptitude/questions/topic'   // post
export const getAptiQuestionByCompanyEndpoint = '/api/v1/aptitude/questions/company'   // post
export const addAptiQuestionTagEndpoint = '/api/v1/aptitude/question-tag'   // post
export const getAptiQuestionTagEndpoint = '/api/v1/aptitude/question-tag'   // get

// test
export const getTestsEndpoint = '/api/v1/test'   // get
export const postTestEndpoint = '/api/v1/test'   // post
export const submitTestEndpoint = '/api/v1/test/submit-test'   // post
export const upComingTestEndpoint = '/api/v1/test/upcoming-test'   // get
export const testRegistrationEndpoint = '/api/v1/test/test-registration'   // post
export const scoreCardEndpoint = '/api/v1/test/score-card'   // get
export const aptiValidateQuestionIds = "/api/v1/test/validate-questions"
export const getExamReport = "/api/v1/test/exam-report"

// feedback
export const feedbackEndpoint = '/api/v1/feedback'   // post

// payment
export const paymentCreateOrderEndpoint = '/api/v1/payment/create-order'   // post
export const verifyPaymentEndpoint = '/api/v1/payment/verify-payment'   // post
