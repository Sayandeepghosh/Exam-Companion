import React, { useState, useMemo } from 'react';
import Card from '../../components/Card';

type CalculationType = 'tables' | 'squares' | 'cubes' | 'squareRoots' | 'cubeRoots' | null;

const CalculationResult: React.FC<{ title: string; data: { n: number; value: string }[] }> = ({ title, data }) => (
    <Card className="animate-fade-in">
        <h3 className="text-xl font-medium mb-4 text-center">{title}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 max-h-96 overflow-y-auto p-2">
            {data.map(item => (
                <div key={item.n} className="text-sm font-mono p-1.5 rounded-lg bg-surface-variant/70 dark:bg-dark-surface-variant/70 text-on-surface-variant dark:text-dark-on-surface-variant text-center">
                   {item.value}
                </div>
            ))}
        </div>
    </Card>
);

const TablesScreen: React.FC = () => {
    const [activeCalculation, setActiveCalculation] = useState<CalculationType>('squares');
    const [tableNumber, setTableNumber] = useState(12);

    const calculationData = useMemo(() => {
        const data: { n: number; value: string }[] = [];
        switch (activeCalculation) {
            case 'tables':
                for (let i = 1; i <= 20; i++) {
                    data.push({ n: i, value: `${tableNumber} × ${i} = ${tableNumber * i}` });
                }
                return { title: `Multiplication Table of ${tableNumber}`, data };
            case 'squares':
                for (let i = 1; i <= 100; i++) {
                    data.push({ n: i, value: `${i}² = ${i * i}` });
                }
                return { title: 'Squares (1-100)', data };
            case 'cubes':
                for (let i = 1; i <= 100; i++) {
                    data.push({ n: i, value: `${i}³ = ${i * i * i}` });
                }
                return { title: 'Cubes (1-100)', data };
            case 'squareRoots':
                 for (let i = 1; i <= 100; i++) {
                    data.push({ n: i, value: `√${i} ≈ ${Math.sqrt(i).toFixed(4)}` });
                }
                return { title: 'Square Roots (1-100)', data };
            case 'cubeRoots':
                 for (let i = 1; i <= 100; i++) {
                    data.push({ n: i, value: `³√${i} ≈ ${Math.cbrt(i).toFixed(4)}` });
                }
                return { title: 'Cube Roots (1-100)', data };
            default:
                return null;
        }
    }, [activeCalculation, tableNumber]);

    const ActionButton: React.FC<{ type: CalculationType; children: React.ReactNode }> = ({ type, children }) => (
         <button
            onClick={() => setActiveCalculation(type)}
            className={`w-full text-center p-3 rounded-full transition-colors font-medium ${activeCalculation === type ? 'bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary shadow-elevation-1' : 'bg-secondary-container dark:bg-dark-secondary-container text-on-secondary-container dark:text-dark-on-secondary-container hover:opacity-90'}`}
         >
             {children}
         </button>
    );

    return (
        <div className="space-y-8">
            <Card>
                <h2 className="text-2xl font-medium mb-4">Quick Calculations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   <ActionButton type="squares">Squares (1-100)</ActionButton>
                   <ActionButton type="cubes">Cubes (1-100)</ActionButton>
                   <ActionButton type="squareRoots">Square Roots (1-100)</ActionButton>
                   <ActionButton type="cubeRoots">Cube Roots (1-100)</ActionButton>
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-medium mb-4">Multiplication Table</h2>
                 <form onSubmit={(e) => { e.preventDefault(); setActiveCalculation('tables'); }} className="flex items-center space-x-4">
                     <input
                        type="number"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(Number(e.target.value))}
                        className="block w-full px-4 py-3 bg-surface-variant/40 dark:bg-dark-surface-variant/40 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary transition"
                        placeholder="Enter a number"
                     />
                     <button
                        type="submit"
                        className="bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary font-medium rounded-full px-6 py-3 shadow-elevation-1 hover:shadow-elevation-2 transition-all transform hover:scale-[1.02] whitespace-nowrap"
                     >
                        Generate
                     </button>
                </form>
            </Card>

            {calculationData && <CalculationResult title={calculationData.title} data={calculationData.data} />}

        </div>
    );
};

export default TablesScreen;