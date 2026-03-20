

// // /src/components/assessments/question-builder.tsx

// 'use client';

// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Switch } from '@/components/ui/switch';
// import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
// import { Question, CreateQuestionData, UpdateQuestionData } from '@/types/assessments';

// interface QuestionBuilderProps {
//   assessmentId: string;
//   question?: Question;
//   onSave?: (question: Question) => void;
//   onCancel?: () => void;
// }

// const questionTypes = [
//   { value: 'multiple_choice', label: 'Multiple Choice' },
//   { value: 'true_false', label: 'True/False' },
//   { value: 'short_answer', label: 'Short Answer' },
//   { value: 'essay', label: 'Essay' }
// ];

// const difficultyLevels = [
//   { value: 'easy', label: 'Easy' },
//   { value: 'medium', label: 'Medium' },
//   { value: 'hard', label: 'Hard' }
// ];

// export function QuestionBuilder({ assessmentId, question, onSave, onCancel }: QuestionBuilderProps) {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     question_text: question?.question_text || '',
//     question_type: question?.question_type || 'multiple_choice',
//     difficulty: question?.difficulty || 'medium',
//     points: question?.points || 1,
//     explanation: question?.explanation || '',
//     hints: question?.hints?.join('\n') || '',
//     image_url: question?.image_url || '',
//     video_url: question?.video_url || '',
//     order_index: question?.order_index || 0
//   });

//   const [options, setOptions] = useState<Array<{
//     id: string;
//     text: string;
//     correct: boolean;
//     explanation: string;
//   }>>(
//     question?.options?.map((opt, index) => ({
//       id: `opt-${index}`,
//       text: opt.text,
//       correct: opt.correct,
//       explanation: opt.explanation || ''
//     })) || [
//       { id: 'opt-1', text: '', correct: false, explanation: '' },
//       { id: 'opt-2', text: '', correct: false, explanation: '' },
//       { id: 'opt-3', text: '', correct: false, explanation: '' },
//       { id: 'opt-4', text: '', correct: false, explanation: '' }
//     ]
//   );

//   const [correctAnswer, setCorrectAnswer] = useState(question?.correct_answer || '');
//   const [possibleAnswers, setPossibleAnswers] = useState(question?.possible_answers?.join('\n') || '');

//   const handleInputChange = (field: string, value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleOptionChange = (id: string, field: string, value: any) => {
//     setOptions(prev => prev.map(opt => 
//       opt.id === id ? { ...opt, [field]: value } : opt
//     ));
//   };

//   const handleAddOption = () => {
//     setOptions(prev => [
//       ...prev,
//       { id: `opt-${Date.now()}`, text: '', correct: false, explanation: '' }
//     ]);
//   };

//   const handleRemoveOption = (id: string) => {
//     if (options.length > 2) {
//       setOptions(prev => prev.filter(opt => opt.id !== id));
//     } else {
//       toast.error('Error', { description: 'At least two options are required' });
//     }
//   };

//   const handleToggleCorrect = (id: string) => {
//     if (formData.question_type === 'multiple_choice') {
//       // For multiple choice, only one correct answer
//       setOptions(prev => prev.map(opt => ({
//         ...opt,
//         correct: opt.id === id
//       })));
//       // Update correct answer text
//       const selectedOption = options.find(opt => opt.id === id);
//       if (selectedOption) {
//         setCorrectAnswer(selectedOption.text);
//       }
//     } else {
//       // For other types, toggle the specific option
//       setOptions(prev => prev.map(opt => 
//         opt.id === id ? { ...opt, correct: !opt.correct } : opt
//       ));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.question_text.trim()) {
//       toast.error('Error', { description: 'Question text is required' });
//       return;
//     }

//     if (formData.question_type === 'multiple_choice') {
//       const validOptions = options.filter(opt => opt.text.trim() !== '');
//       if (validOptions.length < 2) {
//         toast.error('Error', { description: 'At least two options are required for multiple choice' });
//         return;
//       }
      
//       const hasCorrect = validOptions.some(opt => opt.correct);
//       if (!hasCorrect) {
//         toast.error('Error', { description: 'Please select the correct answer' });
//         return;
//       }
//     }

//     if (formData.question_type === 'true_false' && !correctAnswer) {
//       toast.error('Error', { description: 'Please select True or False as the correct answer' });
//       return;
//     }

