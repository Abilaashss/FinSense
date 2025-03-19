import React from 'react';
import QuestionExplanation from './QuestionExplanation';

interface Question {
  id: string;
  text: string;
  category: string;
  explanation?: string;
}

interface QuestionChecklistProps {
  questions: Question[];
  answers: Record<string, string>;
  currentQuestion?: number;
  onQuestionClick?: (index: number) => void;
  isEditable?: boolean;
}

const QuestionChecklist: React.FC<QuestionChecklistProps> = ({
  questions,
  answers,
  currentQuestion,
  onQuestionClick,
  isEditable = true
}) => {
  // Group questions by category
  const questionsByCategory = questions.reduce((acc, question, index) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    
    acc[question.category].push({
      ...question,
      index
    });
    
    return acc;
  }, {} as Record<string, (Question & { index: number })[]>);
  
  const categories = Object.keys(questionsByCategory);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-secondary-900">Question Checklist</h3>
        <p className="text-sm text-secondary-600 mt-1">
          {Object.values(answers).filter(Boolean).length} of {questions.length} questions answered
        </p>
      </div>
      
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-4 last:mb-0">
            <h4 className="text-sm font-semibold text-secondary-800 mb-2">{category}</h4>
            <ul className="space-y-2">
              {questionsByCategory[category].map(({ id, text, index, explanation }) => {
                const isAnswered = !!answers[id];
                const isActive = currentQuestion === index;
                
                return (
                  <li 
                    key={id} 
                    className={`p-2 rounded-md text-sm flex items-start gap-2 ${
                      isActive 
                        ? 'bg-primary-50 border border-primary-200' 
                        : isAnswered 
                        ? 'bg-green-50 border border-green-100' 
                        : 'bg-gray-50 border border-gray-100'
                    } ${isEditable && 'cursor-pointer hover:bg-opacity-80 transition-colors'}`}
                    onClick={() => isEditable && onQuestionClick && onQuestionClick(index)}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {isAnswered ? (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                    
                    <span className={`flex-grow ${isAnswered ? 'text-green-800' : 'text-secondary-700'}`}>
                      {text}
                    </span>
                    
                    {explanation && (
                      <div className="flex-shrink-0">
                        <QuestionExplanation 
                          question={text} 
                          explanation={explanation} 
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      
      {isEditable && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-secondary-500">
            Click on any unanswered question to record your response.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionChecklist; 