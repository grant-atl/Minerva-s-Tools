import { ReactNode } from "react";
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
    <div className="min-h-screen bg-black text-white">
      <HomeNav variant="dark" />
      <div className="relative z-10 pb-10">
        <main className="w-full px-[25px] pb-10 pt-6">
          <section className="ease-up mb-8 rounded-none border border-white/15 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
            <h1 className="text-[2.2rem] font-bold leading-[0.95] text-white sm:text-[3rem]">
              {title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base">
              {description}
            </p>
            {updatedAt && (
              <p className="mt-3 text-xs uppercase tracking-[0.08em] text-white/50">
                Last updated: {updatedAt}
              </p>
            )}
          </section>

          <section className="ease-up ease-up-delay-1 rounded-none border border-white/15 bg-white/[0.03] p-6 shadow-[0_24px_80px_-45px_rgba(0,0,0,0.85)] sm:p-8">
            <div className="space-y-8">{children}</div>
          </section>
        </main>
      </div>
    </div>
  );
}
