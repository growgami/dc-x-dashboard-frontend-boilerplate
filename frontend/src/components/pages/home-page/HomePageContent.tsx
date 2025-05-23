'use client';

import { useEffect, useRef, useMemo } from 'react';

import gsap from 'gsap';
import Image from 'next/image';
import SplitType from 'split-type';
import FooterNav from './FooterNav';
import ScrollArrow from './auxiliaries/ScrollArrow';
import {
  Grid1Card,
  Grid2Card,
  Grid6Card,
  Grid7Card,
  Grid9Card,
  Grid10Card,
  Grid11Card,
  Grid12Card,
  Grid13Card,
} from '../../ui/cards/grid';
import Grid3Card from '../../../features/x-metrics/component/Grid3Card';
import Grid4Card from '../../../features/x-metrics/component/Grid4Card';
import Grid5Card from '../../../features/discord-metrics/components/Grid5Card';
import Grid8Card from '../../../features/discord-metrics/components/Grid8Card';
import { motion } from 'framer-motion';
import InsightsModal from '../../modals/insights/InsightsModal';
import { useInsightsModal } from '@/context/InsightsModalContext';
// Add global style to hide scrollbars
const globalStyles = `
  html, body {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  html::-webkit-scrollbar,
  body::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }
`;



const HomePageContent = () => {
  console.log('HomePageContent mounted')
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const initialTextRef = useRef<HTMLDivElement>(null);
  const blackBgRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Create refs for all grid cards
  const grid1Ref = useRef<HTMLDivElement>(null);
  const grid2Ref = useRef<HTMLDivElement>(null);
  const grid3Ref = useRef<HTMLDivElement>(null);
  const grid4Ref = useRef<HTMLDivElement>(null);
  const grid5Ref = useRef<HTMLDivElement>(null);
  const grid6Ref = useRef<HTMLDivElement>(null);
  const grid7Ref = useRef<HTMLDivElement>(null);
  const grid8Ref = useRef<HTMLDivElement>(null);
  const grid9Ref = useRef<HTMLDivElement>(null);
  const grid10Ref = useRef<HTMLDivElement>(null);
  const grid11Ref = useRef<HTMLDivElement>(null);
  const grid12Ref = useRef<HTMLDivElement>(null);
  const grid13Ref = useRef<HTMLDivElement>(null);

  // Memoize the gridRefs array to prevent recreation
  const gridRefs = useMemo(() => [
    grid1Ref, grid2Ref, grid3Ref, grid4Ref, grid5Ref, grid6Ref, grid7Ref,
    grid8Ref, grid9Ref, grid10Ref, grid11Ref, grid12Ref, grid13Ref
  ], []); // Empty dependency array since refs never change

  // Get modal controls from context
  const { modalOpen, selectedCard, openModal, closeModal } = useInsightsModal();

  // Handler for grid card click using context
  const handleGridCardClick = (cardId: string) => {
    openModal(cardId);
  };

  useEffect(() => {
    if (!containerRef.current || !textRef.current || !initialTextRef.current || !blackBgRef.current) return;

    // Initially hide all grid cards
    gridRefs.forEach(ref => {
      if (ref.current) {
        gsap.set(ref.current, { opacity: 0 });
      }
    });

    // Split the initial text into characters
    const splitText = new SplitType(initialTextRef.current, {
      types: 'chars',
      absolute: false
    });

    // Split the main heading text
    const mainText = new SplitType(textRef.current, {
      types: 'words',
      absolute: false
    });

    // Animate each character with fade in
    const chars = splitText.chars;
    if (chars) {
      chars.forEach((char, i) => {
        gsap.fromTo(char,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.3,
            delay: i * 0.1,
          }
        );
      });
    }

    // Start the main animation after all characters are shown
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" }
    });

    tl.to(blackBgRef.current, {
      opacity: 0,
      duration: 1.5,
      delay: 2
    })
    .to(initialTextRef.current, {
      duration: 1.5,
    }, "<") // Start at the same time as the fade out
    .fromTo(mainText.words,
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.15,
      },
      "-=1"
    );

    // Create a sub-timeline for grid animations that starts with the text animation
    const gridTimeline = gsap.timeline({
      defaults: { ease: "power2.out" }
    });

    // Define the animation sequence order
    const animationSequence = [
      grid1Ref, grid2Ref, grid3Ref, grid5Ref, grid6Ref,
      grid4Ref, grid8Ref, grid7Ref, grid9Ref, grid10Ref,
      grid11Ref, grid12Ref, grid13Ref
    ];

    // Add sequential fade-in animations for each grid card in the specified order
    animationSequence.forEach((ref) => {
      gridTimeline.fromTo(ref.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
        },
        "<+=0.05" // Start 0.05s after the previous animation starts
      );
    });

    // Add the grid timeline to the main timeline, starting slightly after the text begins
    tl.add(gridTimeline, "-=0.6")
      .call(() => {
        // Enable scrolling after all animations complete
        document.body.style.overflow = 'auto';
        document.body.classList.remove('no-scroll');
      });

  }, [gridRefs]); // Add gridRefs to dependencies for ESLint compliance

  const handleScrollToFooter = () => {
    footerRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleScrollToTop = () => {
    heroRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <>
      <style jsx global>{globalStyles}</style>
      <motion.div 
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          ref={blackBgRef}
          className="fixed inset-0 bg-black z-[100] pointer-events-none"
        >
          <Image
            src="/assets/background/initial/blacked.svg"
            alt="Initial background"
            fill
            className="object-cover"
            priority
          />
          <div
            ref={initialTextRef}
            className="absolute inset-0 flex items-center justify-center origin-center"
          >
            <h2 className="text-2xl font-light text-white tracking-[1em] z-10 font-space-grotesk uppercase">
              Growgami
            </h2>
          </div>
        </div>

        <div 
          ref={containerRef}
          className="absolute inset-0 flex flex-col justify-between z-20"
        >
          <Image
            src="/assets/background/main-page-background/pattern.svg"
            alt="Background pattern"
            fill
            className="object-cover opacity-30 -z-10"
            priority
          />
          
          <div className="grid grid-cols-5 grid-rows-6 gap-4 p-8 h-full">
            <Grid1Card ref={grid1Ref} onClick={() => handleGridCardClick('1')} />
            <Grid2Card ref={grid2Ref} onClick={() => handleGridCardClick('2')} />
            <Grid3Card ref={grid3Ref} onClick={() => handleGridCardClick('3')} />
            <Grid4Card ref={grid4Ref} onClick={() => handleGridCardClick('4')} />
            <Grid5Card ref={grid5Ref} onClick={() => handleGridCardClick('5')} />
            <Grid6Card ref={grid6Ref} onClick={() => handleGridCardClick('6')} />
            <Grid7Card ref={grid7Ref} onClick={() => handleGridCardClick('7')} />
            <Grid8Card 
              ref={grid8Ref} 
              onClick={() => handleGridCardClick('8')} 
              isOpen={modalOpen && selectedCard === '8'} 
              onOpenChange={(open) => !open && closeModal()} 
            />
            <Grid9Card ref={grid9Ref} onClick={() => handleGridCardClick('9')} />
            <Grid10Card ref={grid10Ref} onClick={() => handleGridCardClick('10')} />
            <Grid11Card ref={grid11Ref} onClick={() => handleGridCardClick('11')} />
            <Grid12Card ref={grid12Ref} onClick={() => handleGridCardClick('12')} />
            <Grid13Card ref={grid13Ref} onClick={() => handleGridCardClick('13')} />

            <div className="absolute bottom-12 left-20">
              <h1
                ref={textRef}
                className="text-[8rem] leading-[7rem] font-bold text-black tracking-wider relative text-left font-syne -z-10"
              >
                CLIENT
                <br />
                DASHBOARD
              </h1>
            </div>
          </div>
        </div>
      </motion.div>
      
      <ScrollArrow 
        onReveal={handleScrollToFooter}
        onScrollUp={handleScrollToTop}
      />
      
      <div 
        ref={footerRef} 
        className="h-20 bg-white"
      >
        <FooterNav />
      </div>
    {/* InsightsModal for grid card details */}
    <InsightsModal 
      open={modalOpen} 
      onClose={closeModal} 
      selectedCardId={selectedCard || undefined}
    />
    </>
  );
};

export default HomePageContent;
