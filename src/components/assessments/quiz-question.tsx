

// /src/components/assessments/quiz-question.tsx
// FIXED VERSION - Replace the useEffect section

'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, ImageIcon, VideoIcon, Code, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  text: string;
  correct?: boolean;
  explanation?: string;
}

interface QuizQuestionProps {
  question: {
    id: string;
    question_text: string;
    question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'matching' | 'fill_blank' | 'code' | 'file_upload';
    options: Option[] | null;
    points: number;
    image_url?: string | null;
    video_url?: string | null;
    explanation?: string | null;
    hints?: string[] | null;
    order_index: number;
    possible_answers?: string[] | null;
    code_template?: string | null;
    allowed_file_types?: string[] | null;
  };
  currentAnswer: string | string[] | null;
  onAnswerChange: (answer: string | string[] | null) => void;
  showExplanation?: boolean;
  disabled?: boolean;
  markedForReview?: boolean;
  onToggleReview?: () => void;
}

export function QuizQuestion({
  question,
  currentAnswer,
  onAnswerChange,
  showExplanation = false,
  disabled = false,
  markedForReview = false,
  onToggleReview
}: QuizQuestionProps) {
  const [showHint, setShowHint] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [codeValue, setCodeValue] = useState(question.code_template || '');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize answer based on question type - FIXED VERSION
  useEffect(() => {
    // Only run once when component mounts
    if (!isInitialized && currentAnswer === null) {
      let defaultAnswer: string | string[] | null = null;
      
      switch (question.question_type) {
        case 'multiple_choice':
        case 'true_false':
        case 'short_answer':
        case 'essay':
        case 'code':
        case 'file_upload':
          defaultAnswer = '';
          break;
        case 'matching':
        case 'fill_blank':
          defaultAnswer = [];
          break;
        default:
          defaultAnswer = null;
      }
      
      onAnswerChange(defaultAnswer);
      setIsInitialized(true);
    }
  }, [question.question_type, currentAnswer, onAnswerChange, isInitialized]);

  const handleSingleSelect = (value: string) => {
    onAnswerChange(value);
  };

  const handleTextChange = (value: string) => {
    onAnswerChange(value);
  };

  const handleCodeChange = (value: string) => {
    setCodeValue(value);
    onAnswerChange(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, we'll just store the file name
      // In a real implementation, you'd upload the file
      onAnswerChange(file.name);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const getOptionLabel = (index: number) => {
    const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
    return labels[index] || `${index + 1}`;
  };

  const getQuestionTypeIcon = () => {
    switch (question.question_type) {
      case 'multiple_choice': return '🔘';
      case 'true_false': return '✅';
      case 'short_answer': return '📝';
      case 'essay': return '📄';
      case 'matching': return '🔗';
      case 'fill_blank': return '▯▯▯';
      case 'code': return <Code className="h-4 w-4" />;
      case 'file_upload': return <Upload className="h-4 w-4" />;
      default: return '❓';
    }
  };

  const getQuestionTypeLabel = () => {
    return question.question_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const isOptionSelected = (optionText: string) => {
    return currentAnswer === optionText;
  };

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        {/* Question Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="text-xs">
                Question {question.order_index + 1}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {question.points} point{question.points !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize flex items-center gap-1">
                <span>{getQuestionTypeIcon()}</span>
                {getQuestionTypeLabel()}
              </Badge>
              
              {markedForReview && (
                <Badge variant="destructive" className="text-xs">
                  Marked for Review
                </Badge>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-foreground">
              {question.question_text}
            </h3>
          </div>
          
          {onToggleReview && (
            <button
              onClick={onToggleReview}
              className={cn(
                "text-sm px-3 py-1 rounded-md border transition cursor-pointer",
                markedForReview 
                  ? "bg-destructive/10 text-destructive border-destructive/20" 
                  : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
              )}
              disabled={disabled}
            >
              {markedForReview ? 'Unmark' : 'Mark'}
            </button>
          )}
        </div>

        {/* Media Display */}
        {(question.image_url || question.video_url) && (
          <div className="mb-6 rounded-lg overflow-hidden bg-muted">
            {question.image_url && (
              <div className="relative">
                <img 
                  src={question.image_url} 
                  alt="Question illustration"
                  className="w-full h-auto max-h-64 object-contain"
                />
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <ImageIcon size={12} />
                  Image
                </div>
              </div>
            )}
            {question.video_url && (
              <div className="relative">
                <video 
                  src={question.video_url}
                  controls
                  className="w-full h-auto max-h-64"
                />
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <VideoIcon size={12} />
                  Video
                </div>
              </div>
            )}
          </div>
        )}

        {/* Answer Options */}
        <div className="space-y-3">
          {(question.question_type === 'multiple_choice' || question.question_type === 'true_false') && question.options && (
            <RadioGroup 
              value={currentAnswer as string} 
              onValueChange={handleSingleSelect}
              className="space-y-3"
              disabled={disabled}
            >
              {question.options.map((option, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex items-start space-x-3 p-4 rounded-lg border transition-all",
                    isOptionSelected(option.text)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <RadioGroupItem 
                    value={option.text} 
                    id={`option-${question.id}-${index}`}
                    className="mt-0.5"
                  />
                  <Label 
                    htmlFor={`option-${question.id}-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-muted font-medium text-sm">
                        {getOptionLabel(index)}
                      </div>
                      <div className="flex-1">
                        <span className="text-foreground">{option.text}</span>
                        {showExplanation && option.explanation && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {option.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.question_type === 'essay' && (
            <div className="space-y-2">
              <Label htmlFor={`essay-${question.id}`}>Your Answer</Label>
              <Textarea
                id={`essay-${question.id}`}
                value={currentAnswer as string || ''}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Type your essay answer here..."
                rows={6}
                className="resize-y min-h-[150px]"
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                Tip: Be thorough and structured in your response.
              </p>
            </div>
          )}

          {question.question_type === 'short_answer' && (
            <div className="space-y-2">
              <Label htmlFor={`short-answer-${question.id}`}>Your Answer</Label>
              <Input
                id={`short-answer-${question.id}`}
                value={currentAnswer as string || ''}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Enter your answer..."
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                Brief and precise answers are preferred.
              </p>
            </div>
          )}

          {question.question_type === 'code' && (
            <div className="space-y-2">
              <Label htmlFor={`code-${question.id}`}>Your Code</Label>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-900 text-gray-100 px-4 py-2 text-sm font-mono flex items-center justify-between">
                  <span>Code Editor</span>
                  <span className="text-xs text-gray-400">Write your solution below</span>
                </div>
                <textarea
                  id={`code-${question.id}`}
                  value={codeValue}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder={question.code_template || "// Write your code here..."}
                  rows={10}
                  className="w-full p-4 font-mono text-sm bg-gray-950 text-gray-100 focus:outline-none resize-y"
                  disabled={disabled}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Write your solution in the code editor above.
              </p>
            </div>
          )}

          {question.question_type === 'file_upload' && (
            <div className="space-y-2">
              <Label htmlFor={`file-${question.id}`}>Upload File</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id={`file-${question.id}`}
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={disabled}
                  accept={question.allowed_file_types?.join(',')}
                />
                <label htmlFor={`file-${question.id}`} className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {question.allowed_file_types 
                          ? `Allowed: ${question.allowed_file_types.join(', ')}`
                          : 'Any file type allowed'}
                      </p>
                    </div>
                  </div>
                </label>
                {filePreview && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      File selected: {currentAnswer as string}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {question.question_type === 'fill_blank' && (
            <div className="space-y-4">
              <Label>Fill in the blanks</Label>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {question.question_text.split('___').map((part, index, array) => (
                    <span key={index}>
                      {part}
                      {index < array.length - 1 && (
                        <input
                          type="text"
                          value={Array.isArray(currentAnswer) ? (currentAnswer[index] || '') : ''}
                          onChange={(e) => {
                            const newAnswers = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
                            newAnswers[index] = e.target.value;
                            onAnswerChange(newAnswers);
                          }}
                          className="inline-block mx-2 px-2 py-1 border-b-2 border-primary bg-transparent focus:outline-none min-w-[80px]"
                          placeholder="______"
                          disabled={disabled}
                        />
                      )}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          )}

          {question.question_type === 'matching' && question.options && (
            <div className="space-y-4">
              <Label>Match the items</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Items</h4>
                  {question.options.map((option, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded border">
                      <span className="font-medium">{option.text}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Matches</h4>
                  {question.options.map((option, index) => (
                    <div key={index} className="p-3">
                      <Input
                        type="text"
                        placeholder={`Match for "${option.text}"`}
                        value={Array.isArray(currentAnswer) ? (currentAnswer[index] || '') : ''}
                        onChange={(e) => {
                          const newAnswers = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
                          newAnswers[index] = e.target.value;
                          onAnswerChange(newAnswers);
                        }}
                        disabled={disabled}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hints */}
        {question.hints && question.hints.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <button
              onClick={() => setShowHint(!showHint)}
              className="cursor-pointer flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
              disabled={disabled}
            >
              <HelpCircle size={16} />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            
            {showHint && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  {question.hints[0]}
                </p>
                {question.hints.length > 1 && (
                  <p className="mt-1 text-xs text-blue-600">
                    Additional hints available after attempting.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Explanation (only shown in review mode) */}
        {showExplanation && question.explanation && (
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-2">Explanation</h4>
            <p className="text-sm text-muted-foreground">
              {question.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}















