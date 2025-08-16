import React, { useState } from 'react';
import Card from '../../components/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getFormulasAndShortcuts } from '../../services/geminiService';
import type { Formula } from '../../types';

const FormulaScreen: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [bookmarkedFormulas, setBookmarkedFormulas] = useLocalStorage<Formula[]>('bookmarkedFormulas', []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;
        setIsLoading(true);
        setResult(null);
        const formulaResult = await getFormulasAndShortcuts(topic);
        setResult(formulaResult);
        setIsLoading(false);
    };

    const handleBookmark = () => {
        if (!result || !topic) return;
        // Avoid duplicate bookmarks
        if (bookmarkedFormulas.some(f => f.topic === topic && f.content === result)) return;
        
        const newBookmark: Formula = {
            id: Date.now(),
            topic: topic,
            content: result,
        };
        setBookmarkedFormulas(prev => [newBookmark, ...prev]);
    };
    
    const unBookmark = (id: number) => {
        setBookmarkedFormulas(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-semibold mb-4">Formula & Shortcut Vault</h2>
                <form onSubmit={handleSearch} className="space-y-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g., Quadratic Equations, Simple Interest"
                        required
                    />
                    <button type="submit" disabled={isLoading} className="w-full bg-primary-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:bg-primary-400/50">
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </Card>

            {isLoading && (
                <div className="text-center p-8">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Fetching from AI...</p>
                </div>
            )}

            {result && (
                <Card>
                    <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br />') }} />
                    <button onClick={handleBookmark} className="mt-4 w-full bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold py-2 px-4 rounded-lg hover:bg-blue-500/30 transition-colors">
                        Bookmark Result
                    </button>
                </Card>
            )}

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Bookmarked Formulas</h2>
                {bookmarkedFormulas.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">Your bookmarked items will appear here.</p>
                ) : (
                    bookmarkedFormulas.map(formula => (
                        <Card key={formula.id}>
                            <h3 className="font-bold mb-2">{formula.topic}</h3>
                            <div className="prose prose-sm dark:prose-invert max-w-none mb-4" dangerouslySetInnerHTML={{ __html: formula.content.replace(/\n/g, '<br />') }} />
                            <button onClick={() => unBookmark(formula.id)} className="w-full text-center text-sm text-red-600 dark:text-red-400 hover:underline">
                                Remove
                            </button>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default FormulaScreen;