//     try {
//       setLoading(true);

//       let questionData: CreateQuestionData | UpdateQuestionData;
      
//       if (formData.question_type === 'multiple_choice') {
//         const validOptions = options
//           .filter(opt => opt.text.trim() !== '')
//           .map(opt => ({
//             text: opt.text.trim(),
//             correct: opt.correct,
//             explanation: opt.explanation.trim() || undefined
//           }));
        
//         const correctOption = validOptions.find(opt => opt.correct);
        
//         questionData = {
//           assessment_id: assessmentId,
//           question_text: formData.question_text.trim(),
//           question_type: formData.question_type,
//           options: validOptions,
//           correct_answer: correctOption?.text || '',
//           explanation: formData.explanation.trim() || undefined,
//           hints: formData.hints.split('\n').filter(h => h.trim()) || undefined,
//           points: Number(formData.points),
//           image_url: formData.image_url.trim() || undefined,
//           video_url: formData.video_url.trim() || undefined,
//           order_index: Number(formData.order_index),
//           difficulty: formData.difficulty
//         };
//       } else if (formData.question_type === 'true_false') {
//         questionData = {
//           assessment_id: assessmentId,
//           question_text: formData.question_text.trim(),
//           question_type: formData.question_type,
//           correct_answer: correctAnswer,
//           explanation: formData.explanation.trim() || undefined,
//           hints: formData.hints.split('\n').filter(h => h.trim()) || undefined,
//           points: Number(formData.points),
//           image_url: formData.image_url.trim() || undefined,
//           video_url: formData.video_url.trim() || undefined,
//           order_index: Number(formData.order_index),
//           difficulty: formData.difficulty
//         };
//       } else {
//         questionData = {
//           assessment_id: assessmentId,
//           question_text: formData.question_text.trim(),
//           question_type: formData.question_type,
//           correct_answer: correctAnswer.trim() || undefined,
//           possible_answers: possibleAnswers.split('\n').filter(a => a.trim()) || undefined,
//           explanation: formData.explanation.trim() || undefined,
//           hints: formData.hints.split('\n').filter(h => h.trim()) || undefined,
//           points: Number(formData.points),
//           image_url: formData.image_url.trim() || undefined,
//           video_url: formData.video_url.trim() || undefined,
//           order_index: Number(formData.order_index),
//           difficulty: formData.difficulty
//         };
//       }

//       const url = question ? `/api/questions/${question.id}` : `/api/assessments/${assessmentId}/questions`;
//       const method = question ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(questionData)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success('Success', {
//           description: data.message || `Question ${question ? 'updated' : 'created'} successfully`
//         });

//         if (onSave && data.question) {
//           onSave(data.question);
//         }
//       } else {
//         const errorMessage = data.error || data.details?.[0]?.message || 'Failed to save question';
//         toast.error('Error', { description: errorMessage });
//       }
//     } catch (error) {
//       console.error('Error saving question:', error);
//       toast.error('Error', { description: 'Network error. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>
//           {question ? 'Edit Question' : 'Add New Question'}
//         </CardTitle>
//         <CardDescription>
//           {question 
//             ? 'Update your question details'
//             : 'Add a new question to your assessment'
//           }
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Question Type */}
//           <div className="space-y-2">
//             <Label htmlFor="question_type">Question Type</Label>
//             <Select 
//               value={formData.question_type} 
//               onValueChange={(value) => {
//                 handleInputChange('question_type', value);
//                 // Reset options for True/False
//                 if (value === 'true_false') {
//                   setOptions([
//                     { id: 'opt-1', text: 'True', correct: false, explanation: '' },
//                     { id: 'opt-2', text: 'False', correct: false, explanation: '' }
//                   ]);
//                   setCorrectAnswer('');
//                 }
//               }}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {questionTypes.map(type => (
//                   <SelectItem key={type.value} value={type.value}>
//                     {type.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Question Text */}
//           <div className="space-y-2">
//             <Label htmlFor="question_text">Question Text *</Label>
//             <Textarea
//               id="question_text"
//               value={formData.question_text}
//               onChange={(e) => handleInputChange('question_text', e.target.value)}
//               placeholder="Enter your question here..."
//               rows={3}
//               required
//             />
//           </div>

