import React, { useState } from 'react';

interface QuestionExplanationProps {
  question: string;
  explanation: string;
}

const QuestionExplanation: React.FC<QuestionExplanationProps> = ({ question, explanation }) => {
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering parent onClick
          setIsExplanationVisible(!isExplanationVisible);
        }}
        className="p-1 rounded-full transition-colors"
        aria-label="Show explanation"
        title="See explanation for this question"
      >
        <svg 
          className={`w-5 h-5 ${isExplanationVisible ? 'text-primary-600' : 'text-gray-400 hover:text-primary-500'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
        </svg>
      </button>

      {isExplanationVisible && (
        <div className="absolute z-50 right-0 top-8 w-64 bg-white rounded-lg shadow-lg border border-primary-200 p-4 text-sm">
          <div className="absolute top-0 right-3 transform -translate-y-1/2 w-3 h-3 rotate-45 bg-white border-t border-l border-primary-200"></div>
          
          <div className="flex justify-between items-start mb-2">
            <h5 className="font-medium text-primary-700">Explanation</h5>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExplanationVisible(false);
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
              aria-label="Close explanation"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
          
          <div className="mb-2">
            <div className="text-xs font-medium text-gray-600 mb-1">Question:</div>
            <div className="text-sm text-secondary-800">{question}</div>
          </div>
          
          <div>
            <div className="text-xs font-medium text-gray-600 mb-1">Explanation:</div>
            <div className="text-sm text-secondary-700">{explanation}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionExplanation; 