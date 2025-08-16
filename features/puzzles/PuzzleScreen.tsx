import React, { useState } from 'react';
import Card from '../../components/Card';
import { generateReasoningPuzzle } from '../../services/geminiService';

type PuzzleType = 'Blood Relations' | 'Coding-Decoding' | 'Seating Arrangement';

const PuzzleScreen: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [puzzle, setPuzzle] = useState<{ puzzle: string; solution: string } | null>(null);
    const [showSolution, setShowSolution] = useState(false);

    const handleGeneratePuzzle = async (type: PuzzleType) => {
        setIsLoading(true);
        setPuzzle(null);
        setShowSolution(false);
        const result = await generateReasoningPuzzle(type);
        setPuzzle(result);
        setIsLoading(false);
    };

    const puzzleTypes: PuzzleType[] = ['Blood Relations', 'Coding-Decoding', 'Seating Arrangement'];

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-medium mb-4">Reasoning Puzzle Zone</h2>
                <p className="text-on-surface-variant dark:text-dark-on-surface-variant mb-4">Select a topic to generate a random practice puzzle.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {puzzleTypes.map(type => (
                        <button key={type} onClick={() => handleGeneratePuzzle(type)} disabled={isLoading} className="bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary font-medium rounded-full py-2.5 px-4 shadow-sm hover:shadow-md transition-shadow disabled:bg-primary/50 dark:disabled:bg-dark-primary/50">
                            {type}
                        </button>
                    ))}
                </div>
            </Card>

            {isLoading && (
                 <div className="text-center p-8">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary dark:border-dark-primary mx-auto"></div>
                    <p className="mt-4 text-on-surface-variant dark:text-dark-on-surface-variant">AI is creating a puzzle...</p>
                </div>
            )}

            {puzzle && (
                <Card>
                    <h3 className="text-lg font-medium mb-2">Your Puzzle:</h3>
                    <p className="whitespace-pre-wrap text-on-surface dark:text-dark-on-surface mb-6">{puzzle.puzzle}</p>
                    
                    {!showSolution ? (
                        <button onClick={() => setShowSolution(true)} className="w-full bg-secondary-container dark:bg-dark-secondary-container text-on-secondary-container dark:text-dark-on-secondary-container font-medium py-2.5 px-4 rounded-full hover:opacity-90 transition-opacity">
                            Show Solution
                        </button>
                    ) : (
                        <div className="p-4 bg-tertiary-container/50 dark:bg-dark-tertiary-container/50 border border-tertiary-container dark:border-dark-tertiary-container rounded-2xl">
                             <h3 className="text-lg font-medium text-on-tertiary-container dark:text-dark-on-tertiary-container mb-2">Solution:</h3>
                             <p className="whitespace-pre-wrap text-on-tertiary-container/90 dark:text-dark-on-tertiary-container/90">{puzzle.solution}</p>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default PuzzleScreen;
