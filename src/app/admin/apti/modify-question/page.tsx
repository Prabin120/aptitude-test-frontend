"use client";

import ReduxProvider from "@/redux/redux-provider";
import EditQuestionPage from "./editQuestionPage";
import { withAdminAuth } from "@/components/withAdminAuth";

function Page() {
  return (
    <ReduxProvider>
      <EditQuestionPage />
    </ReduxProvider>
  )
}

export default withAdminAuth(Page);