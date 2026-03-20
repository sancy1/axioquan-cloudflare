
// // /components/curriculum/lesson-editor.tsx

// 'use client';

// import { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import { FileUpload } from '@/components/courses/file-upload';
// import { Lesson } from '@/lib/db/queries/curriculum';

// interface LessonEditorProps {
//   lesson: Lesson;
//   onSave: (updates: any) => void;
//   onCancel: () => void;
// }

// const lessonTypes = [
//   { value: 'video', label: 'Video', icon: '🎥' },
//   { value: 'text', label: 'Text', icon: '📝' },
//   { value: 'document', label: 'Document', icon: '📄' },
//   { value: 'quiz', label: 'Quiz', icon: '❓' },
//   { value: 'assignment', label: 'Assignment', icon: '📋' },
//   { value: 'live_session', label: 'Live Session', icon: '🔴' },
//   { value: 'audio', label: 'Audio', icon: '🎧' },
//   { value: 'interactive', label: 'Interactive', icon: '⚡' },
//   { value: 'code', label: 'Code', icon: '💻' },
//   { value: 'discussion', label: 'Discussion', icon: '💬' }
// ];

// const difficultyLevels = [
//   { value: 'beginner', label: 'Beginner' },
//   { value: 'intermediate', label: 'Intermediate' },
//   { value: 'advanced', label: 'Advanced' }
// ];

// export function LessonEditor({ lesson, onSave, onCancel }: LessonEditorProps) {
//   const [formData, setFormData] = useState({
//     title: lesson.title,
//     description: lesson.description || '',
//     lesson_type: lesson.lesson_type,
//     difficulty: lesson.difficulty,
//     video_url: lesson.video_url || '',
//     video_duration: lesson.video_duration || 0,
//     document_url: lesson.document_url || '',
//     content_html: lesson.content_html || '',
//     is_published: lesson.is_published,
//     is_preview: lesson.is_preview
//   });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.title.trim()) {
//       return;
//     }

//     setLoading(true);
//     try {
//       await onSave(formData);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field: string, value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const getCurrentLessonType = () => {
//     return lessonTypes.find(type => type.value === formData.lesson_type) || lessonTypes[0];
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Edit Lesson</CardTitle>
//         <CardDescription>
//           Update your lesson content and settings
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Information */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Basic Information</h3>
            
//             <div className="grid grid-cols-1 gap-4">
//               <div>
//                 <label htmlFor="title" className="block text-sm font-medium mb-1">
//                   Lesson Title *
//                 </label>
//                 <Input
//                   id="title"
//                   value={formData.title}
//                   onChange={(e) => handleInputChange('title', e.target.value)}
//                   placeholder="e.g., Introduction to React Components"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label htmlFor="description" className="block text-sm font-medium mb-1">
//                   Description
//                 </label>
//                 <Textarea
//                   id="description"
//                   value={formData.description}
//                   onChange={(e) => handleInputChange('description', e.target.value)}
//                   placeholder="Brief description of what students will learn in this lesson"
//                   rows={3}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Lesson Type & Settings */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Lesson Type & Settings</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="lesson_type" className="block text-sm font-medium mb-1">
//                   Lesson Type
//                 </label>
//                 <select
//                   id="lesson_type"
//                   value={formData.lesson_type}
//                   onChange={(e) => handleInputChange('lesson_type', e.target.value)}
//                   className="w-full p-2 border rounded-md"
//                 >
//                   {lessonTypes.map(type => (
//                     <option key={type.value} value={type.value}>
//                       {type.icon} {type.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
//                   Difficulty Level
//                 </label>
//                 <select
//                   id="difficulty"
//                   value={formData.difficulty}
//                   onChange={(e) => handleInputChange('difficulty', e.target.value)}
//                   className="w-full p-2 border rounded-md"
//                 >
//                   {difficultyLevels.map(level => (
//                     <option key={level.value} value={level.value}>
//                       {level.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="flex space-x-4">
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id="is_published"
//                   checked={formData.is_published}
//                   onChange={(e) => handleInputChange('is_published', e.target.checked)}
//                   className="rounded"
//                 />
//                 <label htmlFor="is_published" className="text-sm font-medium">
//                   Published
//                 </label>
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id="is_preview"
//                   checked={formData.is_preview}
//                   onChange={(e) => handleInputChange('is_preview', e.target.checked)}
//                   className="rounded"
//                 />
//                 <label htmlFor="is_preview" className="text-sm font-medium">
//                   Available as Preview
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Content Based on Lesson Type */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Lesson Content</h3>
            
//             <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//               <div className="flex items-center space-x-2 mb-2">
//                 <Badge variant="default" className="bg-blue-100 text-blue-800">
//                   {getCurrentLessonType().icon} {getCurrentLessonType().label}
//                 </Badge>
//                 <span className="text-sm text-blue-700">
//                   Configure {getCurrentLessonType().label.toLowerCase()} content below
//                 </span>
//               </div>
//             </div>

//             {formData.lesson_type === 'video' && (
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Video Content
//                 </label>
//                 <FileUpload
//                   value={formData.video_url}
//                   onChange={(url) => handleInputChange('video_url', url)}
//                   onUploadComplete={(meta) => {
//                     if (meta.duration) {
//                       handleInputChange('video_duration', Math.round(meta.duration));
//                     }
//                   }}
//                   type="video"
//                   description="Upload a video file or paste a video URL"
//                 />
                
//                 {formData.video_duration > 0 && (
//                   <div className="mt-2 text-sm text-gray-600">
//                     Video duration: {Math.round(formData.video_duration / 60)} minutes
//                   </div>
//                 )}
//               </div>
//             )}

//             {formData.lesson_type === 'document' && (
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Document File
//                 </label>
//                 <FileUpload
//                   value={formData.document_url}
//                   onChange={(url) => handleInputChange('document_url', url)}
//                   type="document"
//                   description="Upload PDF, Word, PowerPoint, or other document files"
//                 />
//               </div>
//             )}

//             {(formData.lesson_type === 'text' || formData.lesson_type === 'discussion') && (
//               <div>
//                 <label htmlFor="content_html" className="block text-sm font-medium mb-1">
//                   Content
//                 </label>
//                 <Textarea
//                   id="content_html"
//                   value={formData.content_html}
//                   onChange={(e) => handleInputChange('content_html', e.target.value)}
//                   placeholder="Write your lesson content here. You can use basic HTML formatting."
//                   rows={10}
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Supports basic HTML tags: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;br&gt;
//                 </p>
//               </div>
//             )}

//             {formData.lesson_type === 'quiz' && (
//               <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//                 <p className="text-yellow-800">
//                   Quiz functionality coming soon! For now, you can describe the quiz in the description field.
//                 </p>
//               </div>
//             )}

//             {formData.lesson_type === 'assignment' && (
//               <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
//                 <p className="text-orange-800">
//                   Assignment functionality coming soon! For now, you can describe the assignment in the description field.
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Submit Buttons */}
//           <div className="flex space-x-4 pt-4">
//             <Button 
//               type="submit" 
//               disabled={loading || !formData.title.trim()}
//               className="flex-1"
//             >
//               {loading ? 'Saving...' : 'Save Lesson'}
//             </Button>
            
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onCancel}
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }





























// 'use client';
// // /components/curriculum/lesson-editor.tsx
// //
// // Rich text editor for lesson content_html.
// // Uses a dependency-free contenteditable WYSIWYG that saves clean HTML
// // directly into the content_html field — no TipTap/Quill install needed.
// // Works with the existing updateLessonAction / PUT /api/lessons/[id] flow.

// import { useState, useRef, useCallback, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import { FileUpload } from '@/components/courses/file-upload';
// import { Lesson } from '@/lib/db/queries/curriculum';
// import {
//   Bold, Italic, Underline, Strikethrough, Code, Link, List, ListOrdered,
//   AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3,
//   Quote, Minus, Undo, Redo, Type, RotateCcw
// } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface LessonEditorProps {
//   lesson: Lesson;
//   onSave: (updates: any) => void;
//   onCancel: () => void;
// }

// // ─── Lesson type / difficulty metadata ───────────────────────────────────────

// const lessonTypes = [
//   { value: 'video',        label: 'Video',         icon: '🎥' },
//   { value: 'text',         label: 'Text',          icon: '📝' },
//   { value: 'document',     label: 'Document',      icon: '📄' },
//   { value: 'quiz',         label: 'Quiz',          icon: '❓' },
//   { value: 'assignment',   label: 'Assignment',    icon: '📋' },
//   { value: 'live_session', label: 'Live Session',  icon: '🔴' },
//   { value: 'audio',        label: 'Audio',         icon: '🎧' },
//   { value: 'interactive',  label: 'Interactive',   icon: '⚡' },
//   { value: 'code',         label: 'Code',          icon: '💻' },
//   { value: 'discussion',   label: 'Discussion',    icon: '💬' },
// ];

// const difficultyLevels = [
//   { value: 'beginner',     label: 'Beginner' },
//   { value: 'intermediate', label: 'Intermediate' },
//   { value: 'advanced',     label: 'Advanced' },
// ];

// // Lesson types that get the rich text body editor
// const RICH_TEXT_TYPES = new Set([
//   'text', 'discussion', 'assignment', 'interactive', 'live_session', 'code',
// ]);

// // ─── RichTextEditor ───────────────────────────────────────────────────────────

// interface RichTextEditorProps {
//   value: string;
//   onChange: (html: string) => void;
//   placeholder?: string;
//   minHeight?: number;
// }

// function RichTextEditor({
//   value,
//   onChange,
//   placeholder = 'Start writing your lesson content here…',
//   minHeight = 320,
// }: RichTextEditorProps) {
//   const editorRef = useRef<HTMLDivElement>(null);
//   const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
//   const isInitialised = useRef(false);

