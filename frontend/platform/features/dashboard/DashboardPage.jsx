'use client';

import WelcomeHeader from './components/WelcomeHeader';
import ResourceGrid from './components/ResourceGrid';
import { useResourceCategories } from './hooks/useResourceCategories';

export default function DashboardPage() {
  const resourceCategories = useResourceCategories();

  return (
    <div className='p-8'>
      <WelcomeHeader />
      <ResourceGrid categories={resourceCategories} />
    </div>
  );
}
