"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

// Sonic Waveform Canvas Component
const SonicWaveformCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        const draw = () => {
            ctx.fillStyle = 'rgba(23, 23, 23, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const lineCount = 60;
            const segmentCount = 80;
            const height = canvas.height / 2;
            
            for (let i = 0; i < lineCount; i++) {
                ctx.beginPath();
                const progress = i / lineCount;
                const colorIntensity = Math.sin(progress * Math.PI);
                ctx.strokeStyle = `rgba(245, 158, 11, ${colorIntensity * 0.5})`;
                ctx.lineWidth = 1.5;

                for (let j = 0; j < segmentCount + 1; j++) {
                    const x = (j / segmentCount) * canvas.width;
                    
                    // Mouse influence
                    const distToMouse = Math.hypot(x - mouse.x, (height) - mouse.y);
                    const mouseEffect = Math.max(0, 1 - distToMouse / 400);

                    // Wave calculation
                    const noise = Math.sin(j * 0.1 + time + i * 0.2) * 20;
                    const spike = Math.cos(j * 0.2 + time + i * 0.1) * Math.sin(j * 0.05 + time) * 50;
                    const y = height + noise + spike * (1 + mouseEffect * 2);
                    
                    if (j === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }

            time += 0.02;
            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        
        resizeCanvas();
        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full bg-background" />;
};


// The main hero component
interface SonicWaveformHeroProps {
    onStart: () => void;
}

const SonicWaveformHero = ({ onStart }: SonicWaveformHeroProps) => {
    const fadeUpVariants: any = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2 + 0.5,
                duration: 0.8,
                ease: "easeInOut" as const,
            },
        }),
    };

    return (
        <div 
            className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans"
        >
            <SonicWaveformCanvas />
            
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent z-10"></div>

            {/* Overlay HTML Content */}
            <div className="relative z-20 text-center p-6 max-w-4xl mx-auto">
                <motion.div
                    custom={0} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6 backdrop-blur-sm"
                >
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span className="text-sm font-medium text-gray-200">
                        The ultimate README forge
                    </span>
                </motion.div>

                <motion.h1
                    custom={1} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-amber-500"
                >
                    ReadmeSmith
                </motion.h1>

                <motion.p
                    custom={2} variants={fadeUpVariants} initial="hidden" animate="visible"
                    className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed"
                >
                    Forge professional GitHub profiles in seconds. Interactive, modular, and designed for developers who value impact.
                </motion.p>

                <motion.div
                    custom={3} variants={fadeUpVariants} initial="hidden" animate="visible"
                >
                    <button 
                        onClick={onStart}
                        className="group px-8 py-4 bg-amber-500 text-black font-bold rounded-lg shadow-2xl hover:bg-amber-400 transition-all duration-300 flex items-center gap-2 mx-auto active:scale-95"
                    >
                        Forge Your README
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 z-20 text-center">
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="text-muted-foreground text-xs font-mono tracking-widest uppercase"
                >
                    Built with passion for the open source community
                </motion.p>
            </div>
        </div>
    );
};

export default SonicWaveformHero;
