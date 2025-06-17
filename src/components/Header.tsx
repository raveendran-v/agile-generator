
import React, { useState } from 'react';
import { Moon, Sun, Zap, RotateCcw, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Header = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleStartOver = () => {
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 dark:border-stone-800 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur supports-[backdrop-filter]:bg-stone-50/60 dark:supports-[backdrop-filter]:bg-stone-900/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="h-7 w-7 text-purple-600" />
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Epics and Story Generator
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 flex items-center space-x-2"
              >
                <Info className="h-4 w-4 text-blue-600" />
                <span>About</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-purple-800">
                  <Zap className="h-6 w-6 text-purple-600" />
                  <span>About Epics and Story Generator</span>
                </DialogTitle>
                <DialogDescription className="text-left space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Epics and Story Generator is a professional-grade web application designed to automate the conversion of Business Requirement Documents (BRDs) into Agile epics and user stories. Built for product teams, Agile practitioners, and business analysts, the platform streamlines early-stage planning and improves collaboration across stakeholders.
                  </p>
                  <p>
                    Leveraging the power of LLaMA 3–70B via Groq, the system extracts and structures high-quality Agile artifacts—including epics, user stories, acceptance criteria, and readiness definitions—with support for iterative feedback and refinement.
                  </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartOver}
            className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4 text-green-600" />
            <span>Start Over</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-500" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
