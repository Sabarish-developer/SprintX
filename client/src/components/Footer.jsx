const Footer = () => {
    return (
      <footer className="bg-white w-full text-black py-4 mt-10 border-t border-gray-300">
        <div className="text-center text-sm">
          &copy; {new Date().getFullYear()} <span className="font-semibold">SprintX</span> - All rights reserved.
        </div>
      </footer>
    );
  };
  
export default Footer;  