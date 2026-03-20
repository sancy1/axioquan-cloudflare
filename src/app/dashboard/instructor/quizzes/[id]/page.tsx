
// // /src/app/dashboard/instructor/quizzes/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Copy, 
  Trash2,
  FileQuestion,
  CheckCircle,
  XCircle,
  Play,
  Plus,
  BarChart3,
  Clock,
  Users,
  Download,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import { Assessment, Question } from '@/types/assessments';

export default function AssessmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id as string;
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAssessment = async () => {
    try {
      const response = await fetch(`/api/assessments/${assessmentId}`);
      if (response.ok) {
        const data = await response.json();
        setAssessment(data.assessment);
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

  const fetchAssessments = async () => {
    try {
      const response = await fetch('/api/assessments');
      if (response.ok) {
        const data = await response.json();
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  useEffect(() => {
    if (assessmentId) {
      fetchAssessment();
      fetchQuestions();
    }
  }, [assessmentId]);

  const handleDeleteAssessment = async () => {
    if (!assessment || !confirm(`Are you sure you want to delete "${assessment.title}"? This will also delete all questions.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/assessments/${assessmentId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Success', { description: data.message });
        router.push('/dashboard/instructor/quizzes');
      } else {
        toast.error('Error', { description: data.error || 'Failed to delete assessment' });
      }
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error('Error', { description: 'Network error' });
    }
  };

  const handleDuplicateAssessment = async () => {
    if (!assessment) return;

    try {
      const { id, created_at, updated_at, question_count, course_title, lesson_title, ...assessmentData } = assessment;
      
      const duplicateData = {
        course_id: assessment.course_id,
        title: `${assessment.title} (Copy)`,
        description: assessment.description || undefined,
        instructions: assessment.instructions || undefined,
        type: assessment.type,
        difficulty: assessment.difficulty,
        passing_score: assessment.passing_score,
        max_attempts: assessment.max_attempts,
        time_limit: assessment.time_limit || undefined,
        shuffle_questions: assessment.shuffle_questions,
        show_correct_answers: assessment.show_correct_answers,
        show_results_immediately: assessment.show_results_immediately,
        require_passing: assessment.require_passing,
        points_per_question: assessment.points_per_question,
        total_points: assessment.total_points,
        lesson_id: assessment.lesson_id || undefined,
        available_from: assessment.available_from || undefined,
        available_until: assessment.available_until || undefined,
        duration_minutes: assessment.duration_minutes || undefined
      };
      
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Success', { description: 'Assessment duplicated successfully' });
        await fetchAssessments();
        
        if (data.assessment) {
          router.push(`/dashboard/instructor/quizzes/${data.assessment.id}/edit`);
        }
      } else {
        toast.error('Error', { description: data.error || 'Failed to duplicate assessment' });
      }
    } catch (error) {
      console.error('Error duplicating assessment:', error);
      toast.error('Error', { description: 'Network error' });
    }
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'quiz': return { icon: '❓', color: 'bg-blue-100 text-blue-800', label: 'Quiz' };
      case 'test': return { icon: '📝', color: 'bg-purple-100 text-purple-800', label: 'Test' };
      case 'exam': return { icon: '📚', color: 'bg-red-100 text-red-800', label: 'Exam' };
      case 'practice': return { icon: '🔄', color: 'bg-green-100 text-green-800', label: 'Practice' };
      default: return { icon: '📋', color: 'bg-gray-100 text-gray-800', label: type };
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Badge className="bg-green-100 text-green-800 border-green-200">Easy</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
      case 'hard': return <Badge className="bg-red-100 text-red-800 border-red-200">Hard</Badge>;
      default: return <Badge>{difficulty}</Badge>;
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

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const typeInfo = getTypeInfo(assessment.type);

  return (
    <div className="space-y-6">
      {/* Header - Simplified */}
            {/* Back Button - At the very top */}
      <div>
        <Link href="/dashboard/instructor/quizzes">
          <Button variant="outline" size="sm" className="cursor-pointer"> 
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Back to Assessments</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      </div>

      {/* Title Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{typeInfo.icon}</span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate max-w-[300px] sm:max-w-[500px] lg:max-w-[700px]">
            {assessment.title}
          </h1>
          <Badge className={`${typeInfo.color} shrink-0 hidden sm:inline-flex`}>
            {typeInfo.label}
          </Badge>
        </div>
        <Badge className={`${typeInfo.color} shrink-0 sm:hidden`}>
          {typeInfo.label}
        </Badge>
      </div>

      {/* Description */}
      {assessment.description && (
        <p className="text-muted-foreground text-sm sm:text-base">
          {assessment.description}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Link href={`/dashboard/instructor/quizzes/${assessmentId}/edit?tab=questions`}>
          <Button variant="outline" size="sm" className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Add Questions
          </Button>
        </Link>
        
        <Link href={`/dashboard/instructor/quizzes/${assessmentId}/edit`}>
          <Button size="sm" className="cursor-pointer">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
        
        <Button variant="outline" size="sm" className="cursor-pointer" onClick={handleDuplicateAssessment}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </Button>
        
        <Button variant="destructive" size="sm" onClick={handleDeleteAssessment} className="cursor-pointer">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Questions</p>
                <p className="text-xl sm:text-2xl font-bold">{questions.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg shrink-0">
                <FileQuestion className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Points</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {questions.reduce((sum, q) => sum + q.points, 0)}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-50 rounded-lg shrink-0">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Time Limit</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {assessment.time_limit ? `${assessment.time_limit} min` : 'None'}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-50 rounded-lg shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Max Attempts</p>
                <p className="text-xl sm:text-2xl font-bold">{assessment.max_attempts}</p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-50 rounded-lg shrink-0">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="questions" className="text-xs sm:text-sm">
            Questions ({questions.length})
          </TabsTrigger>
          <TabsTrigger value="preview" className="text-xs sm:text-sm">Preview</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Assessment Details */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Assessment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Course</p>
                      <p className="font-medium text-sm sm:text-base truncate">
                        {assessment.course_title || 'Unknown Course'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Linked Lesson</p>
                      <p className="font-medium text-sm sm:text-base truncate">
                        {assessment.lesson_title || 'Not linked to a lesson'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Difficulty</p>
                      <div className="mt-1">{getDifficultyBadge(assessment.difficulty)}</div>
                    </div>
                    
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Passing Score</p>
                      <p className="font-medium text-sm sm:text-base">{assessment.passing_score}%</p>
                    </div>
                    
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Available From</p>
                      <p className="font-medium text-sm sm:text-base">{formatDate(assessment.available_from)}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Available Until</p>
                      <p className="font-medium text-sm sm:text-base">{formatDate(assessment.available_until)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              {assessment.instructions && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg sm:text-xl">Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none text-sm sm:text-base">
                      <p className="whitespace-pre-wrap break-words">{assessment.instructions}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Settings & Actions */}
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">Shuffle Questions</p>
                    </div>
                    {assessment.shuffle_questions ? (
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">Show Correct Answers</p>
                    </div>
                    {assessment.show_correct_answers ? (
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">Show Results Immediately</p>
                    </div>
                    {assessment.show_results_immediately ? (
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">Require Passing Grade</p>
                    </div>
                    {assessment.require_passing ? (
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href={`/dashboard/instructor/quizzes/${assessmentId}/edit?tab=questions`} className="block">
                    <Button variant="outline" className="w-full cursor-pointer justify-start text-xs sm:text-sm h-9 sm:h-10">
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Add More Questions
                    </Button>
                  </Link>
                  
                  <Link href={`/dashboard/instructor/quizzes/${assessmentId}/edit`} className="block">
                    <Button variant="outline" className="w-full cursor-pointer justify-start text-xs sm:text-sm h-9 sm:h-10">
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Edit Assessment Settings
                    </Button>
                  </Link>
                  
                  <Link href={`/dashboard/instructor/quizzes/${assessmentId}/edit?tab=questions`} className="block">
                    <Button variant="outline" className="w-full cursor-pointer justify-start text-xs sm:text-sm h-9 sm:h-10">
                      <FileQuestion className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Manage All Questions
                    </Button>
                  </Link>
                  
                  <Button variant="outline" className="w-full cursor-pointer justify-start text-xs sm:text-sm h-9 sm:h-10" onClick={handleDuplicateAssessment}>
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Duplicate Assessment
                  </Button>
                  
                  <Button variant="outline" className="w-full cursor-pointer justify-start text-xs sm:text-sm h-9 sm:h-10">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Export Questions
                  </Button>
                  
                  <Button variant="outline" className="w-full cursor-pointer justify-start text-xs sm:text-sm h-9 sm:h-10">
                    <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Share Assessment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">Questions ({questions.length})</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Preview all questions in this assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {questions.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-lg sm:text-xl">
                              {getQuestionTypeIcon(question.question_type)}
                            </span>
                            <h3 className="font-semibold text-base sm:text-lg truncate">
                              Question {index + 1}
                            </h3>
                            <Badge variant="outline" className="shrink-0 text-xs">
                              {question.points} point{question.points !== 1 ? 's' : ''}
                            </Badge>
                            <span className={`px-2 py-1 rounded text-xs shrink-0 ${
                              question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {question.difficulty}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            Type: {question.question_type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">Question:</h4>
                          <p className="text-base sm:text-lg break-words">{question.question_text}</p>
                        </div>

                        {question.image_url && (
                          <div>
                            <h4 className="font-medium text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">Image:</h4>
                            <div className="max-w-full sm:max-w-md">
                              <img 
                                src={question.image_url} 
                                alt="Question image" 
                                className="rounded-lg border max-w-full h-auto"
                              />
                            </div>
                          </div>
                        )}

                        {question.question_type === 'multiple_choice' && question.options && (
                          <div>
                            <h4 className="font-medium text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">Options:</h4>
                            <div className="space-y-2">
                              {question.options.map((option, optIndex) => (
                                <div 
                                  key={optIndex} 
                                  className={`p-2 sm:p-3 border rounded-lg break-words ${
                                    option.correct 
                                      ? 'border-green-200 bg-green-50' 
                                      : 'border-gray-200'
                                  }`}
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <span className="font-medium text-sm">Option {optIndex + 1}:</span>
                                    <span className="flex-1">{option.text}</span>
                                    {option.correct && (
                                      <Badge className="bg-green-100 text-green-800 text-xs shrink-0 mt-1 sm:mt-0">
                                        Correct
                                      </Badge>
                                    )}
                                  </div>
                                  {option.explanation && (
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:ml-6">
                                      <span className="font-medium">Explanation:</span> {option.explanation}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {question.question_type === 'true_false' && (
                          <div>
                            <h4 className="font-medium text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">Correct Answer:</h4>
                            <Badge className={`text-xs sm:text-sm ${
                              question.correct_answer === 'True' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {question.correct_answer}
                            </Badge>
                          </div>
                        )}

                        {(question.question_type === 'short_answer' || question.question_type === 'essay') && question.correct_answer && (
                          <div>
                            <h4 className="font-medium text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">
                              {question.question_type === 'short_answer' ? 'Expected Answer:' : 'Sample Answer:'}
                            </h4>
                            <p className="p-2 sm:p-3 border rounded-lg bg-gray-50 break-words text-sm sm:text-base">
                              {question.correct_answer}
                            </p>
                          </div>
                        )}

                        {question.explanation && (
                          <div>
                            <h4 className="font-medium text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">Explanation:</h4>
                            <p className="p-2 sm:p-3 border rounded-lg bg-blue-50 break-words text-sm sm:text-base">
                              {question.explanation}
                            </p>
                          </div>
                        )}

                        {question.hints && question.hints.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-700 text-sm sm:text-base mb-1 sm:mb-2">Hints:</h4>
                            <ul className="list-disc pl-4 sm:pl-5 space-y-1">
                              {question.hints.map((hint, hintIndex) => (
                                <li key={hintIndex} className="text-gray-600 text-sm sm:text-base">
                                  {hint}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">❓</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">No questions yet</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-sm mx-auto">
                    Add questions to your assessment to make it complete
                  </p>
                  <Link href={`/dashboard/instructor/quizzes/${assessmentId}/edit?tab=questions`}>
                    <Button size="sm" className="sm:text-sm">
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Add Questions
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">Assessment Preview</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                See how your assessment will appear to students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">👁️</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Student Preview</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto">
                  {/* This feature will be available in Phase 2 when student quiz-taking is implemented. */}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                  <Button disabled size="sm" className="sm:text-sm cursor-pointer">
                    <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Start Preview
                  </Button>
                  <Link href={`/dashboard/instructor/quizzes/${assessmentId}/edit?tab=questions`}>
                    <Button variant="outline" size="sm" className="sm:text-sm cursor-pointer">
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Edit Questions
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Assessment Info */}
              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-base sm:text-lg">What students will see:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 border rounded-lg">
                    <p className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Assessment Title</p>
                    <p className="text-gray-600 text-sm sm:text-base break-words">{assessment.title}</p>
                  </div>
                  <div className="p-3 sm:p-4 border rounded-lg">
                    <p className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Time Limit</p>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {assessment.time_limit ? `${assessment.time_limit} minutes` : 'No time limit'}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 border rounded-lg">
                    <p className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Passing Score</p>
                    <p className="text-gray-600 text-sm sm:text-base">{assessment.passing_score}%</p>
                  </div>
                  <div className="p-3 sm:p-4 border rounded-lg">
                    <p className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Max Attempts</p>
                    <p className="text-gray-600 text-sm sm:text-base">{assessment.max_attempts}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}