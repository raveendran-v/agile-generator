
import React from 'react';
import { Moon, Sun, Zap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

const Header = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleStartOver = () => {
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm dark:shadow-modern">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-primary/10 dark:bg-primary/20">
            <Zap className="h-6 w-6 text-primary dark:text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-enhanced">
            Epics and Story Generator
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartOver}
            className="hover-enhanced flex items-center space-x-2 border-border/60 dark:border-border/70 dark:hover:bg-accent/20"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Start Over</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover-enhanced relative dark:hover:bg-accent/20"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
