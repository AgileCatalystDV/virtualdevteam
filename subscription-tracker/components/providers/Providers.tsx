"use client";

import { ApiDataProvider } from "./ApiDataProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApiDataProvider>{children}</ApiDataProvider>;
}
