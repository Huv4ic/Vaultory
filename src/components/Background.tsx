import React from 'react';

interface BackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const Background: React.FC<BackgroundProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`min-h-screen text-[#f0f0f0] relative ${className}`}
      style={{
        backgroundImage: 'url(/background-eye.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Затемнение фона для лучшей читаемости контента */}
      <div className="absolute inset-0 bg-[#121212]/85 backdrop-blur-[0.5px]"></div>
      
      {/* Градиентные акценты для глубины */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-transparent to-[#FFD700]/5 pointer-events-none"></div>
      
      {/* Тонкие неоновые линии для атмосферы */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/15 to-transparent"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent"></div>
      </div>
      
      {/* Контент */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Background;