//           {/* Options for Multiple Choice */}
//           {formData.question_type === 'multiple_choice' && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <Label>Answer Options</Label>
//                 <Button
//                  className="cursor-pointer"
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={handleAddOption}
//                 >
//                   <Plus className="h-4 w-4 mr-1" />
//                   Add Option
//                 </Button>
//               </div>
              
//               <div className="space-y-3">
//                 {options.map((option, index) => (
//                   <div key={option.id} className="space-y-2 p-3 border rounded-lg">
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center space-x-2 flex-1">
//                         <button
//                           type="button"
//                           onClick={() => handleToggleCorrect(option.id)}
//                           className="mt-1 cursor-pointer"
//                         >
//                           {option.correct ? (
//                             <CheckCircle className="h-5 w-5 text-green-600" />
//                           ) : (
//                             <Circle className="h-5 w-5 text-gray-400" />
//                           )}
//                         </button>
//                         <span className="font-medium">Option {index + 1}</span>
//                         {option.correct && (
//                           <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
//                             Correct Answer
//                           </span>
//                         )}
//                       </div>
//                       {options.length > 2 && (
//                         <Button
//                         className="cursor-pointer"
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handleRemoveOption(option.id)}
//                         >
//                           <Trash2 className="h-4 w-4 text-red-500" />
//                         </Button>
//                       )}
//                     </div>
                    
//                     <div className="space-y-2">
//                       <Input
//                         value={option.text}
//                         onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
//                         placeholder={`Enter option ${index + 1} text...`}
//                         required={index < 2}
//                       />
                      
//                       <Textarea
//                         value={option.explanation}
//                         onChange={(e) => handleOptionChange(option.id, 'explanation', e.target.value)}
//                         placeholder="Explanation for this option (optional)"
//                         rows={2}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <p className="text-sm text-gray-500">
//                 Click the circle to mark the correct answer. You can add explanations for each option.
//               </p>
//             </div>
//           )}

//           {/* True/False Options */}
//           {formData.question_type === 'true_false' && (
//             <div className="space-y-4">
//               <Label>Select Correct Answer</Label>
//               <div className="grid grid-cols-2 gap-4">
//                 <button
//                   type="button"
//                   onClick={() => setCorrectAnswer('True')}
//                   className={`p-4 border-2 rounded-lg text-center cursor-pointer transition-colors ${
//                     correctAnswer === 'True' 
//                       ? 'border-green-600 bg-green-50' 
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <div className="text-lg font-semibold">True</div>
//                   {correctAnswer === 'True' && (
//                     <div className="text-sm text-green-600 mt-1">✓ Correct Answer</div>
//                   )}
//                 </button>
                
//                 <button
//                   type="button"
//                   onClick={() => setCorrectAnswer('False')}
//                   className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-colors ${
//                     correctAnswer === 'False' 
//                       ? 'border-green-600 bg-green-50' 
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <div className="text-lg font-semibold">False</div>
//                   {correctAnswer === 'False' && (
//                     <div className="text-sm text-green-600 mt-1">✓ Correct Answer</div>
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Short Answer/Essay Options */}
//           {(formData.question_type === 'short_answer' || formData.question_type === 'essay') && (
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="correct_answer">
//                   {formData.question_type === 'short_answer' ? 'Correct Answer' : 'Sample Answer'}
//                 </Label>
//                 <Textarea
//                   id="correct_answer"
//                   value={correctAnswer}
//                   onChange={(e) => setCorrectAnswer(e.target.value)}
//                   placeholder={
//                     formData.question_type === 'short_answer' 
//                       ? 'Enter the expected short answer...' 
//                       : 'Enter a sample essay answer...'
//                   }
//                   rows={formData.question_type === 'essay' ? 4 : 2}
//                 />
//               </div>
              
