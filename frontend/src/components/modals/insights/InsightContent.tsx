import React from 'react';

interface InsightContentProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

const InsightContent: React.FC<InsightContentProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-3">
        <div className="relative w-18 h-18 rounded-full bg-gray-100 shadow-[6px_6px_12px_#d1d1d1,-6px_-6px_12px_#ffffff] flex items-center justify-center border border-gray-200/30">
          <span className="text-xl font-semibold text-gray-900">
            {title?.[0] || 'I'}
          </span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
        </div>
        <div className="flex flex-col items-start">
          <h4 className="text-base font-medium text-gray-900">{title || 'Insight'}</h4>
          <p className="text-sm text-gray-800">{subtitle || 'Details'}</p>
        </div>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default InsightContent;