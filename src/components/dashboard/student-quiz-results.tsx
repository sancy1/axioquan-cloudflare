
// // // /src/components/dashboard/student-quiz-results.tsx  OLD-FILE

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Award,
  ExternalLink,
  Trophy,
  Target,
  ChevronRight,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { QuizPerformanceChart } from '@/components/assessments/quiz-performance-chart';

// Fallback CertificateIndicator component
const CertificateIndicator = ({ status, score, requiredScore = 70, showLabel = true, size = "md" }: any) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'eligible': return { color: 'bg-green-100 text-green-800 border-green-200', label: 'Eligible', icon: '✓' };
      case 'in_progress': return { color: 'bg-amber-100 text-amber-800 border-amber-200', label: 'In Progress', icon: '↻' };
      case 'issued': return { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Issued', icon: '🏆' };
      default: return { color: 'bg-red-100 text-red-800 border-red-200', label: 'Not Eligible', icon: '✗' };
    }
  };
  
  const info = getStatusInfo();
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  
  return (
    <Badge variant="outline" className={`${info.color} ${sizeClass} border`}>
      {showLabel ? (
        <>
          <span className="mr-1">{info.icon}</span>
          {info.label}
        </>
      ) : (
        <>
          <span className="mr-1">{info.icon}</span>
          {score}%
        </>
      )}
    </Badge>
  );
};

// Fallback CertificateProgress component
const CertificateProgress = ({ currentScore, requiredScore, attemptsUsed, maxAttempts }: any) => {
  const progressPercentage = Math.min((currentScore / requiredScore) * 100, 100);
  const attemptsPercentage = (attemptsUsed / maxAttempts) * 100;
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Score Progress</span>
        <span className="text-muted-foreground">{currentScore.toFixed(1)}% / {requiredScore}%</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="flex justify-between text-sm">
        <span className="font-medium">Attempts</span>
        <span className="text-muted-foreground">{attemptsUsed} / {maxAttempts}</span>
      </div>
      <Progress value={attemptsPercentage} className="h-2 bg-gray-100">
        <div 
          className="h-full bg-amber-500 rounded-full transition-all"
          style={{ width: `${attemptsPercentage}%` }}
        />
      </Progress>
    </div>
  );
};

interface QuizResult {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  courseId: string;
  courseTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  gradeLetter: string;
  attemptNumber: number;
  submittedAt: string;
  timeSpent: number;
  realAttemptId?: string;
  hasValidIds?: boolean;
}

interface StudentQuizAnalytics {
  overallScore: number;
  averageScore: number;
  quizzesCompleted: number;
  totalQuizzes: number;
  certificatesEligible: number;
  certificatesIssued: number;
  performanceTrend: Array<{
    date: string;
    score: number;
    quizTitle: string;
    courseTitle: string;
  }>;
  certificateProgress: Array<{
    courseId: string;
    courseTitle: string;
    currentScore: number;
    requiredScore: number;
    attemptsUsed: number;
    maxAttempts: number;
    status: 'eligible' | 'in_progress' | 'not_eligible' | 'issued';
    certificateId?: string;
  }>;
  weakAreas: Array<{
    topic: string;
    score: number;
    averageScore: number;
    recommendations: string[];
  }>;
}

