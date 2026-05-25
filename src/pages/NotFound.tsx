import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import HomeNav from "@/components/HomeNav";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="404 — Page Not Found | Minerva"
        description="The page you're looking for doesn't exist. Head back to Minerva's free design tools."
        canonical="/404"
      />
      <HomeNav />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="text-center max-w-md">
          <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl font-semibold text-foreground mb-2">Page not found</p>
          <p className="text-sm text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild size="lg">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
