
































// /src/app/courses/learn/[courseId]/quiz/[assessmentId]/results/page.tsx

// /src/app/courses/learn/[courseId]/quiz/[assessmentId]/results/page.tsx - FIXED VERSION

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award, 
  FileText, 
  BarChart3, 
  ArrowLeft,
  RefreshCw,
  Download,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface QuizResults {
  attemptId: string;
  assessmentId: string;
  courseId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  gradeLetter: string;
  timeSpent: number;
  timeLimit: number | null;
  attemptNumber: number;
  maxAttempts: number;
  submittedAt: string;
  questions: Array<{
    id: string;
    questionText: string;
    questionType: string;
    userAnswer: any;
    correctAnswer: any;
    points: number;
    awardedPoints: number;
    isCorrect: boolean;
    explanation: string | null;
  }>;
  assessment: {
    title: string;
    passingScore: number;
    showCorrectAnswers: boolean;
  };
}

export default function QuizResultsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const courseId = params.courseId as string;
  const assessmentId = params.assessmentId as string;
  const attemptId = searchParams.get('attempt');

  useEffect(() => {
    const fetchResults = async () => {
      if (!attemptId) {
        setError('No attempt ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/student/assessments/${assessmentId}/attempts/${attemptId}/results`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch results');
        }

        const data = await response.json();
        
        if (data.success) {
          setResults(data.results);
          // Auto-expand the first incorrect question
          const firstIncorrect = data.results.questions.find((q: any) => !q.isCorrect);
          if (firstIncorrect) {
            setExpandedQuestions(new Set([firstIncorrect.id]));
          }
        } else {
          setError(data.message || 'Failed to load results');
        }
      } catch (error: any) {
        console.error('Error fetching results:', error);
        setError(error.message || 'An error occurred while loading results');
        toast.error('Failed to load quiz results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [attemptId, assessmentId]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleRetakeQuiz = async () => {
    if (!results) return;
    
    try {
      toast.loading('Starting new attempt...');
      const response = await fetch(`/api/student/assessments/${assessmentId}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.dismiss();
        toast.success('New attempt started');
        router.push(`/courses/learn/${courseId}/quiz/${assessmentId}?attempt=${data.attemptId}`);
      } else {
        toast.dismiss();
        toast.error(data.message || 'Failed to start new attempt');
      }
    } catch (error) {
      console.error('Error starting new attempt:', error);
      toast.dismiss();
      toast.error('Failed to start new attempt');
    }
  };

  const handleDownloadPDF = () => {
    if (!results) return;
    
    try {
      toast.loading('Preparing printable version...');
      
      // Calculate correctCount here since it's used in the template
      const correctCount = results.questions.filter(q => q.isCorrect).length;
      const totalQuestions = results.questions.length;
      
      // Create a printable HTML version
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Quiz Results: ${results.assessment.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { color: #2980b9; font-size: 24px; margin-bottom: 5px; }
            .subtitle { color: #666; font-size: 16px; margin-bottom: 20px; }
            .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
            .score { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
            .score.passed { color: #27ae60; }
            .score.failed { color: #e74c3c; }
            .details { margin-top: 30px; }
            .question { margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
            .question-title { font-weight: bold; margin-bottom: 10px; }
            .answer { margin-bottom: 5px; padding-left: 15px; }
            .answer.correct { color: #27ae60; }
            .answer.incorrect { color: #e74c3c; }
            .explanation { background: #e8f4fc; padding: 10px; border-radius: 3px; margin-top: 10px; font-size: 14px; }
            .metadata { color: #666; font-size: 12px; margin-top: 20px; }
            @media print {
              body { margin: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Quiz Results Report</h1>
            <h2 class="subtitle">${results.assessment.title}</h2>
            <div class="metadata">
              Course: ${courseId} | 
              Attempt: ${results.attemptNumber} of ${results.maxAttempts} | 
              Submitted: ${new Date(results.submittedAt).toLocaleDateString()} at ${new Date(results.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          <div class="summary">
            <div class="score ${results.passed ? 'passed' : 'failed'}">${results.percentage.toFixed(1)}%</div>
            <div>Grade: ${results.gradeLetter} | Status: <strong>${results.passed ? 'PASSED' : 'FAILED'}</strong></div>
            <div>Questions: ${correctCount} correct out of ${totalQuestions}</div>
            <div>Time Spent: ${formatTime(results.timeSpent)}</div>
            ${results.timeLimit ? `<div>Time Limit: ${results.timeLimit} minutes</div>` : ''}
          </div>
          
          <div class="details">
            <h3>Question Review (${totalQuestions} questions)</h3>
            ${results.questions.map((question, index) => `
              <div class="question">
                <div class="question-title">Question ${index + 1} ${question.isCorrect ? '✓' : '✗'} (${question.awardedPoints.toFixed(1)}/${question.points} points)</div>
                <div><strong>Q:</strong> ${question.questionText}</div>
                <div class="answer ${question.isCorrect ? 'correct' : 'incorrect'}">
                  <strong>Your Answer:</strong> ${question.userAnswer || 'No answer provided'}
                </div>
                ${!question.isCorrect && question.correctAnswer && results.assessment.showCorrectAnswers ? `
                  <div class="answer correct">
                    <strong>Correct Answer:</strong> ${question.correctAnswer}
                  </div>
                ` : ''}
                ${question.explanation && results.assessment.showCorrectAnswers ? `
                  <div class="explanation">
                    <strong>Explanation:</strong> ${question.explanation}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
          
          <div class="metadata">
            <p>Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()} by Axioquan Learning Platform</p>
            <button class="no-print" onclick="window.print()">Print this page</button>
            <button class="no-print" onclick="window.close()">Close</button>
          </div>
        </body>
        </html>
      `;
      
      // Open in new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Wait for content to load then show print dialog
        printWindow.onload = () => {
          toast.dismiss();
          setTimeout(() => {
            printWindow.focus();
            printWindow.print();
          }, 500);
        };
      } else {
        toast.dismiss();
        toast.error('Popup blocked. Please allow popups to download results.');
      }
      
    } catch (error) {
      console.error('Error generating report:', error);
      toast.dismiss();
      toast.error('Failed to generate report');
    }
  };

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href={`/courses/learn/${courseId}`}>
            <Button variant="outline" size="sm" className='cursor-pointer'>
              <ArrowLeft className="corsor-pointer h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </Link>
        </div>
        
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Results</AlertTitle>
          <AlertDescription>
            {error || 'Unable to load quiz results. Please try again.'}
          </AlertDescription>
        </Alert>
        
        <div className="mt-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            Possible reasons:
          </p>
          <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
            <li>Quiz attempt not found</li>
            <li>You don't have permission to view these results</li>
            <li>Results are still being graded</li>
            <li>Network connection issue</li>
          </ul>
        </div>
        
        <div className="mt-6 flex gap-3">
          <Link href={`/courses/learn/${courseId}`}>
            <Button className='cursor-pointer'>
              Return to Course
            </Button>
          </Link>
          <Button className='cursor-pointer' variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const correctCount = results.questions.filter(q => q.isCorrect).length;
  const totalQuestions = results.questions.length;
  const passPercentage = results.assessment.passingScore;
  const percentage = results.percentage;

  return (
    <div className="container max-w-6xl py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/courses/learn/${courseId}`}>
              <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Course
              </Button>
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Quiz Results</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{results.assessment.title}</h1>
          <p className="text-muted-foreground">
            Attempt {results.attemptNumber} of {results.maxAttempts} • Submitted{' '}
            {new Date(results.submittedAt).toLocaleDateString()} at{' '}
            {new Date(results.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/courses/learn/${courseId}`}>
            <Button variant="outline" className="gap-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Course
            </Button>
          </Link>
          {results.attemptNumber < results.maxAttempts && (
            <Button onClick={handleRetakeQuiz} className="gap-2 cursor-pointer">
              <RefreshCw className="h-4 w-4" />
              Retake Quiz
            </Button>
          )}
        </div>
      </div>

      {/* Score Summary Card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Score Card */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${results.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Score</p>
                  <p className="text-2xl font-bold">{percentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{percentage.toFixed(1)}%</span>
                </div>
                <div className="relative">
                  <Progress 
                    value={percentage} 
                    className="h-2 bg-gray-200"
                  />
                  <div 
                    className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-500 ${
                      results.passed ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>{passPercentage}% to pass</span>
                  <span>100%</span>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Points: </span>
                <span className="font-medium">{results.score.toFixed(1)} / {results.maxScore}</span>
              </div>
            </div>

            {/* Questions Card */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Questions</p>
                  <p className="text-2xl font-bold">{correctCount}<span className="text-lg text-muted-foreground">/{totalQuestions}</span></p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-2xl font-bold text-green-700">{correctCount}</p>
                  <p className="text-xs text-green-600">Correct</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-2xl font-bold text-red-700">{totalQuestions - correctCount}</p>
                  <p className="text-xs text-red-600">Incorrect</p>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Accuracy: </span>
                <span className="font-medium">{totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>

            {/* Time Card */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Time Spent</p>
                  <p className="text-2xl font-bold">{formatTime(results.timeSpent)}</p>
                </div>
              </div>
              {results.timeLimit && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time Used</span>
                    <span className="font-medium">
                      {Math.floor(results.timeSpent / 60)}:{String(results.timeSpent % 60).padStart(2, '0')} / {results.timeLimit}:00
                    </span>
                  </div>
                  <Progress 
                    value={(results.timeSpent / (results.timeLimit * 60)) * 100} 
                    className="h-2 bg-gray-200"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    Time limit: {results.timeLimit} minutes
                  </div>
                </div>
              )}
              <div className="text-sm">
                <span className="text-muted-foreground">Time per question: </span>
                <span className="font-medium">{totalQuestions > 0 ? (results.timeSpent / totalQuestions).toFixed(1) : 0}s</span>
              </div>
            </div>

            {/* Grade Card */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-800">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Grade</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{results.gradeLetter}</p>
                    <Badge variant={results.passed ? "default" : "destructive"} className="text-xs">
                      {results.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Status: </span>
                  <span className={`font-medium ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {results.passed ? 'Passed' : 'Failed'} • {results.attemptNumber === results.maxAttempts ? 'Final Attempt' : `Attempt ${results.attemptNumber}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    percentage >= 90 ? 'bg-green-100 text-green-800' :
                    percentage >= 80 ? 'bg-blue-100 text-blue-800' :
                    percentage >= 70 ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {percentage >= 90 ? 'Excellent' :
                     percentage >= 80 ? 'Very Good' :
                     percentage >= 70 ? 'Good' :
                     percentage >= 60 ? 'Satisfactory' : 'Needs Improvement'}
                  </span>
                </div>
              </div>
              {!results.passed && results.attemptNumber < results.maxAttempts && (
                <div className="text-sm p-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800">
                    You need {passPercentage}% to pass. {passPercentage - percentage > 0 ? 
                    `${(passPercentage - percentage).toFixed(1)}% more to pass.` : 
                    'You were close!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Review */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Question Review</CardTitle>
              <CardDescription>
                {results.assessment.showCorrectAnswers ? 
                  'Review your answers and see explanations' : 
                  'Review your answers'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Show: </span>
              <Button 
                className="cursor-pointer"
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  const allIds = results.questions.map(q => q.id);
                  setExpandedQuestions(new Set(allIds));
                }}
              >
                All
              </Button>
              <Button 
                className="cursor-pointer"
                variant="ghost" 
                size="sm"
                onClick={() => {
                  const incorrectIds = results.questions.filter(q => !q.isCorrect).map(q => q.id);
                  setExpandedQuestions(new Set(incorrectIds));
                }}
              >
                Incorrect Only
              </Button>
              <Button 
              className="cursor-pointer"
                variant="ghost" 
                size="sm"
                onClick={() => setExpandedQuestions(new Set())}
              >
                None
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 ">
            {results.questions.map((question, index) => {
              const isExpanded = expandedQuestions.has(question.id);
              
              return (
                <div key={question.id} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleQuestion(question.id)}
                    className="cursor-pointer w-full p-4 text-left hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          question.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {question.isCorrect ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <XCircle className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">Question {index + 1}</h3>
                            <Badge variant="outline" className="text-xs">
                              {question.points} point{question.points !== 1 ? 's' : ''}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {question.questionType.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {question.questionText}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={question.isCorrect ? "default" : "destructive"} className="text-sm">
                          {question.awardedPoints.toFixed(1)} / {question.points}
                        </Badge>
                        <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 border-t bg-accent/30">
                      <div className="mb-4">
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Question:</h4>
                        <p className="text-base">{question.questionText}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className={`p-3 rounded-lg ${
                          question.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">Your Answer:</h4>
                          <p className="font-medium break-words">
                            {question.userAnswer || <span className="text-muted-foreground italic">No answer provided</span>}
                          </p>
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Points awarded: </span>
                            <span className={`font-medium ${question.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                              {question.awardedPoints.toFixed(1)} / {question.points}
                            </span>
                          </div>
                        </div>
                        
                        {results.assessment.showCorrectAnswers && !question.isCorrect && question.correctAnswer && (
                          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Correct Answer:</h4>
                            <p className="font-medium text-green-700 break-words">{question.correctAnswer}</p>
                          </div>
                        )}
                      </div>

                      {question.explanation && results.assessment.showCorrectAnswers && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">Explanation:</h4>
                          <p className="text-sm break-words">{question.explanation}</p>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Question {index + 1} of {totalQuestions}
                        </span>
                        <Button
                        className='cursor-pointer'
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleQuestion(question.id)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="mt-8 p-6 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-semibold mb-4">What would you like to do next?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href={`/courses/learn/${courseId}`} className="block">
            <Button variant="outline" className="w-full cursor-pointer h-full py-6 flex flex-col items-center justify-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Continue Learning</span>
              <span className="text-xs text-muted-foreground">Return to course materials</span>
            </Button>
          </Link>
          
          {results.attemptNumber < results.maxAttempts ? (
            <Button onClick={handleRetakeQuiz} className="cursor-pointer w-full h-full py-6 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="h-5 w-5" />
              <span>Retake Quiz</span>
              <span className="text-xs">Attempt {results.attemptNumber + 1} of ${results.maxAttempts}</span>
            </Button>
          ) : (
            <div className="w-full h-full py-6 flex flex-col items-center justify-center gap-2 border rounded-lg bg-muted">
              <Award className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Maximum Attempts Reached</span>
              <span className="text-xs text-muted-foreground text-center">
                You've used all {results.maxAttempts} attempt{results.maxAttempts !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="w-full cursor-pointer h-full py-6 flex flex-col items-center justify-center gap-2"
            onClick={handleDownloadPDF}
          >
            <Download className="h-5 w-5" />
            <span>Download Results</span>
            <span className="text-xs text-muted-foreground">PDF Report</span>
          </Button>
        </div>

        {!results.passed && results.attemptNumber < results.maxAttempts && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <RefreshCw className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Need to improve your score?</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Review the questions above and retake the quiz. You have {results.maxAttempts - results.attemptNumber} more attempt{results.maxAttempts - results.attemptNumber > 1 ? 's' : ''} remaining.
                </p>
                <ul className="text-xs text-amber-700 mt-2 space-y-1 list-disc pl-4">
                  <li>Review the explanations for incorrect answers</li>
                  <li>Focus on question types you struggled with</li>
                  <li>Take your time on each question</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}