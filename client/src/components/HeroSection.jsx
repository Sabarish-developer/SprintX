import { ArrowRight } from "lucide-react"
import { CirclePlay } from 'lucide-react'
import { MoveRight } from "lucide-react"
import template from '../assets/template.png'
import {motion} from 'framer-motion'

const HeroSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-white"
    >
    <div className="flex flex-col items-center bg-transparent">
        <div className="flex justify-center">
            <a href="#" className="inline-flex items-center gap-2 inline-block text-sm font-semibold text-[#a40ff3] bg-[#f3e9fd] py-2 px-6 shadow-md rounded-full hover:bg-[#e9d7fb] transition-colors duration-200">
                Super Charge your Agile Workflow!<MoveRight size={23} color="#a40ff3" />
            </a>
        </div>
        <h1 className="font-[Arial] mt-13 text-3xl lg:text-6xl tracking-wide font-bold text-center">
            Accelerate your Agile<br/> Streamline your success!!!
        </h1>
        <p className='mt-13 text-center text-neutral-500 max-w-4xl'>
        Stay ahead with SprintX, the ultimate Scrum project management tool. Plan, track progress,
         and collaborate effortlessly-all in one place. Boost your productivity by 16X.
        </p>
        <div className="flex flex-col lg:flex-row justify-center my-13 gap-5 lg:gap-20">
            <a href="#" className="inline-flex items-center gap-2 text-black border-n shadow-md bg-[#a40ff3] text-white rounded-r-full rounded-l-full px-3 py-1 hover:bg-white hover:text-[#a40ff3] transition-colors duration-200 group">Get Started<span><ArrowRight size={25} className="text-white group-hover:text-[#a40ff3] transition-colors duration-200" /></span></a>
            <a href="#" className="inline-flex items-center gap-2 text-black border-n rounded-r-full rounded-l-full shadow-lg px-3 py-1 hover:bg-[#a40ff3] hover:text-white transition-colors duration-200 group"><CirclePlay size={32} className="text-black group-hover:text-white transition-colors duration-200" />Watch Demo</a>
        </div>
        <img src={template} alt="dashboard" className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg object-cover"/>
    </div>
    </motion.div>
  )
}

export default HeroSection