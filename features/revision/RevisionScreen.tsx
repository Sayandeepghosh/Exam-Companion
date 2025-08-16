import React, { useState, useMemo, useRef, useEffect } from 'react';
import Card from '../../components/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Flashcard } from '../../types';
import { extractTextFromImage } from '../../services/geminiService';
import { CameraIcon } from '../../components/Icons';

const FlashcardViewer: React.FC = () => {
    const [flashcards, setFlashcards] = useLocalStorage<Flashcard[]>('flashcards', []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [newFront, setNewFront] = useState('');
    const [newBack, setNewBack] = useState('');

    // OCR State
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        // Cleanup function to stop camera stream when component unmounts
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const reviewDeck = useMemo(() => {
        const now = Date.now();
        return flashcards.filter(card => card.nextReviewDate <= now);
    }, [flashcards]);

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (newFront.trim() && newBack.trim()) {
            const newCard: Flashcard = {
                id: Date.now(),
                front: newFront,
                back: newBack,
                nextReviewDate: Date.now(),
                easeFactor: 'Good',
            };
            setFlashcards(prev => [...prev, newCard]);
            setNewFront('');
            setNewBack('');
        }
    };
    
    const handleAnswer = (ease: 'Hard' | 'Good' | 'Easy') => {
        if (reviewDeck.length === 0) return;
        const card = reviewDeck[currentIndex];
        let nextInterval;
        switch (ease) {
            case 'Hard': nextInterval = 10 * 60 * 1000; break; // 10 minutes
            case 'Good': nextInterval = 24 * 60 * 60 * 1000; break; // 1 day
            case 'Easy': nextInterval = 4 * 24 * 60 * 60 * 1000; break; // 4 days
        }
        
        const updatedFlashcards = flashcards.map(c => 
            c.id === card.id ? { ...c, nextReviewDate: Date.now() + nextInterval, easeFactor: ease } : c
        );
        setFlashcards(updatedFlashcards);
        
        setIsFlipped(false);
        if (currentIndex >= reviewDeck.length - 1) {
            setCurrentIndex(0);
        }
    };

    const startCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                }
                setIsCameraOpen(true);
            } catch (error) {
                console.error("Error accessing camera:", error);
                alert("Could not access camera. Please check permissions and try again.");
            }
        } else {
            alert("Your browser does not support camera access.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsCameraOpen(false);
    };

    const handleCapture = async () => {
        if (!videoRef.current) return;
        setIsScanning(true);
        stopCamera();

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setIsScanning(false);
            return;
        }
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64Image = dataUrl.split(',')[1];

        try {
            const extractedText = await extractTextFromImage(base64Image);
            setNewFront('Scanned Note');
            setNewBack(extractedText);
        } catch (error) {
            console.error(error);
            setNewBack("Error scanning text. Please try again.");
        } finally {
            setIsScanning(false);
        }
    };
    
    const currentCard = reviewDeck[currentIndex];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-medium">Flashcard Review</h2>
            {reviewDeck.length > 0 ? (
                 <Card>
                    <div 
                        className="relative w-full h-64 rounded-lg flex items-center justify-center text-2xl font-bold text-center p-4 cursor-pointer"
                        onClick={() => setIsFlipped(!isFlipped)}
                        style={{ perspective: '1000px' }}
                    >
                         <div className={`absolute w-full h-full transition-transform duration-700 [transform-style:preserve-3d] bg-surface-variant dark:bg-dark-surface-variant rounded-2xl p-4 flex items-center justify-center [backface-visibility:hidden] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                            {currentCard?.front}
                        </div>
                        <div className={`absolute w-full h-full transition-transform duration-700 [transform-style:preserve-3d] bg-primary-container dark:bg-dark-primary-container text-on-primary-container dark:text-dark-on-primary-container rounded-2xl p-4 flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(-180deg)] ${isFlipped ? '[transform:rotateY(0deg)]' : ''}`}>
                            {currentCard?.back}
                        </div>
                    </div>
                     {isFlipped && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                             <button onClick={() => handleAnswer('Hard')} className="bg-error-container text-on-error-container font-semibold p-3 rounded-full hover:opacity-90 transition">Hard</button>
                             <button onClick={() => handleAnswer('Good')} className="bg-tertiary-container text-on-tertiary-container font-semibold p-3 rounded-full hover:opacity-90 transition">Good</button>
                             <button onClick={() => handleAnswer('Easy')} className="bg-primary-container text-on-primary-container font-semibold p-3 rounded-full hover:opacity-90 transition">Easy</button>
                        </div>
                     )}
                 </Card>
            ) : (
                <p className="text-center text-on-surface-variant dark:text-dark-on-surface-variant py-10">No flashcards to review right now. Come back later or add some new ones!</p>
            )}

            <Card>
                <h3 className="text-lg font-medium mb-4">Add New Flashcard</h3>
                <div className="space-y-4">
                    <button 
                      type="button" 
                      onClick={startCamera} 
                      className="w-full flex items-center justify-center gap-2 bg-secondary-container dark:bg-dark-primary-container text-on-secondary-container dark:text-dark-on-primary-container font-medium py-3 px-4 rounded-full hover:opacity-90 transition-opacity"
                    >
                        <CameraIcon />
                        <span>Scan with Camera</span>
                    </button>
                    <div className="flex items-center text-xs text-outline">
                        <span className="flex-grow border-t border-outline/50"></span>
                        <span className="px-2">OR</span>
                        <span className="flex-grow border-t border-outline/50"></span>
                    </div>
                    <form onSubmit={handleAddCard} className="space-y-4">
                        <input type="text" value={newFront} onChange={e => setNewFront(e.target.value)} placeholder="Front of card" className="w-full p-3 border border-outline dark:border-dark-outline rounded-lg bg-transparent focus:ring-2 focus:ring-primary focus:outline-none" required />
                        <textarea value={newBack} onChange={e => setNewBack(e.target.value)} placeholder="Back of card" className="w-full p-3 border border-outline dark:border-dark-outline rounded-lg bg-transparent focus:ring-2 focus:ring-primary focus:outline-none" rows={3} required />
                        <button type="submit" className="w-full bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary font-medium rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-shadow">Add Card</button>
                    </form>
                </div>
            </Card>

            {isScanning && (
                <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center text-white">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
                    <p className="mt-4 text-lg font-semibold">AI is reading your note...</p>
                </div>
            )}

            {isCameraOpen && (
                <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full max-w-2xl h-auto rounded-lg mb-6 shadow-lg border-2 border-dark-outline" />
                    <div className="flex space-x-4">
                        <button onClick={handleCapture} className="bg-primary text-on-primary font-bold py-3 px-6 rounded-full hover:opacity-90 transition-transform hover:scale-105">
                            Capture
                        </button>
                        <button onClick={stopCamera} className="bg-secondary text-on-secondary font-bold py-3 px-6 rounded-full hover:opacity-90 transition-transform hover:scale-105">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const RevisionScreen: React.FC = () => {
  return (
    <div className="space-y-6">
        <FlashcardViewer />
    </div>
  );
};

export default RevisionScreen;
