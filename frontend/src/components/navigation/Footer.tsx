import React from 'react';
import { Compass, Github, Linkedin, Twitter, Mail } from '../icons';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Commute Connect",
    "url": "https://commuteconnect.com",
    "logo": "https://commuteconnect.com/logo192.png",
    "sameAs": [
      "https://github.com",
      "https://linkedin.com",
      "https://x.com"
    ]
  };

  return (
    <footer className="bg-neutral-surface dark:bg-slate-900 border-t border-neutral-borderLine dark:border-slate-800 text-neutral-textMain dark:text-slate-350 py-12 px-6 mt-12 transition-colors duration-theme-normal shrink-0">
      {/* Schema Injection */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Section: Logo & Tagline */}
        <div className="col-span-1 md:col-span-4 space-y-4">
          <div className="flex items-center gap-2 text-brand-primary dark:text-blue-400 font-bold text-lg select-none">
            <Compass className="w-6 h-6 animate-pulse" />
            <span>Commute Connect</span>
          </div>
          <p className="text-small text-neutral-textSub dark:text-slate-400 max-w-sm leading-relaxed">
            Safe, reliable and affordable ride sharing for students and professionals.
          </p>
        </div>

        {/* Center Section: Navigations */}
        <div className="col-span-1 md:col-span-6 grid grid-cols-3 gap-6 sm:gap-4">
          {/* Company Column */}
          <div className="space-y-3">
            <h4 className="text-small font-bold text-neutral-textMain dark:text-slate-200 uppercase tracking-wider">
              Company
            </h4>
            <nav aria-label="Company links">
              <ul className="space-y-2 text-small">
                <li>
                  <a href="/about" className="text-neutral-textSub dark:text-slate-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors duration-theme-fast focus:outline-none focus:underline">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-neutral-textSub dark:text-slate-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors duration-theme-fast focus:outline-none focus:underline">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/careers" className="text-neutral-textSub dark:text-slate-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors duration-theme-fast focus:outline-none focus:underline">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-neutral-textSub dark:text-slate-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors duration-theme-fast focus:outline-none focus:underline">
                    Blog
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Legal Column */}
          <div className="space-y-3">
            <h4 className="text-small font-bold text-neutral-textMain dark:text-slate-200 uppercase tracking-wider">
              Legal
            </h4>
            <nav aria-label="Legal links">
              <ul className="space-y-2 text-small">
                <li>
                  <a href="/privacy" className="text-neutral-textSub dark:text-slate-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors duration-theme-fast focus:outline-none focus:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-neutral-textSub dark:text-slate-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors duration-theme-fast focus:outline-none focus:underline">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="text-neutral-textSub dark:text-slate-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors duration-theme-fast focus:outline-none focus:underline">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Support Column */}
          <div className="space-y-3">
            <h4 className="text-small font-bold text-neutral-textMain dark:text-slate-200 uppercase tracking-wider">
              Support
            </h4>
            <nav aria-label="Support links">
              <ul className="space-y-2 text-small">
                <li>
                  <a href="/help" className="text-neutral-textSub dark:text-slate-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors duration-theme-fast focus:outline-none focus:underline">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/safety" className="text-neutral-textSub dark:text-slate-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors duration-theme-fast focus:outline-none focus:underline">
                    Safety Guidelines
                  </a>
                </li>
                <li>
                  <a href="/report" className="text-neutral-textSub dark:text-slate-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors duration-theme-fast focus:outline-none focus:underline">
                    Report Issue
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-neutral-textSub dark:text-slate-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors duration-theme-fast focus:outline-none focus:underline">
                    FAQs
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Right Section: Social Connect */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <h4 className="text-small font-bold text-neutral-textMain dark:text-slate-200 uppercase tracking-wider">
            Connect
          </h4>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub page link" className="text-neutral-textSub dark:text-slate-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors duration-theme-fast focus:outline-none focus:ring-1 focus:ring-brand-primary p-1 rounded">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile link" className="text-neutral-textSub dark:text-slate-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors duration-theme-fast focus:outline-none focus:ring-1 focus:ring-brand-primary p-1 rounded">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter X profile link" className="text-neutral-textSub dark:text-slate-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors duration-theme-fast focus:outline-none focus:ring-1 focus:ring-brand-primary p-1 rounded">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="mailto:support@commuteconnect.com" aria-label="Support email contact link" className="text-neutral-textSub dark:text-slate-400 hover:text-brand-primary dark:hover:text-blue-400 transition-colors duration-theme-fast focus:outline-none focus:ring-1 focus:ring-brand-primary p-1 rounded">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Metadata Copyright Row */}
      <div className="max-w-7xl mx-auto border-t border-neutral-borderLine dark:border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-textSub dark:text-slate-500">
        <div className="space-y-1 text-center sm:text-left">
          <p>© {currentYear} Commute Connect. All rights reserved.</p>
          <p className="text-[10px] text-neutral-textSub/75 dark:text-slate-600">
            Built with React + Express + Supabase
          </p>
        </div>
        <div className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded border border-neutral-borderLine dark:border-slate-800">
          Version 1.0.0
        </div>
      </div>
    </footer>
  );
};
