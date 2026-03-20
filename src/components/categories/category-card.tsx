// // /components/courses/category-card.tsx

// import Link from 'next/link';
// import { ArrowRight, Star } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Category } from '@/types/categories';

// interface CategoryCardProps {
//   category: Category;
//   view: 'grid' | 'list';
// }

// const categoryIcons: { [key: string]: string } = {
//   'web-development': '💻',
//   'programming': '👨‍💻',
//   'design': '🎨',
//   'data-science': '📊',
//   'business': '💼',
//   'marketing': '📈',
//   'photography': '📷',
//   'music': '🎵',
//   'health': '🏥',
//   'language': '🌐',
//   'default': '📚'
// };

// const getCategoryIcon = (slug: string, icon?: string) => {
//   if (icon) return icon;
//   return categoryIcons[slug] || categoryIcons.default;
// };

// export function CategoryCard({ category, view }: CategoryCardProps) {
//   if (view === 'list') {
//     return (
//       <Link href={`/categories/${category.slug}`}>
//         <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer">
//           <div 
//             className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
//             style={{ 
//               backgroundColor: category.color ? `${category.color}15` : '#f3f4f6',
//               color: category.color || '#6b7280'
//             }}
//           >
//             {getCategoryIcon(category.slug, category.icon)}
//           </div>
          
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-2 mb-1">
//               <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
//               {category.is_featured && (
//                 <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
//               )}
//             </div>
//             {category.description && (
//               <p className="text-sm text-gray-600 truncate">{category.description}</p>
//             )}
//           </div>
          
//           <div className="flex items-center gap-4">
//             <Badge variant="secondary" className="whitespace-nowrap">
//               {category.course_count} course{category.course_count !== 1 ? 's' : ''}
//             </Badge>
//             <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
//           </div>
//         </div>
//       </Link>
//     );
//   }

//   // Grid view
//   return (
//     <Link href={`/categories/${category.slug}`}>
//       <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer h-full border border-gray-200">
//         {/* Category Header with Gradient */}
//         <div 
//           className="relative h-32 overflow-hidden bg-gradient-to-br from-gray-900 to-black text-white"
//           style={{
//             background: category.color 
//               ? `linear-gradient(135deg, ${category.color}40, #000000)`
//               : 'linear-gradient(135deg, #1f2937, #000000)'
//           }}
//         >
//           <div className="absolute inset-0 flex items-center justify-center">
//             <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
//               {getCategoryIcon(category.slug, category.icon)}
//             </span>
//           </div>
          
//           {/* Featured Badge */}
//           {category.is_featured && (
//             <span className="absolute top-3 right-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
//               <Star className="h-3 w-3 inline mr-1" />
//               FEATURED
//             </span>
//           )}
          
//           {/* Course Count Badge */}
//           <span className="absolute bottom-3 left-3 bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
//             {category.course_count} course{category.course_count !== 1 ? 's' : ''}
//           </span>
//         </div>

//         {/* Category Info */}
//         <div className="p-4">
//           <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">{category.name}</h3>
          
//           {/* Category Description */}
//           {category.description && (
//             <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//               {category.description}
//             </p>
//           )}

//           <div className="flex items-center justify-between">
//             <Badge 
//               variant="secondary" 
//               className="text-xs"
//               style={{ 
//                 backgroundColor: category.color ? `${category.color}20` : '#f3f4f6',
//                 borderColor: category.color || '#d1d5db',
//                 color: category.color || '#374151'
//               }}
//             >
//               Explore Courses
//             </Badge>
//             <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }





















// /components/courses/category-card.tsx

import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/types/categories';

interface CategoryCardProps {
  category: Category;
  view: 'grid' | 'list';
}