//   // Set initial HTML once only
//   useEffect(() => {
//     if (editorRef.current && !isInitialised.current) {
//       editorRef.current.innerHTML = value || '';
//       isInitialised.current = true;
//     }
//   }, []);

//   const updateActiveFormats = useCallback(() => {
//     const formats = new Set<string>();
//     try {
//       if (document.queryCommandState('bold'))          formats.add('bold');
//       if (document.queryCommandState('italic'))        formats.add('italic');
//       if (document.queryCommandState('underline'))     formats.add('underline');
//       if (document.queryCommandState('strikeThrough')) formats.add('strikethrough');
//     } catch {}
//     setActiveFormats(formats);
//   }, []);

//   const exec = useCallback((command: string, value?: string) => {
//     editorRef.current?.focus();
//     document.execCommand(command, false, value);
//     updateActiveFormats();
//     if (editorRef.current) onChange(editorRef.current.innerHTML);
//   }, [onChange, updateActiveFormats]);

//   const handleInput = useCallback(() => {
//     if (editorRef.current) {
//       updateActiveFormats();
//       onChange(editorRef.current.innerHTML);
//     }
//   }, [onChange, updateActiveFormats]);

//   const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
//     // Tab → insert 4 spaces (prevents focus loss)
//     if (e.key === 'Tab') {
//       e.preventDefault();
//       exec('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
//     }
//     // Ctrl/Cmd shortcuts
//     if (e.ctrlKey || e.metaKey) {
//       if (e.key === 'b') { e.preventDefault(); exec('bold'); }
//       if (e.key === 'i') { e.preventDefault(); exec('italic'); }
//       if (e.key === 'u') { e.preventDefault(); exec('underline'); }
//       if (e.key === 'z') { e.preventDefault(); exec(e.shiftKey ? 'redo' : 'undo'); }
//     }
//   }, [exec]);

//   const insertLink = useCallback(() => {
//     const url = prompt('Enter URL:', 'https://');
//     if (url) exec('createLink', url);
//   }, [exec]);

//   const insertHR = useCallback(() => exec('insertHTML', '<hr/>'), [exec]);

//   const clearFormatting = useCallback(() => {
//     exec('removeFormat');
//     exec('formatBlock', 'p');
//   }, [exec]);

//   // ── Toolbar button helper ──────────────────────────────────────────────────
//   const ToolbarBtn = ({
//     onClick, title, active = false, children,
//   }: {
//     onClick: () => void; title: string; active?: boolean; children: React.ReactNode;
//   }) => (
//     <button
//       type="button"
//       onMouseDown={(e) => { e.preventDefault(); onClick(); }}
//       title={title}
//       className={`
//         inline-flex items-center justify-center w-8 h-8 rounded-md text-sm transition-colors
//         ${active
//           ? 'bg-indigo-100 text-indigo-700 font-bold'
//           : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
//       `}
//     >
//       {children}
//     </button>
//   );

//   const Divider = () => <div className="w-px h-5 bg-gray-200 mx-0.5" />;

//   return (
//     <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition-all">

//       {/* ── Toolbar ─────────────────────────────────────────────────────── */}
//       <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-100">

//         {/* Undo / Redo */}
//         <ToolbarBtn onClick={() => exec('undo')} title="Undo (Ctrl+Z)">
//           <Undo size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('redo')} title="Redo (Ctrl+Shift+Z)">
//           <Redo size={14} />
//         </ToolbarBtn>

//         <Divider />

//         {/* Block type */}
//         <ToolbarBtn onClick={() => exec('formatBlock', 'p')} title="Paragraph">
//           <Type size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('formatBlock', 'h1')} title="Heading 1">
//           <Heading1 size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('formatBlock', 'h2')} title="Heading 2">
//           <Heading2 size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('formatBlock', 'h3')} title="Heading 3">
//           <Heading3 size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('formatBlock', 'pre')} title="Code Block">
//           <Code size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('formatBlock', 'blockquote')} title="Blockquote">
//           <Quote size={14} />
//         </ToolbarBtn>

//         <Divider />

//         {/* Inline formatting */}
//         <ToolbarBtn
//           onClick={() => exec('bold')}
//           title="Bold (Ctrl+B)"
//           active={activeFormats.has('bold')}
//         >
//           <Bold size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn
//           onClick={() => exec('italic')}
//           title="Italic (Ctrl+I)"
//           active={activeFormats.has('italic')}
//         >
//           <Italic size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn
//           onClick={() => exec('underline')}
//           title="Underline (Ctrl+U)"
//           active={activeFormats.has('underline')}
//         >
//           <Underline size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn
//           onClick={() => exec('strikeThrough')}
//           title="Strikethrough"
//           active={activeFormats.has('strikethrough')}
//         >
//           <Strikethrough size={14} />
//         </ToolbarBtn>

//         <Divider />

//         {/* Lists */}
//         <ToolbarBtn onClick={() => exec('insertUnorderedList')} title="Bullet List">
//           <List size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('insertOrderedList')} title="Numbered List">
//           <ListOrdered size={14} />
//         </ToolbarBtn>

//         <Divider />

//         {/* Alignment */}
//         <ToolbarBtn onClick={() => exec('justifyLeft')} title="Align Left">
//           <AlignLeft size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('justifyCenter')} title="Align Centre">
//           <AlignCenter size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('justifyRight')} title="Align Right">
//           <AlignRight size={14} />
//         </ToolbarBtn>

//         <Divider />

//         {/* Misc */}
//         <ToolbarBtn onClick={insertLink} title="Insert Link">
//           <Link size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={insertHR} title="Insert Horizontal Rule">
//           <Minus size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={clearFormatting} title="Clear Formatting">
//           <RotateCcw size={14} />
//         </ToolbarBtn>
//       </div>

//       {/* ── Editor area ──────────────────────────────────────────────────── */}
//       <style>{`
//         .wysiwyg-editor { outline: none; }
//         .wysiwyg-editor:empty::before {
//           content: attr(data-placeholder);
//           color: #9ca3af;
//           pointer-events: none;
//         }

//         /* Real-time preview styles inside editor — match .lesson-body exactly */
//         .wysiwyg-editor p          { margin-bottom: 1.2em; line-height: 1.75; }
//         .wysiwyg-editor p:last-child { margin-bottom: 0; }
//         .wysiwyg-editor h1         { font-size: 1.7rem; font-weight: 700; color: #111827; margin: 1.6em 0 0.5em; }
//         .wysiwyg-editor h2         { font-size: 1.35rem; font-weight: 700; color: #1f2937; margin: 1.4em 0 0.5em; border-bottom: 2px solid #f3f4f6; padding-bottom: 0.3em; }
//         .wysiwyg-editor h3         { font-size: 1.1rem; font-weight: 700; color: #374151; margin: 1.2em 0 0.4em; }
//         .wysiwyg-editor h4         { font-size: 1rem; font-weight: 600; color: #374151; margin: 1em 0 0.3em; }
//         .wysiwyg-editor h1:first-child, .wysiwyg-editor h2:first-child, .wysiwyg-editor h3:first-child { margin-top: 0; }
//         .wysiwyg-editor ul         { list-style-type: disc; padding-left: 1.6em; margin-bottom: 1.2em; }
//         .wysiwyg-editor ol         { list-style-type: decimal; padding-left: 1.6em; margin-bottom: 1.2em; }
//         .wysiwyg-editor li         { margin-bottom: 0.4em; line-height: 1.7; }
//         .wysiwyg-editor blockquote { border-left: 4px solid #6366f1; background: #eef2ff; margin: 1.2em 0; padding: 0.8em 1.1em; border-radius: 0 8px 8px 0; color: #4338ca; }
//         .wysiwyg-editor pre        { background: #1e293b; color: #e2e8f0; font-family: ui-monospace, monospace; font-size: 0.875em; padding: 1em 1.2em; border-radius: 10px; overflow-x: auto; margin-bottom: 1.2em; white-space: pre-wrap; }
//         .wysiwyg-editor code       { background: #f3f4f6; color: #e11d48; font-family: ui-monospace, monospace; font-size: 0.875em; padding: 0.1em 0.4em; border-radius: 4px; }
//         .wysiwyg-editor pre code   { background: none; color: inherit; padding: 0; }
//         .wysiwyg-editor a          { color: #4f46e5; text-decoration: underline; }
//         .wysiwyg-editor hr         { border: none; border-top: 2px solid #f3f4f6; margin: 1.5em 0; }
//         .wysiwyg-editor strong, .wysiwyg-editor b { font-weight: 700; }
//         .wysiwyg-editor em, .wysiwyg-editor i { font-style: italic; }
//       `}</style>

//       <div
//         ref={editorRef}
//         contentEditable
//         suppressContentEditableWarning
//         data-placeholder={placeholder}
//         onInput={handleInput}
//         onKeyDown={handleKeyDown}
//         onKeyUp={updateActiveFormats}
//         onMouseUp={updateActiveFormats}
//         onSelect={updateActiveFormats}
//         className="wysiwyg-editor px-5 py-4 text-gray-800 text-[15px] leading-relaxed"
//         style={{ minHeight }}
//       />

//       {/* ── Footer: word count + hint ─────────────────────────────────── */}
//       <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
//         <span>
//           {value
//             ? `${value.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length} words`
//             : '0 words'}
//         </span>
//         <span>Tip: Select text then click a toolbar button to format it</span>
//       </div>
//     </div>
//   );
// }

// // ─── LessonEditor (main export) ───────────────────────────────────────────────

