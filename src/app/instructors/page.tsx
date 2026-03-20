
// // /src/app/instructors/page.tsx

// import { getInstructors } from '@/lib/db/queries/instructors';
// import InstructorsClient from './instructors-client';
// import { Header } from '@/components/layout/header';
// import { Footer } from '@/components/layout/footer';

// export const metadata = {
//   title: 'Instructors | AxioQuan',
//   description: 'Meet our expert instructors — industry leaders and skilled professionals ready to guide your learning journey.',
// };

// export default async function InstructorsPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ search?: string; sort?: string }>;
// }) {
//   const params = await searchParams;

//   const { instructors, total } = await getInstructors({
//     search: params.search,
//     sortBy: (params.sort as any) || 'popular',
//     limit: 12,
//     offset: 0,
//   });

//   return (
//     <InstructorsClient
//       initialInstructors={instructors}
//       initialTotal={total}
//       initialSearch={params.search || ''}
//       initialSort={params.sort || 'popular'}
//     />
//   );
  
// }










// /src/app/instructors/page.tsx

import { getInstructors } from '@/lib/db/queries/instructors';
import InstructorsClient from './instructors-client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: 'Instructors | AxioQuan',
  description: 'Meet our expert instructors — industry leaders and skilled professionals ready to guide your learning journey.',
};

export default async function InstructorsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string }>;
}) {
  const params = await searchParams;

  const { instructors, total } = await getInstructors({
    search: params.search,
    sortBy: (params.sort as any) || 'popular',
    limit: 12,
    offset: 0,
  });

  return (
    <>
      <Header />
      <InstructorsClient
        initialInstructors={instructors}
        initialTotal={total}
        initialSearch={params.search || ''}
        initialSort={params.sort || 'popular'}
      />
      <Footer />
    </>
  );
}