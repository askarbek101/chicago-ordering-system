"use client";

import { useAuthSetup } from '../hooks/useAuthSetup';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useAuthSetup();
  
  return (
    <body className="font-sans min-h-screen flex flex-col antialiased">
      {children}
    </body>
  );
} 