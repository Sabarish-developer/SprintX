import {React, forwardRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is SprintX?",
    answer: "SprintX is a lightweight, cloud-based Agile project management tool designed to help software teams plan, track, and deliver projects efficiently using sprints, epics, and tasks.",
  },
  {
    question: "Who can use SprintX?",
    answer: "Anyone! Whether you're a student team, a startup, or just exploring Agile, SprintX is beginner-friendly and easy to use.",
  },
  {
    question: "Is SprintX free to use?",
    answer: "Yes! SprintX is a student-built project and completely free to use. Just sign up and start managing your projects.",
  },
  {
    question: "Can I manage multiple projects with SprintX?",
    answer: "Absolutely. You can create and manage multiple projects, assign team members, and track progress through sprints and tasks.",
  },
  {
    question: "Is my data safe?",
    answer: "We take basic data security seriously. While SprintX is a student project, it follows good practices like authentication and role-based access."
  },
  {
    question: "Can I contribute or suggest improvements?",
    answer: "We’d love that! You can reach out to us through the contact section or our GitHub repo.",
  }
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