export default function StudentQuizResults() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<StudentQuizAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    passedQuizzes: 0,
    totalTimeSpent: 0,
    currentStreak: 0,
    bestScore: 0,
  });

  useEffect(() => {
    fetchStudentResults();
  }, []);

  const calculateGradeLetter = (score: number): string => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const generateResultLink = (result: QuizResult): string | null => {
    if (result.hasValidIds && result.courseId && result.assessmentId && result.realAttemptId) {
      return `/courses/learn/${result.courseId}/quiz/${result.assessmentId}/results?attempt=${result.realAttemptId}`;
    }
    return null;
  };

  const getLinkTooltip = (result: QuizResult): string => {
    if (!result.hasValidIds) {
      if (result.id.startsWith('demo-')) {
        return 'Demo data - no detailed results available';
      }
      if (result.id.startsWith('trend-')) {
        return 'Analytics data - detailed results not available';
      }
      if (result.id.startsWith('local-')) {
        return 'Local storage data - detailed results not available';
      }
      return 'Detailed results not available for this data';
    }
    return 'View detailed quiz results';
  };

  const fetchStudentResults = async () => {
    try {
      setLoading(true);
      
      const endpoint = '/api/student/quiz-analytics';
      
      try {
        const response = await fetch(endpoint);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.analytics) {
            setAnalytics(data.analytics);
            
            if (data.analytics.performanceTrend && data.analytics.performanceTrend.length > 0) {
              const trendResults: QuizResult[] = data.analytics.performanceTrend.map((item: any, index: number) => ({
                id: `trend-${index}`,
                assessmentId: 'assessment-id',
                assessmentTitle: item.quizTitle || 'Quiz',
                courseId: 'course-id',
                courseTitle: item.courseTitle || 'Course',
                score: item.score,
                maxScore: 100,
                percentage: item.score,
                passed: item.score >= 70,
                gradeLetter: calculateGradeLetter(item.score),
                attemptNumber: 1,
                submittedAt: item.date,
                timeSpent: 1800,
                hasValidIds: false
              }));
              
              setResults(trendResults);
              calculateStatsFromAnalytics(data.analytics);
            }
          } else {
            await fetchRecentAttempts();
          }
        } else {
          await fetchRecentAttempts();
        }
      } catch (error: any) {
        console.error(`Error fetching from ${endpoint}:`, error);
        await fetchRecentAttempts();
      }
      
    } catch (error: any) {
      console.error('Error in fetchStudentResults:', error);
      toast.error('Failed to load quiz results');
      generateDemoData();
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentAttempts = async () => {
    try {
      const endpoint = '/api/student/assessments/attempts';
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        
        if (data.attempts && Array.isArray(data.attempts)) {
          const attemptsResults: QuizResult[] = data.attempts.map((item: any) => ({
            id: item.id,
            assessmentId: item.assessment_id,
            assessmentTitle: item.assessment_title || 'Quiz',
            courseId: item.course_id,
            courseTitle: item.course_title || 'Course',
            score: item.score || 0,
            maxScore: item.max_score || 100,
            percentage: item.percentage || 0,
            passed: item.passed || (item.percentage >= 70),
            gradeLetter: calculateGradeLetter(item.percentage || 0),
            attemptNumber: item.attempt_number || 1,
            submittedAt: item.submitted_at || new Date().toISOString(),
            timeSpent: item.time_spent || 0,
            realAttemptId: item.id,
            hasValidIds: true
          }));
          
          setResults(attemptsResults);
          calculateStats(attemptsResults);
          generateAnalyticsFromResults(attemptsResults);
        }
      }
    } catch (error) {
      console.error('Error fetching recent attempts:', error);
      checkLocalStorage();
    }
  };

  const checkLocalStorage = () => {
    try {
      const localStorageData = localStorage.getItem('quiz_attempts');
      if (localStorageData) {
        const parsedData = JSON.parse(localStorageData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          const localResults: QuizResult[] = parsedData.map((item: any, index: number) => ({
            id: item.id || `local-${index}-${Date.now()}`,
            assessmentId: item.assessmentId || 'local-assessment',
            assessmentTitle: item.assessmentTitle || 'Local Quiz',
            courseId: item.courseId || 'local-course',
            courseTitle: item.courseTitle || 'Local Course',
            score: item.score || 75,
            maxScore: item.maxScore || 100,
            percentage: item.percentage || item.score || 75,
            passed: item.passed || true,
            gradeLetter: calculateGradeLetter(item.percentage || item.score || 75),
            attemptNumber: item.attemptNumber || 1,
            submittedAt: item.submittedAt || new Date(Date.now() - (index * 86400000)).toISOString(),
            timeSpent: item.timeSpent || 1800,
            hasValidIds: false
          }));
          
          setResults(localResults);
          calculateStats(localResults);
          generateAnalyticsFromResults(localResults);
        }
      } else {
        generateDemoData();
      }
    } catch (localError) {
      console.error('Error checking localStorage:', localError);
      generateDemoData();
    }
  };

  const calculateStatsFromAnalytics = (analyticsData: StudentQuizAnalytics) => {
    const total = analyticsData.quizzesCompleted || 0;
    const avgScore = analyticsData.averageScore || analyticsData.overallScore || 0;
    const passed = Math.floor(total * (avgScore >= 70 ? 0.8 : 0.6));
    
    setStats({
      totalQuizzes: total,
      averageScore: avgScore,
      passedQuizzes: passed,
      totalTimeSpent: total * 1800,
      currentStreak: calculateStreakFromTrend(analyticsData.performanceTrend),
      bestScore: getBestScoreFromTrend(analyticsData.performanceTrend),
    });
  };

  const calculateStreakFromTrend = (trend: any[]) => {
    if (!trend || trend.length === 0) return 0;
    
    const sortedTrend = [...trend].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let streak = 1;
    for (let i = sortedTrend.length - 1; i > 0; i--) {
      const currentDate = new Date(sortedTrend[i].date);
      const prevDate = new Date(sortedTrend[i - 1].date);
      const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getBestScoreFromTrend = (trend: any[]) => {
    if (!trend || trend.length === 0) return 0;
    return Math.max(...trend.map(item => item.score || 0));
  };

  const calculateStats = (quizResults: QuizResult[]) => {
    const total = quizResults.length;
    const passed = quizResults.filter(r => r.passed).length;
    const avgScore = total > 0 ? quizResults.reduce((sum, r) => sum + r.percentage, 0) / total : 0;
    const totalTime = quizResults.reduce((sum, r) => sum + r.timeSpent, 0);
    const bestScore = total > 0 ? Math.max(...quizResults.map(r => r.percentage)) : 0;
    
    const dates = quizResults
      .map(r => new Date(r.submittedAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort()
      .reverse();
    
    let streak = 0;
    if (dates.length > 0) {
      streak = 1;
      for (let i = 0; i < dates.length - 1; i++) {
        const currentDate = new Date(dates[i]);
        const nextDate = new Date(dates[i + 1]);
        const diffTime = Math.abs(currentDate.getTime() - nextDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
    
    setStats({
      totalQuizzes: total,
      averageScore: avgScore,
      passedQuizzes: passed,
      totalTimeSpent: totalTime,
      currentStreak: streak,
      bestScore: bestScore,
    });
  };

  const generateAnalyticsFromResults = (quizResults: QuizResult[]) => {
    if (quizResults.length === 0) return;
    
    const coursesMap = new Map();
    quizResults.forEach(result => {
      if (!coursesMap.has(result.courseId)) {
        coursesMap.set(result.courseId, {
          courseId: result.courseId,
          courseTitle: result.courseTitle,
          scores: [],
          bestScore: 0,
          attempts: 0,
        });
      }
      
      const course = coursesMap.get(result.courseId);
      course.scores.push(result.percentage);
      course.bestScore = Math.max(course.bestScore, result.percentage);
      course.attempts++;
    });

    const certificateProgress = Array.from(coursesMap.values()).map(course => {
      const currentScore = Math.max(...course.scores);
      const requiredScore = 70;
      const attemptsUsed = course.attempts;
      const maxAttempts = 3;
      
      let status: 'eligible' | 'in_progress' | 'not_eligible' | 'issued' = 'not_eligible';
      if (currentScore >= requiredScore) {
        status = 'eligible';
      } else if (attemptsUsed < maxAttempts) {
        status = 'in_progress';
      }

      return {
        courseId: course.courseId,
        courseTitle: course.courseTitle,
        currentScore,
        requiredScore,
        attemptsUsed,
        maxAttempts,
        status,
      };
    });

    const performanceTrend = quizResults
      .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
      .slice(-10)
      .map(result => ({
        date: result.submittedAt,
        score: result.percentage,
        quizTitle: result.assessmentTitle,
        courseTitle: result.courseTitle,
      }));

    const analyticsData: StudentQuizAnalytics = {
      overallScore: stats.averageScore,
      averageScore: stats.averageScore,
      quizzesCompleted: quizResults.length,
      totalQuizzes: Math.max(quizResults.length, 10),
      certificatesEligible: certificateProgress.filter(c => c.status === 'eligible').length,
      certificatesIssued: 0,
      performanceTrend,
      certificateProgress,
      weakAreas: [
        {
          topic: 'JavaScript Functions',
          score: 65,
          averageScore: 75,
          recommendations: ['Review function parameters', 'Practice arrow functions', 'Study scope and closures'],
        },
        {
          topic: 'React Hooks',
          score: 70,
          averageScore: 80,
          recommendations: ['Master useState and useEffect', 'Practice custom hooks', 'Study useContext'],
        },
      ],
    };

    setAnalytics(analyticsData);
  };

  const generateDemoData = () => {
    const demoResults: QuizResult[] = [
      {
        id: 'demo-1',
        assessmentId: 'assessment-1',
        assessmentTitle: 'Python Fundamentals Quiz',
        courseId: 'course-1',
        courseTitle: 'Introduction to Python Programming',
        score: 85,
        maxScore: 100,
        percentage: 85,
        passed: true,
        gradeLetter: 'B',
        attemptNumber: 1,
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        timeSpent: 1800,
        hasValidIds: false
      },
      {
        id: 'demo-2',
        assessmentId: 'assessment-2',
        assessmentTitle: 'Web Design Quiz',
        courseId: 'course-2',
        courseTitle: 'Modern Web Design Principles',
        score: 92,
        maxScore: 100,
        percentage: 92,
        passed: true,
        gradeLetter: 'A',
        attemptNumber: 1,
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        timeSpent: 1500,
        hasValidIds: false
      },
      {
        id: 'demo-3',
        assessmentId: 'assessment-3',
        assessmentTitle: 'JavaScript Basics Quiz',
        courseId: 'course-3',
        courseTitle: 'Advanced JavaScript Patterns',
        score: 78,
        maxScore: 100,
        percentage: 78,
        passed: true,
        gradeLetter: 'C',
        attemptNumber: 2,
        submittedAt: new Date().toISOString(),
        timeSpent: 2100,
        hasValidIds: false
      }
    ];

    setResults(demoResults);
    calculateStats(demoResults);
    generateAnalyticsFromResults(demoResults);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade.charAt(0)) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'F': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleExportResults = () => {
    toast.info('Export feature coming soon!');
  };

  const handleLoadDemoData = () => {
    localStorage.setItem('quiz_attempts', JSON.stringify([
      {
        id: 'manual-demo-1',
        assessmentId: 'demo-assessment',
        assessmentTitle: 'Demo Quiz',
        courseId: 'demo-course',
        courseTitle: 'Demo Course',
        score: 88,
        percentage: 88,
        passed: true,
        submittedAt: new Date().toISOString(),
        timeSpent: 1200
      }
    ]));
    toast.success('Demo data saved to localStorage');
    fetchStudentResults();
  };

  if (loading) {
    return <ResultsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Your Quiz Performance</h2>
          <p className="text-muted-foreground">
            Track your performance and progress towards certificates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportResults}
            disabled={results.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchStudentResults}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {results.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>Your recent quiz performances</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No quiz results yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Complete quizzes to see your results, track progress, and earn certificates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/courses">
                <Button>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Courses
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLoadDemoData}>
                Load Demo Data
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Overall Score</span>
                      </div>
                      <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</p>
                      <Progress value={stats.averageScore} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Certificates</span>
                      </div>
                      <p className="text-2xl font-bold">{analytics?.certificatesEligible || 0}</p>
                      <p className="text-xs text-muted-foreground">
                        {analytics?.quizzesCompleted || 0}/{analytics?.totalQuizzes || 0} quizzes
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium">Avg. Score</span>
                      </div>
                      <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</p>
                      <div className="text-xs text-amber-600">
                        {stats.passedQuizzes} passed
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Time Spent</span>
                      </div>
                      <p className="text-2xl font-bold">{formatTime(stats.totalTimeSpent)}</p>
                      <div className="text-xs text-purple-600">
                        Across {stats.totalQuizzes} quizzes
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium">Best Score</span>
                      </div>
                      <p className="text-2xl font-bold">{stats.bestScore.toFixed(1)}%</p>
                      <div className="text-xs text-red-600">
                        Top performance
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Current Streak</span>
                      </div>
                      <p className="text-2xl font-bold">{stats.currentStreak}</p>
                      <div className="text-xs text-orange-600">
                        Consecutive days
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {analytics?.performanceTrend && analytics.performanceTrend.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trend</CardTitle>
                    <CardDescription>Your scores over time across all quizzes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <QuizPerformanceChart 
                      data={analytics.performanceTrend.map(t => ({
                        date: t.date,
                        averageScore: t.score,
                        attempts: 1,
                        newStudents: 0
                      }))}
                      type="line"
                      height={250}
                    />
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Recent Quiz Results</CardTitle>
                  <CardDescription>Your most recent quiz performances</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.slice(0, 5).map((result) => {
                      const link = generateResultLink(result);
                      const tooltip = getLinkTooltip(result);
                      
                      return (
                        <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold truncate">{result.assessmentTitle}</h4>
                              <Badge variant={result.passed ? "default" : "destructive"} className="text-xs">
                                {result.passed ? 'PASS' : 'FAIL'}
                              </Badge>
                              <CertificateIndicator 
                                status={result.passed ? 'eligible' : 'not_eligible'}
                                score={result.percentage}
                                showLabel={false}
                                size="sm"
                              />
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {result.courseTitle} • Attempt {result.attemptNumber}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(result.timeSpent)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(result.submittedAt)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold">{result.percentage.toFixed(1)}%</p>
                              <p className="text-xs text-muted-foreground">
                                {result.score.toFixed(1)}/{result.maxScore} pts
                              </p>
                            </div>
                            
                            {link ? (
                              <Link href={link}>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="hover:bg-accent hover:text-accent-foreground transition-colors"
                                  title={tooltip}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                disabled 
                                title={tooltip}
                                className="opacity-50 cursor-not-allowed"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    {results.length > 5 && (
                      <div className="text-center pt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => setActiveTab('history')}
                        >
                          View All Quizzes
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              {analytics?.certificateProgress && analytics.certificateProgress.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Certificate Progress</CardTitle>
                    <CardDescription>Your progress towards course certificates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.certificateProgress.map((cert, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                            <div>
                              <h4 className="font-semibold">{cert.courseTitle}</h4>
                              <p className="text-sm text-muted-foreground">
                                Attempts: {cert.attemptsUsed}/{cert.maxAttempts} • Required: {cert.requiredScore}%
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <CertificateIndicator 
                                status={cert.status}
                                score={cert.currentScore}
                                requiredScore={cert.requiredScore}
                              />
                              <div className="text-right">
                                <p className="text-2xl font-bold">{cert.currentScore.toFixed(1)}%</p>
                                <p className="text-xs text-muted-foreground">Current Score</p>
                              </div>
                            </div>
                          </div>
                          <CertificateProgress
                            currentScore={cert.currentScore}
                            requiredScore={cert.requiredScore}
                            attemptsUsed={cert.attemptsUsed}
                            maxAttempts={cert.maxAttempts}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {analytics?.weakAreas && analytics.weakAreas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Areas for Improvement</CardTitle>
                    <CardDescription>Topics where you can improve your performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.weakAreas.map((area, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{area.topic}</h4>
                              <p className="text-sm text-muted-foreground">
                                Your score: {area.score}% • Class average: {area.averageScore}%
                              </p>
                            </div>
                            <Badge variant={area.score < 70 ? "destructive" : "secondary"}>
                              {area.score < 70 ? 'Needs Work' : 'Can Improve'}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Performance</span>
                              <span>{area.score}%</span>
                            </div>
                            <Progress value={area.score} className="h-2" />
                            <div className="mt-3">
                              <p className="text-sm font-medium mb-2">Recommendations:</p>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                {area.recommendations.map((rec, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <BookOpen className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="certificates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Status</CardTitle>
                  <CardDescription>Track your certificate eligibility and issuance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="border rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {analytics?.certificatesEligible || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Eligible</div>
                        <p className="text-xs text-green-600 mt-1">Ready for issuance</p>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-amber-600">
                          {analytics?.certificateProgress?.filter(c => c.status === 'in_progress').length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">In Progress</div>
                        <p className="text-xs text-amber-600 mt-1">Keep studying</p>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-red-600">
                          {analytics?.certificateProgress?.filter(c => c.status === 'not_eligible').length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Not Eligible</div>
                        <p className="text-xs text-red-600 mt-1">Review needed</p>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        {/* <div className="text-3xl font-bold text-blue-600">
                          {analytics?.certificatesIssued || 0}
                        </div> */}
                        {/* <div className="text-sm text-muted-foreground">Issued</div>
                        <p className="text-xs text-blue-600 mt-1">Completed</p> */}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Your Certificates</h3>
                      {analytics?.certificateProgress && analytics.certificateProgress.length > 0 ? (
                        analytics.certificateProgress.map((cert, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className={`p-2 rounded-lg ${
                                    cert.status === 'eligible' ? 'bg-green-100' :
                                    cert.status === 'in_progress' ? 'bg-amber-100' :
                                    cert.status === 'issued' ? 'bg-blue-100' : 'bg-red-100'
                                  }`}>
                                    {cert.status === 'eligible' ? (
                                      <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : cert.status === 'in_progress' ? (
                                      <AlertCircle className="h-5 w-5 text-amber-600" />
                                    ) : cert.status === 'issued' ? (
                                      <Award className="h-5 w-5 text-blue-600" />
                                    ) : (
                                      <XCircle className="h-5 w-5 text-red-600" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">{cert.courseTitle}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Score: {cert.currentScore.toFixed(1)}% • Required: {cert.requiredScore}%
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                {/* <CertificateIndicator 
                                  status={cert.status}
                                  score={cert.currentScore}
                                  requiredScore={cert.requiredScore}
                                /> */}
                                {/* {cert.status === 'eligible' && (
                                  <Button size="sm" variant="outline">
                                    Request Certificate
                                  </Button>
                                )}
                                {cert.status === 'issued' && (
                                  <Button size="sm" variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download PDF
                                  </Button>
                                )} */}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No certificate progress yet.</p>
                          <p className="text-sm mt-2">Complete quizzes with passing scores to earn certificates.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz History</CardTitle>
                  <CardDescription>All your quiz attempts and results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.map((result) => {
                      const link = generateResultLink(result);
                      const tooltip = getLinkTooltip(result);
                      
                      return (
                        <div key={result.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{result.assessmentTitle}</h4>
                                <Badge className={getGradeColor(result.gradeLetter)}>
                                  {result.gradeLetter}
                                </Badge>
                                <Badge variant={result.passed ? "default" : "destructive"}>
                                  {result.passed ? 'PASSED' : 'FAILED'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {result.courseTitle} • Attempt {result.attemptNumber}
                              </p>
                              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(result.submittedAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(result.timeSpent)}
                                </span>
                                <span>
                                  Score: {result.score.toFixed(1)}/{result.maxScore}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-2xl font-bold">{result.percentage.toFixed(1)}%</p>
                                <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      result.percentage >= 90 ? 'bg-green-500' :
                                      result.percentage >= 80 ? 'bg-blue-500' :
                                      result.percentage >= 70 ? 'bg-amber-500' :
                                      result.percentage >= 60 ? 'bg-orange-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${result.percentage}%` }}
                                  />
                                </div>
                              </div>
                              
                              {link ? (
                                <Link href={link}>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="hover:bg-accent hover:text-accent-foreground transition-colors"
                                    title={tooltip}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="sr-only">View detailed results</span>
                                  </Button>
                                </Link>
                              ) : (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  disabled 
                                  title={tooltip}
                                  className="opacity-50 cursor-not-allowed"
                                >
                                  <ExternalLink className="h-4 w-4 opacity-50" />
                                  <span className="sr-only">Results not available</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <Skeleton className="h-10 w-full md:w-96" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}