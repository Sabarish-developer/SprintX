import {React, forwardRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is the purpose of this Contact Us form?",
    answer: "This form allows users to send queries or support requests directly to our team, and we will respond via email shortly.",
  },
  {
    question: "Will I get a confirmation after submitting the form?",
    answer: "Yes, after submitting the form, you will see a success message on the screen and receive an email confirmation if needed.",
  },
  {
    question: "Is my data safe when I fill out the form?",
    answer: "Absolutely. We use secure services to handle your data and do not share your information with third parties.",
  },
  {
    question: "Can I submit multiple queries?",
    answer: "Yes, you can click on 'Submit Another Response' after your first query to send more messages.",
  },
];

const Faq = forwardRef((props, ref) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div ref={ref} className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg shadow-sm transition-all duration-200"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left px-4 py-3 font-medium text-lg hover:cursor-pointer"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`}
              />
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-700 text-base">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default Faq;