//               {formData.question_type === 'short_answer' && (
//                 <div className="space-y-2">
//                   <Label htmlFor="possible_answers">Possible Answers (Optional)</Label>
//                   <Textarea
//                     id="possible_answers"
//                     value={possibleAnswers}
//                     onChange={(e) => setPossibleAnswers(e.target.value)}
//                     placeholder="Enter each possible answer on a new line"
//                     rows={3}
//                   />
//                   <p className="text-xs text-gray-500">
//                     Acceptable variations of the correct answer. One per line.
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Additional Settings */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Additional Settings</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="points">Points</Label>
//                 <Input
//                   id="points"
//                   type="number"
//                   min="1"
//                   value={formData.points}
//                   onChange={(e) => handleInputChange('points', e.target.value)}
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="difficulty">Difficulty</Label>
//                 <Select 
//                   value={formData.difficulty} 
//                   onValueChange={(value) => handleInputChange('difficulty', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {difficultyLevels.map(level => (
//                       <SelectItem key={level.value} value={level.value}>
//                         {level.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="order_index">Order Index</Label>
//                 <Input
//                   id="order_index"
//                   type="number"
//                   min="0"
//                   value={formData.order_index}
//                   onChange={(e) => handleInputChange('order_index', e.target.value)}
//                 />
//               </div>
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="explanation">Explanation (Optional)</Label>
//               <Textarea
//                 id="explanation"
//                 value={formData.explanation}
//                 onChange={(e) => handleInputChange('explanation', e.target.value)}
//                 placeholder="Explain why the correct answer is correct"
//                 rows={3}
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="hints">Hints (Optional)</Label>
//               <Textarea
//                 id="hints"
//                 value={formData.hints}
//                 onChange={(e) => handleInputChange('hints', e.target.value)}
//                 placeholder="Enter each hint on a new line"
//                 rows={2}
//               />
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="image_url">Image URL (Optional)</Label>
//                 <Input
//                   id="image_url"
//                   value={formData.image_url}
//                   onChange={(e) => handleInputChange('image_url', e.target.value)}
//                   placeholder="https://example.com/image.jpg"
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="video_url">Video URL (Optional)</Label>
//                 <Input
//                   id="video_url"
//                   value={formData.video_url}
//                   onChange={(e) => handleInputChange('video_url', e.target.value)}
//                   placeholder="https://example.com/video.mp4"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Submit Buttons */}
//           <div className="flex space-x-4 pt-4">
//             <Button type="submit" disabled={loading} className="flex-1 cursor-pointer">
//               {loading ? 'Saving...' : (question ? 'Update Question' : 'Add Question')}
//             </Button>
            
//             {onCancel && (
//               <Button
//               className="cursor-pointer"
//                 type="button"
//                 variant="outline"
//                 onClick={onCancel}
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//             )}
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }






























// /src/components/assessments/question-builder.tsx

'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Question, CreateQuestionData, UpdateQuestionData } from '@/types/assessments';

interface QuestionBuilderProps {
  assessmentId: string;
  question?: Question;
  onSave?: (question: Question) => void;
  onCancel?: () => void;
}

const questionTypes = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'true_false', label: 'True/False' },
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'essay', label: 'Essay' },
];

const difficultyLevels = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

// ✅ Helper: convert a newline-separated textarea string into string[] | undefined
function parseLines(value: string): string[] | undefined {
  const lines = value
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : undefined;
}

