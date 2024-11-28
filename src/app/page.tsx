'use client'
import HomePage from "@/app/home";
import Header from "@/components/header";
import Footer from "@/components/ui/footer";
import ReduxProvider from "@/redux/redux-provider";

export default function Home() {
  return (
    <ReduxProvider>
      <main className="m-auto dark">
        <Header/>
        <main className="flex justify-center">
          <HomePage/>
        </main>
        <Footer/>
      </main>
    </ReduxProvider>
  );
}
