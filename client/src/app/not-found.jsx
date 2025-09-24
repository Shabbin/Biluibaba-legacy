"use client";

import Button from "@/src/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Button onClick={() => (window.location.href = "/")} variant="default">
        Return Home
      </Button>
    </div>
  );
};

export default NotFound;
