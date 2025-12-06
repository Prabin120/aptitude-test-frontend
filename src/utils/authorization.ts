// apiUtils.ts
import { setAuthState } from "@/redux/auth/authSlice";
import { AppDispatch } from "@/redux/store";
import { setUserState, userInitialState } from "@/redux/user/userSlice";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { handleGetMethod } from "./apiCall";
import { apiEntryPoint, logoutEndpoint } from "@/consts";

export const checkAuthorization = async (
    response: Response,
    dispatch: AppDispatch,
    router?: AppRouterInstance,
    forward?: boolean
) => {
    if (response.status === 401 || response.status === 403) {
        await handleGetMethod(apiEntryPoint + logoutEndpoint);
        dispatch(setAuthState(false));
        dispatch(setUserState(userInitialState));
        if(router && forward) router.push("/login");
    } else if (response.status === 500) {
        console.error("Server Error");
    }
};