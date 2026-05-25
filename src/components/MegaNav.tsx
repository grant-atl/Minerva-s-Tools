import { useState } from "react";
import { Link } from "react-router-dom";
import { List } from "@phosphor-icons/react";
import minervaLogo from "@/assets/minerva-logo.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { tools, categories, categoryDescriptions } from "@/lib/tools-data";

export default function MegaNav() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  let closeTimeout: ReturnType<typeof setTimeout>;

  const handleEnter = (category: string) => {
    clearTimeout(closeTimeout);
    setOpenCategory(category);
  };

  const handleLeave = () => {
    closeTimeout = setTimeout(() => setOpenCategory(null), 150);
  };

  return (
    <nav className="relative border-b border-border z-50">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
          <img src={minervaLogo} alt="Minerva logo" className="h-9 w-9" />
          Minerva
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {categories.map((category) => (
            <div
              key={category}
              className="relative"
              onMouseEnter={() => handleEnter(category)}
              onMouseLeave={handleLeave}
            >
              <button
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  openCategory === category
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {category}
              </button>
            </div>
          ))}
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="md:hidden">
              <List size={20} weight="bold" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="!w-full !max-w-full h-full overflow-y-auto" showCloseButton={false}>
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground"
              >
                <img src={minervaLogo} alt="Minerva logo" className="h-9 w-9" />
                Minerva
              </Link>
              <Button variant="ghost" size="icon-sm" onClick={() => setMobileOpen(false)}>
                <span className="text-lg font-bold">✕</span>
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="px-2 pb-6">
              <Accordion type="multiple" className="border-none [&_a]:!no-underline">
                {categories.map((category) => {
                  const categoryTools = tools.filter((t) => t.category === category);
                  return (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                        {category}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-xs text-muted-foreground mb-3">
                          {categoryDescriptions[category]}
                        </p>
                        <div className="flex flex-col gap-1">
                          {categoryTools.map((tool) => {
                            const Icon = tool.icon;
                            const isAvailable = tool.tier === 1;

                            if (!isAvailable) {
                              return (
                                <div
                                  key={tool.route}
                                  className="flex items-center gap-3 rounded-lg p-2.5 opacity-50 cursor-not-allowed"
                                >
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    <Icon size={16} weight="duotone" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-foreground">
                                        {tool.name}
                                      </span>
                                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                        Soon
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {tool.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <Link
                                key={tool.route}
                                to={tool.route}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted"
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                  <Icon size={16} weight="duotone" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-foreground">
                                      {tool.name}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {tool.description}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop dropdown panel */}
      {openCategory && (
        <div
          className="absolute left-0 right-0 border-b border-border bg-card shadow-lg animate-in fade-in-0 slide-in-from-top-1 duration-150"
          onMouseEnter={() => handleEnter(openCategory)}
          onMouseLeave={handleLeave}
        >
          <div className="container mx-auto px-4 sm:px-6 py-6">
            <p className="text-xs text-muted-foreground mb-4">
              {categoryDescriptions[openCategory]}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {tools
                .filter((t) => t.category === openCategory)
                .map((tool) => {
                  const Icon = tool.icon;
                  const isAvailable = tool.tier === 1;

                  if (!isAvailable) {
                    return (
                      <div
                        key={tool.route}
                        className="group flex items-center gap-3 rounded-lg p-3 opacity-50 cursor-not-allowed"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Icon size={18} weight="duotone" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {tool.name}
                            </span>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              Soon
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={tool.route}
                      to={tool.route}
                      onClick={() => setOpenCategory(null)}
                      className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon size={18} weight="duotone" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {tool.name}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
