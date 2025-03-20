import { useState } from "react";
import { useForm } from "react-hook-form";
import ReachUs from '../assets/ReachUs.png';

const ContactUs = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data) => {
        console.log("Form Data:", data);
        setIsSubmitted(true);  // Set form as submitted
        // Optionally reset the form if needed
        reset();
    };

    return (
        <>
            <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold text-center mt-8">Contact Us</h1>
            <div className="flex flex-col md:flex-row items-center justify-center mt-4 px-4">
                
                {/* Form Section or Success Message */}
                <div className="w-full md:w-1/2 p-6 shadow-lg rounded-lg min-h-[300px] flex items-center justify-center">
                    {isSubmitted ? (
                        <h2 className="text-2xl md:text-3xl text-center font-semibold text-[#a40ff3]">
                            Successfully Submitted, We Reach You Soon 😊.
                        </h2>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                            {/* Name */}
                            <input
                                {...register("name", { required: "Name is required" })}
                                type="text"
                                placeholder="Your Name"
                                className="p-2 border rounded"
                            />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

                            {/* Email */}
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

                            {/* Query Type */}
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

                            {/* Description */}
                            <textarea
                                {...register("description", { required: "Description is required" })}
                                placeholder="Your Message..."
                                className="p-2 border rounded h-24"
                            />
                            {errors.description && <p className="text-red-500">{errors.description.message}</p>}

                            {/* Submit Button */}
                            <button type="submit" className="bg-[#a40ff3] text-white py-2 rounded hover:bg-purple-500 transition-colors duration-200">
                                Submit
                            </button>
                        </form>
                    )}
                </div>

                {/* Image Section - Only visible on lg screen */}
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
};

export default ContactUs;