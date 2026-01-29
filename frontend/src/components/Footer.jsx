const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 text-white py-4 mt-auto border-t border-gray-700">
      <div className="max-w-full mx-auto px-4 text-center">
        <p className="text-sm font-semibold">OneEdu</p>
        <p className="text-xs text-gray-400 mt-1">
          &copy; {new Date().getFullYear()} Smart Career Guidance & Job Tracking Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
