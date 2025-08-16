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
                <h2 className="text-xl font-medium mb-4">Formula & Shortcut Vault</h2>
                <form onSubmit={handleSearch} className="space-y-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-4 py-3 bg-transparent border border-outline dark:border-dark-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
                        placeholder="e.g., Quadratic Equations"
                        required
                    />
                    <button type="submit" disabled={isLoading} className="w-full bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary font-medium rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-shadow disabled:bg-primary/50 dark:disabled:bg-dark-primary/50">
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </Card>

            {isLoading && (
                <div className="text-center p-8">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary dark:border-dark-primary mx-auto"></div>
                    <p className="mt-4 text-on-surface-variant dark:text-dark-on-surface-variant">Fetching from AI...</p>
                </div>
            )}

            {result && (
                <Card>
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:text-on-surface dark:prose-p:text-dark-on-surface prose-headings:text-on-surface dark:prose-headings:text-dark-on-surface" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br />') }} />
                    <button onClick={handleBookmark} className="mt-4 w-full bg-secondary-container dark:bg-dark-secondary-container text-on-secondary-container dark:text-dark-on-secondary-container font-medium py-2.5 px-4 rounded-full hover:opacity-90 transition-opacity">
                        Bookmark Result
                    </button>
                </Card>
            )}

            <div className="space-y-4">
                <h2 className="text-xl font-medium">Bookmarked Formulas</h2>
                {bookmarkedFormulas.length === 0 ? (
                    <p className="text-on-surface-variant dark:text-dark-on-surface-variant">Your bookmarked items will appear here.</p>
                ) : (
                    bookmarkedFormulas.map(formula => (
                        <Card key={formula.id}>
                            <h3 className="font-medium mb-2">{formula.topic}</h3>
                            <div className="prose prose-sm dark:prose-invert max-w-none mb-4 prose-p:text-on-surface dark:prose-p:text-dark-on-surface prose-headings:text-on-surface dark:prose-headings:text-dark-on-surface" dangerouslySetInnerHTML={{ __html: formula.content.replace(/\n/g, '<br />') }} />
                            <button onClick={() => unBookmark(formula.id)} className="w-full text-center text-sm text-error hover:underline">
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
