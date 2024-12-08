'use client'
import HomePage from "@/app/home";
import Footer from "@/components/ui/footer";
import ReduxProvider from "@/redux/redux-provider";

export default function Home() {
  return (
    <ReduxProvider>
      <main className="m-auto dark">
        <main className="flex justify-center">
          <HomePage/>
        </main>
        <Footer/>
      </main>
    </ReduxProvider>
  );
}
