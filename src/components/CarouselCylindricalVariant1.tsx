'use client';

import {
  type PanInfo,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useId, useEffect } from "react";
import { cn } from "../utils/cn";

export function CarouselCylindricalVariant1() {
  // Updated water conservation facts with better readability
  const flowFacts = [
    {
      title: "Copper Pipe Longevity",
      description: "Copper pipes last 50+ years in coastal homes. PVC degrades 4x faster in salt air, making copper the superior choice for Garden Route properties."
    },
    {
      title: "Water Conservation",
      description: "A dripping tap wastes 11,000+ litres per year — enough to fill a large swimming pool. Fixing leaks saves both water and money on your municipal bills."
    },
    {
      title: "Leak Detection Technology",
      description: "Modern thermal leak detection finds 94% of slab leaks within 15 minutes — no digging or demolition needed. This saves your floors, walls, and landscaping."
    },
    {
      title: "Root Intrusion Prevention",
      description: "70% of Garden Route homes have undetected tree root intrusions in drainage systems. Professional camera inspections prevent costly emergency repairs."
    },
    {
      title: "Workmanship Guarantee",
      description: "Our 7-year workmanship guarantee is the longest on the Garden Route. We stand behind every joint, fitting, and installation with confidence."
    }
  ];
  
  const cylinderWidth = 1600;
  const faceCount = flowFacts.length;
  const faceWidth = cylinderWidth / faceCount;
  const dragFactor = 0.04;
  const radius = cylinderWidth / (2 * Math.PI);

  const rotation = useMotionValue(0);
  const controls = useAnimation();
  const id = useId();

  // Auto-rotate - Very slow for readability
  useEffect(() => {
    const rotateCard = () => {
      controls.start({
        rotateY: rotation.get() + 360,
        transition: {
          duration: 35,
          ease: "linear",
        },
      });
    };

    const interval = setInterval(() => {
      rotateCard();
    }, 35000); // 35 seconds between rotations

    // Initial animation
    rotateCard();

    return () => clearInterval(interval);
  }, [controls, rotation]);

  const handleDrag = (_: unknown, info: PanInfo) => {
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    controls.start({
      rotateY: rotation.get() + info.velocity.x * dragFactor,
      transition: { type: "spring", stiffness: 60, damping: 20, mass: 0.1 },
    });
  };

  const transform = useTransform(rotation, (value) => {
    return `rotate3d(0, 1, 0, ${value}deg)`;
  });

  return (
    <div className="relative h-[420px] w-full overflow-hidden">
      <div
        className="flex h-full items-center justify-center"
        style={{
          perspective: "1600px",
          transformStyle: "preserve-3d",
          transform: "rotateX(0deg)",
        }}
      >
        <motion.div
          animate={controls}
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
          drag="x"
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{
            transform: transform,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
        >
          {flowFacts.map((fact, index) => {
            return (
              <div
                className="absolute flex h-full origin-center items-center justify-center"
                key={`fact-${id}-${index}`}
                style={{
                  width: `${faceWidth}px`,
                  transform: `rotateY(${
                    index * (360 / faceCount)
                  }deg) translateZ(${radius}px)`,
                }}
              >
                <div
                  className={cn(
                    "flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900/80 to-gray-950/90 rounded-2xl border"
                  )}
                  style={{
                    borderColor: index === 0 
                      ? "rgba(0,210,255,0.3)" 
                      : "rgba(255,255,255,0.1)",
                    boxShadow: index === 0 
                      ? "0 30px 60px rgba(0,210,255,0.2)"
                      : "0 15px 30px rgba(0,0,0,0.3)",
                    backdropFilter: "blur(20px)",
                    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                >
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 flex items-center justify-center mb-4">
                      <span className="text-5xl">{index === 0 ? "🔧" : index === 1 ? "💧" : index === 2 ? "🔍" : index === 3 ? "🌳" : "🛡️"}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mb-4 text-center text-white font-bold text-xl">
                    {fact.title}
                  </h3>

                  {/* Description */}
                  <p className="text-center text-white/90 text-base leading-relaxed max-w-[280px]">
                    {fact.description}
                  </p>

                  {/* Brand */}
                  <div className="mt-8 flex items-center justify-center space-x-3 text-xs">
                    <span className="w-2.5 h-2.5 bg-[#00D2FF] rounded-full"></span>
                    <span className="font-medium">GARDEN ROUTE</span>
                    <span className="w-0.5 h-0.5 bg-white/20 mx-1"></span>
                    <span className="font-medium">PLUMBING CO.</span>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

export default CarouselCylindricalVariant1;
