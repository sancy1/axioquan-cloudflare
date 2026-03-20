

// /lib/courses/resources-actions.ts
'use server';

import { sql } from '@/lib/db';

export async function getCourseResources(courseId: string) {
  try {
    console.log('📁 Fetching resources for course:', courseId);
    
    const allResources: Array<{
      id: string;
      name: string;
      url: string;
      type: string;
      size: number | null;
      lessonTitle: string;
      moduleTitle: string;
      isPdf: boolean;
      lessonType: string; // Added from lesson_type
      contentType: string; // Added from content_type
    }> = [];

    // ==================== FETCH LESSONS WITH RESOURCES ====================
    console.log('🔍 Fetching resources from lessons...');
    
    const lessons = await sql`
      SELECT 
        l.id,
        l.title as lesson_title,
        l.lesson_type,
        l.content_type,
        l.document_url,
        l.document_type,
        l.document_size,
        l.downloadable_resources,
        l.attached_files,
        l.external_links,
        m.title as module_title,
        m.order_index as module_order,
        l.order_index as lesson_order
      FROM lessons l
      JOIN modules m ON l.module_id = m.id
      WHERE l.course_id = ${courseId}
        AND l.is_published = true
        AND (
          l.document_url IS NOT NULL 
          OR l.downloadable_resources IS NOT NULL 
          OR l.attached_files IS NOT NULL
        )
      ORDER BY m.order_index, l.order_index
    `;
    
    // Process each lesson's resources
    lessons.forEach((lesson: any) => {
      // ========== 1. MAIN LESSON DOCUMENT ==========
      if (lesson.document_url) {
        const fileName = extractFileName(lesson.document_url, `lesson_${lesson.id}_document`);
        const fileType = lesson.document_type || detectFileType(fileName, lesson.document_url);
        const isPdf = isPdfFile(fileType, fileName, lesson.document_url);
        
        allResources.push({
          id: `lesson_${lesson.id}_document`,
          name: fileName || lesson.lesson_title || 'Lesson Document',
          url: lesson.document_url,
          type: fileType,
          size: lesson.document_size || null,
          lessonTitle: lesson.lesson_title,
          moduleTitle: lesson.module_title,
          isPdf: isPdf,
          lessonType: lesson.lesson_type || 'document',
          contentType: lesson.content_type || 'premium'
        });
      }
      
      // ========== 2. DOWNLOADABLE RESOURCES ==========
      if (lesson.downloadable_resources && Array.isArray(lesson.downloadable_resources)) {
        lesson.downloadable_resources.forEach((url: string, index: number) => {
          if (url && typeof url === 'string' && url.trim() !== '') {
            const fileName = extractFileName(url, `lesson_${lesson.id}_resource_${index}`);
            const fileType = detectFileType(fileName, url);
            const isPdf = isPdfFile(fileType, fileName, url);
            
            allResources.push({
              id: `lesson_${lesson.id}_downloadable_${index}`,
              name: fileName,
              url: url.trim(),
              type: fileType,
              size: null,
              lessonTitle: lesson.lesson_title,
              moduleTitle: lesson.module_title,
              isPdf: isPdf,
              lessonType: lesson.lesson_type || 'document',
              contentType: lesson.content_type || 'premium'
            });
          }
        });
      }
      
      // ========== 3. ATTACHED FILES ==========
      if (lesson.attached_files && Array.isArray(lesson.attached_files)) {
        lesson.attached_files.forEach((url: string, index: number) => {
          if (url && typeof url === 'string' && url.trim() !== '') {
            const fileName = extractFileName(url, `lesson_${lesson.id}_attachment_${index}`);
            const fileType = detectFileType(fileName, url);
            const isPdf = isPdfFile(fileType, fileName, url);
            
            allResources.push({
              id: `lesson_${lesson.id}_attached_${index}`,
              name: fileName,
              url: url.trim(),
              type: fileType,
              size: null,
              lessonTitle: lesson.lesson_title,
              moduleTitle: lesson.module_title,
              isPdf: isPdf,
              lessonType: lesson.lesson_type || 'document',
              contentType: lesson.content_type || 'premium'
            });
          }
        });
      }
      
      // ========== 4. EXTERNAL LINKS (as references) ==========
      if (lesson.external_links && typeof lesson.external_links === 'object') {
        try {
          // Handle JSONB external_links
          const externalLinks = lesson.external_links;
          if (Array.isArray(externalLinks)) {
            externalLinks.forEach((link: any, index: number) => {
              if (link && link.url && typeof link.url === 'string') {
                const fileName = link.name || extractFileName(link.url, `lesson_${lesson.id}_link_${index}`);
                const fileType = 'External Link';
                const isPdf = false; // External links are not downloadable files
                
                allResources.push({
                  id: `lesson_${lesson.id}_external_${index}`,
                  name: fileName,
                  url: link.url.trim(),
                  type: fileType,
                  size: null,
                  lessonTitle: lesson.lesson_title,
                  moduleTitle: lesson.module_title,
                  isPdf: isPdf,
                  lessonType: lesson.lesson_type || 'document',
                  contentType: lesson.content_type || 'premium'
                });
              }
            });
          }
        } catch (e) {
          console.log('Could not parse external_links for lesson', lesson.id);
        }
      }
    });
    
    // ==================== REMOVE DUPLICATES ====================
    const uniqueResources = allResources.filter((resource, index, self) => 
      index === self.findIndex((r) => r.url === resource.url)
    );
    
    // ==================== SORT RESOURCES ====================
    const sortedResources = uniqueResources.sort((a, b) => {
      // Sort by module order (from query), then by lesson order
      // Since we don't have the order in the resource object,
      // we rely on the original lesson order from the query
      return 0; // Already sorted by SQL query
    });
    
    console.log(`✅ Found ${sortedResources.length} resources for course ${courseId}`);
    console.log(`📄 PDFs: ${sortedResources.filter(r => r.isPdf).length}`);
    console.log(`📊 By type: ${JSON.stringify(countByType(sortedResources))}`);
    
    return sortedResources;
    
  } catch (error) {
    console.error('❌ Error in getCourseResources:', error);
    return [];
  }
}

