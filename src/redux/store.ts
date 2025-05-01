import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authReducer } from "./auth/authSlice";
import { userReducer } from "./user/userSlice";
import { aptitudeReducer } from "./testAnswers/aptiAnswers";
import { codingTestReducer } from "./testAnswers/codingAnswers";
import { userCodeReducer } from "./userCode/userCode";

// Configure which keys we want to persist
const authPersistConfig = {
    key: "auth",
    storage: storage,
    whitelist: ["authState"],
};

const userPersistConfig = {
    key: "user",
    storage: storage,
    whitelist: ["username", "name", "email", "image", "coins"],
};

const aptitudePersistConfig = {
    key: "aptitude",
    storage: storage,
};

const codingPersistConfig = {
    key: "coding",
    storage: storage,
    whitelist: [
        "questionNo",
        "code",
        "language",
        "passedTestCases",
        "totalTestCases",
        "questionKind",
    ],
};

const userCodePersistConfig = {
    key: "userCode",
    storage: storage,
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    user: persistReducer(userPersistConfig, userReducer),
    aptitude: persistReducer(aptitudePersistConfig, aptitudeReducer),
    coding: persistReducer(codingPersistConfig, codingTestReducer),
    userCode: persistReducer(userCodePersistConfig, userCodeReducer),
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
