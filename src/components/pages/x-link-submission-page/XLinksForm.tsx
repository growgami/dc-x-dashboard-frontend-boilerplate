'use client'

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PaperAirplaneIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useXLinkSubmission } from '@/hooks/x-metrics/xLinkSubmission';

export default function LinksForm() {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const { submitXLink, isLoading, error, isSuccess } = useXLinkSubmission();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await submitXLink(value);
    if (!error) {
      setValue('');
    }
    // Release focus after submission
    inputRef.current?.blur();
    setIsFocused(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/background/main-page-background/pattern.svg"
          alt="Background Pattern"
          fill
          className={`object-cover opacity-30 transition-all duration-500 ${
            isFocused ? 'scale-110 blur-sm' : ''
          }`}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-8 left-8 flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:text-white"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Dashboard
        </button>

        {/* Form Container */}
        <div className="flex flex-col items-center">
          {/* Spotlight Container */}
          <div
            className={`relative rounded-lg bg-gradient-to-r from-white/20 to-gray-500/20 p-1 backdrop-blur-lg transition-all duration-500 ${
              isFocused ? 'scale-110' : 'scale-100'
            }`}
          >
            {/* Spotlight Ring */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white to-gray-500 opacity-20 blur-xl" />
            
            {/* Input Container */}
            <div className="relative rounded-lg bg-white/10 px-6 py-4 backdrop-blur-sm">
              <form onSubmit={handleSubmit}>
                <div className="relative flex items-center">
                  <div className="relative flex-1">
                    <label
                      className={`pointer-events-none absolute left-0 z-10 transition-all duration-200 ${
                        isFocused || value
                          ? '-top-15 left-35 text-xl text-white'
                          : 'top-1/2 -translate-y-1/2 text-lg text-white/50'
                      }`}
                    >
                      Enter your X link.
                    </label>
                    <input
                      ref={inputRef}
                      type="text"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="relative z-20 w-[300px] bg-transparent text-lg text-white outline-none md:w-[400px]"
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      disabled={isLoading}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className={`ml-2 rounded-full p-2 transition-colors duration-200 focus:outline-none
                      ${isLoading ? 'text-gray-500 cursor-not-allowed' : 'text-white/50 hover:text-white'}`}
                    aria-label="Submit link"
                  >
                    <PaperAirplaneIcon className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Messages Container - Outside the input container */}
          <div className="h-6 mt-2"> {/* Fixed height container for messages */}
            {error && (
              <div className="text-sm text-red-400">
                {error}
              </div>
            )}
            {isSuccess && (
              <div className="text-sm text-green-400">
                Link submitted successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