// ==================== HELPER FUNCTIONS ====================

function extractFileName(url: string, defaultName: string): string {
  if (!url) return defaultName;
  
  // Special handling for Cloudinary
  if (url.includes('cloudinary')) {
    console.log('🔧 Processing Cloudinary URL for filename extraction:', url);
    
    // Try to extract using regex for Cloudinary patterns
    const cloudinaryPatterns = [
      // Pattern: /upload/version/folder/filename.ext
      /\/upload\/[^\/]+\/[^\/]+\/([^\/?]+)(?:\?|$)/,
      // Pattern: /upload/version/filename.ext
      /\/upload\/[^\/]+\/([^\/?]+)(?:\?|$)/,
      // Pattern: /upload/folder/filename.ext
      /\/upload\/[^\/]+\/([^\/?]+)(?:\?|$)/,
      // Pattern: /upload/filename.ext
      /\/upload\/([^\/?]+)(?:\?|$)/,
      // Pattern: /video/upload/version/folder/filename.ext
      /\/video\/upload\/[^\/]+\/[^\/]+\/([^\/?]+)(?:\?|$)/,
      // Pattern: /raw/upload/version/folder/filename.ext
      /\/raw\/upload\/[^\/]+\/[^\/]+\/([^\/?]+)(?:\?|$)/,
    ];
    
    for (const pattern of cloudinaryPatterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        let filename = decodeURIComponent(match[1]);
        
        // Remove Cloudinary transformation parameters
        // These are usually at the end before query params
        const cleanFilename = filename
          .replace(/\.(jpg|jpeg|png|gif|pdf|docx?|xlsx?|pptx?|mp4|mov|avi|mp3|wav|zip|rar|txt)$/i, (match, ext) => {
            // Remove transformation suffixes before extension
            const baseName = match.slice(0, -(ext.length + 1));
            const cleanBase = baseName
              .replace(/_[a-zA-Z0-9]{6,}$/, '')
              .replace(/_[0-9]{6,}$/, '')
              .replace(/_q_[a-z]+$/, '')
              .replace(/_f_[a-z]+$/, '');
            return `${cleanBase}.${ext}`;
          });
        
        console.log('🔧 Extracted from Cloudinary:', filename, '→ Cleaned:', cleanFilename);
        return cleanFilename || filename || defaultName;
      }
    }
  }
  
  // Fallback to generic URL parsing
  try {
    const urlObj = new URL(url, 'http://dummy.com');
    const pathname = urlObj.pathname;
    const lastSegment = pathname.split('/').pop() || defaultName;
    
    const decodedName = decodeURIComponent(lastSegment)
      .split('?')[0]
      .split('#')[0]
      .trim();
    
    return decodedName;
  } catch (e) {
    const simpleName = url.split('/').pop() || defaultName;
    return simpleName.split('?')[0].split('#')[0].trim();
  }
}



