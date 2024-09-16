'use client'
import HomePage from "@/components/component/home";
import Header from "@/components/ui/header";
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
