import React from 'react';
import Card from '../../components/Card';

const TestbookScreen: React.FC = () => {
  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <Card className="flex-grow flex flex-col">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Testbook Login</h1>
          <p className="mb-4 text-gray-600 dark:text-gray-400 text-sm">
              Log in to your Testbook account directly within the app to access your materials.
          </p>
          <div className="flex-grow border border-gray-200 dark:border-gray-700/50 rounded-lg overflow-hidden">
             <iframe
                src="https://testbook.com/login"
                title="Testbook Login"
                className="w-full h-full bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms"
             ></iframe>
          </div>
      </Card>
    </div>
  );
};

export default TestbookScreen;