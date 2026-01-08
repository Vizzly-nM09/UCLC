'use client';
import React, { useState, useEffect, useRef, memo } from 'react';

// Animated Number Component
export const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0); 
  const startTime = useRef<number>(0);
  const startValue = useRef<number>(0); 
  const targetValue = useRef<number>(value);
  const animationFrame = useRef<number>(0);

  useEffect(() => {
    startValue.current = displayValue;
    targetValue.current = value;
    startTime.current = 0; 

    const animate = (time: number) => {
      if (!startTime.current) startTime.current = time;
      const progress = (time - startTime.current) / 1000; 

      if (progress < 1) {
        const ease = 1 - Math.pow(2, -10 * progress);
        const current = startValue.current + (targetValue.current - startValue.current) * ease;
        setDisplayValue(Math.floor(current)); 
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue.current);
      }
    };

    animationFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame.current);
  }, [value]); 

  return <span>{displayValue}</span>;
};

// Stat Card Component
export const StatCard = memo(({ title, value, icon: Icon, color, isPercent = false, darkMode }: any) => (
    <div className={`group relative p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden
      ${darkMode ? 'bg-[#1c1c24] border-gray-700' : 'bg-white border-white shadow-sm'}
    `}>
        <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 group-hover:scale-125 transition-transform duration-500 ${color}`}></div>
        <div className="flex items-center justify-between relative z-10">
            <div>
                <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
                <h3 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <AnimatedNumber value={value} />{isPercent && <span className="text-lg">%</span>}
                </h3>
            </div>
            <div className={`p-2.5 rounded-xl ${color} text-white shadow-md`}><Icon /></div>
        </div>
    </div>
));
StatCard.displayName = "StatCard";