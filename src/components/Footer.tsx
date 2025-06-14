
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-8 mt-16 border-t border-stone-200 dark:border-stone-800">
      <div className="container mx-auto px-4">
        <div className="text-right">
          <p className="text-stone-500 dark:text-stone-400 font-serif">
            Powered by LLaMA 3 70B via Groq
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
