import {React, forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "emailjs-com";
import ReachUs from "../assets/ReachUs.png";

const ContactUs = forwardRef((props, ref) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data) => {
        // Send Email
        emailjs.send(
            "your_service_id",         // Replace with your actual Service ID
            "your_template_id",        // Replace with your actual Template ID
            data,
            "your_public_key"          // Replace with your actual Public Key
        )
        .then(
            (result) => {
                console.log("Email successfully sent!", result.text);
                setIsSubmitted(true);
                reset();
            },
            (error) => {
                console.error("Email send error:", error.text);
            }
        );
    };

    const handleAnotherResponse = () => {
        setIsSubmitted(false);
    };

    return (
        <>
            <h1 ref={ref} className="text-3xl md:text-5xl font-bold text-center mt-8">Contact Us</h1>
            <div className="flex flex-col md:flex-row items-center justify-center mt-4 px-4">
                <div className="w-full md:w-1/2 p-6 shadow-lg rounded-lg min-h-[300px] flex items-center justify-center mb-8">
                    {isSubmitted ? (
                        <div className="text-center">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#a40ff3] mb-4">
                                Successfully Submitted, We’ll Reach You Soon 😊.
                            </h2>
                            <button
                                className="bg-[#a40ff3] text-white py-2 px-6 rounded hover:bg-purple-500 transition-colors duration-200"
                                onClick={handleAnotherResponse}
                            >
                                Submit Another Response
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                            <input
                                {...register("name", { required: "Name is required" })}
                                type="text"
                                placeholder="Your Name"
                                className="p-2 border rounded"
                            />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
                                })}
                                type="email"
                                placeholder="Your Email"
                                className="p-2 border rounded"
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input {...register("queryType")} type="radio" value="general" className="mr-2" />
                                    General
                                </label>
                                <label className="flex items-center">
                                    <input {...register("queryType")} type="radio" value="support" className="mr-2" />
                                    Support
                                </label>
                            </div>

                            <textarea
                                {...register("description", { required: "Description is required" })}
                                placeholder="Your Message..."
                                className="p-2 border rounded h-24"
                            />
                            {errors.description && <p className="text-red-500">{errors.description.message}</p>}

                            <button
                                type="submit"
                                className="bg-[#a40ff3] text-white py-2 rounded hover:bg-purple-500 transition-colors duration-200"
                            >
                                Submit
                            </button>
                        </form>
                    )}
                </div>

                <div className="hidden lg:block w-1/3 p-6">
                    <img
                        alt="Reach Us"
                        src={ReachUs}
                        className="w-60 h-auto mx-auto hover:scale-105 transition-transform duration-200"
                    />
                </div>
            </div>
        </>
    );
});

export default ContactUs;