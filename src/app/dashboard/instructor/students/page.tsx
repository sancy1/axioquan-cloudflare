
// // /app/dashboard/instructor/students/page.tsx

// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// // REMOVED: Sidebar import
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { 
//   Users, 
//   BarChart3, 
//   Award, 
//   Clock,
//   Mail,
//   Download,
//   Search,
//   Filter,
//   Eye,
//   AlertCircle,
//   TrendingUp,
//   Target,
//   CheckCircle,
//   Clock as ClockIcon
// } from 'lucide-react'
// import { Badge } from '@/components/ui/badge'
// import { Progress } from '@/components/ui/progress'
// import { toast } from 'sonner'
// import Link from 'next/link'

// interface StudentQuizResult {
//   studentId: string;
//   studentName: string;
//   studentEmail: string;
//   studentImage?: string;
//   courseId: string;
//   courseTitle: string;
//   assessmentId: string;
//   assessmentTitle: string;
//   passingScore: number;
//   maxAttempts: number;
//   totalAttempts: number;
//   bestScore: number;
//   worstScore: number;
//   averageScore: number;
//   hasPassed: boolean;
//   lastAttemptDate: string;
//   totalTimeSpent: number;
//   isCertificateEligible: boolean;
//   status: 'eligible' | 'in_progress' | 'not_eligible';
// }

// interface QuizSummary {
//   totalStudents: number;
//   totalQuizzesAvailable: number;
//   totalQuizzesAttempted: number;
//   overallAverageScore: number;
//   totalAttempts: number;
//   totalPassedAttempts: number;
//   totalQuizzesPassed: number;
//   studentsEligibleCertificates: number;
//   recentSubmissions: number;
//   eligibleStudents: number;
//   eligibleCourses: number;
// }

// export default function InstructorStudentsPage() {
//   const router = useRouter()
//   const [session, setSession] = useState<any>(null)
//   const [quizResults, setQuizResults] = useState<StudentQuizResult[]>([])
//   const [summary, setSummary] = useState<QuizSummary | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [filterCourse, setFilterCourse] = useState('all')
//   const [filterStatus, setFilterStatus] = useState('all')
//   const [courses, setCourses] = useState<any[]>([])
//   const hasEligibleCertificates = summary && summary.studentsEligibleCertificates > 0;

//   useEffect(() => {
//     fetchSessionAndData()
//   }, [])

//   const fetchSessionAndData = async () => {
//     try {
//       setLoading(true)
      
//       // Fetch session
//       const sessionRes = await fetch('/api/auth/status')
//       const sessionData = await sessionRes.json()
      
//       if (sessionRes.ok && sessionData.user) {
//         setSession(sessionData)
//         await fetchStudentQuizData()
//         await fetchCourses()
//       } else {
//         router.push('/login')
//       }
//     } catch (error) {
//       console.error('Error fetching session:', error)
//       router.push('/login')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchStudentQuizData = async () => {
//     try {
//       setLoading(true)
      
//       // Fetch quiz results
//       const resultsResponse = await fetch('/api/instructor/students/quiz-results')
//       const resultsData = await resultsResponse.json()
      
//       if (resultsData.success) {
//         setQuizResults(resultsData.data || [])
//       } else {
//         toast.error(resultsData.error || 'Failed to load quiz results')
//       }
      
//       // Fetch summary
//       const summaryResponse = await fetch('/api/instructor/students/quiz-summary')
//       const summaryData = await summaryResponse.json()
      
//       if (summaryData.success) {
//         setSummary(summaryData.summary)
//       } else {
//         toast.error(summaryData.error || 'Failed to load summary')
//       }
//     } catch (error) {
//       console.error('Error fetching student quiz data:', error)
//       toast.error('Failed to load student quiz data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchCourses = async () => {
//     try {
//       const response = await fetch('/api/courses/instructor/my-courses')
//       if (response.ok) {
//         const data = await response.json()
//         setCourses(data.courses || [])
//       }
//     } catch (error) {
//       console.error('Error fetching courses:', error)
//     }
//   }

//   // Filter quiz results
//   const filteredResults = quizResults.filter(result => {
//     const matchesSearch = 
//       result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       result.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       result.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       result.assessmentTitle.toLowerCase().includes(searchTerm.toLowerCase())
    
//     const matchesCourse = filterCourse === 'all' || result.courseId === filterCourse
//     const matchesStatus = filterStatus === 'all' || result.status === filterStatus
    
//     return matchesSearch && matchesCourse && matchesStatus
//   })

//   // Group results by student for the table
//   const studentSummaries = quizResults.reduce((acc, result) => {
//     if (!acc[result.studentId]) {
//       acc[result.studentId] = {
//         studentId: result.studentId,
//         studentName: result.studentName,
//         studentEmail: result.studentEmail,
//         studentImage: result.studentImage,
//         totalQuizzes: 0,
//         quizzesAttempted: 0,
//         quizzesPassed: 0,
//         bestScore: 0,
//         averageScore: 0,
//         totalAttempts: 0,
//         totalTimeSpent: 0,
//         eligibleCertificates: 0,
//         lastActivity: result.lastAttemptDate,
//         courses: new Set<string>()
//       }
//     }
    
//     const student = acc[result.studentId]
//     student.totalQuizzes += 1
//     student.quizzesAttempted += result.totalAttempts > 0 ? 1 : 0
//     student.quizzesPassed += result.hasPassed ? 1 : 0
//     student.totalAttempts += result.totalAttempts
//     student.totalTimeSpent += result.totalTimeSpent
//     student.courses.add(result.courseTitle)
    
//     if (result.bestScore > student.bestScore) {
//       student.bestScore = result.bestScore
//     }
    
//     // Update average score
//     if (student.quizzesAttempted > 0) {
//       student.averageScore = (student.averageScore * (student.quizzesAttempted - 1) + result.averageScore) / student.quizzesAttempted
//     }
    
//     if (result.isCertificateEligible) {
//       student.eligibleCertificates += 1
//     }
    
//     return acc
//   }, {} as Record<string, any>)

//   const studentList = Object.values(studentSummaries).map((student: any) => ({
//     ...student,
//     coursesCount: student.courses.size,
//     coursesList: Array.from(student.courses).join(', ')
//   }))


//   const formatTime = (seconds: number) => {
//   // Handle null/undefined/NaN values
//   if (!seconds || isNaN(seconds) || seconds === 0) return '0s';
  
//   // Ensure it's a whole number
//   const secs = Math.floor(Number(seconds));
  
//   const hours = Math.floor(secs / 3600);
//   const minutes = Math.floor((secs % 3600) / 60);
//   const remainingSeconds = secs % 60;
  
//   // Format based on duration
//   if (hours > 0) {
//     return `${hours}h ${minutes}m ${remainingSeconds}s`;
//   } else if (minutes > 0) {
//     return `${minutes}m ${remainingSeconds}s`;
//   } else {
//     return `${remainingSeconds}s`;
//   }
// }

//   const getScoreColor = (score: number) => {
//     if (score >= 90) return 'text-green-600'
//     if (score >= 80) return 'text-blue-600'
//     if (score >= 70) return 'text-amber-600'
//     if (score >= 60) return 'text-orange-600'
//     return 'text-red-600'
//   }

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'eligible':
//         return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Eligible</Badge>
//       case 'in_progress':
//         return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
//       case 'not_eligible':
//         return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Not Eligible</Badge>
//       default:
//         return <Badge variant="outline">{status}</Badge>
//     }
//   }

//   if (loading) {
//     return (
//       // REMOVED: Outer div with Sidebar - just return loading state
//       <div className="p-8">
//         <div className="max-w-7xl mx-auto space-y-6">
//           {/* Loading skeletons */}
//           <div className="animate-pulse space-y-4">
//             <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               {[1, 2, 3, 4].map(i => (
//                 <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
//               ))}
//             </div>
//             <div className="h-64 bg-gray-200 rounded-lg"></div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!session) {
//     return (
//       <div className="flex min-h-screen bg-gray-50 items-center justify-center">
//         <div className="text-center">
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
//           <p className="text-gray-600">Please log in to access this page.</p>
//           <Button onClick={() => router.push('/login')} className="mt-4 cursor-pointer">
//             Go to Login
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   // REMOVED: User object creation (not needed since Sidebar is in layout)

//   return (
//     // REMOVED: Outer div with Sidebar - just return the content
//     <div className="p-4 md:p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Student Quiz Analytics</h1>
//           <p className="text-gray-600">
//             Track student quiz performance and certificate eligibility
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Students</p>
//                   <p className="text-2xl font-bold">{summary?.totalStudents || 0}</p>
//                 </div>
//                 <div className="p-3 bg-blue-50 rounded-lg">
//                   <Users className="h-6 w-6 text-blue-600" />
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <div className="flex justify-between text-xs mb-1">
//                   <span>Active</span>
//                   <span>{quizResults.length > 0 ? '100%' : '0%'}</span>
//                 </div>
//                 <Progress value={quizResults.length > 0 ? 100 : 0} className="h-2" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Avg. Quiz Score</p>
//                   <p className="text-2xl font-bold">
//                     {summary?.overallAverageScore ? Math.round(summary.overallAverageScore) + '%' : 'N/A'}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-green-50 rounded-lg">
//                   <BarChart3 className="h-6 w-6 text-green-600" />
//                 </div>
//               </div>
//               <div className="mt-4 flex items-center gap-2 text-sm">
//                 <TrendingUp className="h-4 w-4 text-green-500" />
//                 <span className="text-green-600">Overall Performance</span>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Pass Rate</p>
//                   <p className="text-2xl font-bold">
//                     {summary?.totalAttempts 
//                       ? Math.round((summary.totalPassedAttempts / summary.totalAttempts) * 100) + '%'
//                       : '0%'
//                     }
//                   </p>
//                 </div>
//                 <div className="p-3 bg-amber-50 rounded-lg">
//                   <Target className="h-6 w-6 text-amber-600" />
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <div className="flex justify-between text-xs mb-1">
//                   <span>Passing</span>
//                   <span>
//                     {summary?.totalPassedAttempts || 0}/{summary?.totalAttempts || 0}
//                   </span>
//                 </div>
//                 <Progress 
//                   value={summary?.totalAttempts 
//                     ? (summary.totalPassedAttempts / summary.totalAttempts) * 100 
//                     : 0
//                   } 
//                   className="h-2" 
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Certificates</p>
//                   <p className="text-2xl font-bold">{summary?.studentsEligibleCertificates || 0}</p>
//                 </div>
//                 <div className="p-3 bg-purple-50 rounded-lg">
//                   <Award className="h-6 w-6 text-purple-600" />
//                 </div>
//               </div>
//               <div className="mt-4 flex items-center gap-2 text-sm">
//                 <span className="text-purple-600">
//                   {summary?.eligibleStudents || 0} students eligible
//                 </span>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Search and Filter */}
//         <Card>
//           <CardContent className="p-4 md:p-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search students by name, email, or course..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <select 
//                   value={filterCourse} 
//                   onChange={(e) => setFilterCourse(e.target.value)}
//                   className="border border-gray-300 rounded-lg px-3 py-2"
//                 >
//                   <option value="all">All Courses</option>
//                   {courses.map(course => (
//                     <option key={course.id} value={course.id}>
//                       {course.title}
//                     </option>
//                   ))}
//                 </select>
//                 <select 
//                   value={filterStatus} 
//                   onChange={(e) => setFilterStatus(e.target.value)}
//                   className="border border-gray-300 rounded-lg px-3 py-2"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="eligible">Eligible</option>
//                   <option value="in_progress">In Progress</option>
//                   <option value="not_eligible">Not Eligible</option>
//                 </select>
//                 <Button 
//                  className="cursor-pointer"
//                   variant="outline" 
//                   onClick={() => {
//                     setSearchTerm('')
//                     setFilterCourse('all')
//                     setFilterStatus('all')
//                   }}
//                 >
//                   <Filter className="h-4 w-4 mr-2" />
//                   Reset
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Students Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Student Quiz Performance</CardTitle>
//             <p className="text-sm text-gray-600">
//               Showing {studentList.length} students with quiz results
//             </p>
//           </CardHeader>
//           <CardContent>
//             {studentList.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b">
//                       <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Student</th>
//                       <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Courses</th>
//                       <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Avg. Score</th>
//                       <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Quizzes</th>
//                       <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Attempts</th>
//                       <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Time Spent</th>
//                       <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Certificates</th>
//                       <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {studentList.map((student: any) => (
//                       <tr key={student.studentId} className="border-b hover:bg-gray-50">
//                         <td className="py-3 px-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
//                               {student.studentImage ? (
//                                 <img 
//                                   src={student.studentImage} 
//                                   alt={student.studentName}
//                                   className="w-8 h-8 rounded-full"
//                                 />
//                               ) : (
//                                 <span className="text-sm font-medium">
//                                   {student.studentName?.charAt(0).toUpperCase()}
//                                 </span>
//                               )}
//                             </div>
//                             <div>
//                               <div className="font-medium">{student.studentName}</div>
//                               <div className="text-sm text-gray-500">{student.studentEmail}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-3 px-4">
//                           <div className="text-sm">
//                             <span className="font-medium">{student.coursesCount}</span> courses
//                             <div className="text-xs text-gray-500 truncate max-w-[200px]" title={student.coursesList}>
//                               {student.coursesList}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-3 px-4">
//                           <div className="flex items-center gap-2">
//                             <span className={`font-bold text-lg ${getScoreColor(student.averageScore)}`}>
//                               {Math.round(student.averageScore)}%
//                             </span>
//                             <div className="w-20 bg-gray-200 rounded-full h-2">
//                               <div 
//                                 className={`h-2 rounded-full ${
//                                   student.averageScore >= 70 ? 'bg-green-500' :
//                                   student.averageScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
//                                 }`}
//                                 style={{ width: `${Math.min(100, student.averageScore)}%` }}
//                               />
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-3 px-4">
//                           <div className="flex flex-col gap-1">
//                             <div className="flex items-center gap-2">
//                               <CheckCircle className="h-4 w-4 text-green-500" />
//                               <span>{student.quizzesPassed}/{student.quizzesAttempted}</span>
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {student.totalQuizzes} total
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-3 px-4">
//                           <div className="flex items-center gap-2">
//                             <ClockIcon className="h-4 w-4 text-gray-400" />
//                             <span>{student.totalAttempts}</span>
//                           </div>
//                         </td>
//                         <td className="py-3 px-4">
//                           <div className="text-sm">
//                             {formatTime(student.totalTimeSpent)}
//                           </div>
//                         </td>
//                         <td className="py-3 px-4">
//                           <div className="flex flex-col gap-1">
//                             <Badge className={`w-fit ${
//                               student.eligibleCertificates > 0 
//                                 ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' 
//                                 : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
//                             }`}>
//                               {student.eligibleCertificates} eligible
//                             </Badge>
//                             <div className="text-xs text-gray-500">
//                               Last: {new Date(student.lastActivity).toLocaleDateString()}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-3 px-4">
//                           <div className="flex gap-2">
//                             <Button 
//                             className='cursor-pointer'
//                               size="sm" 
//                               variant="outline"
//                               asChild
//                             >
//                               {/* <Link href={`/dashboard/instructor/students/${student.studentId}`}>
//                                 <Eye className="h-4 w-4 mr-1" />
//                                 View
//                               </Link> */}
//                             </Button>
//                             <Button 
//                             className='cursor-pointer'
//                               size="sm" 
//                               variant="outline"
//                               onClick={() => {
//                                 window.open(`mailto:${student.studentEmail}?subject=Regarding Your Quiz Performance`, '_blank')
//                               }}
//                             >
//                               <Mail className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <div className="text-6xl mb-4">📊</div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quiz Results Found</h3>
//                 <p className="text-gray-600 mb-6">
//                   No students have taken quizzes in your courses yet.
//                 </p>
//                 <Button asChild className='cursor-pointer'>
                  
//                   <Link href="/dashboard/instructor/courses">
//                     View Your Courses
//                   </Link>
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Certificate Management */}
//         {summary && summary.studentsEligibleCertificates > 0 && (
//           <Card className="border-amber-200 bg-amber-50">
//             <CardHeader>
//               <CardTitle className="text-amber-900">Certificate Management</CardTitle>
//               <p className="text-sm text-amber-700">
//                 {summary.studentsEligibleCertificates} students are eligible for certificates
//               </p>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//                 <div>
//                   <p className="text-amber-800">
//                     Review and issue certificates to students who have passed your course quizzes with 70% or higher.
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button 
//                     variant="outline" 
//                     className="border-amber-300 text-amber-700 cursor-pointer"
//                     onClick={() => {
//                       const csvData = studentList
//                         .filter(s => s.eligibleCertificates > 0)
//                         .map(s => ({
//                           Name: s.studentName,
//                           Email: s.studentEmail,
//                           'Avg Score': s.averageScore + '%',
//                           'Eligible Certificates': s.eligibleCertificates,
//                           'Courses': s.coursesList
//                         }))
                      
