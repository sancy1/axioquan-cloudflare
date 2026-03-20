 // src/app/become-instructor/page.tsx

 // app/become-instructor/page.tsx
import BecomeInstructorSteps from '@/components/home/become-instructor-steps';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function BecomeInstructorPage() {
  return (
    <main>
      <Header />
      <BecomeInstructorSteps />
      <Footer />
    </main>
  );
}