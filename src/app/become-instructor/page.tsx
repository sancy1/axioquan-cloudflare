//  // src/app/become-instructor/page.tsx

//  // app/become-instructor/page.tsx
// import BecomeInstructorSteps from '@/components/home/become-instructor-steps';
// import { Header } from '@/components/layout/header';
// import { Footer } from '@/components/layout/footer';

// export default function BecomeInstructorPage() {
//   return (
//     <main>
//       <Header />
//       <BecomeInstructorSteps />
//       <Footer />
//     </main>
//   );
// }


















// src/app/become-instructor/page.tsx
import BecomeInstructorSteps from '@/components/home/become-instructor-steps';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

async function getSiteStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stats`, {
      next: { revalidate: 3600 }, // revalidate every hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function BecomeInstructorPage() {
  const stats = await getSiteStats();

  return (
    <main>
      <Header />
      <BecomeInstructorSteps stats={stats} />
      <Footer />
    </main>
  );
}