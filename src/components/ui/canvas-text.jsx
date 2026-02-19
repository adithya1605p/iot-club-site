"use client";
import React, { useRef, useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export const CanvasText = ({
    text,
    backgroundClassName,
    colors = ["#000000"],
    lineGap = 2,
    animationDuration = 2,
    className,
}) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        // Initial measure
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [text]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || dimensions.width === 0) return;

        const ctx = canvas.getContext("2d");
        let animationFrameId;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = dimensions.width * dpr;
        canvas.height = dimensions.height * dpr;
        ctx.scale(dpr, dpr);

        let offset = 0;

        const draw = () => {
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);

            ctx.font = "bold 60px Inter, sans-serif"; // Sync this with CSS if possible, or make prop
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const x = dimensions.width / 2;
            const y = dimensions.height / 2;

            // Draw gradient text
            const gradient = ctx.createLinearGradient(0, 0, dimensions.width, 0);
            colors.forEach((color, index) => {
                gradient.addColorStop(index / (colors.length - 1), color);
            });
            ctx.fillStyle = gradient;
            ctx.fillText(text, x, y);

            // Animation effect: "Scanline" or "Wave" masking
            // We use 'source-atop' to only draw where text exists
            ctx.globalCompositeOperation = 'source-atop';

            const time = Date.now() / 1000;
            const move = (time % animationDuration) / animationDuration * dimensions.width * 2;

            const shimmer = ctx.createLinearGradient(move - dimensions.width, 0, move, 0);
            shimmer.addColorStop(0, "transparent");
            shimmer.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
            shimmer.addColorStop(1, "transparent");

            ctx.fillStyle = shimmer;
            ctx.fillRect(0, 0, dimensions.width, dimensions.height);

            ctx.globalCompositeOperation = 'source-over';

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [text, colors, animationDuration, dimensions]);

    return (
        <span
            ref={containerRef}
            className={cn(
                "inline-block relative px-2 rounded-md transition-colors duration-300",
                backgroundClassName,
                className
            )}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ width: '100%', height: '100%' }}
            />
            {/* Invisible text to define container size */}
            <span className="opacity-0 relative z-0">{text}</span>
        </span>
    );
};
