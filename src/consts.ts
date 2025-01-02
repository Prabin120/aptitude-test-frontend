
export const apiEntryPoint = process.env.NEXT_PUBLIC_API_ENDPOINT ?? "https://apticode.in"
export const codeCompileApiEntryPoint = process.env.NEXT_PUBLIC_CODE_COMPILER_ENDPOINT ?? "https://apticode.in"

// auth
export const loginEndpoint = '/p/api/v1/auth/login'   // post
export const signupEndpoint = '/p/api/v1/auth/signup'   // post
export const changePasswordEndpoint = '/p/api/v1/auth/change-password'   // post
export const logoutEndpoint = '/p/api/v1/auth/logout'   // post
export const forgotPassword = '/p/api/v1/auth/forgot-password'   // post
export const resetPassword = '/p/api/v1/auth/reset-password'   // post
export const checkTokenValidation = "/s/is-authenticated"     // go server call
export const refreshToken = "/p/api/v1/auth/refresh-token"   // post
export const validAdminAccess = "/p/api/v1/auth/valid-admin-access"

// profile
export const editProfile = '/p/api/v1/user/profile'   // put
export const getProfile = '/p/api/v1/user/profile'   // get

// code
export const codeRunCode = "/s/run-code"
export const codeSubmitCode = "/s/submit-code"
export const getCodeSubmissions = "/s/code-submissions"
export const codeQuestion = "/s/question"
export const codeQuestions = "/s/questions"
export const codeValidateQuestionIds = "/s/test/validate-questions"

// test cases
export const testCases = "/s/test-cases"

// apti question
export const addAptiQuestionEndpoint = '/p/api/v1/aptitude/questions'   // post
export const getAptiQuestionEndpoint = '/p/api/v1/aptitude/question'   // get
export const modifyAptiQuestionEndpoint = '/p/api/v1/aptitude/question'   // put
export const getAllAptiQuestionsEndpoint = '/p/api/v1/aptitude/questions'   // put
export const getAptiQuestionByCategoryEndpoint = '/p/api/v1/aptitude/questions/category'   // post
export const getAptiQuestionByTopicEndpoint = '/p/api/v1/aptitude/questions/topic'   // post
export const getAptiQuestionByCompanyEndpoint = '/p/api/v1/aptitude/questions/company'   // post
export const addAptiQuestionTagEndpoint = '/p/api/v1/aptitude/question-tag'   // post
export const getAptiQuestionTagEndpoint = '/p/api/v1/aptitude/question-tag'   // get

// test
export const getTestsEndpoint = '/p/api/v1/test'   // get
export const postTestEndpoint = '/p/api/v1/test'   // post
export const submitTestEndpoint = '/p/api/v1/test/submit-test'   // post
export const upComingTestEndpoint = '/p/api/v1/test/upcoming-test'   // get
export const testRegistrationEndpoint = '/p/api/v1/test/test-registration'   // post
export const scoreCardEndpoint = '/p/api/v1/test/score-card'   // get
export const aptiValidateQuestionIds = "/p/api/v1/test/validate-questions"
export const getExamReport = "/p/api/v1/test/exam-report"

// feedback
export const feedbackEndpoint = '/p/api/v1/feedback'   // post

// payment
export const paymentCreateOrderEndpoint = '/p/api/v1/payment/create-order'   // post
export const verifyPaymentEndpoint = '/p/api/v1/payment/verify-payment'   // post

// OAuth2
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? '';
export const GET_VERIFY_GOOGLE_USER = '/p/api/v1/auth/google-login'