// ── SVG illustrations from landing page ───────────────────────────────────────
const categoryConfig: {
  [key: string]: { glow: string; bg: string; svg: React.ReactNode };
} = {
  'web-development': {
    glow: 'rgba(99,102,241,0.5)',
    bg: 'rgba(99,102,241,0.12)',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        <rect x="8" y="16" width="64" height="48" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
        <rect x="8" y="16" width="64" height="12" rx="6" fill="rgba(99,102,241,0.25)"/>
        <circle cx="18" cy="22" r="2.5" fill="#ef4444"/>
        <circle cx="26" cy="22" r="2.5" fill="#f59e0b"/>
        <circle cx="34" cy="22" r="2.5" fill="#22c55e"/>
        <path d="M16 38 L24 46 L16 54" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M32 54 L48 54" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M56 38 L48 46 L56 54" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  'programming': {
    glow: 'rgba(139,92,246,0.5)',
    bg: 'rgba(139,92,246,0.12)',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        <rect x="10" y="10" width="60" height="60" rx="8" fill="rgba(139,92,246,0.12)" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5"/>
        <path d="M20 30 L30 40 L20 50" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M38 52 L52 28" stroke="#f472b6" strokeWidth="2" strokeLinecap="round"/>
        <path d="M42 52 L56 52" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="62" cy="20" r="5" fill="rgba(167,139,250,0.2)" stroke="#a78bfa" strokeWidth="1.5"/>
        <path d="M60 20 L62 22 L65 18" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  'design': {
    glow: 'rgba(244,114,182,0.5)',
    bg: 'rgba(244,114,182,0.12)',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        <circle cx="40" cy="40" r="28" fill="rgba(244,114,182,0.1)" stroke="rgba(244,114,182,0.3)" strokeWidth="1.5"/>
        <circle cx="40" cy="40" r="8" fill="rgba(244,114,182,0.2)" stroke="#f472b6" strokeWidth="1.5"/>
        <path d="M40 12 L40 20M40 60 L40 68M12 40 L20 40M60 40 L68 40" stroke="rgba(244,114,182,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="40" cy="24" r="4" fill="#fb923c"/>
        <circle cx="56" cy="40" r="4" fill="#f472b6"/>
        <circle cx="40" cy="56" r="4" fill="#a78bfa"/>
        <circle cx="24" cy="40" r="4" fill="#38bdf8"/>
      </svg>
    ),
  },
  'data-science': {
    glow: 'rgba(20,184,166,0.5)',
    bg: 'rgba(20,184,166,0.12)',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        <rect x="10" y="50" width="12" height="22" rx="3" fill="rgba(52,211,153,0.6)"/>
        <rect x="26" y="38" width="12" height="34" rx="3" fill="rgba(52,211,153,0.7)"/>
        <rect x="42" y="26" width="12" height="46" rx="3" fill="rgba(52,211,153,0.85)"/>
        <rect x="58" y="16" width="12" height="56" rx="3" fill="#34d399"/>
        <path d="M16 48 L32 36 L48 24 L64 14" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2"/>
        <circle cx="16" cy="48" r="3" fill="white"/>
        <circle cx="32" cy="36" r="3" fill="white"/>
        <circle cx="48" cy="24" r="3" fill="white"/>
        <circle cx="64" cy="14" r="3" fill="white"/>
      </svg>
    ),
  },
  'business': {
    glow: 'rgba(251,191,36,0.5)',
    bg: 'rgba(251,191,36,0.12)',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        <rect x="20" y="30" width="40" height="36" rx="4" fill="rgba(251,191,36,0.12)" stroke="rgba(251,191,36,0.35)" strokeWidth="1.5"/>
        <rect x="30" y="22" width="20" height="10" rx="3" fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.4)" strokeWidth="1.5"/>
        <path d="M20 44 L60 44" stroke="rgba(251,191,36,0.3)" strokeWidth="1"/>
        <circle cx="40" cy="52" r="5" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5"/>
        <path d="M38 52 L39.5 53.5 L43 50" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M28 36 L28 38M40 36 L40 38M52 36 L52 38" stroke="rgba(251,191,36,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  'marketing': {
    glow: 'rgba(99,102,241,0.5)',
    bg: 'rgba(99,102,241,0.12)',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        <circle cx="40" cy="40" r="28" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.25)" strokeWidth="1" strokeDasharray="4 3"/>
        <circle cx="40" cy="40" r="18" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.35)" strokeWidth="1" strokeDasharray="3 2"/>
        <circle cx="40" cy="40" r="8" fill="rgba(99,102,241,0.2)" stroke="#818cf8" strokeWidth="1.5"/>
        <path d="M40 12 L44 38 L40 40" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="40" cy="40" r="2.5" fill="#818cf8"/>
        <circle cx="58" cy="24" r="4" fill="rgba(99,102,241,0.3)" stroke="#818cf8" strokeWidth="1"/>
        <circle cx="20" cy="56" r="3" fill="rgba(167,139,250,0.4)" stroke="#a78bfa" strokeWidth="1"/>
      </svg>
    ),
  },
  'photography': {
    glow: 'rgba(100,116,139,0.5)',
    bg: 'rgba(100,116,139,0.12)',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        <rect x="10" y="24" width="60" height="42" rx="6" fill="rgba(148,163,184,0.12)" stroke="rgba(148,163,184,0.3)" strokeWidth="1.5"/>
        <path d="M10 34 L24 24 L30 30 L70 24" stroke="rgba(148,163,184,0.3)" strokeWidth="1"/>
        <circle cx="40" cy="46" r="12" fill="rgba(148,163,184,0.1)" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5"/>
        <circle cx="40" cy="46" r="7" fill="rgba(148,163,184,0.15)" stroke="#94a3b8" strokeWidth="1.5"/>
        <circle cx="40" cy="46" r="3" fill="#94a3b8"/>
        <rect x="54" y="28" width="10" height="7" rx="2" fill="rgba(148,163,184,0.3)"/>
        <circle cx="18" cy="32" r="3" fill="rgba(148,163,184,0.4)"/>
      </svg>
    ),
  },
  'music': {
    glow: 'rgba(244,63,94,0.5)',
    bg: 'rgba(244,63,94,0.12)',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        <path d="M30 56 L30 24 L62 18 L62 50" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M30 24 L62 18" stroke="#fb7185" strokeWidth="1.5"/>
        <circle cx="24" cy="58" r="8" fill="rgba(251,113,133,0.15)" stroke="#fb7185" strokeWidth="1.5"/>
        <circle cx="56" cy="52" r="8" fill="rgba(251,113,133,0.15)" stroke="#fb7185" strokeWidth="1.5"/>
        <path d="M36 36 L56 32" stroke="rgba(251,113,133,0.3)" strokeWidth="1" strokeDasharray="3 2"/>
        <path d="M36 42 L56 38" stroke="rgba(251,113,133,0.3)" strokeWidth="1" strokeDasharray="3 2"/>
      </svg>
    ),
  },
  'health': {
    glow: 'rgba(16,185,129,0.5)',
    bg: 'rgba(16,185,129,0.12)',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        <path d="M40 64 C40 64 14 50 14 30 C14 22 20 16 28 16 C33 16 37 19 40 23 C43 19 47 16 52 16 C60 16 66 22 66 30 C66 50 40 64 40 64Z" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="1.5"/>
        <path d="M32 38 L37 43 L48 32" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  'language': {
    glow: 'rgba(14,165,233,0.5)',
    bg: 'rgba(14,165,233,0.12)',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        <circle cx="40" cy="40" r="28" fill="rgba(14,165,233,0.1)" stroke="rgba(14,165,233,0.3)" strokeWidth="1.5"/>
        <ellipse cx="40" cy="40" rx="12" ry="28" fill="none" stroke="rgba(14,165,233,0.25)" strokeWidth="1.5"/>
        <path d="M12 40 L68 40" stroke="rgba(14,165,233,0.25)" strokeWidth="1.5"/>
        <path d="M16 28 Q40 22 64 28" stroke="rgba(14,165,233,0.35)" strokeWidth="1" fill="none"/>
        <path d="M16 52 Q40 58 64 52" stroke="rgba(14,165,233,0.35)" strokeWidth="1" fill="none"/>
        <circle cx="40" cy="40" r="4" fill="rgba(14,165,233,0.3)" stroke="#0ea5e9" strokeWidth="1.5"/>
      </svg>
    ),
  },
  'default': {
    glow: 'rgba(139,92,246,0.5)',
    bg: 'rgba(139,92,246,0.12)',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
        <rect x="14" y="20" width="24" height="32" rx="4" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5"/>
        <rect x="18" y="28" width="16" height="2" rx="1" fill="rgba(139,92,246,0.5)"/>
        <rect x="18" y="33" width="12" height="2" rx="1" fill="rgba(139,92,246,0.4)"/>
        <rect x="18" y="38" width="14" height="2" rx="1" fill="rgba(139,92,246,0.3)"/>
        <rect x="42" y="14" width="24" height="32" rx="4" fill="rgba(139,92,246,0.2)" stroke="#a78bfa" strokeWidth="1.5"/>
        <rect x="46" y="22" width="16" height="2" rx="1" fill="rgba(167,139,250,0.6)"/>
        <rect x="46" y="27" width="12" height="2" rx="1" fill="rgba(167,139,250,0.5)"/>
        <rect x="46" y="32" width="14" height="2" rx="1" fill="rgba(167,139,250,0.4)"/>
        <rect x="28" y="48" width="24" height="16" rx="4" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.3)" strokeWidth="1"/>
      </svg>
    ),
  },
};