//                       const csv = [
//                         Object.keys(csvData[0]).join(','),
//                         ...csvData.map(row => Object.values(row).join(','))
//                       ].join('\n')
                      
//                       const blob = new Blob([csv], { type: 'text/csv' })
//                       const url = window.URL.createObjectURL(blob)
//                       const a = document.createElement('a')
//                       a.href = url
//                       a.download = 'eligible-students.csv'
//                       document.body.appendChild(a)
//                       a.click()
//                       document.body.removeChild(a)
//                     }}
//                   >
//                     <Download className="h-4 w-4 mr-2" />
//                     Export List
//                   </Button>
//                   <Button 
//                     className="bg-amber-600 hover:bg-amber-700 cursor-pointer"
//                     asChild
//                   >
//                     <Link href="/dashboard/instructor/certificates">
//                       <Award className="h-4 w-4 mr-2" />
//                       Manage Certificates
//                     </Link>
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Detailed Quiz Results */}
//         {filteredResults.length > 0 && (
//           <Card>
//             <CardHeader>
//               <CardTitle>Detailed Quiz Results</CardTitle>
//               <p className="text-sm text-gray-600">
//                 Individual quiz performance for each student
//               </p>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {filteredResults.map((result, index) => (
//                   <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
//                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-2">
//                           <span className="font-medium">{result.studentName}</span>
//                           <span className="text-gray-500">•</span>
//                           <span className="text-sm text-gray-600">{result.courseTitle}</span>
//                           <span className="text-gray-500">•</span>
//                           <span className="text-sm text-gray-600">{result.assessmentTitle}</span>
//                         </div>
                        
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                           <div>
//                             <div className="text-gray-500">Best Score</div>
//                             <div className={`font-bold ${getScoreColor(result.bestScore)}`}>
//                               {Math.round(result.bestScore)}%
//                             </div>
//                           </div>
//                           <div>
//                             <div className="text-gray-500">Average Score</div>
//                             <div className="font-medium">{Math.round(result.averageScore)}%</div>
//                           </div>
//                           <div>
//                             <div className="text-gray-500">Attempts</div>
//                             <div className="font-medium">{result.totalAttempts}/{result.maxAttempts}</div>
//                           </div>
//                           <div>
//                             <div className="text-gray-500">Status</div>
//                             <div>{getStatusBadge(result.status)}</div>
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="flex gap-2">
//                         <Button 
//                         className='cursor-pointer'
//                           size="sm" 
//                           variant="outline"
//                           asChild
//                         >
//                           <Link href={`/dashboard/instructor/quizzes/${result.assessmentId}/analytics`}>
//                             <BarChart3 className="h-4 w-4 mr-1" />
//                             Analytics
//                           </Link>
//                         </Button>
//                         <Button 
//                         className='cursor-pointer'
//                           size="sm" 
//                           variant={result.isCertificateEligible ? "default" : "outline"}
//                           disabled={!result.isCertificateEligible}
//                         >
//                           <Award className="h-4 w-4 mr-1" />
//                           {result.isCertificateEligible ? 'Issue Certificate' : 'Not Eligible'}
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }

























