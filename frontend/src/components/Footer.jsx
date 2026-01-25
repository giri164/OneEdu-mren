const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-lg font-semibold">OneEdu</p>
        <p className="text-sm text-gray-400 mt-2">
          &copy; {new Date().getFullYear()} Smart Career Guidance & Job Tracking Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
