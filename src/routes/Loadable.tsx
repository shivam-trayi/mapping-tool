import React, { Suspense } from "react";

export function Loadable<T extends object>(Component: React.LazyExoticComponent<React.ComponentType<T>>) {
  return (props: JSX.IntrinsicAttributes & T) => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
}