'use client'
import HomePage from "@/app/home";
import ReduxProvider from "@/redux/redux-provider";

export default function Home() {
  return (
    <ReduxProvider>
      <main className="m-auto dark">
        <main className="flex justify-center">
          <HomePage/>
        </main>
      </main>
    </ReduxProvider>
  );
}
