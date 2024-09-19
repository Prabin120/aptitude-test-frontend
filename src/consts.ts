
export const apiEntryPoint = process.env.API_ENDPOINT

// auth
export const loginEndpoint = '/api/v1/auth/login'   // post
export const signupEndpoint = '/api/v1/auth/signup'   // post
export const changePasswordEndpoint = '/api/v1/auth/change-password'   // post
export const logoutEndpoint = '/api/v1/auth/logout'   // post
export const forgotPassword = '/api/v1/auth/forgot-password'   // post
export const resetPassword = '/api/v1/auth/reset-password'   // post


// profile
export const editProfile = '/api/v1/user/profile'   // put


// test
export const getTestEndpoint = '/api/v1/aptitude/test'   // get
export const postTestEndpoint = '/api/v1/aptitude/test'   // post
export const upComingTestEndpoint = '/api/v1/aptitude/upcoming-test'   // get
export const testRegistrationEndpoint = '/api/v1/aptitude/test-registration'   // post
export const scoreCardEndpoint = '/api/v1/aptitude/score-card'   // get