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
                <h2 className="text-xl font-semibold mb-4">Reasoning Puzzle Zone</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Select a topic to generate a random practice puzzle.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {puzzleTypes.map(type => (
                        <button key={type} onClick={() => handleGeneratePuzzle(type)} disabled={isLoading} className="bg-primary-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-primary-400/50">
                            {type}
                        </button>
                    ))}
                </div>
            </Card>

            {isLoading && (
                 <div className="text-center p-8">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">AI is creating a puzzle...</p>
                </div>
            )}

            {puzzle && (
                <Card>
                    <h3 className="text-lg font-semibold mb-2">Your Puzzle:</h3>
                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 mb-6">{puzzle.puzzle}</p>
                    
                    {!showSolution ? (
                        <button onClick={() => setShowSolution(true)} className="w-full bg-gray-200 dark:bg-gray-700 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            Show Solution
                        </button>
                    ) : (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg">
                             <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">Solution:</h3>
                             <p className="whitespace-pre-wrap text-green-700 dark:text-green-300">{puzzle.solution}</p>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default PuzzleScreen;