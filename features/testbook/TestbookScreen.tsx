import React from 'react';
import Card from '../../components/Card';

const TestbookScreen: React.FC = () => {
  return (
    <div className="space-y-6 h-[calc(100vh-160px)] flex flex-col">
      <Card className="flex-grow flex flex-col">
          <h1 className="text-2xl font-medium text-on-surface dark:text-dark-on-surface mb-2">Testbook Login</h1>
          <p className="mb-4 text-on-surface-variant dark:text-dark-on-surface-variant">
              Log in to your Testbook account directly within the app to access your materials.
          </p>
          <div className="flex-grow border border-outline/30 dark:border-dark-outline/30 rounded-2xl overflow-hidden bg-white">
             <iframe
                src="https://testbook.com/login"
                title="Testbook Login"
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin allow-forms"
             ></iframe>
          </div>
      </Card>
    </div>
  );
};

export default TestbookScreen;