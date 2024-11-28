"use client";

import ReduxProvider from "@/redux/redux-provider";
import EditQuestionPage from "./editQuestionPage";

export default function Page() {
  return (
  <ReduxProvider>
      <EditQuestionPage />
  </ReduxProvider>
  )
}