// export function LessonEditor({ lesson, onSave, onCancel }: LessonEditorProps) {
//   const [formData, setFormData] = useState({
//     title:          lesson.title,
//     description:    lesson.description    || '',
//     lesson_type:    lesson.lesson_type,
//     difficulty:     lesson.difficulty     || 'beginner',
//     video_url:      lesson.video_url      || '',
//     video_duration: lesson.video_duration || 0,
//     audio_url:      lesson.audio_url      || '',
//     document_url:   lesson.document_url   || '',
//     content_html:   lesson.content_html   || '',
//     is_published:   lesson.is_published,
//     is_preview:     lesson.is_preview,
//   });
//   const [loading, setLoading] = useState(false);

//   const set = (field: string, value: any) =>
//     setFormData(prev => ({ ...prev, [field]: value }));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.title.trim()) return;
//     setLoading(true);
//     try { await onSave(formData); } finally { setLoading(false); }
//   };

//   const currentType = lessonTypes.find(t => t.value === formData.lesson_type) ?? lessonTypes[0];
//   const showRichEditor = RICH_TEXT_TYPES.has(formData.lesson_type);

//   return (
//     <Card className="shadow-sm">
//       <CardHeader className="pb-4 border-b border-gray-100">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
//             {currentType.icon}
//           </div>
//           <div>
//             <CardTitle className="text-xl">Edit Lesson</CardTitle>
//             <CardDescription>Update lesson content and settings</CardDescription>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="pt-6">
//         <form onSubmit={handleSubmit} className="space-y-8">

//           {/* ── 1. Basic Information ──────────────────────────────────── */}
//           <section className="space-y-4">
//             <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
//               <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">1</span>
//               Basic Information
//             </h3>

//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Lesson Title <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 id="title"
//                 value={formData.title}
//                 onChange={(e) => set('title', e.target.value)}
//                 placeholder="e.g., Introduction to React Components"
//                 required
//                 className="text-base"
//               />
//             </div>

//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Short Description
//                 <span className="ml-2 text-xs text-gray-400 font-normal">Shown in curriculum sidebar</span>
//               </label>
//               <Textarea
//                 id="description"
//                 value={formData.description}
//                 onChange={(e) => set('description', e.target.value)}
//                 placeholder="Brief description of what students will learn in this lesson"
//                 rows={2}
//                 className="resize-none"
//               />
//             </div>
//           </section>

//           {/* ── 2. Lesson Type & Settings ─────────────────────────────── */}
//           <section className="space-y-4">
//             <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
//               <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">2</span>
//               Type & Settings
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="lesson_type" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Lesson Type
//                 </label>
//                 <select
//                   id="lesson_type"
//                   value={formData.lesson_type}
//                   onChange={(e) => set('lesson_type', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
//                 >
//                   {lessonTypes.map(type => (
//                     <option key={type.value} value={type.value}>
//                       {type.icon} {type.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Difficulty
//                 </label>
//                 <select
//                   id="difficulty"
//                   value={formData.difficulty}
//                   onChange={(e) => set('difficulty', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
//                 >
//                   {difficultyLevels.map(level => (
//                     <option key={level.value} value={level.value}>
//                       {level.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="flex items-center gap-6 pt-1">
//               <label className="flex items-center gap-2.5 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={formData.is_published}
//                   onChange={(e) => set('is_published', e.target.checked)}
//                   className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Published</span>
//               </label>

//               <label className="flex items-center gap-2.5 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={formData.is_preview}
//                   onChange={(e) => set('is_preview', e.target.checked)}
//                   className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Available as Free Preview</span>
//               </label>
//             </div>
//           </section>

//           {/* ── 3. Lesson Content ─────────────────────────────────────── */}
//           <section className="space-y-4">
//             <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
//               <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">3</span>
//               Lesson Content
//               <Badge className="ml-1 bg-indigo-50 text-indigo-700 border-0 text-xs font-medium">
//                 {currentType.icon} {currentType.label}
//               </Badge>
//             </h3>

//             {/* VIDEO ──────────────────────────────────────────────────── */}
//             {formData.lesson_type === 'video' && (
//               <div className="space-y-3">
//                 <label className="block text-sm font-medium text-gray-700">Video File / URL</label>
//                 <FileUpload
//                   value={formData.video_url}
//                   onChange={(url) => set('video_url', url)}
//                   onUploadComplete={(meta: any) => {
//                     if (meta?.duration) set('video_duration', Math.round(meta.duration));
//                   }}
//                   type="video"
//                   description="Upload a video file or paste a video URL"
//                 />
//                 {formData.video_duration > 0 && (
//                   <p className="text-sm text-gray-500">
//                     Duration: {Math.floor(formData.video_duration / 60)}m {formData.video_duration % 60}s
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* AUDIO ──────────────────────────────────────────────────── */}
//             {/* FileUpload only accepts "video"|"image"|"document" — no "audio" type.
//                 We use a URL input with live preview + document uploader as fallback. */}
//             {formData.lesson_type === 'audio' && (
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                     Audio URL
//                     <span className="ml-2 text-xs text-gray-400 font-normal">
//                       Paste a direct link to your MP3, WAV, or OGG file
//                     </span>
//                   </label>
//                   <Input
//                     value={formData.audio_url}
//                     onChange={(e) => set('audio_url', e.target.value)}
//                     placeholder="https://example.com/audio/lesson.mp3"
//                     type="url"
//                   />
//                   {formData.audio_url && (
//                     <div className="mt-3 p-3 bg-violet-50 border border-violet-100 rounded-xl">
//                       <p className="text-xs font-medium text-violet-700 mb-2">Preview</p>
//                       <audio controls className="w-full" src={formData.audio_url}>
//                         Your browser does not support the audio element.
//                       </audio>
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                     Or upload audio file
//                     <span className="ml-2 text-xs text-gray-400 font-normal">
//                       Upload and the URL will be filled in above automatically
//                     </span>
//                   </label>
//                   <FileUpload
//                     value={formData.document_url}
//                     onChange={(url) => { set('document_url', url); set('audio_url', url); }}
//                     type="document"
//                     description="Upload MP3, WAV, OGG — URL copies to audio field above"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* DOCUMENT ───────────────────────────────────────────────── */}
//             {formData.lesson_type === 'document' && (
//               <div className="space-y-3">
//                 <label className="block text-sm font-medium text-gray-700">Document File</label>
//                 <FileUpload
//                   value={formData.document_url}
//                   onChange={(url) => set('document_url', url)}
//                   type="document"
//                   description="Upload PDF, Word, PowerPoint, or other documents"
//                 />
//               </div>
//             )}

//             {/* QUIZ notice ─────────────────────────────────────────────── */}
//             {formData.lesson_type === 'quiz' && (
//               <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
//                 <span className="text-2xl flex-shrink-0">❓</span>
//                 <div>
//                   <p className="font-semibold text-yellow-900 text-sm">Quiz Builder</p>
//                   <p className="text-yellow-800 text-sm mt-0.5">
//                     Quizzes are built in the Quiz section of the dashboard. Use the description above to
//                     briefly explain what this quiz covers.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* RICH TEXT EDITOR — text, discussion, assignment, interactive, live_session, code */}
//             {showRichEditor && (
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Lesson Body
//                     <span className="ml-2 text-xs text-gray-400 font-normal">
//                       Formatted content students will read
//                     </span>
//                   </label>
//                 </div>

//                 <RichTextEditor
//                   value={formData.content_html}
//                   onChange={(html) => set('content_html', html)}
//                   placeholder={
//                     formData.lesson_type === 'assignment'
//                       ? 'Describe the assignment instructions, requirements, and submission guidelines…'
//                       : formData.lesson_type === 'discussion'
//                       ? 'Write the discussion prompt and any background context…'
//                       : formData.lesson_type === 'code'
//                       ? 'Explain the coding exercise, requirements, and expected output…'
//                       : formData.lesson_type === 'live_session'
//                       ? 'Describe what will be covered in this live session, prerequisites, and agenda…'
//                       : 'Write your lesson content here. Use headings, bullet points, and bold text to structure it clearly…'
//                   }
//                 />

//                 <p className="text-xs text-gray-400 pt-1">
//                   What you write here is exactly what students see — all formatting is preserved.
//                 </p>
//               </div>
//             )}

//             {/* VIDEO with optional notes ───────────────────────────────── */}
//             {formData.lesson_type === 'video' && (
//               <div className="space-y-2 pt-2 border-t border-gray-100">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Lesson Notes
//                   <span className="ml-2 text-xs text-gray-400 font-normal">Optional — supplementary text shown below the video</span>
//                 </label>
//                 <RichTextEditor
//                   value={formData.content_html}
//                   onChange={(html) => set('content_html', html)}
//                   placeholder="Add notes, summaries, or additional context for this video lesson…"
//                   minHeight={200}
//                 />
//               </div>
//             )}
//           </section>

//           {/* ── Actions ───────────────────────────────────────────────── */}
//           <div className="flex gap-3 pt-2 border-t border-gray-100">
//             <Button
//               type="submit"
//               disabled={loading || !formData.title.trim()}
//               className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
//             >
//               {loading ? (
//                 <span className="flex items-center gap-2">
//                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   Saving…
//                 </span>
//               ) : 'Save Lesson'}
//             </Button>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onCancel}
//               disabled={loading}
//               className="px-6"
//             >
//               Cancel
//             </Button>
//           </div>

//         </form>
//       </CardContent>
//     </Card>
//   );
// }





































// 'use client';
// // /components/curriculum/lesson-editor.tsx
// //
// // Rich text editor for lesson content_html.
// // Uses a dependency-free contenteditable WYSIWYG that saves clean HTML
// // directly into the content_html field — no TipTap/Quill install needed.
// // Works with the existing updateLessonAction / PUT /api/lessons/[id] flow.