const getConfig = (slug: string) =>
  categoryConfig[slug] || categoryConfig.default;

export function CategoryCard({ category, view }: CategoryCardProps) {
  const config = getConfig(category.slug);

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  if (view === 'list') {
    return (
      <Link href={`/categories/${category.slug}`}>
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group cursor-pointer">

          {/* SVG icon replacing emoji */}
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
            style={{
              background: 'linear-gradient(180deg, #0a0a14 0%, #0f0a1e 100%)',
              border: `1px solid ${config.glow.replace('0.5', '0.3')}`,
            }}
          >
            <div className="w-8 h-8">
              {config.svg}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
              {category.is_featured && (
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            {category.description && (
              <p className="text-sm text-gray-600 truncate">{category.description}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="whitespace-nowrap">
              {category.course_count} course{category.course_count !== 1 ? 's' : ''}
            </Badge>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    );
  }

  // ── GRID VIEW ──────────────────────────────────────────────────────────────
  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer h-full border border-gray-200">

        {/* Dark purple top section with checky grid + SVG icon */}
        <div
          className="relative h-32 overflow-hidden flex items-center justify-center"
          style={{
            background: 'linear-gradient(180deg, #0a0a14 0%, #0f0a1e 100%)',
          }}
        >
          {/* Checky grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Glow behind icon */}
          <div
            className="absolute w-20 h-20 rounded-full"
            style={{
              background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
              filter: 'blur(16px)',
            }}
          />

          {/* SVG icon */}
          <div
            className="relative w-14 h-14 rounded-xl flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300"
            style={{
              background: config.bg,
              border: `1px solid ${config.glow.replace('0.5', '0.25')}`,
            }}
          >
            {config.svg}
          </div>

          {/* Featured Badge */}
          {category.is_featured && (
            <span className="absolute top-3 right-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
              <Star className="h-3 w-3 fill-black" />
              FEATURED
            </span>
          )}

          {/* Course Count Badge */}
          <span className="absolute bottom-3 left-3 bg-white/10 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10 z-10">
            {category.course_count} course{category.course_count !== 1 ? 's' : ''}
          </span>
        </div>

        {/* White bottom section — black text, unchanged from original */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">
            {category.name}
          </h3>

          {category.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {category.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="text-xs"
              style={{
                backgroundColor: category.color ? `${category.color}20` : '#f3f4f6',
                borderColor: category.color || '#d1d5db',
                color: category.color || '#374151',
              }}
            >
              Explore Courses
            </Badge>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}