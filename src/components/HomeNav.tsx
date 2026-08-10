import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { List } from "@phosphor-icons/react";
import minervaLogo from "@/assets/minerva-logo.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { categories, categoryDescriptions, tools } from "@/lib/tools-data";

interface HomeNavProps {
  variant?: "dark" | "light";
}

export default function HomeNav({ variant = "light" }: HomeNavProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  let closeTimeout: ReturnType<typeof setTimeout>;

  const handleEnter = (cat: string) => {
    clearTimeout(closeTimeout);
    setOpenCategory(cat);
  };

  const handleLeave = () => {
    closeTimeout = setTimeout(() => setOpenCategory(null), 150);
  };

  const isDark = variant === "dark";
  const isHomeRoute = pathname === "/";

  // Token classes based on variant
  const logoText = isDark ? "text-white" : "text-foreground";
  const linkBase = isDark
    ? "text-white/60 hover:text-white hover:bg-white/[0.06]"
    : "text-muted-foreground hover:text-foreground hover:bg-muted/50";
  const linkActive = isDark
    ? "text-white bg-white/10"
    : "text-foreground bg-muted";
  const dropdownBg = isDark ? "bg-[#141414] border-white/10" : "bg-card border-border";
  const dropdownDesc = isDark ? "text-white/50" : "text-muted-foreground";
  const toolName = isDark ? "text-white" : "text-foreground";
  const toolNameHover = isDark
    ? isHomeRoute
      ? "group-hover:text-white"
      : "group-hover:text-primary"
    : "group-hover:text-primary";
  const toolDesc = isDark ? "text-white/40" : "text-muted-foreground";
  const toolIconBg = isDark
    ? "bg-white/10 text-white/70 group-hover:bg-white group-hover:text-black"
    : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground";
  const toolIconBgDisabled = isDark
    ? "bg-white/10 text-white/60"
    : "bg-primary/10 text-primary";
  const toolHover = isDark ? "hover:bg-white/[0.06]" : "hover:bg-muted";
  const badgeCls = isDark
    ? "bg-white/10 text-white/50 border-0"
    : "bg-secondary text-secondary-foreground";
  const pillCls = isDark
    ? "text-black bg-white hover:bg-white/90"
    : "text-primary-foreground bg-primary hover:bg-primary/90";
  const borderCls = isDark ? "border-white/[0.08]" : "border-border";

  return (
    <nav className={`relative z-50 border-b ${borderCls}`}>
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        <Link
          to="/"
          className={`flex items-center gap-2.5 text-xl font-bold tracking-tight ${logoText}`}
        >
          <img src={minervaLogo} alt="" className="h-9 w-9" />
          Minerva's Tools
        </Link>

        {/* Desktop links */}
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
                  openCategory === category ? linkActive : linkBase
                }`}
              >
                {category}
              </button>
            </div>
          ))}
          <Link
            to="/about"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${linkBase}`}
          >
            About
          </Link>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className={`md:hidden ${isDark ? "text-white hover:bg-white/10" : ""}`}>
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
                <img src={minervaLogo} alt="" className="h-9 w-9" />
                Minerva's Tools
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
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
                                <div key={tool.route} className="flex items-center gap-3 rounded-lg p-2.5 opacity-50 cursor-not-allowed">
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    <Icon size={16} weight="duotone" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-foreground">{tool.name}</span>
                                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Soon</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <Link key={tool.route} to={tool.route} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                  <Icon size={16} weight="duotone" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="text-sm font-medium text-foreground">{tool.name}</span>
                                  <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
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
              <div className="mt-4 px-2">
                <Link to="/about" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-foreground hover:text-primary">About</Link>
                <Link to="/privacy" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Privacy</Link>
                <Link to="/terms" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Terms</Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Dropdown panel */}
      {openCategory && (
        <div
          className={`absolute left-0 right-0 ${dropdownBg} border-b shadow-2xl animate-in fade-in-0 slide-in-from-top-1 duration-150`}
          onMouseEnter={() => handleEnter(openCategory)}
          onMouseLeave={handleLeave}
        >
          <div className="container mx-auto px-4 sm:px-6 py-6">
            <p className={`text-xs ${dropdownDesc} mb-4`}>
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
                      <div key={tool.route} className="flex items-center gap-3 rounded-lg p-3 opacity-40 cursor-not-allowed">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${toolIconBgDisabled}`}>
                          <Icon size={18} weight="duotone" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${toolName}`}>{tool.name}</span>
                            <Badge className={`text-[10px] px-1.5 py-0 ${badgeCls}`}>Soon</Badge>
                          </div>
                          <p className={`text-xs ${toolDesc} truncate`}>{tool.description}</p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={tool.route}
                      to={tool.route}
                      onClick={() => setOpenCategory(null)}
                      className={`group flex items-center gap-3 rounded-lg p-3 transition-colors ${toolHover}`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors ${toolIconBg}`}>
                        <Icon size={18} weight="duotone" />
                      </div>
                      <div className="min-w-0">
                        <span className={`text-sm font-medium ${toolName} ${toolNameHover} transition-colors`}>
                          {tool.name}
                        </span>
                        <p className={`text-xs ${toolDesc} truncate`}>{tool.description}</p>
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
