"use client";

import ReduxProvider from "@/redux/redux-provider";
import EditQuestionPage from "./editQuestionPage";
import { withCreatorAccess } from "@/components/withCreatorAccess";

function Page() {
  return (
    <ReduxProvider>
      <EditQuestionPage />
    </ReduxProvider>
  )
}

export default withCreatorAccess(Page);