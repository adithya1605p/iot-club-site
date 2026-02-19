import { useEffect, useState } from 'react';

const KonamiCode = () => {
    const [input, setInput] = useState([]);
    const konamiCode = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            setInput((prev) => {
                const newInput = [...prev, e.key];
                if (newInput.length > konamiCode.length) {
                    return newInput.slice(newInput.length - konamiCode.length);
                }
                return newInput;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (JSON.stringify(input) === JSON.stringify(konamiCode)) {
            activateEasterEgg();
            setInput([]);
        }
    }, [input]);

    const activateEasterEgg = () => {
        // 8-bit sound
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        oscillator.frequency.setValueAtTime(1760, audioCtx.currentTime + 0.2); // A6

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);

        alert("🤖 LEVEL UP! SYSTEM OVERRIDE: ACTIVATED");

        // Add temporary matrix rain or visual glitch here if desired
        document.body.style.filter = "invert(1)";
        setTimeout(() => {
            document.body.style.filter = "invert(0)";
        }, 1000);
    };

    return null;
};

export default KonamiCode;