// import { useState, useRef, useCallback, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import { FileUpload } from '@/components/courses/file-upload';
// import { Lesson } from '@/lib/db/queries/curriculum';
// import {
//   Bold, Italic, Underline, Strikethrough, Code, Link, List, ListOrdered,
//   AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3,
//   Quote, Minus, Undo, Redo, Type, RotateCcw, Highlighter, Baseline
// } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface LessonEditorProps {
//   lesson: Lesson;
//   onSave: (updates: any) => void;
//   onCancel: () => void;
// }

// // ─── Lesson type / difficulty metadata ───────────────────────────────────────

// const lessonTypes = [
//   { value: 'video',        label: 'Video',         icon: '🎥' },
//   { value: 'text',         label: 'Text',          icon: '📝' },
//   { value: 'document',     label: 'Document',      icon: '📄' },
//   { value: 'quiz',         label: 'Quiz',          icon: '❓' },
//   { value: 'assignment',   label: 'Assignment',    icon: '📋' },
//   { value: 'live_session', label: 'Live Session',  icon: '🔴' },
//   { value: 'audio',        label: 'Audio',         icon: '🎧' },
//   { value: 'interactive',  label: 'Interactive',   icon: '⚡' },
//   { value: 'code',         label: 'Code',          icon: '💻' },
//   { value: 'discussion',   label: 'Discussion',    icon: '💬' },
// ];

// const difficultyLevels = [
//   { value: 'beginner',     label: 'Beginner' },
//   { value: 'intermediate', label: 'Intermediate' },
//   { value: 'advanced',     label: 'Advanced' },
// ];

// // Lesson types that get the rich text body editor
// const RICH_TEXT_TYPES = new Set([
//   'text', 'discussion', 'assignment', 'interactive', 'live_session', 'code',
// ]);

// // ─── RichTextEditor ───────────────────────────────────────────────────────────

// interface RichTextEditorProps {
//   value: string;
//   onChange: (html: string) => void;
//   placeholder?: string;
//   minHeight?: number;
// }

// function RichTextEditor({
//   value,
//   onChange,
//   placeholder = 'Start writing your lesson content here…',
//   minHeight = 320,
// }: RichTextEditorProps) {
//   const editorRef = useRef<HTMLDivElement>(null);
//   const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
//   const isInitialised = useRef(false);

//   // Set initial HTML once only
//   useEffect(() => {
//     if (editorRef.current && !isInitialised.current) {
//       editorRef.current.innerHTML = value || '';
//       isInitialised.current = true;
//     }
//   }, []);

//   const updateActiveFormats = useCallback(() => {
//     const formats = new Set<string>();
//     try {
//       if (document.queryCommandState('bold'))          formats.add('bold');
//       if (document.queryCommandState('italic'))        formats.add('italic');
//       if (document.queryCommandState('underline'))     formats.add('underline');
//       if (document.queryCommandState('strikeThrough')) formats.add('strikethrough');
//     } catch {}
//     setActiveFormats(formats);
//   }, []);

//   const exec = useCallback((command: string, value?: string) => {
//     editorRef.current?.focus();
//     document.execCommand(command, false, value);
//     updateActiveFormats();
//     if (editorRef.current) onChange(editorRef.current.innerHTML);
//   }, [onChange, updateActiveFormats]);

//   const handleInput = useCallback(() => {
//     if (editorRef.current) {
//       updateActiveFormats();
//       onChange(editorRef.current.innerHTML);
//     }
//   }, [onChange, updateActiveFormats]);

//   const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
//     // Tab → insert 4 spaces (prevents focus loss)
//     if (e.key === 'Tab') {
//       e.preventDefault();
//       exec('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
//     }
//     // Ctrl/Cmd shortcuts
//     if (e.ctrlKey || e.metaKey) {
//       if (e.key === 'b') { e.preventDefault(); exec('bold'); }
//       if (e.key === 'i') { e.preventDefault(); exec('italic'); }
//       if (e.key === 'u') { e.preventDefault(); exec('underline'); }
//       if (e.key === 'z') { e.preventDefault(); exec(e.shiftKey ? 'redo' : 'undo'); }
//     }
//   }, [exec]);

//   const insertLink = useCallback(() => {
//     const url = prompt('Enter URL:', 'https://');
//     if (url) exec('createLink', url);
//   }, [exec]);

//   const insertHR = useCallback(() => exec('insertHTML', '<hr/>'), [exec]);

//   const clearFormatting = useCallback(() => {
//     exec('removeFormat');
//     exec('formatBlock', 'p');
//   }, [exec]);

//   // ── Color pickers ──────────────────────────────────────────────────────────
//   // We must save/restore the selection because opening a native <input type=color>
//   // causes the contenteditable to lose focus and drop the selection.
//   const savedRangeRef = useRef<Range | null>(null);
//   const textColorRef  = useRef<HTMLInputElement>(null);
//   const bgColorRef    = useRef<HTMLInputElement>(null);

//   const saveSelection = useCallback(() => {
//     const sel = window.getSelection();
//     if (sel && sel.rangeCount > 0) {
//       savedRangeRef.current = sel.getRangeAt(0).cloneRange();
//     }
//   }, []);

//   const restoreSelection = useCallback(() => {
//     const sel = window.getSelection();
//     if (sel && savedRangeRef.current) {
//       sel.removeAllRanges();
//       sel.addRange(savedRangeRef.current);
//     }
//   }, []);

//   const applyTextColor = useCallback((color: string) => {
//     editorRef.current?.focus();
//     restoreSelection();
//     document.execCommand('styleWithCSS', false, 'true');
//     document.execCommand('foreColor', false, color);
//     document.execCommand('styleWithCSS', false, 'false');
//     if (editorRef.current) onChange(editorRef.current.innerHTML);
//   }, [restoreSelection, onChange]);

//   const applyBgColor = useCallback((color: string) => {
//     editorRef.current?.focus();
//     restoreSelection();
//     document.execCommand('styleWithCSS', false, 'true');
//     document.execCommand('hiliteColor', false, color);
//     document.execCommand('styleWithCSS', false, 'false');
//     if (editorRef.current) onChange(editorRef.current.innerHTML);
//   }, [restoreSelection, onChange]);

//   // ── Toolbar button helper ──────────────────────────────────────────────────
//   const ToolbarBtn = ({
//     onClick, title, active = false, children,
//   }: {
//     onClick: () => void; title: string; active?: boolean; children: React.ReactNode;
//   }) => (
//     <button
//       type="button"
//       onMouseDown={(e) => { e.preventDefault(); onClick(); }}
//       title={title}
//       className={`
//         inline-flex items-center justify-center w-8 h-8 rounded-md text-sm transition-colors
//         ${active
//           ? 'bg-indigo-100 text-indigo-700 font-bold'
//           : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
//       `}
//     >
//       {children}
//     </button>
//   );

//   const Divider = () => <div className="w-px h-5 bg-gray-200 mx-0.5" />;

//   return (
//     <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition-all">

//       {/* Hidden native color inputs — triggered by toolbar buttons */}
//       <input
//         ref={textColorRef}
//         type="color"
//         className="sr-only"
//         defaultValue="#000000"
//         onChange={(e) => applyTextColor(e.target.value)}
//       />
//       <input
//         ref={bgColorRef}
//         type="color"
//         className="sr-only"
//         defaultValue="#ffff00"
//         onChange={(e) => applyBgColor(e.target.value)}
//       />

//       {/* ── Toolbar ─────────────────────────────────────────────────────── */}
//       <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-100">

//         {/* Undo / Redo */}
//         <ToolbarBtn onClick={() => exec('undo')} title="Undo (Ctrl+Z)">
//           <Undo size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('redo')} title="Redo (Ctrl+Shift+Z)">
//           <Redo size={14} />
//         </ToolbarBtn>

//         <Divider />

//         {/* Block type */}
//         <ToolbarBtn onClick={() => exec('formatBlock', 'p')} title="Paragraph">
//           <Type size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('formatBlock', 'h1')} title="Heading 1">
//           <Heading1 size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('formatBlock', 'h2')} title="Heading 2">
//           <Heading2 size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('formatBlock', 'h3')} title="Heading 3">
//           <Heading3 size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('formatBlock', 'pre')} title="Code Block">
//           <Code size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('formatBlock', 'blockquote')} title="Blockquote">
//           <Quote size={14} />
//         </ToolbarBtn>

//         <Divider />

//         {/* Inline formatting */}
//         <ToolbarBtn
//           onClick={() => exec('bold')}
//           title="Bold (Ctrl+B)"
//           active={activeFormats.has('bold')}
//         >
//           <Bold size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn
//           onClick={() => exec('italic')}
//           title="Italic (Ctrl+I)"
//           active={activeFormats.has('italic')}
//         >
//           <Italic size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn
//           onClick={() => exec('underline')}
//           title="Underline (Ctrl+U)"
//           active={activeFormats.has('underline')}
//         >
//           <Underline size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn
//           onClick={() => exec('strikeThrough')}
//           title="Strikethrough"
//           active={activeFormats.has('strikethrough')}
//         >
//           <Strikethrough size={14} />
//         </ToolbarBtn>

//         <Divider />

//         {/* Lists */}
//         <ToolbarBtn onClick={() => exec('insertUnorderedList')} title="Bullet List">
//           <List size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('insertOrderedList')} title="Numbered List">
//           <ListOrdered size={14} />
//         </ToolbarBtn>

//         <Divider />

//         {/* Alignment */}
//         <ToolbarBtn onClick={() => exec('justifyLeft')} title="Align Left">
//           <AlignLeft size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('justifyCenter')} title="Align Centre">
//           <AlignCenter size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('justifyRight')} title="Align Right">
//           <AlignRight size={14} />
//         </ToolbarBtn>

