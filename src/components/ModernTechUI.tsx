
import React, { useState } from 'react';
import { Search, Menu, Bell, User, TrendingUp, Play, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ModernTechUI: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Trending');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    'Trending', 'Technology', 'AI & ML', 'Web Development', 
    'Mobile Apps', 'Cloud Computing', 'Cybersecurity', 'Data Science'
  ];

  const navItems = ['Home', 'Courses', 'Community', 'Resources', 'About'];

  const contentCards = [
    {
      id: 1,
      title: 'Advanced React Patterns & Architecture',
      description: 'Master modern React development with advanced patterns, hooks, and architectural decisions.',
      image: '/placeholder.svg',
      category: 'Web Development',
      duration: '4h 32m',
      rating: 4.9,
      students: '12.5k'
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals',
      description: 'Complete guide to ML algorithms, data preprocessing, and model deployment strategies.',
      image: '/placeholder.svg',
      category: 'AI & ML',
      duration: '6h 45m',
      rating: 4.8,
      students: '8.3k'
    },
    {
      id: 3,
      title: 'Cloud Architecture with AWS',
      description: 'Build scalable, secure cloud infrastructure using Amazon Web Services best practices.',
      image: '/placeholder.svg',
      category: 'Cloud Computing',
      duration: '5h 20m',
      rating: 4.9,
      students: '15.2k'
    },
    {
      id: 4,
      title: 'Mobile App Development with React Native',
      description: 'Create cross-platform mobile applications with modern React Native techniques.',
      image: '/placeholder.svg',
      category: 'Mobile Apps',
      duration: '7h 15m',
      rating: 4.7,
      students: '9.8k'
    },
    {
      id: 5,
      title: 'Cybersecurity Essentials',
      description: 'Learn essential security practices, threat detection, and vulnerability assessment.',
      image: '/placeholder.svg',
      category: 'Cybersecurity',
      duration: '3h 45m',
      rating: 4.8,
      students: '6.7k'
    },
    {
      id: 6,
      title: 'Data Science with Python',
      description: 'Analyze data, create visualizations, and build predictive models using Python.',
      image: '/placeholder.svg',
      category: 'Data Science',
      duration: '8h 30m',
      rating: 4.9,
      students: '11.4k'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--tech-content)' }}>
      {/* Navigation Bar */}
      <nav 
        className="sticky top-0 z-50 px-6 py-4 backdrop-blur-lg border-b"
        style={{ 
          backgroundColor: 'var(--tech-navy)',
          borderColor: 'var(--tech-border)'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">TechLearn</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses, tutorials..."
                className="search-input w-full pl-12 pr-4"
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-white hover:text-gray-300 transition-colors font-medium"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <User className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section 
        className="relative px-6 py-20 overflow-hidden"
        style={{ backgroundColor: 'var(--tech-navy)' }}
      >
        {/* Floating Gradient Shapes */}
        <div className="wave-shape w-32 h-32 top-10 right-20"></div>
        <div className="wave-shape w-20 h-20 top-32 left-10 animation-delay-2000"></div>
        <div className="wave-shape w-24 h-24 bottom-20 right-32 animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Master Technology</span>
            <br />
            <span className="text-white">Shape the Future</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Unlock your potential with cutting-edge courses in AI, web development, 
            cloud computing, and more. Join thousands of learners building tomorrow's tech.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="gradient-primary text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
              Start Learning Now
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full font-semibold"
            >
              Explore Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <TrendingUp className="w-6 h-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">Popular Categories</h2>
          </div>
          
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`pill-button ${activeCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Cards */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contentCards.map((card) => (
              <Card key={card.id} className="tech-card cursor-pointer group">
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="pill-button text-xs bg-white/90 backdrop-blur-sm">
                      {card.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:gradient-text transition-all duration-300">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {card.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{card.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{card.rating}</span>
                      </div>
                    </div>
                    <span className="font-medium">{card.students} students</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div 
            className="fixed top-0 right-0 h-full w-80 p-6"
            style={{ backgroundColor: 'var(--tech-navy)' }}
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-white font-bold text-xl">Menu</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-white hover:text-gray-300 transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
            
            <div className="mt-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input w-full pl-12 pr-4"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernTechUI;
