import Footer from '@/components/ui/footer'
import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col px-6">
      {/* <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">AptiCode</h1>
        </div>
      </header> */}

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 mx-auto text-center">Terms of Service</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-4">
            AptiCode provides users with access to its services. You are responsible for obtaining access to this service and that access may involve third-party fees (such as Internet service provider or airtime charges). You are responsible for those fees.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Conduct</h2>
          <p className="mb-4">
            You agree to use our service for lawful purposes only. You shall not post or transmit through our service any material which violates or infringes in any way upon the rights of others, or any material that is unlawful, threatening, abusive, defamatory, invasive of privacy or publicity rights, vulgar, obscene, profane or otherwise objectionable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Modifications to Terms</h2>
          <p className="mb-4">
            AptiCode reserves the right to change these conditions from time to time as it sees fit and your continued use of the site will signify your acceptance of any adjustment to these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Governing Law</h2>
          <p className="mb-4">
            These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </section>
      </main>

      <Footer/>
    </div>
  )
}

