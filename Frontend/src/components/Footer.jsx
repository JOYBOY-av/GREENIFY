import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-emerald-50/50 border-t border-emerald-100 mt-auto">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Greenify Logo" className="h-10 w-10 object-contain rounded-lg" />
              <span className="font-bold text-emerald-800 text-lg">Greenify</span>
            </div>
            <p className="text-sm text-emerald-700/60 max-w-xs">
              A gamified sustainability tracker for college students. Log actions, earn badges, and compete for the planet.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Support & Legal</p>
            <div className="flex flex-wrap gap-5">
              <Link to="/contact" className="text-base text-emerald-700 hover:text-emerald-900 transition">Contact Us</Link>
              <Link to="/donate" className="text-base text-emerald-700 hover:text-emerald-900 transition">Donate</Link>
              <Link to="/privacy" className="text-base text-emerald-700 hover:text-emerald-900 transition">Privacy Policy</Link>
              <Link to="/terms" className="text-base text-emerald-700 hover:text-emerald-900 transition">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-emerald-700/40">© {new Date().getFullYear()} Greenify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
