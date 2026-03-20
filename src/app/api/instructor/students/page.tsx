// /src/app/dashboard/instructor/students/page.tsx
'use client';

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
  Trash2, Loader2,
} from 'lucide-react';
import { CertificateGenerator } from '@/components/dashboard/certificate-generator';

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
  status: 'eligible' | 'in_progress' | 'not_eligible';
}

interface QuizSummary {
  totalStudents: number;
  overallAverageScore: number;
  totalAttempts: number;
  totalPassedAttempts: number;
  studentsEligibleCertificates: number;
  eligibleStudents: number;
}

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
    eligible:     'bg-green-100 text-green-800 hover:bg-green-100',
    in_progress:  'bg-blue-100  text-blue-800  hover:bg-blue-100',
    not_eligible: 'bg-gray-100  text-gray-700  hover:bg-gray-100',
  };
  const labels: Record<string, string> = {
    eligible: '✓ Eligible', in_progress: '⏳ In Progress', not_eligible: '✗ Not Eligible',
  };
  return <Badge className={`${map[status] ?? map.not_eligible} text-xs`}>{labels[status] ?? status}</Badge>;
}

export default function InstructorStudentsPage() {
  const router = useRouter();
  const [quizResults, setQuizResults] = useState<StudentQuizResult[]>([]);
  const [summary, setSummary] = useState<QuizSummary | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [issuedKeys, setIssuedKeys] = useState<Set<string>>(new Set());

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

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

  const handleDeleteQuiz = async (result: StudentQuizResult) => {
    const key = `${result.studentId}-${result.assessmentId}`;
    if (!confirm(`Delete ALL quiz records for "${result.studentName}" on "${result.assessmentTitle}"?\n\nThis cannot be undone.`)) return;
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

  // Apply all filters to detailed results
  const filteredResults = quizResults.filter(r => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !searchTerm ||
      r.studentName.toLowerCase().includes(s) ||
      r.studentEmail.toLowerCase().includes(s) ||
      r.courseTitle.toLowerCase().includes(s) ||
      r.assessmentTitle.toLowerCase().includes(s);
    const matchCourse = filterCourse === 'all' || r.courseId === filterCourse;
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchCourse && matchStatus;
  });

  const hasActiveFilters = searchTerm || filterCourse !== 'all' || filterStatus !== 'all';
  const resetFilters = () => { setSearchTerm(''); setFilterCourse('all'); setFilterStatus('all'); };

  // Student-level summary (grouped, unfiltered)
  const studentMap: Record<string, any> = {};
  quizResults.forEach(r => {
    if (!studentMap[r.studentId]) {
      studentMap[r.studentId] = {
        studentId: r.studentId, studentName: r.studentName,
        studentEmail: r.studentEmail, studentImage: r.studentImage,
        totalQuizzes: 0, quizzesAttempted: 0, quizzesPassed: 0,
        totalAttempts: 0, totalTimeSpent: 0, eligibleCertificates: 0,
        scoreSum: 0, lastActivity: r.lastAttemptDate,
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
  });
  const studentList = Object.values(studentMap).map((st: any) => ({
    ...st,
    averageScore: st.quizzesAttempted > 0 ? st.scoreSum / st.quizzesAttempted : 0,
    coursesCount: st.courses.size,
    coursesList: Array.from(st.courses).join(', '),
  }));

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4 max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i=><div key={i} className="h-32 bg-gray-200 rounded-lg"/>)}</div>
          <div className="h-64 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Student Quiz Analytics</h1>
          <p className="text-gray-500 mt-1">Track performance, issue certificates, and manage quiz records</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: summary?.totalStudents ?? 0, icon: <Users className="h-5 w-5 text-blue-500"/>, bg: 'bg-blue-50',
              sub: <Progress value={quizResults.length > 0 ? 100 : 0} className="h-1.5 mt-3"/> },
            { label: 'Avg. Quiz Score',
              value: summary?.overallAverageScore ? `${Math.round(summary.overallAverageScore)}%` : 'N/A',
              icon: <BarChart3 className="h-5 w-5 text-green-500"/>, bg: 'bg-green-50',
              sub: <div className="flex items-center gap-1 mt-3 text-xs text-green-600"><TrendingUp className="h-3 w-3"/>Overall</div> },
            { label: 'Pass Rate',
              value: summary?.totalAttempts ? `${Math.round((summary.totalPassedAttempts/summary.totalAttempts)*100)}%` : '0%',
              icon: <Target className="h-5 w-5 text-amber-500"/>, bg: 'bg-amber-50',
              sub: <Progress value={summary?.totalAttempts ? (summary.totalPassedAttempts/summary.totalAttempts)*100 : 0} className="h-1.5 mt-3"/> },
            { label: 'Cert. Eligible', value: summary?.studentsEligibleCertificates ?? 0,
              icon: <Award className="h-5 w-5 text-purple-500"/>, bg: 'bg-purple-50',
              sub: <p className="text-xs text-purple-600 mt-3">{summary?.eligibleStudents ?? 0} students qualify</p> },
          ].map((s,i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-gray-500">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></div>
                  <div className={`p-3 ${s.bg} rounded-xl`}>{s.icon}</div>
                </div>
                {s.sub}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by student name, email, course or quiz..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer">
                <option value="all">All Courses</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer">
                <option value="all">All Status</option>
                <option value="eligible">✓ Eligible</option>
                <option value="in_progress">⏳ In Progress</option>
                <option value="not_eligible">✗ Not Eligible</option>
              </select>
              <Button variant="outline" onClick={resetFilters} disabled={!hasActiveFilters}
                className="cursor-pointer gap-2 text-sm">
                <Filter className="h-4 w-4" /> Reset
              </Button>
            </div>
            {hasActiveFilters && (
              <p className="text-xs text-blue-600 mt-2">
                Showing {filteredResults.length} of {quizResults.length} results
              </p>
            )}
          </CardContent>
        </Card>

        {/* Student Overview Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Overview</CardTitle>
            <p className="text-sm text-gray-500">{studentList.length} students with quiz activity</p>
          </CardHeader>
          <CardContent>
            {studentList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      {['Student','Courses','Avg. Score','Quizzes Passed','Attempts','Time Spent','Certs Eligible','Contact'].map(h => (
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
                            <div className="w-14 bg-gray-200 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${st.averageScore>=70?'bg-green-500':st.averageScore>=50?'bg-amber-500':'bg-red-500'}`}
                                style={{width:`${Math.min(100,st.averageScore)}%`}}/>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4 text-green-500"/>
                            <span>{st.quizzesPassed}/{st.quizzesAttempted}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-gray-400"/>
                            <span>{st.totalAttempts}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{formatTime(st.totalTimeSpent)}</td>
                        <td className="py-3 px-4">
                          <Badge className={st.eligibleCertificates > 0
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-100'}>
                            {st.eligibleCertificates} eligible
                          </Badge>
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

        {/* Detailed Quiz Results (filtered) */}
        {quizResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                <span>Detailed Quiz Results</span>
                <Badge variant="secondary">{filteredResults.length} records</Badge>
              </CardTitle>
              <p className="text-sm text-gray-500">
                Per-quiz breakdown with certificate issuance and record deletion.
                {hasActiveFilters && ' Filters are active above.'}
              </p>
            </CardHeader>
            <CardContent>
              {filteredResults.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No results match your current filters.</p>
                  <Button variant="outline" onClick={resetFilters} className="mt-3 cursor-pointer">Clear Filters</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredResults.map((result, index) => {
                    const deleteKey = `${result.studentId}-${result.assessmentId}`;
                    const issueKey  = `${result.studentId}-${result.assessmentId}`;
                    return (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Row header */}
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
                              <span className="font-semibold text-gray-900">{result.studentName}</span>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-600 truncate max-w-[200px]">{result.courseTitle}</span>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-500">{result.assessmentTitle}</span>
                              <StatusBadge status={result.status}/>
                            </div>
                            {/* Stats grid */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                              {[
                                { label: 'Best Score',  value: <span className={`font-bold ${getScoreColor(result.bestScore)}`}>{Math.round(result.bestScore)}%</span> },
                                { label: 'Avg. Score',  value: `${Math.round(result.averageScore)}%` },
                                { label: 'Attempts',    value: `${result.totalAttempts}/${result.maxAttempts}` },
                                { label: 'Time Spent',  value: formatTime(result.totalTimeSpent) },
                                { label: 'Last Attempt',value: new Date(result.lastAttemptDate).toLocaleDateString() },
                              ].map(s => (
                                <div key={s.label}>
                                  <div className="text-xs text-gray-400 mb-0.5">{s.label}</div>
                                  <div className="font-medium text-gray-900">{s.value}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-wrap gap-2 items-center shrink-0">
                            <Button size="sm" variant="outline" asChild className="cursor-pointer gap-1 text-xs">
                              <Link href={`/dashboard/instructor/quizzes/${result.assessmentId}/analytics`}>
                                <BarChart3 className="h-3 w-3"/> Analytics
                              </Link>
                            </Button>

                            <CertificateGenerator
                              data={{
                                studentId:     result.studentId,
                                studentName:   result.studentName,
                                courseTitle:   result.courseTitle,
                                averageScore:  Math.round(result.averageScore),
                                assessmentId:  result.assessmentId,
                                courseId:      result.courseId,
                                completedDate: result.lastAttemptDate,
                              }}
                              onIssued={() => setIssuedKeys(prev => new Set([...prev, issueKey]))}
                              alreadyIssued={issuedKeys.has(issueKey)}
                            />

                            <Button size="sm" variant="ghost"
                              onClick={() => handleDeleteQuiz(result)}
                              disabled={deletingKey === deleteKey}
                              className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 gap-1 text-xs"
                              title="Delete all quiz records for this student on this quiz">
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
