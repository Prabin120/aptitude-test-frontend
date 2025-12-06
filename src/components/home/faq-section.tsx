"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

export default function FaqSection() {
  const faqs = [
    {
      question: "How do I create a group test?",
      answer:
        "Navigate to the Group Tests section, click on 'Create Test', and follow the instructions to set up your custom test. You can select questions, set time limits, and invite participants via email or a shareable link.",
    },
    {
      question: "How are global competitions scored?",
      answer:
        "Global competitions are scored based on correctness, efficiency, and completion time. Each problem has a maximum point value, and participants earn points based on their solution's quality and how quickly they submit it.",
    },
    {
      question: "What types of questions can I contribute?",
      answer:
        "You can contribute coding challenges, quantitative problems, or aptitude questions. All contributions should be original, educational, and include clear instructions, test cases, and solutions.",
    },
    {
      question: "How do I redeem my earned coins?",
      answer:
        "Visit the Rewards page to see all available redemption options. You can redeem coins for premium subscriptions, exclusive workshops, profile badges, and more. The minimum withdrawal amount is 100 coins.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "We're currently developing mobile apps for iOS and Android. In the meantime, our website is fully responsive and works great on mobile browsers.",
    },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Find answers to common questions about our platform and features.
          </motion.p>
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
      </div>
    </section>
  )
}
