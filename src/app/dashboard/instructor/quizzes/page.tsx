
// // /src/app/dashboard/instructor/quizzes/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  FileQuestion,
  Clock,
  Users,
  BarChart3,
  Filter,
  Copy
} from 'lucide-react';
import Link from 'next/link';
import { Assessment } from '@/types/assessments';
import { Course } from '@/types/courses';

export default function InstructorQuizzesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseIdParam = searchParams.get('course');

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  // Use a ref to track if initial fetch has been done
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  // Fetch Courses function
  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses/instructor/my-courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Fetch Assessments function
  const fetchAssessments = useCallback(async (courseId?: string | null) => {
    try {
      setLoading(true);
      let url = '/api/assessments';
      
      // Use the provided courseId or fall back to the URL param
      const targetCourseId = courseId || courseIdParam;
      
      if (targetCourseId && targetCourseId !== 'all') {
        url = `/api/assessments?course_id=${targetCourseId}`;
      }
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setAssessments(data.assessments || []);
      } else {
        toast.error('Error', { description: 'Failed to load assessments' });
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      toast.error('Error', { description: 'Network error' });
    } finally {
      setLoading(false);
    }
  }, [courseIdParam]); // Add courseIdParam as dependency

  // Initial fetch for courses and assessments
  useEffect(() => {
    const initializeData = async () => {
      await fetchCourses();
      // Fetch assessments with the courseId from URL
      await fetchAssessments();
      setHasInitialFetch(true);
    };
    
    initializeData();
  }, []); // Empty dependency array - runs once on mount

  // Handle course filter change
  const handleCourseFilterChange = useCallback(async (courseId: string) => {
    // Update URL without triggering immediate refetch
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (courseId && courseId !== 'all') {
      newParams.set('course', courseId);
    } else {
      newParams.delete('course');
    }
    
    // Use push instead of replace to avoid history manipulation issues
    router.push(`?${newParams.toString()}`, { scroll: false });
    
    // Fetch assessments with the new course filter
    await fetchAssessments(courseId);
  }, [router, searchParams, fetchAssessments]);

  // Handle URL parameter changes (when user navigates directly with URL)
  useEffect(() => {
    if (hasInitialFetch && courseIdParam) {
      // Only fetch if the URL param changes after initial load
      fetchAssessments();
    }
  }, [courseIdParam, hasInitialFetch, fetchAssessments]);

  // Filter assessments locally (for search and other filters)
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          assessment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          assessment.course_title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || assessment.type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || assessment.difficulty === filterDifficulty;
    
    // If course filter is applied in URL, filter locally as well
    const matchesCourse = !courseIdParam || courseIdParam === 'all' || assessment.course_id === courseIdParam;

    return matchesSearch && matchesType && matchesDifficulty && matchesCourse;
  });

  // Rest of your existing functions remain the same...
  const handleDeleteAssessment = async (assessmentId: string, assessmentTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${assessmentTitle}"? This will also delete all questions.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/assessments/${assessmentId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Success', { description: data.message });
        fetchAssessments(courseIdParam || 'all');
      } else {
        toast.error('Error', { description: data.error || 'Failed to delete assessment' });
      }
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error('Error', { description: 'Network error' });
    }
  };

  const handleDuplicateAssessment = async (assessmentId: string) => {
    try {
      const getResponse = await fetch(`/api/assessments/${assessmentId}`);
      if (!getResponse.ok) {
        throw new Error('Failed to fetch assessment');
      }
      
      const { assessment } = await getResponse.json();
      
      const duplicateData = {
        ...assessment,
        title: `${assessment.title} (Copy)`,
        course_id: assessment.course_id
      };
      
      delete duplicateData.id;
      delete duplicateData.created_at;
      delete duplicateData.updated_at;
      delete duplicateData.question_count;
      delete duplicateData.course_title;
      delete duplicateData.lesson_title;
      
      const postResponse = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData)
      });
      
      const data = await postResponse.json();
      
      if (postResponse.ok) {
        toast.success('Success', { description: 'Assessment duplicated successfully' });
        fetchAssessments(courseIdParam || 'all');
        
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

  // Get type icon and color
  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'quiz': return { icon: '❓', color: 'bg-blue-100 text-blue-800', label: 'Quiz' };
      case 'test': return { icon: '📝', color: 'bg-purple-100 text-purple-800', label: 'Test' };
      case 'exam': return { icon: '📚', color: 'bg-red-100 text-red-800', label: 'Exam' };
      case 'practice': return { icon: '🔄', color: 'bg-green-100 text-green-800', label: 'Practice' };
      default: return { icon: '📋', color: 'bg-gray-100 text-gray-800', label: type };
    }
  };

  // Get difficulty badge
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Easy</Badge>;
      case 'medium': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Medium</Badge>;
      case 'hard': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Hard</Badge>;
      default: return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  // Loading state
  if (loading && !hasInitialFetch) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
            <p className="text-muted-foreground">Manage your quizzes, tests, and exams</p>
          </div>
          <Button disabled className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground">Manage your quizzes, tests, and exams</p>
        </div>
        <div className="flex space-x-2">
          <Link href="/dashboard/instructor/quizzes/create">
            <Button className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              New Assessment
            </Button>
          </Link>
        </div>
      </div>

      <hr className="my-6" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold">{assessments.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileQuestion className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold">
                  {assessments.reduce((sum, a) => sum + (a.question_count || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Questions</p>
                <p className="text-2xl font-bold">
                  {assessments.length > 0 
                    ? Math.round(assessments.reduce((sum, a) => sum + (a.question_count || 0), 0) / assessments.length)
                    : 0}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">
                  {assessments.filter(a => !a.available_until || new Date(a.available_until) > new Date()).length}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <hr className="my-6" />

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assessments by title, description, or course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex space-x-2 flex-wrap sm:flex-nowrap">
              {/* Course Filter Dropdown */}
              <div className="w-full sm:w-40">
                <select
                  value={courseIdParam || 'all'}
                  onChange={(e) => handleCourseFilterChange(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm h-10"
                >
                  <option value="all">All Courses</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="w-full sm:w-40">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm h-10"
                >
                  <option value="all">All Types</option>
                  <option value="quiz">Quiz</option>
                  <option value="test">Test</option>
                  <option value="exam">Exam</option>
                  <option value="practice">Practice</option>
                </select>
              </div>
              
              <div className="w-full sm:w-40">
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm h-10"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => fetchAssessments(courseIdParam || 'all')} 
                className="w-full cursor-pointer sm:w-auto"
              >
                <Filter className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <hr className="my-6" />

      {/* Assessments List */}
      {filteredAssessments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssessments.map(assessment => {
            const typeInfo = getTypeInfo(assessment.type);
            
            return (
              <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{typeInfo.icon}</span>
                        <h3 className="font-semibold text-lg">{assessment.title}</h3>
                        <Badge className={typeInfo.color}>
                          {typeInfo.label}
                        </Badge>
                        {getDifficultyBadge(assessment.difficulty)}
                      </div>
                      
                      <p className="text-gray-600 line-clamp-2">
                        {assessment.description || 'No description provided'}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FileQuestion className="h-4 w-4" />
                          <span>{assessment.question_count || 0} questions</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{assessment.time_limit ? `${assessment.time_limit} min` : 'No time limit'}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4" />
                          <span>{assessment.passing_score}% to pass</span>
                        </div>
                        
                        <div>
                          <span className="font-medium">Course:</span>{' '}
                          {assessment.course_title || 'Unknown Course'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 shrink-0">
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/instructor/quizzes/${assessment.id}`}>
                          <Button variant="outline" size="sm" className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        
                        <Link href={`/dashboard/instructor/quizzes/${assessment.id}/edit`}>
                          <Button variant="outline" size="sm" className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        
                        {/* NEW: Add Questions Button */}
                        <Link href={`/dashboard/instructor/quizzes/${assessment.id}/edit?tab=questions`}>
                          <Button variant="outline" size="sm" className="cursor-pointer">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Questions
                          </Button>
                        </Link>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDuplicateAssessment(assessment.id)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Duplicate
                        </Button>
                        
                        <Button
                          className="cursor-pointer"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteAssessment(assessment.id, assessment.title)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || filterType !== 'all' || filterDifficulty !== 'all' || courseIdParam
                ? 'No matching assessments found'
                : 'No assessments yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterType !== 'all' || filterDifficulty !== 'all' || courseIdParam
                ? 'Try adjusting your search or filters'
                : 'Create your first assessment to get started'}
            </p>
            <Link href="/dashboard/instructor/quizzes/create">
              <Button className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}