'use client';
// /src/app/dashboard/instructor/students/page.tsx
//
// v5 fixes:
// • Search & filter now actually work — filteredResults drives BOTH tables
// • Status filter includes 'issued' option
// • Filter card is fully responsive — no more overlapping Reset button
// • Removed dead "Issue Certificate" Award button (replaced by CertificateGenerator)
// • "Certificate Management" message updates dynamically:
//   - If eligible students remain → shows count + review prompt
//   - If all eligible have certs → shows "All eligible students have received certificates"
// • "Detailed Quiz Results" section title/desc updates based on filter state
// • CertificateGenerator onIssued callback updates local eligibility state
//   so eligible counts update without a full page reload

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Users, BarChart3, Award, Target, TrendingUp,
  CheckCircle, Clock, Mail, Search, Filter,
  Trash2, Loader2, X, RefreshCw,
} from 'lucide-react';
import { CertificateGenerator } from '@/components/dashboard/certificate-generator';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudentQuizResult {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentImage?: string;
  courseId: string;
  courseTitle: string;
  assessmentId: string;
  assessmentTitle: string;
  passingScore: number;
  maxAttempts: number;
  totalAttempts: number;
  bestScore: number;
  worstScore: number;
  averageScore: number;
  hasPassed: boolean;
  lastAttemptDate: string;
  totalTimeSpent: number;
  isCertificateEligible: boolean;
  /** 'eligible' | 'in_progress' | 'not_eligible' | 'issued' */
  status: string;
}