export function QuestionBuilder({ assessmentId, question, onSave, onCancel }: QuestionBuilderProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    question_text: question?.question_text || '',
    question_type: question?.question_type || 'multiple_choice',
    difficulty: question?.difficulty || 'medium',
    points: question?.points || 1,
    explanation: question?.explanation || '',
    hints: question?.hints?.join('\n') || '',
    image_url: question?.image_url || '',
    video_url: question?.video_url || '',
    order_index: question?.order_index || 0,
  });

  const [options, setOptions] = useState<Array<{
    id: string;
    text: string;
    correct: boolean;
    explanation: string;
  }>>(
    question?.options?.map((opt, index) => ({
      id: `opt-${index}`,
      text: opt.text,
      correct: opt.correct,
      explanation: opt.explanation || '',
    })) || [
      { id: 'opt-1', text: '', correct: false, explanation: '' },
      { id: 'opt-2', text: '', correct: false, explanation: '' },
      { id: 'opt-3', text: '', correct: false, explanation: '' },
      { id: 'opt-4', text: '', correct: false, explanation: '' },
    ]
  );

  const [correctAnswer, setCorrectAnswer] = useState(question?.correct_answer || '');
  const [possibleAnswers, setPossibleAnswers] = useState(
    question?.possible_answers?.join('\n') || ''
  );

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (id: string, field: string, value: any) => {
    setOptions((prev) => prev.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt)));
  };

  const handleAddOption = () => {
    setOptions((prev) => [
      ...prev,
      { id: `opt-${Date.now()}`, text: '', correct: false, explanation: '' },
    ]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length > 2) {
      setOptions((prev) => prev.filter((opt) => opt.id !== id));
    } else {
      toast.error('Error', { description: 'At least two options are required' });
    }
  };

  const handleToggleCorrect = (id: string) => {
    if (formData.question_type === 'multiple_choice') {
      setOptions((prev) => prev.map((opt) => ({ ...opt, correct: opt.id === id })));
      const selected = options.find((opt) => opt.id === id);
      if (selected) setCorrectAnswer(selected.text);
    } else {
      setOptions((prev) =>
        prev.map((opt) => (opt.id === id ? { ...opt, correct: !opt.correct } : opt))
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question_text.trim()) {
      toast.error('Error', { description: 'Question text is required' });
      return;
    }

    if (formData.question_type === 'multiple_choice') {
      const validOptions = options.filter((opt) => opt.text.trim() !== '');
      if (validOptions.length < 2) {
        toast.error('Error', { description: 'At least two options are required for multiple choice' });
        return;
      }
      if (!validOptions.some((opt) => opt.correct)) {
        toast.error('Error', { description: 'Please select the correct answer' });
        return;
      }
    }

    if (formData.question_type === 'true_false' && !correctAnswer) {
      toast.error('Error', { description: 'Please select True or False as the correct answer' });
      return;
    }

    try {
      setLoading(true);

      // ✅ Parse hints once, correctly — undefined when empty so API never sees []
      const parsedHints = parseLines(formData.hints);

      let questionData: CreateQuestionData | UpdateQuestionData;

      if (formData.question_type === 'multiple_choice') {
        const validOptions = options
          .filter((opt) => opt.text.trim() !== '')
          .map((opt) => ({
            text: opt.text.trim(),
            correct: opt.correct,
            ...(opt.explanation.trim() ? { explanation: opt.explanation.trim() } : {}),
          }));

        const correctOption = validOptions.find((opt) => opt.correct);

        questionData = {
          assessment_id: assessmentId,
          question_text: formData.question_text.trim(),
          question_type: formData.question_type,
          options: validOptions,
          correct_answer: correctOption?.text || '',
          explanation: formData.explanation.trim() || undefined,
          hints: parsedHints,                          // ✅ undefined when empty
          points: Number(formData.points),
          image_url: formData.image_url.trim() || undefined,
          video_url: formData.video_url.trim() || undefined,
          order_index: Number(formData.order_index),
          difficulty: formData.difficulty,
        };
      } else if (formData.question_type === 'true_false') {
        questionData = {
          assessment_id: assessmentId,
          question_text: formData.question_text.trim(),
          question_type: formData.question_type,
          correct_answer: correctAnswer,
          explanation: formData.explanation.trim() || undefined,
          hints: parsedHints,                          // ✅ undefined when empty
          points: Number(formData.points),
          image_url: formData.image_url.trim() || undefined,
          video_url: formData.video_url.trim() || undefined,
          order_index: Number(formData.order_index),
          difficulty: formData.difficulty,
        };
      } else {
        questionData = {
          assessment_id: assessmentId,
          question_text: formData.question_text.trim(),
          question_type: formData.question_type,
          correct_answer: correctAnswer.trim() || undefined,
          possible_answers: parseLines(possibleAnswers),  // ✅ same fix for possible_answers
          explanation: formData.explanation.trim() || undefined,
          hints: parsedHints,                             // ✅ undefined when empty
          points: Number(formData.points),
          image_url: formData.image_url.trim() || undefined,
          video_url: formData.video_url.trim() || undefined,
          order_index: Number(formData.order_index),
          difficulty: formData.difficulty,
        };
      }

      const url = question
        ? `/api/questions/${question.id}`
        : `/api/assessments/${assessmentId}/questions`;
      const method = question ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Success', {
          description: data.message || `Question ${question ? 'updated' : 'created'} successfully`,
        });
        if (onSave && data.question) {
          onSave(data.question);
        }
      } else {
        const errorMessage =
          data.error || data.details?.[0]?.message || 'Failed to save question';
        toast.error('Error', { description: errorMessage });
      }
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Error', { description: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{question ? 'Edit Question' : 'Add New Question'}</CardTitle>
        <CardDescription>
          {question ? 'Update your question details' : 'Add a new question to your assessment'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Type */}
          <div className="space-y-2">
            <Label htmlFor="question_type">Question Type</Label>
            <Select
              value={formData.question_type}
              onValueChange={(value) => {
                handleInputChange('question_type', value);
                if (value === 'true_false') {
                  setOptions([
                    { id: 'opt-1', text: 'True', correct: false, explanation: '' },
                    { id: 'opt-2', text: 'False', correct: false, explanation: '' },
                  ]);
                  setCorrectAnswer('');
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="question_text">Question Text *</Label>
            <Textarea
              id="question_text"
              value={formData.question_text}
              onChange={(e) => handleInputChange('question_text', e.target.value)}
              placeholder="Enter your question here..."
              rows={3}
              required
            />
          </div>

          {/* Multiple Choice Options */}
          {formData.question_type === 'multiple_choice' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Answer Options</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddOption} className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={option.id} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 flex-1">
                        <button
                          type="button"
                          onClick={() => handleToggleCorrect(option.id)}
                          className="mt-1 cursor-pointer"
                        >
                          {option.correct ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        <span className="font-medium">Option {index + 1}</span>
                        {option.correct && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Correct Answer
                          </span>
                        )}
                      </div>
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveOption(option.id)}
                          className="cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Input
                        value={option.text}
                        onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                        placeholder={`Enter option ${index + 1} text...`}
                        required={index < 2}
                      />
                      <Textarea
                        value={option.explanation}
                        onChange={(e) => handleOptionChange(option.id, 'explanation', e.target.value)}
                        placeholder="Explanation for this option (optional)"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500">
                Click the circle to mark the correct answer. You can add explanations for each option.
              </p>
            </div>
          )}

          {/* True/False */}
          {formData.question_type === 'true_false' && (
            <div className="space-y-4">
              <Label>Select Correct Answer</Label>
              <div className="grid grid-cols-2 gap-4">
                {['True', 'False'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCorrectAnswer(val)}
                    className={`p-4 border-2 rounded-lg text-center cursor-pointer transition-colors ${
                      correctAnswer === val
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg font-semibold">{val}</div>
                    {correctAnswer === val && (
                      <div className="text-sm text-green-600 mt-1">✓ Correct Answer</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Short Answer / Essay */}
          {(formData.question_type === 'short_answer' || formData.question_type === 'essay') && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="correct_answer">
                  {formData.question_type === 'short_answer' ? 'Correct Answer' : 'Sample Answer'}
                </Label>
                <Textarea
                  id="correct_answer"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  placeholder={
                    formData.question_type === 'short_answer'
                      ? 'Enter the expected short answer...'
                      : 'Enter a sample essay answer...'
                  }
                  rows={formData.question_type === 'essay' ? 4 : 2}
                />
              </div>

              {formData.question_type === 'short_answer' && (
                <div className="space-y-2">
                  <Label htmlFor="possible_answers">Possible Answers (Optional)</Label>
                  <Textarea
                    id="possible_answers"
                    value={possibleAnswers}
                    onChange={(e) => setPossibleAnswers(e.target.value)}
                    placeholder="Enter each possible answer on a new line"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Acceptable variations of the correct answer. One per line.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Additional Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  value={formData.points}
                  onChange={(e) => handleInputChange('points', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => handleInputChange('difficulty', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_index">Order Index</Label>
                <Input
                  id="order_index"
                  type="number"
                  min="0"
                  value={formData.order_index}
                  onChange={(e) => handleInputChange('order_index', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation (Optional)</Label>
              <Textarea
                id="explanation"
                value={formData.explanation}
                onChange={(e) => handleInputChange('explanation', e.target.value)}
                placeholder="Explain why the correct answer is correct"
                rows={3}
              />
            </div>

            {/* ✅ Hints field — now submits correctly */}
            {/* <div className="space-y-2">
              <Label htmlFor="hints">Hints (Optional)</Label>
              <Textarea
                id="hints"
                value={formData.hints}
                onChange={(e) => handleInputChange('hints', e.target.value)}
                placeholder="Enter each hint on a new line"
                rows={2}
              />
              <p className="text-xs text-gray-500">
                One hint per line. Leave blank if no hints needed.
              </p>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL (Optional)</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL (Optional)</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => handleInputChange('video_url', e.target.value)}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1 cursor-pointer">
              {loading ? 'Saving...' : question ? 'Update Question' : 'Add Question'}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