//         <Divider />

//         {/* Misc */}
//         <ToolbarBtn onClick={insertLink} title="Insert Link">
//           <Link size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={insertHR} title="Insert Horizontal Rule">
//           <Minus size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={clearFormatting} title="Clear Formatting">
//           <RotateCcw size={14} />
//         </ToolbarBtn>

//         <Divider />

//         {/* Text colour ─────────────────────────────────────────────────── */}
//         {/* onMouseDown saves selection BEFORE the input steals focus       */}
//         <div className="relative group">
//           <button
//             type="button"
//             title="Text Colour"
//             onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
//             onClick={() => textColorRef.current?.click()}
//             className="inline-flex flex-col items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors gap-0.5 pt-1"
//           >
//             <Baseline size={13} />
//             {/* Colour swatch under the icon — shows current picker value */}
//             <span
//               className="w-4 h-1.5 rounded-sm border border-gray-300"
//               style={{ background: textColorRef.current?.value ?? '#000000' }}
//             />
//           </button>
//           <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] bg-gray-800 text-white px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
//             Text colour
//           </span>
//         </div>

//         {/* Background / highlight colour ──────────────────────────────── */}
//         <div className="relative group">
//           <button
//             type="button"
//             title="Highlight Colour"
//             onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
//             onClick={() => bgColorRef.current?.click()}
//             className="inline-flex flex-col items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors gap-0.5 pt-1"
//           >
//             <Highlighter size={13} />
//             <span
//               className="w-4 h-1.5 rounded-sm border border-gray-300"
//               style={{ background: bgColorRef.current?.value ?? '#ffff00' }}
//             />
//           </button>
//           <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] bg-gray-800 text-white px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
//             Highlight
//           </span>
//         </div>
//       </div>

//       {/* ── Editor area ──────────────────────────────────────────────────── */}
//       <style>{`
//         .wysiwyg-editor { outline: none; }
//         .wysiwyg-editor:empty::before {
//           content: attr(data-placeholder);
//           color: #9ca3af;
//           pointer-events: none;
//         }

//         /* Real-time preview styles inside editor — match .lesson-body exactly */
//         .wysiwyg-editor p          { margin-bottom: 1.2em; line-height: 1.75; }
//         .wysiwyg-editor p:last-child { margin-bottom: 0; }
//         .wysiwyg-editor h1         { font-size: 1.7rem; font-weight: 700; color: #111827; margin: 1.6em 0 0.5em; }
//         .wysiwyg-editor h2         { font-size: 1.35rem; font-weight: 700; color: #1f2937; margin: 1.4em 0 0.5em; border-bottom: 2px solid #f3f4f6; padding-bottom: 0.3em; }
//         .wysiwyg-editor h3         { font-size: 1.1rem; font-weight: 700; color: #374151; margin: 1.2em 0 0.4em; }
//         .wysiwyg-editor h4         { font-size: 1rem; font-weight: 600; color: #374151; margin: 1em 0 0.3em; }
//         .wysiwyg-editor h1:first-child, .wysiwyg-editor h2:first-child, .wysiwyg-editor h3:first-child { margin-top: 0; }
//         .wysiwyg-editor ul         { list-style-type: disc; padding-left: 1.6em; margin-bottom: 1.2em; }
//         .wysiwyg-editor ol         { list-style-type: decimal; padding-left: 1.6em; margin-bottom: 1.2em; }
//         .wysiwyg-editor li         { margin-bottom: 0.4em; line-height: 1.7; }
//         .wysiwyg-editor blockquote { border-left: 4px solid #6366f1; background: #eef2ff; margin: 1.2em 0; padding: 0.8em 1.1em; border-radius: 0 8px 8px 0; color: #4338ca; }
//         .wysiwyg-editor pre        { background: #1e293b; color: #e2e8f0; font-family: ui-monospace, monospace; font-size: 0.875em; padding: 1em 1.2em; border-radius: 10px; overflow-x: auto; margin-bottom: 1.2em; white-space: pre-wrap; }
//         .wysiwyg-editor code       { background: #f3f4f6; color: #e11d48; font-family: ui-monospace, monospace; font-size: 0.875em; padding: 0.1em 0.4em; border-radius: 4px; }
//         .wysiwyg-editor pre code   { background: none; color: inherit; padding: 0; }
//         .wysiwyg-editor a          { color: #4f46e5; text-decoration: underline; }
//         .wysiwyg-editor hr         { border: none; border-top: 2px solid #f3f4f6; margin: 1.5em 0; }
//         .wysiwyg-editor strong, .wysiwyg-editor b { font-weight: 700; }
//         .wysiwyg-editor em, .wysiwyg-editor i { font-style: italic; }
//       `}</style>

//       <div
//         ref={editorRef}
//         contentEditable
//         suppressContentEditableWarning
//         data-placeholder={placeholder}
//         onInput={handleInput}
//         onKeyDown={handleKeyDown}
//         onKeyUp={updateActiveFormats}
//         onMouseUp={updateActiveFormats}
//         onSelect={updateActiveFormats}
//         className="wysiwyg-editor px-5 py-4 text-gray-800 text-[15px] leading-relaxed"
//         style={{ minHeight }}
//       />

//       {/* ── Footer: word count + hint ─────────────────────────────────── */}
//       <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
//         <span>
//           {value
//             ? `${value.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length} words`
//             : '0 words'}
//         </span>
//         <span>Tip: Select text then click a toolbar button to format it</span>
//       </div>
//     </div>
//   );
// }

// // ─── LessonEditor (main export) ───────────────────────────────────────────────

// export function LessonEditor({ lesson, onSave, onCancel }: LessonEditorProps) {
//   const [formData, setFormData] = useState({
//     title:          lesson.title,
//     description:    lesson.description    || '',
//     lesson_type:    lesson.lesson_type,
//     difficulty:     lesson.difficulty     || 'beginner',
//     video_url:      lesson.video_url      || '',
//     video_duration: lesson.video_duration || 0,
//     audio_url:      lesson.audio_url      || '',
//     document_url:   lesson.document_url   || '',
//     content_html:   lesson.content_html   || '',
//     is_published:   lesson.is_published,
//     is_preview:     lesson.is_preview,
//   });
//   const [loading, setLoading] = useState(false);

//   const set = (field: string, value: any) =>
//     setFormData(prev => ({ ...prev, [field]: value }));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.title.trim()) return;
//     setLoading(true);
//     try { await onSave(formData); } finally { setLoading(false); }
//   };

//   const currentType = lessonTypes.find(t => t.value === formData.lesson_type) ?? lessonTypes[0];
//   const showRichEditor = RICH_TEXT_TYPES.has(formData.lesson_type);

//   return (
//     <Card className="shadow-sm">
//       <CardHeader className="pb-4 border-b border-gray-100">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
//             {currentType.icon}
//           </div>
//           <div>
//             <CardTitle className="text-xl">Edit Lesson</CardTitle>
//             <CardDescription>Update lesson content and settings</CardDescription>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="pt-6">
//         <form onSubmit={handleSubmit} className="space-y-8">

//           {/* ── 1. Basic Information ──────────────────────────────────── */}
//           <section className="space-y-4">
//             <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
//               <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">1</span>
//               Basic Information
//             </h3>

//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Lesson Title <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 id="title"
//                 value={formData.title}
//                 onChange={(e) => set('title', e.target.value)}
//                 placeholder="e.g., Introduction to React Components"
//                 required
//                 className="text-base"
//               />
//             </div>

//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Short Description
//                 <span className="ml-2 text-xs text-gray-400 font-normal">Shown in curriculum sidebar</span>
//               </label>
//               <Textarea
//                 id="description"
//                 value={formData.description}
//                 onChange={(e) => set('description', e.target.value)}
//                 placeholder="Brief description of what students will learn in this lesson"
//                 rows={2}
//                 className="resize-none"
//               />
//             </div>
//           </section>

//           {/* ── 2. Lesson Type & Settings ─────────────────────────────── */}
//           <section className="space-y-4">
//             <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
//               <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">2</span>
//               Type & Settings
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="lesson_type" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Lesson Type
//                 </label>
//                 <select
//                   id="lesson_type"
//                   value={formData.lesson_type}
//                   onChange={(e) => set('lesson_type', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
//                 >
//                   {lessonTypes.map(type => (
//                     <option key={type.value} value={type.value}>
//                       {type.icon} {type.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Difficulty
//                 </label>
//                 <select
//                   id="difficulty"
//                   value={formData.difficulty}
//                   onChange={(e) => set('difficulty', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
//                 >
//                   {difficultyLevels.map(level => (
//                     <option key={level.value} value={level.value}>
//                       {level.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="flex items-center gap-6 pt-1">
//               <label className="flex items-center gap-2.5 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={formData.is_published}
//                   onChange={(e) => set('is_published', e.target.checked)}
//                   className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Published</span>
//               </label>

//               <label className="flex items-center gap-2.5 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={formData.is_preview}
//                   onChange={(e) => set('is_preview', e.target.checked)}
//                   className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Available as Free Preview</span>
//               </label>
//             </div>
//           </section>

//           {/* ── 3. Lesson Content ─────────────────────────────────────── */}
//           <section className="space-y-4">
//             <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
//               <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">3</span>
//               Lesson Content
//               <Badge className="ml-1 bg-indigo-50 text-indigo-700 border-0 text-xs font-medium">
//                 {currentType.icon} {currentType.label}
//               </Badge>
//             </h3>

