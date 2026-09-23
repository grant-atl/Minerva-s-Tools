import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import HomeNav from "@/components/HomeNav";

type InfoPageLayoutProps = {
  title: string;
  description: string;
  updatedAt?: string;
  children: ReactNode;
};

export default function InfoPageLayout({
  title,
  description,
  updatedAt,
  children,
}: InfoPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HomeNav />
      <main className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-20">
        <header className="border-b border-border pb-10">
          <h1 className="text-balance text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
          {updatedAt && (
            <p className="mt-5 font-mono text-xs text-muted-foreground">
              Last updated {updatedAt}
            </p>
          )}
        </header>
        <div className="space-y-10 pt-10 [&_a]:text-primary [&_a]:underline-offset-4 [&_h2]:font-medium [&_h2]:tracking-tight [&>section]:text-foreground">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
