// [FUTURE] Pro/Premium page — uncomment when enabling premium subscription features
// Original pro page content preserved below. To restore:
// 1. Remove the ComingSoon import and default export at the bottom
// 2. Uncomment the entire original code block

/*
import { Suspense } from "react";

import Pro from "@/src/app/pro/pro";

export default function Page() {
  return (
    <Suspense>
      <Pro />
    </Suspense>
  );
}
*/

// Active export — shows Coming Soon placeholder
import ComingSoon from "@/src/components/coming-soon";

export default function Page() {
  return (
    <ComingSoon 
      title="Premium Access — Coming Soon" 
      description="Unlock exclusive discounts, priority services, and premium features. Our subscription plans will be available soon!" 
    />
  );
}