//             {/* VIDEO ──────────────────────────────────────────────────── */}
//             {formData.lesson_type === 'video' && (
//               <div className="space-y-3">
//                 <label className="block text-sm font-medium text-gray-700">Video File / URL</label>
//                 <FileUpload
//                   value={formData.video_url}
//                   onChange={(url) => set('video_url', url)}
//                   onUploadComplete={(meta: any) => {
//                     if (meta?.duration) set('video_duration', Math.round(meta.duration));
//                   }}
//                   type="video"
//                   description="Upload a video file or paste a video URL"
//                 />
//                 {formData.video_duration > 0 && (
//                   <p className="text-sm text-gray-500">
//                     Duration: {Math.floor(formData.video_duration / 60)}m {formData.video_duration % 60}s
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* AUDIO ──────────────────────────────────────────────────── */}
//             {/* FileUpload only accepts "video"|"image"|"document" — no "audio" type.
//                 We use a URL input with live preview + document uploader as fallback. */}
//             {formData.lesson_type === 'audio' && (
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                     Audio URL
//                     <span className="ml-2 text-xs text-gray-400 font-normal">
//                       Paste a direct link to your MP3, WAV, or OGG file
//                     </span>
//                   </label>
//                   <Input
//                     value={formData.audio_url}
//                     onChange={(e) => set('audio_url', e.target.value)}
//                     placeholder="https://example.com/audio/lesson.mp3"
//                     type="url"
//                   />
//                   {formData.audio_url && (
//                     <div className="mt-3 p-3 bg-violet-50 border border-violet-100 rounded-xl">
//                       <p className="text-xs font-medium text-violet-700 mb-2">Preview</p>
//                       <audio controls className="w-full" src={formData.audio_url}>
//                         Your browser does not support the audio element.
//                       </audio>
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                     Or upload audio file
//                     <span className="ml-2 text-xs text-gray-400 font-normal">
//                       Upload and the URL will be filled in above automatically
//                     </span>
//                   </label>
//                   <FileUpload
//                     value={formData.document_url}
//                     onChange={(url) => { set('document_url', url); set('audio_url', url); }}
//                     type="document"
//                     description="Upload MP3, WAV, OGG — URL copies to audio field above"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* DOCUMENT ───────────────────────────────────────────────── */}
//             {formData.lesson_type === 'document' && (
//               <div className="space-y-3">
//                 <label className="block text-sm font-medium text-gray-700">Document File</label>
//                 <FileUpload
//                   value={formData.document_url}
//                   onChange={(url) => set('document_url', url)}
//                   type="document"
//                   description="Upload PDF, Word, PowerPoint, or other documents"
//                 />
//               </div>
//             )}

//             {/* QUIZ notice ─────────────────────────────────────────────── */}
//             {formData.lesson_type === 'quiz' && (
//               <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
//                 <span className="text-2xl flex-shrink-0">❓</span>
//                 <div>
//                   <p className="font-semibold text-yellow-900 text-sm">Quiz Builder</p>
//                   <p className="text-yellow-800 text-sm mt-0.5">
//                     Quizzes are built in the Quiz section of the dashboard. Use the description above to
//                     briefly explain what this quiz covers.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* RICH TEXT EDITOR — text, discussion, assignment, interactive, live_session, code */}
//             {showRichEditor && (
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Lesson Body
//                     <span className="ml-2 text-xs text-gray-400 font-normal">
//                       Formatted content students will read
//                     </span>
//                   </label>
//                 </div>

//                 <RichTextEditor
//                   value={formData.content_html}
//                   onChange={(html) => set('content_html', html)}
//                   placeholder={
//                     formData.lesson_type === 'assignment'
//                       ? 'Describe the assignment instructions, requirements, and submission guidelines…'
//                       : formData.lesson_type === 'discussion'
//                       ? 'Write the discussion prompt and any background context…'
//                       : formData.lesson_type === 'code'
//                       ? 'Explain the coding exercise, requirements, and expected output…'
//                       : formData.lesson_type === 'live_session'
//                       ? 'Describe what will be covered in this live session, prerequisites, and agenda…'
//                       : 'Write your lesson content here. Use headings, bullet points, and bold text to structure it clearly…'
//                   }
//                 />

//                 <p className="text-xs text-gray-400 pt-1">
//                   What you write here is exactly what students see — all formatting is preserved.
//                 </p>
//               </div>
//             )}

//             {/* VIDEO with optional notes ───────────────────────────────── */}
//             {formData.lesson_type === 'video' && (
//               <div className="space-y-2 pt-2 border-t border-gray-100">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Lesson Notes
//                   <span className="ml-2 text-xs text-gray-400 font-normal">Optional — supplementary text shown below the video</span>
//                 </label>
//                 <RichTextEditor
//                   value={formData.content_html}
//                   onChange={(html) => set('content_html', html)}
//                   placeholder="Add notes, summaries, or additional context for this video lesson…"
//                   minHeight={200}
//                 />
//               </div>
//             )}
//           </section>

//           {/* ── Actions ───────────────────────────────────────────────── */}
//           <div className="flex gap-3 pt-2 border-t border-gray-100">
//             <Button
//               type="submit"
//               disabled={loading || !formData.title.trim()}
//               className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
//             >
//               {loading ? (
//                 <span className="flex items-center gap-2">
//                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   Saving…
//                 </span>
//               ) : 'Save Lesson'}
//             </Button>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onCancel}
//               disabled={loading}
//               className="px-6"
//             >
//               Cancel
//             </Button>
//           </div>

//         </form>
//       </CardContent>
//     </Card>
//   );
// }


































'use client';
// /components/curriculum/lesson-editor.tsx
//
// Rich text editor for lesson content_html.
// Uses a dependency-free contenteditable WYSIWYG that saves clean HTML
// directly into the content_html field — no TipTap/Quill install needed.
// Works with the existing updateLessonAction / PUT /api/lessons/[id] flow.

