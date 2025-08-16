import React, { useState, useEffect, useRef } from 'react';
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
    
    // Note: Audio playback is not implemented to avoid external dependencies.
    // In a real app, you would load and play audio files based on 'selectedSound'.

    const handleEndSession = (showNotification: boolean) => {
        setIsActive(false);
        setIsPaused(false);
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        if (showNotification) {
            playSound();
            // A simple alert is used as a cross-browser compatible notification.
            setTimeout(() => alert("Focus session complete! Great work."), 100);
        }
    };

    useEffect(() => {
        let intervalId: number | undefined;
        if (isActive && !isPaused) {
            intervalId = window.setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        // Timer finished
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
        // Fullscreen logic
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && isActive) {
                // User exited fullscreen manually, so we end the session.
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
            // Fallback for browsers that don't support it or if the user denies it.
            // The session will still start, just not in fullscreen.
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
                    <p className="text-lg md:text-xl text-gray-300/80 mt-4">Stay focused. You can do this.</p>
                </div>
                <div className="absolute bottom-12 md:bottom-16 flex space-x-4 md:space-x-6">
                    <button 
                        onClick={togglePause} 
                        className="bg-white/10 backdrop-blur-sm text-white font-semibold py-3 px-6 md:px-8 rounded-lg hover:bg-white/20 transition-colors text-md md:text-lg"
                    >
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button 
                        onClick={() => handleEndSession(false)} 
                        className="bg-red-500/80 backdrop-blur-sm text-white font-semibold py-3 px-6 md:px-8 rounded-lg hover:bg-red-500 transition-colors text-md md:text-lg"
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
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Enter a distraction-free session to concentrate on your studies. The app will go into fullscreen mode, hiding other apps and notifications to minimize distractions and help you stay on task.
                </p>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Session Length (minutes)</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {[25, 50, 75].map(d => (
                            <button 
                                key={d}
                                onClick={() => setDuration(d)}
                                className={`p-4 rounded-lg font-bold text-xl transition ${duration === d ? 'bg-primary-500 text-white ring-2 ring-offset-2 ring-offset-gray-50 dark:ring-offset-black ring-primary-500' : 'bg-gray-100 dark:bg-gray-800/60 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                     <h2 className="text-lg font-semibold">Ambient Sound (Optional)</h2>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Note: Audio playback is for demonstration and won't play sound.</p>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['None', 'Rain', 'Cafe', 'Forest'].map(sound => (
                            <button 
                                key={sound}
                                onClick={() => setSelectedSound(sound)}
                                className={`p-3 rounded-lg font-semibold transition ${selectedSound === sound ? 'bg-primary-500 text-white ring-2 ring-offset-2 ring-offset-gray-50 dark:ring-offset-black ring-primary-500' : 'bg-gray-100 dark:bg-gray-800/60 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                            >
                                {sound}
                            </button>
                        ))}
                     </div>
                </div>
                
                <div className="mt-8">
                    <button 
                        onClick={handleStartSession}
                        className="w-full bg-primary-600 text-white font-bold py-3.5 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors text-lg"
                    >
                        Start Focus Session
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default FocusScreen;