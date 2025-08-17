import React from 'react';
import { Card } from './Card';

// Fancy gradient wrapper with an inner Card. Use CardHeader/CardContent/... inside as usual.
export const FancyCard = ({ children, className = '', wrapperClassName = '', hover = true }) => {
  const hoverClasses = hover
    ? 'hover:from-indigo-500/30 hover:via-purple-500/30 hover:to-pink-500/30 hover:-translate-y-1 hover:shadow-xl'
    : '';
  return (
    <div
      className={`group relative rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-[1px] transition-all duration-300 ${hoverClasses} ${wrapperClassName}`}
    >
  <Card className={`p-0 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg ${className}`}>
        {children}
      </Card>
    </div>
  );
};

export default FancyCard;
