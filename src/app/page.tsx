import HomePage from "@/components/component/home";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function Home() {
  return (
    <main className="m-auto">
      <Header/>
      <main className="flex justify-center">
        <HomePage/>
      </main>
      <Footer/>
    </main>
  );
}
