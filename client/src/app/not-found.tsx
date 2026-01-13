'use client';

import React from 'react';
import Button from '@/src/components/ui/button';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Button onClick={() => (window.location.href = '/')} type="default" text="Return Home" />
    </div>
  );
};

export default NotFound;
