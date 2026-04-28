import { Suspense } from "react";
import LoginContent from "./login-content";

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>}>
      <LoginContent />
    </Suspense>
  );
}