interface QuizSummary {
  totalStudents: number;
  overallAverageScore: number;
  totalAttempts: number;
  totalPassedAttempts: number;
  studentsEligibleCertificates: number;
  eligibleStudents: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds === 0) return '0s';
  const s = Math.floor(Number(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${r}s`;
  return `${r}s`;
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-amber-600';
  if (score >= 60) return 'text-orange-500';
  return 'text-red-500';
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    eligible:     'bg-green-100 text-green-800',
    in_progress:  'bg-blue-100 text-blue-800',
    not_eligible: 'bg-gray-100 text-gray-700',
    issued:       'bg-purple-100 text-purple-800',
  };
  const labels: Record<string, string> = {
    eligible: '✓ Eligible',
    in_progress: '⏳ In Progress',
    not_eligible: '✗ Not Eligible',
    issued: '🎓 Issued',
  };
  return (
    <Badge className={`${map[status] ?? map.not_eligible} text-xs hover:opacity-90`}>
      {labels[status] ?? status}
    </Badge>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InstructorStudentsPage() {
  const router = useRouter();
  const [quizResults, setQuizResults] = useState<StudentQuizResult[]>([]);
  const [summary, setSummary] = useState<QuizSummary | null>(null);
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  // Track which keys have had certs issued this session (augments DB state)
  const [issuedKeys, setIssuedKeys] = useState<Set<string>>(new Set());

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const sessionRes = await fetch('/api/auth/status');
      const sessionData = await sessionRes.json();
      if (!sessionRes.ok || !sessionData.user) { router.push('/login'); return; }

      const [resultsRes, summaryRes, coursesRes] = await Promise.all([
        fetch('/api/instructor/students/quiz-results'),
        fetch('/api/instructor/students/quiz-summary'),
        fetch('/api/courses/instructor/my-courses'),
      ]);
      const [rD, sD, cD] = await Promise.all([
        resultsRes.json(), summaryRes.json(), coursesRes.json(),
      ]);
      if (rD.success) setQuizResults(rD.data || []);
      if (sD.success) setSummary(sD.summary);
      if (coursesRes.ok) setCourses(cD.courses || []);
    } catch { toast.error('Failed to load student data'); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Mark a result as issued locally (no refetch needed) ───────────────────
  const markAsIssued = useCallback((studentId: string, assessmentId: string) => {
    const key = `${studentId}-${assessmentId}`;
    setIssuedKeys(prev => new Set([...prev, key]));
    setQuizResults(prev => prev.map(r =>
      r.studentId === studentId && r.assessmentId === assessmentId
        ? { ...r, status: 'issued', isCertificateEligible: true }
        : r
    ));
    setSummary(prev => prev ? {
      ...prev,
      studentsEligibleCertificates: Math.max(0, prev.studentsEligibleCertificates - 1),
      eligibleStudents: Math.max(0, prev.eligibleStudents - 1),
    } : prev);
  }, []);

  // ── Delete quiz record ─────────────────────────────────────────────────────
  const handleDeleteQuiz = async (result: StudentQuizResult) => {
    const key = `${result.studentId}-${result.assessmentId}`;
    if (!confirm(
      `Delete ALL quiz records for "${result.studentName}" on "${result.assessmentTitle}"?\n\nThis cannot be undone.`
    )) return;

    setDeletingKey(key);
    try {
      const res = await fetch('/api/instructor/students/delete-quiz', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: result.studentId, assessment_id: result.assessmentId }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuizResults(prev =>
          prev.filter(r => !(r.studentId === result.studentId && r.assessmentId === result.assessmentId))
        );
        toast.success('Quiz records deleted');
      } else {
        toast.error(data.error || 'Failed to delete');
      }
    } catch { toast.error('Network error'); }
    finally { setDeletingKey(null); }
  };

  // ── Filters ────────────────────────────────────────────────────────────────
  const hasActiveFilters = searchTerm.trim() !== '' || filterCourse !== 'all' || filterStatus !== 'all';
  const resetFilters = () => { setSearchTerm(''); setFilterCourse('all'); setFilterStatus('all'); };

  const filteredResults = quizResults.filter(r => {
    const s = searchTerm.toLowerCase().trim();
    const matchSearch = !s ||
      r.studentName.toLowerCase().includes(s) ||
      r.studentEmail.toLowerCase().includes(s) ||
      r.courseTitle.toLowerCase().includes(s) ||
      r.assessmentTitle.toLowerCase().includes(s);
    const matchCourse = filterCourse === 'all' || r.courseId === filterCourse;
    // Status filter: 'issued' checks both DB status and session-issued keys
    const effectiveStatus = issuedKeys.has(`${r.studentId}-${r.assessmentId}`) ? 'issued' : r.status;
    const matchStatus = filterStatus === 'all' || effectiveStatus === filterStatus;
    return matchSearch && matchCourse && matchStatus;
  });

  // ── Student-level summary (unfiltered, for Overview table) ─────────────────
  const studentMap: Record<string, any> = {};
  quizResults.forEach(r => {
    if (!studentMap[r.studentId]) {
      studentMap[r.studentId] = {
        studentId: r.studentId, studentName: r.studentName,
        studentEmail: r.studentEmail, studentImage: r.studentImage,
        totalQuizzes: 0, quizzesAttempted: 0, quizzesPassed: 0,
        totalAttempts: 0, totalTimeSpent: 0, eligibleCertificates: 0,
        issuedCertificates: 0, scoreSum: 0, lastActivity: r.lastAttemptDate,
        courses: new Set<string>(),
      };
    }
    const st = studentMap[r.studentId];
    st.totalQuizzes++;
    if (r.totalAttempts > 0) { st.quizzesAttempted++; st.scoreSum += r.averageScore; }
    if (r.hasPassed) st.quizzesPassed++;
    st.totalAttempts += r.totalAttempts;
    st.totalTimeSpent += r.totalTimeSpent;
    st.courses.add(r.courseTitle);
    if (r.isCertificateEligible) st.eligibleCertificates++;
    if (r.status === 'issued' || issuedKeys.has(`${r.studentId}-${r.assessmentId}`)) st.issuedCertificates++;
  });
  const studentList = Object.values(studentMap).map((st: any) => ({
    ...st,
    averageScore: st.quizzesAttempted > 0 ? st.scoreSum / st.quizzesAttempted : 0,
    coursesCount: st.courses.size,
    coursesList: Array.from(st.courses).join(', '),
  }));

  // ── Dynamic cert management message ───────────────────────────────────────
  const eligibleCount = quizResults.filter(r =>
    r.isCertificateEligible &&
    r.status !== 'issued' &&
    !issuedKeys.has(`${r.studentId}-${r.assessmentId}`)
  ).length;
  const totalEligible = quizResults.filter(r => r.isCertificateEligible).length;

  const certMgmtTitle = eligibleCount === 0 && totalEligible > 0
    ? '🎓 All eligible students have received their certificates'
    : eligibleCount > 0
    ? `Certificate Management — ${eligibleCount} student${eligibleCount !== 1 ? 's' : ''} eligible`
    : 'Certificate Management';

  const certMgmtDesc = eligibleCount === 0 && totalEligible > 0
    ? 'Every student who passed (70%+) has been issued a certificate. Use the filter below to review issued certificates.'
    : eligibleCount > 0
    ? `${eligibleCount} student${eligibleCount !== 1 ? 's' : ''} ${eligibleCount !== 1 ? 'are' : 'is'} eligible for certificates. Review and issue to students who passed with 70% or higher.`
    : 'No students are currently eligible for certificates.';

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4 max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-lg"/>)}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Student Quiz Analytics</h1>
            <p className="text-gray-500 mt-1 text-sm">Track performance, issue certificates, and manage quiz records</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchAll} className="cursor-pointer gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Students', value: summary?.totalStudents ?? 0,
              icon: <Users className="h-5 w-5 text-blue-500"/>, bg: 'bg-blue-50',
              sub: <Progress value={100} className="h-1.5 mt-3"/>,
            },
            {
              label: 'Avg. Quiz Score',
              value: summary?.overallAverageScore ? `${Math.round(summary.overallAverageScore)}%` : 'N/A',
              icon: <BarChart3 className="h-5 w-5 text-green-500"/>, bg: 'bg-green-50',
              sub: <div className="flex items-center gap-1 mt-3 text-xs text-green-600"><TrendingUp className="h-3 w-3"/>Overall</div>,
            },
            {
              label: 'Pass Rate',
              value: summary?.totalAttempts ? `${Math.round((summary.totalPassedAttempts / summary.totalAttempts) * 100)}%` : '0%',
              icon: <Target className="h-5 w-5 text-amber-500"/>, bg: 'bg-amber-50',
              sub: <Progress value={summary?.totalAttempts ? (summary.totalPassedAttempts / summary.totalAttempts) * 100 : 0} className="h-1.5 mt-3"/>,
            },
            {
              label: 'Cert. Eligible',
              value: eligibleCount,
              icon: <Award className="h-5 w-5 text-purple-500"/>, bg: 'bg-purple-50',
              sub: <p className="text-xs text-purple-600 mt-3">
                {eligibleCount === 0 && totalEligible > 0
                  ? `All ${totalEligible} issued ✓`
                  : `${summary?.eligibleStudents ?? 0} students qualify`}
              </p>,
            },
          ].map((s, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{s.label}</p>
                    <p className="text-2xl font-bold mt-1">{s.value}</p>
                  </div>
                  <div className={`p-3 ${s.bg} rounded-xl flex-shrink-0`}>{s.icon}</div>
                </div>
                {s.sub}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Search & Filter — FIXED: responsive, no overlap ── */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

              {/* Search — full width on mobile, spans 2 cols on lg */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by name, email, course or quiz..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Course filter */}
              <select
                value={filterCourse}
                onChange={e => setFilterCourse(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="all">All Courses</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="eligible">✓ Eligible</option>
                <option value="in_progress">⏳ In Progress</option>
                <option value="not_eligible">✗ Not Eligible</option>
                <option value="issued">🎓 Issued</option>
              </select>
            </div>

            {/* Active filter info + reset — always on its own row, no overlap */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-blue-600">
                  Showing <strong>{filteredResults.length}</strong> of <strong>{quizResults.length}</strong> results
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="cursor-pointer gap-1.5 text-xs h-7"
                >
                  <Filter className="h-3 w-3" /> Reset filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Student Overview Table ── */}
        <Card>
          <CardHeader>
            <CardTitle>Student Overview</CardTitle>
            <p className="text-sm text-gray-500">{studentList.length} students with quiz activity</p>
          </CardHeader>
          <CardContent>
            {studentList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      {['Student', 'Courses', 'Avg. Score', 'Quizzes Passed', 'Attempts', 'Time Spent', 'Certs Eligible', 'Contact'].map(h => (
                        <th key={h} className="text-left py-3 px-4 font-medium text-gray-600 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {studentList.map((st: any) => (
                      <tr key={st.studentId} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                              {st.studentImage
                                ? <img src={st.studentImage} alt="" className="w-full h-full object-cover"/>
                                : st.studentName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 whitespace-nowrap">{st.studentName}</div>
                              <div className="text-xs text-gray-400">{st.studentEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{st.coursesCount}</span>
                          <div className="text-xs text-gray-400 max-w-[140px] truncate" title={st.coursesList}>{st.coursesList}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${getScoreColor(st.averageScore)}`}>{Math.round(st.averageScore)}%</span>
                            <div className="w-14 bg-gray-200 rounded-full h-1.5 hidden lg:block">
                              <div className={`h-1.5 rounded-full ${st.averageScore >= 70 ? 'bg-green-500' : st.averageScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(100, st.averageScore)}%` }}/>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0"/>
                            <span>{st.quizzesPassed}/{st.quizzesAttempted}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-gray-400 flex-shrink-0"/>
                            <span>{st.totalAttempts}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{formatTime(st.totalTimeSpent)}</td>
                        <td className="py-3 px-4">
                          {st.issuedCertificates > 0 ? (
                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-xs">
                              🎓 {st.issuedCertificates} issued
                            </Badge>
                          ) : (
                            <Badge className={`${st.eligibleCertificates > 0 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'} text-xs hover:opacity-90`}>
                              {st.eligibleCertificates > 0 ? `${st.eligibleCertificates} eligible` : 'None eligible'}
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="ghost" title="Send email"
                            onClick={() => window.open(`mailto:${st.studentEmail}?subject=Regarding Your Quiz Performance`, '_blank')}
                            className="cursor-pointer p-1.5">
                            <Mail className="h-4 w-4 text-gray-500"/>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-gray-900">No Quiz Results Yet</h3>
                <p className="text-gray-500 text-sm mt-2">Students haven't taken any quizzes in your courses yet.</p>
                <Button asChild className="mt-4 cursor-pointer">
                  <Link href="/dashboard/instructor/courses">View Your Courses</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Detailed Quiz Results ── */}
        {quizResults.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  {/* Dynamic title based on filter / cert status */}
                  <CardTitle>
                    {hasActiveFilters
                      ? `Filtered Results (${filteredResults.length})`
                      : certMgmtTitle}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {hasActiveFilters
                      ? `Showing ${filteredResults.length} of ${quizResults.length} quiz records`
                      : certMgmtDesc}
                  </p>
                </div>
                <Badge variant="secondary">{filteredResults.length} records</Badge>
              </div>
            </CardHeader>

            <CardContent>
              {filteredResults.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-500 font-medium">No results match your current filters.</p>
                  <Button variant="outline" onClick={resetFilters} className="mt-3 cursor-pointer">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredResults.map((result, index) => {
                    const deleteKey  = `${result.studentId}-${result.assessmentId}`;
                    const wasIssued  = issuedKeys.has(deleteKey) || result.status === 'issued';

                    return (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">

                          {/* Left: student info + stats */}
                          <div className="flex-1 min-w-0">
                            {/* Header row */}
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
                              <span className="font-semibold text-gray-900">{result.studentName}</span>
                              <span className="text-gray-300 select-none">•</span>
                              <span className="text-sm text-gray-600 truncate max-w-[200px]" title={result.courseTitle}>
                                {result.courseTitle}
                              </span>
                              <span className="text-gray-300 select-none">•</span>
                              <span className="text-sm text-gray-500">{result.assessmentTitle}</span>
                              <StatusBadge status={wasIssued ? 'issued' : result.status} />
                            </div>

                            {/* Stats grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm">
                              {[
                                { label: 'Best Score',   value: <span className={`font-bold ${getScoreColor(result.bestScore)}`}>{Math.round(result.bestScore)}%</span> },
                                { label: 'Avg. Score',   value: `${Math.round(result.averageScore)}%` },
                                { label: 'Attempts',     value: `${result.totalAttempts}/${result.maxAttempts}` },
                                { label: 'Time Spent',   value: formatTime(result.totalTimeSpent) },
                                { label: 'Last Attempt', value: new Date(result.lastAttemptDate).toLocaleDateString() },
                              ].map(s => (
                                <div key={s.label}>
                                  <div className="text-xs text-gray-400 mb-0.5">{s.label}</div>
                                  <div className="font-medium text-gray-900">{s.value}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right: action buttons */}
                          <div className="flex flex-wrap gap-2 items-center lg:flex-col lg:items-end shrink-0">
                            {/* Analytics link */}
                            <Button size="sm" variant="outline" asChild className="cursor-pointer gap-1 text-xs">
                              <Link href={`/dashboard/instructor/quizzes/${result.assessmentId}/analytics`}>
                                <BarChart3 className="h-3 w-3"/> Analytics
                              </Link>
                            </Button>

                            {/* Certificate — DB-backed, persists on refresh */}
                            {result.isCertificateEligible && (
                              <CertificateGenerator
                                data={{
                                  studentId:    result.studentId,
                                  studentName:  result.studentName,
                                  courseTitle:  result.courseTitle,
                                  averageScore: Math.round(result.averageScore),
                                  assessmentId: result.assessmentId,
                                  courseId:     result.courseId,
                                  completedDate: result.lastAttemptDate,
                                }}
                                alreadyIssued={wasIssued}
                                onIssued={() => markAsIssued(result.studentId, result.assessmentId)}
                              />
                            )}

                            {/* Delete quiz record */}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteQuiz(result)}
                              disabled={deletingKey === deleteKey}
                              className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 gap-1 text-xs"
                              title="Delete all quiz records for this student on this quiz"
                            >
                              {deletingKey === deleteKey
                                ? <Loader2 className="h-3 w-3 animate-spin"/>
                                : <><Trash2 className="h-3 w-3"/> Delete</>}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
