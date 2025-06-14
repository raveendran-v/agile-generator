
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Epics and Story Generator
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartOver}
            className="hover-enhanced flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Start Over</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover-enhanced relative"
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