function detectFileType(fileName: string, url: string): string {
  if (!fileName) return 'File';
  
  const lowerFileName = fileName.toLowerCase();
  const lowerUrl = (url || '').toLowerCase();
  
  // Enhanced PDF detection
  if (lowerFileName.endsWith('.pdf') || lowerUrl.includes('.pdf')) {
    return 'PDF Document';
  }
  
  // Check by file extension
  const extension = lowerFileName.split('.').pop() || '';
  
  const fileTypeMap: Record<string, string> = {
    // PDF (already handled above but for completeness)
    'pdf': 'PDF Document',
    
    // Microsoft Office
    'doc': 'Word Document',
    'docx': 'Word Document',
    'xls': 'Excel Spreadsheet',
    'xlsx': 'Excel Spreadsheet',
    'ppt': 'PowerPoint',
    'pptx': 'PowerPoint',
    
    // OpenDocument
    'odt': 'OpenDocument Text',
    'ods': 'OpenDocument Spreadsheet',
    'odp': 'OpenDocument Presentation',
    
    // Text & Data
    'txt': 'Text File',
    'rtf': 'Rich Text File',
    'csv': 'CSV File',
    'tsv': 'TSV File',
    'json': 'JSON File',
    'xml': 'XML File',
    'yaml': 'YAML File',
    'yml': 'YAML File',
    'toml': 'TOML File',
    'md': 'Markdown File',
    
    // Images
    'jpg': 'Image',
    'jpeg': 'Image',
    'png': 'Image',
    'gif': 'Image',
    'bmp': 'Image',
    'svg': 'SVG Image',
    'webp': 'Image',
    'ico': 'Icon',
    'tiff': 'Image',
    'tif': 'Image',
    
    // Audio
    'mp3': 'Audio',
    'wav': 'Audio',
    'ogg': 'Audio',
    'm4a': 'Audio',
    'flac': 'Audio',
    'aac': 'Audio',
    'wma': 'Audio',
    
    // Video
    'mp4': 'Video',
    'mov': 'Video',
    'avi': 'Video',
    'mkv': 'Video',
    'webm': 'Video',
    'flv': 'Video',
    'wmv': 'Video',
    'm4v': 'Video',
    'mpg': 'Video',
    'mpeg': 'Video',
    '3gp': 'Video',
    
    // Archives
    'zip': 'ZIP Archive',
    'rar': 'RAR Archive',
    '7z': '7-Zip Archive',
    'tar': 'TAR Archive',
    'gz': 'GZIP Archive',
    'bz2': 'BZIP2 Archive',
    
    // Code
    'html': 'HTML File',
    'htm': 'HTML File',
    'css': 'CSS File',
    'js': 'JavaScript File',
    'jsx': 'React JSX File',
    'ts': 'TypeScript File',
    'tsx': 'React TSX File',
    'py': 'Python File',
    'java': 'Java File',
    'cpp': 'C++ File',
    'c': 'C File',
    'cs': 'C# File',
    'php': 'PHP File',
    'rb': 'Ruby File',
    'go': 'Go File',
    'rs': 'Rust File',
    'swift': 'Swift File',
    'kt': 'Kotlin File',
    'scala': 'Scala File',
    'sql': 'SQL File',
    'sh': 'Shell Script',
    'bat': 'Batch File',
    'ps1': 'PowerShell Script',
    
    // Fonts
    'ttf': 'TrueType Font',
    'otf': 'OpenType Font',
    'woff': 'Web Open Font',
    'woff2': 'Web Open Font 2',
    'eot': 'Embedded OpenType',
    
    // Design
    'psd': 'Photoshop Document',
    'ai': 'Adobe Illustrator',
    'eps': 'Encapsulated PostScript',
    'indd': 'Adobe InDesign',
    'sketch': 'Sketch File',
    'fig': 'Figma File',
    'xd': 'Adobe XD',
    
    // Executables
    'exe': 'Windows Executable',
    'msi': 'Windows Installer',
    'dmg': 'macOS Disk Image',
    'pkg': 'macOS Package',
    'deb': 'Debian Package',
    'rpm': 'RPM Package',
    'apk': 'Android Package',
    
    // Ebooks
    'epub': 'EPUB Ebook',
    'mobi': 'MOBI Ebook',
    'azw': 'Amazon Kindle',
    
    // 3D & CAD
    'stl': '3D Model',
    'obj': '3D Object',
    'fbx': '3D Format',
    'blend': 'Blender File',
    'dwg': 'AutoCAD Drawing',
    'dxf': 'Drawing Exchange',
  };
  
  return fileTypeMap[extension] || 'File';
}

function isPdfFile(fileType: string, fileName: string, url: string): boolean {
  // Check if explicitly marked as PDF
  if (fileType === 'PDF Document') return true;
  
  // Check filename
  const lowerFileName = fileName.toLowerCase();
  if (lowerFileName.endsWith('.pdf')) return true;
  
  // Check URL
  const lowerUrl = (url || '').toLowerCase();
  if (lowerUrl.includes('.pdf')) return true;
  
  // Check for PDF in type name (case-insensitive)
  if (fileType.toLowerCase().includes('pdf')) return true;
  
  return false;
}

function countByType(resources: any[]): Record<string, number> {
  const counts: Record<string, number> = {};
  
  resources.forEach(resource => {
    const type = resource.type || 'Unknown';
    counts[type] = (counts[type] || 0) + 1;
  });
  
  return counts;
}