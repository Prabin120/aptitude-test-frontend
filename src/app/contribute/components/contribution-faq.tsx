"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ContributionFAQ() {
  const faqs = [
    {
      question: "What types of contributions can I make?",
      answer:
        "You can contribute coding challenges, algorithm problems, project ideas, or tutorial content. All contributions should be original and educational.",
    },
    {
      question: "How long does the review process take?",
      answer:
        "Our team typically reviews contributions within 3-5 business days. You'll receive a notification once your submission has been reviewed.",
    },
    {
      question: "How do I redeem my coins?",
      answer:
        "Navigate to the Rewards section where you can see all available redemption options. Select the reward you want and click 'Redeem Now'.",
    },
    {
      question: "Can I contribute if I'm a beginner?",
      answer:
        "We welcome contributions from all skill levels. Beginners often provide valuable perspectives that help other learners.",
    },
    {
      question: "What happens if my contribution is rejected?",
      answer:
        "If your contribution is rejected, you'll receive feedback explaining why. You can revise and resubmit your contribution based on this feedback.",
    },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Have questions about contributing? Find answers to common questions below.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between bg-gray-900 p-4 rounded-lg border border-gray-800 text-left"
            >
              <span className="font-medium text-lg">{faq.question}</span>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-gray-900/50 border-x border-b border-gray-800 rounded-b-lg text-gray-300">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
