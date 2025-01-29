import Footer from "@/components/ui/footer";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen flex flex-col px-6">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 mx-auto text-center">Shipping Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. General Information</h2>
          <p className="mb-4">
            All orders are subject to product availability. If an item is not in stock at the time you place your order, we will notify you and refund you the total amount of your order, using the original method of payment.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Delivery Location</h2>
          <p className="mb-4">
            Items offered on our website are only available for delivery to addresses within [Country/Region]. Any shipments outside of [Country/Region] are not available at this time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Delivery Time</h2>
          <p className="mb-4">
            An estimated delivery time will be provided to you once your order is placed. Delivery times are estimates and commence from the date of shipping, rather than the date of order. Delivery times are to be used as a guide only and are subject to the acceptance and approval of your order.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Shipping Costs</h2>
          <p className="mb-4">
            Shipping costs are based on the weight of your order and the delivery method. To find out how much your order will cost, simply add the items you would like to purchase to your cart and proceed to the checkout page. Once at the checkout screen, shipping charges will be displayed.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Damaged Items in Transport</h2>
          <p className="mb-4">
            If there is any damage to the packaging on delivery, contact us immediately at [Email/Phone Number].
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Questions</h2>
          <p className="mb-4">
            If you have any questions about the delivery and shipment or your order, please contact us at [Email/Phone Number].
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

