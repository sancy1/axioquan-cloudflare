
// /src/components/assessments/assessment-builder.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Assessment, CreateAssessmentData } from '@/types/assessments';
import { Badge } from '@/components/ui/badge'; // ADD THIS IMPORT

interface Course {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  title: string;
  module_title: string;
}

interface AssessmentBuilderProps {
  courseId?: string;
  courses?: Course[];
  assessment?: Assessment;
  onSave?: (assessment: Assessment) => void;
  onCancel?: () => void;
}

const difficultyLevels = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

const assessmentTypes = [
  { value: 'quiz', label: 'Quiz' },
  { value: 'test', label: 'Test' },
  { value: 'exam', label: 'Exam' },
  { value: 'practice', label: 'Practice' }
];

export function AssessmentBuilder({ 
  courseId: initialCourseId, 
  courses = [], 
  assessment, 
  onSave, 
  onCancel 
}: AssessmentBuilderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId || '');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [formData, setFormData] = useState({
    title: assessment?.title || '',
    description: assessment?.description || '',
    instructions: assessment?.instructions || '',
    type: assessment?.type || 'quiz',
    difficulty: assessment?.difficulty || 'medium',
    passing_score: assessment?.passing_score || 70,
    max_attempts: assessment?.max_attempts || 1,
    time_limit: assessment?.time_limit?.toString() || '',
    shuffle_questions: assessment?.shuffle_questions || false,
    show_correct_answers: assessment?.show_correct_answers || true,
    show_results_immediately: assessment?.show_results_immediately || true,
    require_passing: assessment?.require_passing || false,
    points_per_question: assessment?.points_per_question || 1,
    available_from: assessment?.available_from ? new Date(assessment.available_from).toISOString().split('T')[0] : '',
    available_until: assessment?.available_until ? new Date(assessment.available_until).toISOString().split('T')[0] : '',
    duration_minutes: assessment?.duration_minutes?.toString() || '',
    lesson_id: assessment?.lesson_id || 'none'
  });

  // Check if we're in edit mode
  const isEditMode = !!assessment;
  
  // Get current course info for display
  const currentCourse = courses.find(course => course.id === selectedCourseId);

  // Fetch lessons when course changes
  useEffect(() => {
    if (selectedCourseId) {
      fetchLessons(selectedCourseId);
    } else {
      setLessons([]);
    }
  }, [selectedCourseId]);

  const fetchLessons = async (courseId: string) => {
    try {
      const response = await fetch(`/api/assessments/courses/${courseId}/lessons`);
      if (response.ok) {
        const data = await response.json();
        setLessons(data.lessons || []);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  
  // In /src/components/assessments/assessment-builder.tsx
  // Update the handleSubmit function around line 198-304

// In /src/components/assessments/assessment-builder.tsx
// Update the handleSubmit function:

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.title.trim()) {
    toast.error('Error', { description: 'Assessment title is required' });
    return;
  }

  if (!selectedCourseId) {
    toast.error('Error', { description: 'Please select a course' });
    return;
  }

  try {
    setLoading(true);

    const assessmentData: CreateAssessmentData = {
      course_id: selectedCourseId,
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      instructions: formData.instructions.trim() || undefined,
      type: formData.type as any,
      difficulty: formData.difficulty,
      passing_score: Number(formData.passing_score),
      max_attempts: Number(formData.max_attempts),
      time_limit: formData.time_limit ? Number(formData.time_limit) : undefined,
      shuffle_questions: formData.shuffle_questions,
      show_correct_answers: formData.show_correct_answers,
      show_results_immediately: formData.show_results_immediately,
      require_passing: formData.require_passing,
      points_per_question: Number(formData.points_per_question),
      lesson_id: formData.lesson_id && formData.lesson_id !== 'none' ? formData.lesson_id : undefined,
      available_from: formData.available_from ? new Date(formData.available_from) : undefined,
      available_until: formData.available_until ? new Date(formData.available_until) : undefined,
      duration_minutes: formData.duration_minutes ? Number(formData.duration_minutes) : undefined
    };

    const url = assessment ? `/api/assessments/${assessment.id}` : '/api/assessments';
    const method = assessment ? 'PUT' : 'POST';

    console.log('Sending request to:', url);
    console.log('Method:', method);
    console.log('Data:', assessmentData);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(assessmentData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    // Get response text first for debugging
    const responseText = await response.text();
    console.log('Raw response text:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response data:', data);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      console.log('Response text was:', responseText);
      
      if (response.ok) {
        // If response is OK but not JSON, assume success
        toast.success('Success', {
          description: `Assessment ${assessment ? 'updated' : 'created'} successfully`
        });
        
        // Redirect to quizzes page
        setTimeout(() => {
          router.push('/dashboard/instructor/quizzes');
          router.refresh();
        }, 1000);
        return;
      } else {
        toast.error('Error', { 
          description: 'Server returned invalid response format'
        });
        return;
      }
    }
    
    // Check if response is successful (200-299 status code)
    if (response.ok) {
      // SUCCESS: Show success toast
      toast.success('Success', {
        description: data.message || data.assessment?.title || `Assessment ${assessment ? 'updated' : 'created'} successfully`
      });

      // Redirect to quizzes page after a short delay
      setTimeout(() => {
        router.push('/dashboard/instructor/quizzes');
        router.refresh();
      }, 1000);
      
    } else {
      // ERROR: Show error toast with server message
      const errorMessage = data.error || data.message || data.details?.[0]?.message || 'Failed to save assessment';
      console.error('Server error details:', data);
      toast.error('Error', { description: errorMessage });
    }
  } catch (error) {
    console.error('Network error:', error);
    toast.error('Error', { description: 'Network error. Please try again.' });
  } finally {
    setLoading(false);
  }
};

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!formData.title.trim()) {
  //     toast.error('Error', { description: 'Assessment title is required' });
  //     return;
  //   }

  //   if (!selectedCourseId) {
  //     toast.error('Error', { description: 'Please select a course' });
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const assessmentData: CreateAssessmentData = {
  //       course_id: selectedCourseId,
  //       title: formData.title.trim(),
  //       description: formData.description.trim() || undefined,
  //       instructions: formData.instructions.trim() || undefined,
  //       type: formData.type as any,
  //       difficulty: formData.difficulty,
  //       passing_score: Number(formData.passing_score),
  //       max_attempts: Number(formData.max_attempts),
  //       time_limit: formData.time_limit ? Number(formData.time_limit) : undefined,
  //       shuffle_questions: formData.shuffle_questions,
  //       show_correct_answers: formData.show_correct_answers,
  //       show_results_immediately: formData.show_results_immediately,
  //       require_passing: formData.require_passing,
  //       points_per_question: Number(formData.points_per_question),
  //       lesson_id: formData.lesson_id && formData.lesson_id !== 'none' ? formData.lesson_id : undefined,
  //       available_from: formData.available_from ? new Date(formData.available_from) : undefined,
  //       available_until: formData.available_until ? new Date(formData.available_until) : undefined,
  //       duration_minutes: formData.duration_minutes ? Number(formData.duration_minutes) : undefined
  //     };

  //     const url = assessment ? `/api/assessments/${assessment.id}` : '/api/assessments';
  //     const method = assessment ? 'PUT' : 'POST';

  //     console.log('Sending request to:', url);
  //     console.log('Method:', method);
  //     console.log('Data:', assessmentData);

  //     const response = await fetch(url, {
  //       method,
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(assessmentData)
  //     });

  //     console.log('Response status:', response.status);
      
  //     // Check response status before parsing JSON
  //     if (response.status === 204) {
  //       // Handle 204 No Content response
  //       console.log('Received 204 No Content response');
  //       toast.success('Success', {
  //         description: `Assessment ${assessment ? 'updated' : 'created'} successfully`
  //       });
        
  //       if (onSave && assessment) {
  //         // If we're editing, refetch the updated assessment
  //         try {
  //           const refetchedResponse = await fetch(`/api/assessments/${assessment.id}`);
  //           if (refetchedResponse.ok) {
  //             const refetchedData = await refetchedResponse.json();
  //             if (refetchedData.assessment) {
  //               onSave(refetchedData.assessment);
  //               // Wait a moment then redirect
  //               setTimeout(() => {
  //                 router.push('/dashboard/instructor/quizzes');
  //                 router.refresh();
  //               }, 1000);
  //             } else {
  //               router.push('/dashboard/instructor/quizzes');
  //               router.refresh();
  //             }
  //           } else {
  //             // If refetch fails, still redirect
  //             router.push('/dashboard/instructor/quizzes');
  //             router.refresh();
  //           }
  //         } catch (refetchError) {
  //           console.error('Error refetching assessment:', refetchError);
  //           router.push('/dashboard/instructor/quizzes');
  //           router.refresh();
  //         }
  //       } else {
  //         // For create mode, just redirect
  //         router.push('/dashboard/instructor/quizzes');
  //         router.refresh();
  //       }
  //       return;
  //     }

  //     // Parse JSON for normal responses
  //     try {
  //       const data = await response.json();
  //       console.log('Response data:', data);
        
  //       if (response.ok && data.success) {
  //         toast.success('Success', {
  //           description: data.message || `Assessment ${assessment ? 'updated' : 'created'} successfully`
  //         });

  //         if (onSave && data.assessment) {
  //           onSave(data.assessment);
  //           // Wait a moment then redirect
  //           setTimeout(() => {
  //             router.push('/dashboard/instructor/quizzes');
  //             router.refresh();
  //           }, 1000);
  //         } else {
  //           // Redirect immediately if no onSave callback
  //           router.push('/dashboard/instructor/quizzes');
  //           router.refresh();
  //         }
  //       } else {
  //         const errorMessage = data.error || data.details?.[0]?.message || 'Failed to save assessment';
  //         toast.error('Error', { description: errorMessage });
  //       }
  //     } catch (jsonError) {
  //       console.error('JSON parsing error:', jsonError);
  //       // Try to get response as text for debugging
  //       try {
  //         const text = await response.text();
  //         console.error('Response text:', text);
  //         toast.error('Error', { 
  //           description: `Server returned invalid response (Status: ${response.status})` 
  //         });
  //       } catch (textError) {
  //         toast.error('Error', { 
  //           description: `Server error (Status: ${response.status})` 
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Network error:', error);
  //     toast.error('Error', { description: 'Network error. Please try again.' });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? 'Edit Assessment' : 'Create New Assessment'}
        </CardTitle>
        <CardDescription>
          {isEditMode 
            ? 'Update your assessment settings'
            : 'Create a new quiz, test, or exam for your course'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Selection - Only show in create mode */}
          {!isEditMode && courses.length > 0 && !initialCourseId && (
            <div className="space-y-2">
              <Label htmlFor="course_id">Select Course *</Label>
              <Select 
                value={selectedCourseId} 
                onValueChange={setSelectedCourseId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Show course info in edit mode */}
          {isEditMode && currentCourse && (
            <div className="space-y-2">
              <Label>Course</Label>
              <div className="flex items-center p-3 border rounded-lg bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium">{currentCourse.title}</p>
                  <p className="text-sm text-gray-500">Assessment is linked to this course</p>
                </div>
                <Badge variant="outline" className="ml-2">
                  Linked
                </Badge>
              </div>
              {/* Hidden input to maintain course_id in form data */}
              <input 
                type="hidden" 
                name="course_id" 
                value={selectedCourseId} 
              />
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Assessment Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Mid-term Exam, Chapter 1 Quiz"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of what this assessment covers"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  placeholder="Instructions for students taking this assessment"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Rest of the form remains the same... */}
          {/* Assessment Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Assessment Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Assessment Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assessmentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={(value) => handleInputChange('difficulty', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="passing_score">Passing Score (%)</Label>
                <Input
                  id="passing_score"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passing_score}
                  onChange={(e) => handleInputChange('passing_score', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max_attempts">Maximum Attempts</Label>
                <Input
                  id="max_attempts"
                  type="number"
                  min="1"
                  value={formData.max_attempts}
                  onChange={(e) => handleInputChange('max_attempts', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time_limit">Time Limit (minutes, optional)</Label>
                <Input
                  id="time_limit"
                  type="number"
                  min="0"
                  placeholder="No time limit"
                  value={formData.time_limit}
                  onChange={(e) => handleInputChange('time_limit', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration_minutes">Duration (minutes, optional)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  min="0"
                  placeholder="Estimated duration"
                  value={formData.duration_minutes}
                  onChange={(e) => handleInputChange('duration_minutes', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="points_per_question">Points per Question</Label>
                <Input
                  id="points_per_question"
                  type="number"
                  min="1"
                  value={formData.points_per_question}
                  onChange={(e) => handleInputChange('points_per_question', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Lesson Selection */}
          {lessons.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="lesson_id">Link to Lesson (Optional)</Label>
              <Select 
                value={formData.lesson_id} 
                onValueChange={(value) => handleInputChange('lesson_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a lesson (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific lesson</SelectItem>
                  {lessons.map(lesson => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.module_title}: {lesson.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Link this assessment to a specific lesson in your course
              </p>
            </div>
          )}

          {/* Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Availability</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="available_from">Available From (Optional)</Label>
                <Input
                  id="available_from"
                  type="date"
                  value={formData.available_from}
                  onChange={(e) => handleInputChange('available_from', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="available_until">Available Until (Optional)</Label>
                <Input
                  id="available_until"
                  type="date"
                  value={formData.available_until}
                  onChange={(e) => handleInputChange('available_until', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Advanced Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="shuffle_questions">Shuffle Questions</Label>
                  <p className="text-sm text-gray-500">
                    Randomize question order for each attempt
                  </p>
                </div>
                <Switch
                  id="shuffle_questions"
                  checked={formData.shuffle_questions}
                  onCheckedChange={(checked) => handleInputChange('shuffle_questions', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show_correct_answers">Show Correct Answers</Label>
                  <p className="text-sm text-gray-500">
                    Display correct answers after submission
                  </p>
                </div>
                <Switch
                  id="show_correct_answers"
                  checked={formData.show_correct_answers}
                  onCheckedChange={(checked) => handleInputChange('show_correct_answers', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show_results_immediately">Show Results Immediately</Label>
                  <p className="text-sm text-gray-500">
                    Display score immediately after submission
                  </p>
                </div>
                <Switch
                  id="show_results_immediately"
                  checked={formData.show_results_immediately}
                  onCheckedChange={(checked) => handleInputChange('show_results_immediately', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require_passing">Require Passing Grade</Label>
                  <p className="text-sm text-gray-500">
                    Students must pass to continue
                  </p>
                </div>
                <Switch
                  id="require_passing"
                  checked={formData.require_passing}
                  onCheckedChange={(checked) => handleInputChange('require_passing', checked)}
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1 cursor-pointer">
              {loading ? 'Saving...' : (isEditMode ? 'Update Assessment' : 'Create Assessment')}
            </Button>
            
            {(onCancel || !isEditMode) && (
              <Button
              className="cursor-pointer"
                type="button"
                variant="outline"
                onClick={onCancel || (() => router.back())}
                disabled={loading}
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