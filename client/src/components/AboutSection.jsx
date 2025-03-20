import template from '../assets/template.png'

const AboutSection = () => {
  return (
    <section className="pb-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl lg:text-5xl text-black font-bold text-center mb-13">About Us</h2>
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img src={template} alt="About Us" className="rounded-lg shadow-lg" />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <p className="text-lg text-gray-700 mb-4">
              Welcome to our company! We are dedicated to providing the best service possible. Our team is passionate and committed to excellence.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Our mission is to deliver high-quality products that meet the needs of our customers. We believe in innovation, integrity, and customer satisfaction.
            </p>
            <p className="text-lg text-gray-700">
              Thank you for choosing us. We look forward to serving you and making a positive impact in your life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;