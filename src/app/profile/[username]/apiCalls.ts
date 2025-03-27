import { codeProfile, getProfile } from "@/consts"
import { handleGetMethod } from "@/utils/apiCall"
import { userCodeProfile, UserData } from "./schema"

export const fetchCodeProfile = async (username: string) : Promise<{ userProfile: UserData, codingInfo: userCodeProfile }> => {
    try {
        const [userBasicInfo, codingInfo] = await Promise.all([
            handleGetMethod(getProfile, `username=${username}`),
            handleGetMethod(codeProfile+"/", `username=${username}`),
            // handleGetMethod(codeSubmissionStats+"/", `username=${username}`)
        ])


        if (!(userBasicInfo instanceof Response && userBasicInfo.ok) || 
            !(codingInfo instanceof Response && codingInfo.ok)) {
            throw new Error("Failed to fetch profile data")
        }

        const userInfo = await userBasicInfo.json()
        const codeInfo = await codingInfo.json()
        // const codeSubmission = await codeSubmissionInfo.json()

        // console.log("User Info:", codeSubmission);

        return { userProfile: userInfo.data, codingInfo: codeInfo.data }
    } catch (error) {
        console.error("Error fetching profile data:", error)
        throw error
    }
}