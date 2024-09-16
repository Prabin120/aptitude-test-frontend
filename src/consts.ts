export const apiEntryPoint = 'http://localhost:8000'


// auth
export const loginEndpoint = '/api/v1/auth/login'   // post
export const signupEndpoint = '/api/v1/auth/signup'   // post
export const changePasswordEndpoint = '/api/v1/auth/change-password'   // post


// profile
export const editProfile = '/api/v1/user/profile'   // put


// test
export const getTestEndpoint = '/api/v1/aptitude/test'   // get
export const postTestEndpoint = '/api/v1/aptitude/test'   // post
export const upComingTest = '/api/v1/aptitude/upcoming-test'   // get
export const testRegistration = '/api/v1/aptitude/test-registration'   // post
export const scoreCard = '/api/v1/aptitude/score-card'   // get