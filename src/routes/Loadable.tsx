// src/routes/Loadable.tsx
import React, { Suspense } from "react";

export const Loadable = (Component: React.LazyExoticComponent<() => JSX.Element>) => (props: any) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component {...props} />
  </Suspense>
);
