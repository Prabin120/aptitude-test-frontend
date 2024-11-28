
export const apiEntryPoint = process.env.NEXT_PUBLIC_API_ENDPOINT
export const codeCompileApiEntryPoint = process.env.NEXT_PUBLIC_CODE_COMPILER_ENDPOINT

// auth
export const loginEndpoint = '/api/v1/auth/login'   // post
export const signupEndpoint = '/api/v1/auth/signup'   // post
export const changePasswordEndpoint = '/api/v1/auth/change-password'   // post
export const logoutEndpoint = '/api/v1/auth/logout'   // post
export const forgotPassword = '/api/v1/auth/forgot-password'   // post
export const resetPassword = '/api/v1/auth/reset-password'   // post


// profile
export const editProfile = '/api/v1/user/profile'   // put


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
export const getTestEndpoint = '/api/v1/test'   // get
export const postTestEndpoint = '/api/v1/test'   // post
export const upComingTestEndpoint = '/api/v1/test/upcoming-test'   // get
export const testRegistrationEndpoint = '/api/v1/test/test-registration'   // post
export const scoreCardEndpoint = '/api/v1/test/score-card'   // get


// feedback
export const feedbackEndpoint = '/api/v1/feedback'   // post


// payment
export const paymentCreateOrderEndpoint = '/api/v1/payment/create-order'   // post
export const verifyPaymentEndpoint = '/api/v1/payment/verify-payment'   // post