import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/courses/file-upload';
import { Lesson } from '@/lib/db/queries/curriculum';
import {
  Bold, Italic, Underline, Strikethrough, Code, Link, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3,
  Quote, Minus, Undo, Redo, Type, RotateCcw, Highlighter, Baseline,
  Superscript, Subscript, Indent, Outdent, Table, Image as ImageIcon,
  ChevronDown
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LessonEditorProps {
  lesson: Lesson;
  onSave: (updates: any) => void;
  onCancel: () => void;
}

// ─── Lesson type / difficulty metadata ───────────────────────────────────────

const lessonTypes = [
  { value: 'video',        label: 'Video',         icon: '🎥' },
  { value: 'text',         label: 'Text',          icon: '📝' },
  { value: 'document',     label: 'Document',      icon: '📄' },
  { value: 'quiz',         label: 'Quiz',          icon: '❓' },
  { value: 'assignment',   label: 'Assignment',    icon: '📋' },
  { value: 'live_session', label: 'Live Session',  icon: '🔴' },
  { value: 'audio',        label: 'Audio',         icon: '🎧' },
  { value: 'interactive',  label: 'Interactive',   icon: '⚡' },
  { value: 'code',         label: 'Code',          icon: '💻' },
  { value: 'discussion',   label: 'Discussion',    icon: '💬' },
];

const difficultyLevels = [
  { value: 'beginner',     label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced',     label: 'Advanced' },
];

// Lesson types that get the rich text body editor
const RICH_TEXT_TYPES = new Set([
  'text', 'discussion', 'assignment', 'interactive', 'live_session', 'code',
]);

// ─── RichTextEditor ───────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing your lesson content here…',
  minHeight = 320,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const isInitialised = useRef(false);

  // Set initial HTML once only
  useEffect(() => {
    if (editorRef.current && !isInitialised.current) {
      editorRef.current.innerHTML = value || '';
      isInitialised.current = true;
    }
  }, []);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    try {
      if (document.queryCommandState('bold'))          formats.add('bold');
      if (document.queryCommandState('italic'))        formats.add('italic');
      if (document.queryCommandState('underline'))     formats.add('underline');
      if (document.queryCommandState('strikeThrough')) formats.add('strikethrough');
    } catch {}
    setActiveFormats(formats);
  }, []);

  const exec = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    updateActiveFormats();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange, updateActiveFormats]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      updateActiveFormats();
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange, updateActiveFormats]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Tab → insert 4 spaces (prevents focus loss)
    if (e.key === 'Tab') {
      e.preventDefault();
      exec('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
    // Ctrl/Cmd shortcuts
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') { e.preventDefault(); exec('bold'); }
      if (e.key === 'i') { e.preventDefault(); exec('italic'); }
      if (e.key === 'u') { e.preventDefault(); exec('underline'); }
      if (e.key === 'z') { e.preventDefault(); exec(e.shiftKey ? 'redo' : 'undo'); }
    }
  }, [exec]);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:', 'https://');
    if (url) exec('createLink', url);
  }, [exec]);

  const insertHR = useCallback(() => exec('insertHTML', '<hr/>'), [exec]);

  const clearFormatting = useCallback(() => {
    exec('removeFormat');
    exec('formatBlock', 'p');
  }, [exec]);

  // ── Font family & size ────────────────────────────────────────────────────
  const [fontFamily, setFontFamily] = useState('');
  const [fontSize,   setFontSize]   = useState('');

  const FONT_FAMILIES = [
    { label: 'Default',      value: '' },
    { label: 'Inter / Sans', value: 'Inter, ui-sans-serif, system-ui, sans-serif' },
    { label: 'Georgia / Serif', value: 'Georgia, "Times New Roman", serif' },
    { label: 'Mono / Code',  value: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
    { label: 'Arial',        value: 'Arial, Helvetica, sans-serif' },
    { label: 'Verdana',      value: 'Verdana, Geneva, sans-serif' },
    { label: 'Trebuchet',    value: '"Trebuchet MS", Helvetica, sans-serif' },
    { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
    { label: 'Courier New',  value: '"Courier New", Courier, monospace' },
  ];

  const FONT_SIZES = [
    { label: 'Tiny',    value: '1' },   // execCommand fontSize uses 1-7
    { label: 'Small',   value: '2' },
    { label: 'Normal',  value: '3' },
    { label: 'Medium',  value: '4' },
    { label: 'Large',   value: '5' },
    { label: 'X-Large', value: '6' },
    { label: 'Display', value: '7' },
  ];

  const applyFontFamily = useCallback((family: string) => {
    editorRef.current?.focus();
    if (family) {
      document.execCommand('styleWithCSS', false, 'true');
      document.execCommand('fontName', false, family);
      document.execCommand('styleWithCSS', false, 'false');
    }
    setFontFamily(family);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const applyFontSize = useCallback((size: string) => {
    editorRef.current?.focus();
    if (size) document.execCommand('fontSize', false, size);
    setFontSize(size);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  // ── Extra actions ──────────────────────────────────────────────────────────
  const insertTable = useCallback(() => {
    const html = `
      <table style="width:100%;border-collapse:collapse;margin:1em 0;">
        <thead>
          <tr>
            <th style="border:1px solid #e5e7eb;padding:8px 12px;background:#f9fafb;text-align:left;font-weight:600;">Header 1</th>
            <th style="border:1px solid #e5e7eb;padding:8px 12px;background:#f9fafb;text-align:left;font-weight:600;">Header 2</th>
            <th style="border:1px solid #e5e7eb;padding:8px 12px;background:#f9fafb;text-align:left;font-weight:600;">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border:1px solid #e5e7eb;padding:8px 12px;">Cell 1</td>
            <td style="border:1px solid #e5e7eb;padding:8px 12px;">Cell 2</td>
            <td style="border:1px solid #e5e7eb;padding:8px 12px;">Cell 3</td>
          </tr>
          <tr>
            <td style="border:1px solid #e5e7eb;padding:8px 12px;">Cell 4</td>
            <td style="border:1px solid #e5e7eb;padding:8px 12px;">Cell 5</td>
            <td style="border:1px solid #e5e7eb;padding:8px 12px;">Cell 6</td>
          </tr>
        </tbody>
      </table><p></p>`;
    exec('insertHTML', html);
  }, [exec]);

  const insertImageByUrl = useCallback(() => {
    const url = prompt('Paste image URL:', 'https://');
    if (url && url !== 'https://') {
      const altText = prompt('Alt text (description):', '') || '';
      exec('insertHTML',
        `<img src="${url}" alt="${altText}" style="max-width:100%;height:auto;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.08);margin:1em auto;display:block;" />`
      );
    }
  }, [exec]);

  // ── Color pickers ──────────────────────────────────────────────────────────
  // We must save/restore the selection because opening a native <input type=color>
  // causes the contenteditable to lose focus and drop the selection.
  const savedRangeRef = useRef<Range | null>(null);
  const textColorRef  = useRef<HTMLInputElement>(null);
  const bgColorRef    = useRef<HTMLInputElement>(null);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  }, []);

  const applyTextColor = useCallback((color: string) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand('foreColor', false, color);
    document.execCommand('styleWithCSS', false, 'false');
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [restoreSelection, onChange]);

  const applyBgColor = useCallback((color: string) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand('hiliteColor', false, color);
    document.execCommand('styleWithCSS', false, 'false');
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [restoreSelection, onChange]);

  // ── Toolbar button helper ──────────────────────────────────────────────────
  const ToolbarBtn = ({
    onClick, title, active = false, children,
  }: {
    onClick: () => void; title: string; active?: boolean; children: React.ReactNode;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`
        inline-flex items-center justify-center w-8 h-8 rounded-md text-sm transition-colors
        ${active
          ? 'bg-indigo-100 text-indigo-700 font-bold'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
      `}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-gray-200 mx-0.5" />;

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition-all">

      {/* Hidden native color inputs — triggered by toolbar buttons */}
      <input
        ref={textColorRef}
        type="color"
        className="sr-only"
        defaultValue="#000000"
        onChange={(e) => applyTextColor(e.target.value)}
      />
      <input
        ref={bgColorRef}
        type="color"
        className="sr-only"
        defaultValue="#ffff00"
        onChange={(e) => applyBgColor(e.target.value)}
      />

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-100">

        {/* Font Family dropdown ──────────────────────────────────────────── */}
        <div className="relative">
          <select
            value={fontFamily}
            onMouseDown={(e) => { e.stopPropagation(); }}
            onChange={(e) => { e.preventDefault(); applyFontFamily(e.target.value); }}
            title="Font Family"
            className="h-8 pl-2 pr-6 text-xs border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer appearance-none max-w-[110px]"
            style={{ fontFamily: fontFamily || 'inherit' }}
          >
            {FONT_FAMILIES.map(f => (
              <option key={f.value} value={f.value} style={{ fontFamily: f.value || 'inherit' }}>
                {f.label}
              </option>
            ))}
          </select>
          <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Font Size dropdown ─────────────────────────────────────────────── */}
        <div className="relative ml-1">
          <select
            value={fontSize}
            onMouseDown={(e) => { e.stopPropagation(); }}
            onChange={(e) => { e.preventDefault(); applyFontSize(e.target.value); }}
            title="Font Size"
            className="h-8 pl-2 pr-6 text-xs border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer appearance-none w-[80px]"
          >
            <option value="">Size</option>
            {FONT_SIZES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <Divider />

        {/* Undo / Redo */}
        <ToolbarBtn onClick={() => exec('undo')} title="Undo (Ctrl+Z)">
          <Undo size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('redo')} title="Redo (Ctrl+Shift+Z)">
          <Redo size={14} />
        </ToolbarBtn>

        <Divider />

        {/* Block type */}
        <ToolbarBtn onClick={() => exec('formatBlock', 'p')} title="Paragraph">
          <Type size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('formatBlock', 'h1')} title="Heading 1">
          <Heading1 size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('formatBlock', 'h2')} title="Heading 2">
          <Heading2 size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('formatBlock', 'h3')} title="Heading 3">
          <Heading3 size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('formatBlock', 'pre')} title="Code Block">
          <Code size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('formatBlock', 'blockquote')} title="Blockquote">
          <Quote size={14} />
        </ToolbarBtn>

        <Divider />

        {/* Inline formatting */}
        <ToolbarBtn
          onClick={() => exec('bold')}
          title="Bold (Ctrl+B)"
          active={activeFormats.has('bold')}
        >
          <Bold size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => exec('italic')}
          title="Italic (Ctrl+I)"
          active={activeFormats.has('italic')}
        >
          <Italic size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => exec('underline')}
          title="Underline (Ctrl+U)"
          active={activeFormats.has('underline')}
        >
          <Underline size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => exec('strikeThrough')}
          title="Strikethrough"
          active={activeFormats.has('strikethrough')}
        >
          <Strikethrough size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('superscript')} title="Superscript">
          <Superscript size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('subscript')} title="Subscript">
          <Subscript size={14} />
        </ToolbarBtn>

        <Divider />

        {/* Lists */}
        <ToolbarBtn onClick={() => exec('insertUnorderedList')} title="Bullet List">
          <List size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('insertOrderedList')} title="Numbered List">
          <ListOrdered size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('indent')} title="Indent">
          <Indent size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('outdent')} title="Outdent">
          <Outdent size={14} />
        </ToolbarBtn>

        <Divider />

        {/* Alignment */}
        <ToolbarBtn onClick={() => exec('justifyLeft')} title="Align Left">
          <AlignLeft size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('justifyCenter')} title="Align Centre">
          <AlignCenter size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('justifyRight')} title="Align Right">
          <AlignRight size={14} />
        </ToolbarBtn>

        <Divider />

        {/* Misc */}
        <ToolbarBtn onClick={insertLink} title="Insert Link">
          <Link size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={insertTable} title="Insert Table">
          <Table size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={insertImageByUrl} title="Insert Image by URL">
          <ImageIcon size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={insertHR} title="Insert Horizontal Rule">
          <Minus size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={clearFormatting} title="Clear Formatting">
          <RotateCcw size={14} />
        </ToolbarBtn>

        <Divider />

        {/* Text colour ─────────────────────────────────────────────────── */}
        {/* onMouseDown saves selection BEFORE the input steals focus       */}
        <div className="relative group">
          <button
            type="button"
            title="Text Colour"
            onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
            onClick={() => textColorRef.current?.click()}
            className="inline-flex flex-col items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors gap-0.5 pt-1"
          >
            <Baseline size={13} />
            {/* Colour swatch under the icon — shows current picker value */}
            <span
              className="w-4 h-1.5 rounded-sm border border-gray-300"
              style={{ background: textColorRef.current?.value ?? '#000000' }}
            />
          </button>
          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] bg-gray-800 text-white px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
            Text colour
          </span>
        </div>

        {/* Background / highlight colour ──────────────────────────────── */}
        <div className="relative group">
          <button
            type="button"
            title="Highlight Colour"
            onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
            onClick={() => bgColorRef.current?.click()}
            className="inline-flex flex-col items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors gap-0.5 pt-1"
          >
            <Highlighter size={13} />
            <span
              className="w-4 h-1.5 rounded-sm border border-gray-300"
              style={{ background: bgColorRef.current?.value ?? '#ffff00' }}
            />
          </button>
          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] bg-gray-800 text-white px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
            Highlight
          </span>
        </div>
      </div>

      {/* ── Editor area ──────────────────────────────────────────────────── */}
      <style>{`
        .wysiwyg-editor { outline: none; }
        .wysiwyg-editor:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }

        /* Real-time preview styles inside editor — match .lesson-body exactly */
        .wysiwyg-editor p          { margin-bottom: 1.2em; line-height: 1.75; }
        .wysiwyg-editor p:last-child { margin-bottom: 0; }
        .wysiwyg-editor h1         { font-size: 1.7rem; font-weight: 700; color: #111827; margin: 1.6em 0 0.5em; }
        .wysiwyg-editor h2         { font-size: 1.35rem; font-weight: 700; color: #1f2937; margin: 1.4em 0 0.5em; border-bottom: 2px solid #f3f4f6; padding-bottom: 0.3em; }
        .wysiwyg-editor h3         { font-size: 1.1rem; font-weight: 700; color: #374151; margin: 1.2em 0 0.4em; }
        .wysiwyg-editor h4         { font-size: 1rem; font-weight: 600; color: #374151; margin: 1em 0 0.3em; }
        .wysiwyg-editor h1:first-child, .wysiwyg-editor h2:first-child, .wysiwyg-editor h3:first-child { margin-top: 0; }
        .wysiwyg-editor ul         { list-style-type: disc; padding-left: 1.6em; margin-bottom: 1.2em; }
        .wysiwyg-editor ol         { list-style-type: decimal; padding-left: 1.6em; margin-bottom: 1.2em; }
        .wysiwyg-editor li         { margin-bottom: 0.4em; line-height: 1.7; }
        .wysiwyg-editor blockquote { border-left: 4px solid #6366f1; background: #eef2ff; margin: 1.2em 0; padding: 0.8em 1.1em; border-radius: 0 8px 8px 0; color: #4338ca; }
        .wysiwyg-editor pre        { background: #1e293b; color: #e2e8f0; font-family: ui-monospace, monospace; font-size: 0.875em; padding: 1em 1.2em; border-radius: 10px; overflow-x: auto; margin-bottom: 1.2em; white-space: pre-wrap; }
        .wysiwyg-editor code       { background: #f3f4f6; color: #e11d48; font-family: ui-monospace, monospace; font-size: 0.875em; padding: 0.1em 0.4em; border-radius: 4px; }
        .wysiwyg-editor pre code   { background: none; color: inherit; padding: 0; }
        .wysiwyg-editor a          { color: #4f46e5; text-decoration: underline; }
        .wysiwyg-editor hr         { border: none; border-top: 2px solid #f3f4f6; margin: 1.5em 0; }
        .wysiwyg-editor strong, .wysiwyg-editor b { font-weight: 700; }
        .wysiwyg-editor em, .wysiwyg-editor i { font-style: italic; }
      `}</style>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        onSelect={updateActiveFormats}
        className="wysiwyg-editor px-5 py-4 text-gray-800 text-[15px] leading-relaxed"
        style={{ minHeight }}
      />

      {/* ── Footer: word count + hint ─────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
        <span>
          {value
            ? `${value.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length} words`
            : '0 words'}
        </span>
        <span>Tip: Select text then click a toolbar button to format it</span>
      </div>
    </div>
  );
}

// ─── LessonEditor (main export) ───────────────────────────────────────────────

export function LessonEditor({ lesson, onSave, onCancel }: LessonEditorProps) {
  const [formData, setFormData] = useState({
    title:          lesson.title,
    description:    lesson.description    || '',
    lesson_type:    lesson.lesson_type,
    difficulty:     lesson.difficulty     || 'beginner',
    video_url:      lesson.video_url      || '',
    video_duration: lesson.video_duration || 0,
    audio_url:      lesson.audio_url      || '',
    document_url:   lesson.document_url   || '',
    content_html:   lesson.content_html   || '',
    is_published:   lesson.is_published,
    is_preview:     lesson.is_preview,
  });
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: any) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setLoading(true);
    try { await onSave(formData); } finally { setLoading(false); }
  };

  const currentType = lessonTypes.find(t => t.value === formData.lesson_type) ?? lessonTypes[0];
  const showRichEditor = RICH_TEXT_TYPES.has(formData.lesson_type);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
            {currentType.icon}
          </div>
          <div>
            <CardTitle className="text-xl">Edit Lesson</CardTitle>
            <CardDescription>Update lesson content and settings</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── 1. Basic Information ──────────────────────────────────── */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">1</span>
              Basic Information
            </h3>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
                Lesson Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g., Introduction to React Components"
                required
                className="text-base"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                Short Description
                <span className="ml-2 text-xs text-gray-400 font-normal">Shown in curriculum sidebar</span>
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Brief description of what students will learn in this lesson"
                rows={2}
                className="resize-none"
              />
            </div>
          </section>

          {/* ── 2. Lesson Type & Settings ─────────────────────────────── */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">2</span>
              Type & Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lesson_type" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Lesson Type
                </label>
                <select
                  id="lesson_type"
                  value={formData.lesson_type}
                  onChange={(e) => set('lesson_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  {lessonTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => set('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  {difficultyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => set('is_published', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Published</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_preview}
                  onChange={(e) => set('is_preview', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Available as Free Preview</span>
              </label>
            </div>
          </section>

          {/* ── 3. Lesson Content ─────────────────────────────────────── */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">3</span>
              Lesson Content
              <Badge className="ml-1 bg-indigo-50 text-indigo-700 border-0 text-xs font-medium">
                {currentType.icon} {currentType.label}
              </Badge>
            </h3>

            {/* VIDEO ──────────────────────────────────────────────────── */}
            {formData.lesson_type === 'video' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Video File / URL</label>
                <FileUpload
                  value={formData.video_url}
                  onChange={(url) => set('video_url', url)}
                  onUploadComplete={(meta: any) => {
                    if (meta?.duration) set('video_duration', Math.round(meta.duration));
                  }}
                  type="video"
                  description="Upload a video file or paste a video URL"
                />
                {formData.video_duration > 0 && (
                  <p className="text-sm text-gray-500">
                    Duration: {Math.floor(formData.video_duration / 60)}m {formData.video_duration % 60}s
                  </p>
                )}
              </div>
            )}

            {/* AUDIO ──────────────────────────────────────────────────── */}
            {/* FileUpload only accepts "video"|"image"|"document" — no "audio" type.
                We use a URL input with live preview + document uploader as fallback. */}
            {formData.lesson_type === 'audio' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Audio URL
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      Paste a direct link to your MP3, WAV, or OGG file
                    </span>
                  </label>
                  <Input
                    value={formData.audio_url}
                    onChange={(e) => set('audio_url', e.target.value)}
                    placeholder="https://example.com/audio/lesson.mp3"
                    type="url"
                  />
                  {formData.audio_url && (
                    <div className="mt-3 p-3 bg-violet-50 border border-violet-100 rounded-xl">
                      <p className="text-xs font-medium text-violet-700 mb-2">Preview</p>
                      <audio controls className="w-full" src={formData.audio_url}>
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Or upload audio file
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      Upload and the URL will be filled in above automatically
                    </span>
                  </label>
                  <FileUpload
                    value={formData.document_url}
                    onChange={(url) => { set('document_url', url); set('audio_url', url); }}
                    type="document"
                    description="Upload MP3, WAV, OGG — URL copies to audio field above"
                  />
                </div>
              </div>
            )}

            {/* DOCUMENT ───────────────────────────────────────────────── */}
            {formData.lesson_type === 'document' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Document File</label>
                <FileUpload
                  value={formData.document_url}
                  onChange={(url) => set('document_url', url)}
                  type="document"
                  description="Upload PDF, Word, PowerPoint, or other documents"
                />
              </div>
            )}

            {/* QUIZ notice ─────────────────────────────────────────────── */}
            {formData.lesson_type === 'quiz' && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <span className="text-2xl flex-shrink-0">❓</span>
                <div>
                  <p className="font-semibold text-yellow-900 text-sm">Quiz Builder</p>
                  <p className="text-yellow-800 text-sm mt-0.5">
                    Quizzes are built in the Quiz section of the dashboard. Use the description above to
                    briefly explain what this quiz covers.
                  </p>
                </div>
              </div>
            )}

            {/* RICH TEXT EDITOR — text, discussion, assignment, interactive, live_session, code */}
            {showRichEditor && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Lesson Body
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      Formatted content students will read
                    </span>
                  </label>
                </div>

                <RichTextEditor
                  value={formData.content_html}
                  onChange={(html) => set('content_html', html)}
                  placeholder={
                    formData.lesson_type === 'assignment'
                      ? 'Describe the assignment instructions, requirements, and submission guidelines…'
                      : formData.lesson_type === 'discussion'
                      ? 'Write the discussion prompt and any background context…'
                      : formData.lesson_type === 'code'
                      ? 'Explain the coding exercise, requirements, and expected output…'
                      : formData.lesson_type === 'live_session'
                      ? 'Describe what will be covered in this live session, prerequisites, and agenda…'
                      : 'Write your lesson content here. Use headings, bullet points, and bold text to structure it clearly…'
                  }
                />

                <p className="text-xs text-gray-400 pt-1">
                  What you write here is exactly what students see — all formatting is preserved.
                </p>
              </div>
            )}

            {/* VIDEO with optional notes ───────────────────────────────── */}
            {formData.lesson_type === 'video' && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700">
                  Lesson Notes
                  <span className="ml-2 text-xs text-gray-400 font-normal">Optional — supplementary text shown below the video</span>
                </label>
                <RichTextEditor
                  value={formData.content_html}
                  onChange={(html) => set('content_html', html)}
                  placeholder="Add notes, summaries, or additional context for this video lesson…"
                  minHeight={200}
                />
              </div>
            )}
          </section>

          {/* ── Actions ───────────────────────────────────────────────── */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <Button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </span>
              ) : 'Save Lesson'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="px-6"
            >
              Cancel
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
