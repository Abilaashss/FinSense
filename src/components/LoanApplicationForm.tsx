import React, { useState, useEffect, useRef } from 'react';
import QuestionExplanation from './QuestionExplanation';
import QuestionChecklist from './QuestionChecklist';

interface UserInfo {
  fullName?: string;
  email?: string;
  mobile?: string;
  language?: string;
}

interface Question {
  id: string;
  text: string;
  explanation?: string;
}

interface LoanApplicationFormProps {
  questions: Question[];
  loanType: string;
  onSubmit: (answers: Record<string, string>) => void;
  onReview: (answers: Record<string, string>) => void;
  onVideoRecord: (questionId: string) => void;
  userInfo?: UserInfo;
  hardcodedAnswers?: Record<string, string>;
}

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({
  questions,
  loanType,
  onSubmit,
  onReview,
  onVideoRecord,
  userInfo,
  hardcodedAnswers = {}
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>(hardcodedAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [recording, setRecording] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleVideoRecordClick = (questionId: string) => {
    // Only allow recording if the question hasn't been answered yet
    if (!answers[questionId] || answers[questionId].trim() === '') {
      setRecording(questionId);
      onVideoRecord(questionId);
      
      // Simulate recording completing after 3 seconds
      setTimeout(() => {
        setRecording(null);
        // The parent component will update the answers via onVideoRecord
      }, 3000);
    }
  };

  const handleReviewClick = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const missingQuestions = questions
      .filter(q => !answers[q.id] || answers[q.id].trim() === '')
      .map(q => q.id);
    
    if (missingQuestions.length > 0) {
      setFormErrors(missingQuestions);
      // Scroll to the first error
      const firstErrorElement = document.getElementById(`question-${missingQuestions[0]}`);
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Clear errors and proceed to review
    setFormErrors([]);
    onReview(answers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Submit form after a short delay
    setTimeout(() => {
      onSubmit(answers);
      setIsSubmitting(false);
    }, 1000);
  };

  // Get unanswered questions for the to-do list
  const unansweredQuestions = questions.filter(q => !answers[q.id] || answers[q.id].trim() === '');
  const answeredQuestions = questions.filter(q => answers[q.id] && answers[q.id].trim() !== '');
  const completionPercentage = Math.round((answeredQuestions.length / questions.length) * 100);

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-secondary-900">
            {loanType} Application Questions
          </h2>
          <div className="text-sm font-medium text-secondary-700">
            {completionPercentage}% Complete
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        
        <p className="text-secondary-700 mt-3">
          {unansweredQuestions.length === 0 
            ? "All questions have been answered. Please review your answers before submitting."
            : "Please answer all the questions below to submit your application."}
        </p>
        
        {/* Todo list for unanswered questions */}
        {unansweredQuestions.length > 0 && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="text-amber-800 font-medium mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Remaining Questions ({unansweredQuestions.length})
            </h3>
            <ul className="space-y-1">
              {unansweredQuestions.map((question) => (
                <li key={`todo-${question.id}`} className="text-sm text-amber-700 flex items-start">
                  <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="line-clamp-1">{question.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <form onSubmit={handleReviewClick} ref={formRef}>
        <div className="space-y-8">
          {questions.map((question) => {
            const hasError = formErrors.includes(question.id);
            const hasAnswer = answers[question.id] && answers[question.id].trim() !== '';
            const isRecording = recording === question.id;
            
            return (
              <div 
                key={question.id} 
                id={`question-${question.id}`}
                className={`p-4 rounded-lg border ${hasError ? 'border-red-300 bg-red-50' : hasAnswer ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <label 
                    htmlFor={question.id} 
                    className={`font-medium ${hasError ? 'text-red-700' : hasAnswer ? 'text-green-700' : 'text-secondary-700'}`}
                  >
                    {question.text}
                  </label>
                  
                  {question.explanation && (
                    <QuestionExplanation 
                      question={question.text}
                      explanation={question.explanation}
                    />
                  )}
                </div>
                
                <div className="flex">
                  <div className="flex-grow mr-3">
                    <textarea
                      id={question.id}
                      className={`w-full p-3 border rounded-lg ${hasError ? 'border-red-300' : hasAnswer ? 'border-green-300' : 'border-gray-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      rows={3}
                      placeholder="Type your answer here"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      disabled={isRecording}
                    />
                    {hasError && (
                      <p className="mt-1 text-sm text-red-600">Please answer this question</p>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleVideoRecordClick(question.id)}
                    disabled={isRecording || hasAnswer}
                    className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors
                      ${isRecording ? 'bg-red-500 animate-pulse' : hasAnswer ? 'bg-gray-200 cursor-not-allowed' : 'bg-primary-100 hover:bg-primary-200'}`}
                  >
                    {isRecording ? (
                      <span className="w-3 h-3 bg-white rounded-full"></span>
                    ) : (
                      <svg 
                        className={`w-6 h-6 ${hasAnswer ? 'text-gray-400' : 'text-primary-600'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-secondary-700">
              {userInfo?.fullName && (
                <div className="flex items-center text-sm">
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Applying as: <span className="font-medium">{userInfo.fullName}</span></span>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || unansweredQuestions.length > 0}
              className={`px-6 py-3 rounded-lg font-medium 
                ${isSubmitting || unansweredQuestions.length > 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-primary-600 text-white hover:bg-primary-700 transition-colors'}`}
            >
              {isSubmitting ? 'Processing...' : 'Review Application'}
            </button>
          </div>
          
          {unansweredQuestions.length > 0 && (
            <p className="mt-3 text-sm text-amber-600">
              Please answer all questions before reviewing your application.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoanApplicationForm; 