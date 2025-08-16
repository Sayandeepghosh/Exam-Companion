import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const playSound = () => {
    if (typeof window === 'undefined') return;
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) {
            console.warn("Web Audio API is not supported in this browser.");
            return;
        }
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5 note
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.8);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.8);
    } catch (e) {
        console.error("Could not play sound:", e);
    }
};

const FocusScreen: React.FC = () => {
    const [duration, setDuration] = useState(25); // in minutes
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedSound, setSelectedSound] = useState('none');
    
    const handleEndSession = (showNotification: boolean) => {
        setIsActive(false);
        setIsPaused(false);
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        if (showNotification) {
            playSound();
            setTimeout(() => alert("Focus session complete! Great work."), 100);
        }
    };

    useEffect(() => {
        let intervalId: number | undefined;
        if (isActive && !isPaused) {
            intervalId = window.setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        handleEndSession(true);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isActive, isPaused]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && isActive) {
                handleEndSession(false);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [isActive]);


    const handleStartSession = () => {
        setTimeLeft(duration * 60);
        setIsActive(true);
        setIsPaused(false);
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    };
    
    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    if (isActive) {
        return (
            <div className="fixed inset-0 animated-gradient flex flex-col items-center justify-center text-white z-50">
                <div className="text-center">
                    <p className="text-8xl md:text-9xl font-mono font-bold">{formatTime(timeLeft)}</p>
                    <p className="text-lg md:text-xl text-dark-on-primary/80 mt-4">Stay focused. You can do this.</p>
                </div>
                <div className="absolute bottom-12 md:bottom-16 flex space-x-4 md:space-x-6">
                    <button 
                        onClick={togglePause} 
                        className="bg-white/10 backdrop-blur-sm text-white font-semibold py-3 px-6 md:px-8 rounded-2xl hover:bg-white/20 transition-colors text-md md:text-lg"
                    >
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button 
                        onClick={() => handleEndSession(false)} 
                        className="bg-error/80 backdrop-blur-sm text-white font-semibold py-3 px-6 md:px-8 rounded-2xl hover:bg-error transition-colors text-md md:text-lg"
                    >
                        End Session
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <h1 className="text-3xl font-bold mb-2">Focus Mode</h1>
                <p className="text-on-surface-variant dark:text-dark-on-surface-variant mb-6">
                    Enter a distraction-free session to concentrate on your studies. The app will go into fullscreen mode to minimize distractions.
                </p>

                <div className="space-y-4">
                    <h2 className="text-lg font-medium">Session Length (minutes)</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {[25, 50, 75].map(d => (
                            <button 
                                key={d}
                                onClick={() => setDuration(d)}
                                className={`p-4 rounded-xl font-bold text-xl transition ${duration === d ? 'bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary ring-2 ring-offset-2 ring-offset-surface dark:ring-offset-dark-surface ring-primary dark:ring-dark-primary' : 'bg-surface-variant/60 dark:bg-dark-surface-variant/60 hover:bg-surface-variant dark:hover:bg-dark-surface-variant'}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                     <h2 className="text-lg font-medium">Ambient Sound (Optional)</h2>
                     <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">Note: Audio playback is for demonstration and won't play sound.</p>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['None', 'Rain', 'Cafe', 'Forest'].map(sound => (
                            <button 
                                key={sound}
                                onClick={() => setSelectedSound(sound)}
                                className={`p-3 rounded-xl font-semibold transition ${selectedSound === sound ? 'bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary ring-2 ring-offset-2 ring-offset-surface dark:ring-offset-dark-surface ring-primary dark:ring-dark-primary' : 'bg-surface-variant/60 dark:bg-dark-surface-variant/60 hover:bg-surface-variant dark:hover:bg-dark-surface-variant'}`}
                            >
                                {sound}
                            </button>
                        ))}
                     </div>
                </div>
                
                <div className="mt-8">
                    <button 
                        onClick={handleStartSession}
                        className="w-full bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary font-bold py-3.5 px-4 rounded-full hover:opacity-90 transition-opacity text-lg"
                    >
                        Start Focus Session
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default FocusScreen;
