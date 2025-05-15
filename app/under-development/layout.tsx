import { Suspense, type ReactNode } from "react";

export default function UnderDevelopmentLayout({
  children,
}: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex justify-center py-12">
      <div className="space-y-4 p-4 max-w-lg">
        <h1 className="text-center text-xl sm:text-3xl font-black tracking-tighter text-shadow-sm uppercase">
          Em desenvolvimento 🚧
        </h1>
        <div className="py-4">{children}</div>
      </div>
    </div>
  );
}
