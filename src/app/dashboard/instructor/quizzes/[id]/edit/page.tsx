

// // /src/app/dashboard/instructor/quizzes/[id]/edit/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssessmentBuilder } from '@/components/assessments/assessment-builder';
import { QuestionBuilder } from '@/components/assessments/question-builder';
import { 
  ArrowLeft, 
  Settings, 
  FileQuestion, 
  Eye, 
  Copy, 
  Trash2,
  Plus,
  Edit,
  GripVertical,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { Assessment, Question, CreateQuestionData } from '@/types/assessments';

export default function EditAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const assessmentId = params.id as string;
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('settings');
  const [showQuestionForm, setShowQuestionForm] = useState(false); // NEW: Track if we're showing the question form
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (assessmentId) {
      fetchAssessment();
      fetchQuestions();
    }
  }, [assessmentId]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const fetchAssessment = async () => {
    try {
      const response = await fetch(`/api/assessments/${assessmentId}`);
      if (response.ok) {
        const data = await response.json();
        // Ensure all required fields are properly set
        const assessmentData = data.assessment;
        
        // Make sure all form fields have proper values (convert null to undefined where needed)
        const formattedAssessment = {
          ...assessmentData,
          course_id: assessmentData.course_id || '',
          lesson_id: assessmentData.lesson_id || '',
          description: assessmentData.description || '',
          instructions: assessmentData.instructions || '',
          time_limit: assessmentData.time_limit || undefined,
          duration_minutes: assessmentData.duration_minutes || undefined,
          available_from: assessmentData.available_from || '',
          available_until: assessmentData.available_until || '',
          // Ensure boolean fields are properly set
          shuffle_questions: assessmentData.shuffle_questions || false,
          show_correct_answers: assessmentData.show_correct_answers || false,
          show_results_immediately: assessmentData.show_results_immediately || false,
          require_passing: assessmentData.require_passing || false
        };
        
        setAssessment(formattedAssessment);
      } else {
        toast.error('Error', { description: 'Failed to load assessment' });
        router.push('/dashboard/instructor/quizzes');
      }
    } catch (error) {
      console.error('Error fetching assessment:', error);
      toast.error('Error', { description: 'Network error' });
      router.push('/dashboard/instructor/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/assessments/${assessmentId}/questions`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAssessmentSaved = (updatedAssessment: Assessment) => {
    setAssessment(updatedAssessment);
    toast.success('Success', { description: 'Assessment updated successfully' });
  };

  const handleQuestionSaved = (question: Question) => {
    if (editingQuestion) {
      // Update existing question
      setQuestions(prev => prev.map(q => 
        q.id === question.id ? question : q
      ));
    } else {
      // Add new question
      setQuestions(prev => [...prev, question]);
    }
    
    // Reset form state
    setEditingQuestion(null);
    setShowQuestionForm(false);
    
    // Refresh questions to get proper ordering
    fetchQuestions();
  };

  // NEW: Handler for canceling question form
  const handleCancelQuestionForm = () => {
    setEditingQuestion(null);
    setShowQuestionForm(false);
  };

  // NEW: Handler for starting a new question
  const handleStartNewQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionForm(true);
  };

  // NEW: Handler for editing an existing question
  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Success', { description: data.message });
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        setEditingQuestion(null);
        setShowQuestionForm(false);
      } else {
        toast.error('Error', { description: data.error || 'Failed to delete question' });
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Error', { description: 'Network error' });
    }
  };

  const handleReorderQuestion = async (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = questions.findIndex(q => q.id === questionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;

    const newOrder = [...questions];
    const [movedQuestion] = newOrder.splice(currentIndex, 1);
    newOrder.splice(newIndex, 0, movedQuestion);

    // Update order_index for all questions
    const questionIds = newOrder.map(q => q.id);

    try {
      const response = await fetch(`/api/assessments/${assessmentId}/questions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder',
          questionIds
        })
      });

      if (response.ok) {
        setQuestions(newOrder);
        toast.success('Success', { description: 'Question order updated' });
      } else {
        const data = await response.json();
        toast.error('Error', { description: data.error || 'Failed to reorder questions' });
      }
    } catch (error) {
      console.error('Error reordering questions:', error);
      toast.error('Error', { description: 'Network error' });
    }
  };

  const handleDuplicateQuestion = async (question: Question) => {
  try {
    // Create duplicate data with proper type handling
    const duplicateData = {
      assessment_id: question.assessment_id,
      question_text: `${question.question_text} (Copy)`,
      question_type: question.question_type,
      options: question.options || undefined,
      correct_answer: question.correct_answer || undefined,
      possible_answers: question.possible_answers || undefined,
      explanation: question.explanation || undefined,
      hints: question.hints || undefined,
      points: question.points,
      image_url: question.image_url || undefined,
      video_url: question.video_url || undefined,
      order_index: questions.length,
      difficulty: question.difficulty
    };
    
    const response = await fetch(`/api/assessments/${assessmentId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(duplicateData)
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('Success', { description: 'Question duplicated successfully' });
      fetchQuestions();
    } else {
      toast.error('Error', { description: data.error || 'Failed to duplicate question' });
    }
  } catch (error) {
    console.error('Error duplicating question:', error);
    toast.error('Error', { description: 'Network error' });
  }
};

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple_choice': return '🔘';
      case 'true_false': return '✅';
      case 'short_answer': return '📝';
      case 'essay': return '📄';
      default: return '❓';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || !assessment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/instructor/quizzes">
            <Button variant="outline" size="sm" className="cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Assessments
            </Button>
          </Link>
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/instructor/quizzes">
              <Button variant="outline" size="sm" className="cursor-pointer">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{assessment.title}</h1>
          </div>
          <p className="text-muted-foreground">
            {assessment.description || 'Edit assessment settings and questions'}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Link href={`/dashboard/instructor/quizzes/${assessmentId}`}>
            <Button variant="outline" className="cursor-pointer">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <FileQuestion className="h-4 w-4" />
            Questions ({questions.length})
          </TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <AssessmentBuilder
            assessment={assessment}
            onSave={handleAssessmentSaved}
            onCancel={() => router.push('/dashboard/instructor/quizzes')}
            // Add these props for edit mode:
            courseId={assessment.course_id} // Pass the course_id
            courses={[{ 
              id: assessment.course_id, 
              title: assessment.course_title || 'Unknown Course' 
            }]} // Pass course info as array
          />
        </TabsContent>
        {/* <TabsContent value="settings" className="space-y-6">
          <AssessmentBuilder
            assessment={assessment}
            onSave={handleAssessmentSaved}
            onCancel={() => router.push('/dashboard/instructor/quizzes')}
          />
        </TabsContent> */}

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          {/* Show Question Builder Form if editing or adding new question */}
          {showQuestionForm || editingQuestion ? (
            <QuestionBuilder
              assessmentId={assessmentId}
              question={editingQuestion || undefined}
              onSave={handleQuestionSaved}
              onCancel={handleCancelQuestionForm}
            />
          ) : (
            <>
              {/* Add Question Button */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Add New Question</h3>
                      <p className="text-sm text-gray-600">
                        Create different types of questions for your assessment
                      </p>
                    </div>
                    <Button className="cursor-pointer" onClick={handleStartNewQuestion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Questions List */}
              {questions.length > 0 ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Questions ({questions.length})</CardTitle>
                      <CardDescription>
                        Drag and drop to reorder questions, or click to edit
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {questions.map((question, index) => (
                          <div
                            key={question.id}
                            className="group border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="pt-1">
                                  <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                                </div>
                                
                                <div className="space-y-2 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">
                                      {getQuestionTypeIcon(question.question_type)}
                                    </span>
                                    <h4 className="font-medium">
                                      Question {index + 1}: {question.question_text}
                                    </h4>
                                  </div>
                                  
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(question.difficulty)}`}>
                                      {question.difficulty}
                                    </span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                      {question.points} point{question.points !== 1 ? 's' : ''}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      Type: {question.question_type.replace('_', ' ')}
                                    </span>
                                  </div>
                                  
                                  {question.explanation && (
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Explanation:</span> {question.explanation}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex flex-col space-y-2">
                                <div className="flex space-x-1">
                                  <Button
                                    className="cursor-pointer"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReorderQuestion(question.id, 'up')}
                                    disabled={index === 0}
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    className="cursor-pointer"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReorderQuestion(question.id, 'down')}
                                    disabled={index === questions.length - 1}
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="flex space-x-1">
                                  <Button
                                    className="cursor-pointer"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditQuestion(question)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    className="cursor-pointer"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDuplicateQuestion(question)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                    className="text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Assessment Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Assessment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Total Questions</p>
                          <p className="text-2xl font-bold">{questions.length}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Total Points</p>
                          <p className="text-2xl font-bold">
                            {questions.reduce((sum, q) => sum + q.points, 0)}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Question Types</p>
                          <div className="flex flex-wrap gap-2">
                            {Array.from(new Set(questions.map(q => q.question_type))).map(type => (
                              <span key={type} className="px-2 py-1 bg-gray-100 rounded text-sm">
                                {type.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="text-6xl mb-4">❓</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions yet</h3>
                    <p className="text-gray-600 mb-6">
                      Add questions to your assessment to make it complete
                    </p>
                    <Button className="cursor-pointer" onClick={handleStartNewQuestion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Question
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}