import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  CaretDown,
  GithubLogo,
  List,
  X,
} from "@phosphor-icons/react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categories, categoryDescriptions, tools } from "@/lib/tools-data";

interface HomeNavProps {
  variant?: "dark" | "light";
}

export default function HomeNav({ variant: _variant = "light" }: HomeNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const closeMobile = () => setMobileOpen(false);

  return (
    <nav
      aria-label="Primary navigation"
      className="relative z-50 bg-background font-sans text-foreground"
    >
      <div className="lab-container flex h-[100px] items-center justify-between gap-6 border-b border-border">
        <Brand />

        <div className="hidden items-center gap-8 text-[13px] text-muted-foreground md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-[5px] py-2 text-foreground transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                Tools
                <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[9px] leading-none text-muted-foreground">
                  {tools.length}
                </span>
                <CaretDown aria-hidden="true" size={12} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              sideOffset={15}
              className="w-56 rounded-[7px] p-1.5 font-sans"
            >
              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded-[5px] py-2.5 font-sans text-[13px]"
              >
                <Link to="/">
                  Browse all tools{" "}
                  <ArrowUpRight aria-hidden="true" className="ml-auto" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuSub key={category}>
                  <DropdownMenuSubTrigger className="cursor-pointer rounded-[5px] py-2.5 font-sans text-[13px] font-normal">
                    {category}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="max-h-[70vh] w-80 overflow-y-auto rounded-[7px] border border-border bg-popover p-1.5 font-sans">
                      {tools
                        .filter((tool) => tool.category === category)
                        .map((tool) => (
                          <DropdownMenuItem
                            key={tool.route}
                            asChild
                            disabled={tool.tier !== 1}
                            className="cursor-pointer rounded-[5px] p-3 font-sans text-[13px] font-normal"
                          >
                            <Link
                              to={tool.route}
                              aria-current={
                                pathname === tool.route ? "page" : undefined
                              }
                            >
                              <tool.icon
                                aria-hidden="true"
                                className="size-4 text-primary"
                              />
                              {tool.name}
                              {tool.tier !== 1 && (
                                <span className="ml-auto text-xs text-muted-foreground">
                                  Soon
                                </span>
                              )}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            to="/about"
            aria-current={pathname === "/about" ? "page" : undefined}
            className="rounded-[5px] py-2 transition-colors hover:text-primary aria-[current=page]:text-foreground"
          >
            About
          </Link>
        </div>

        <a
          href="https://github.com/grant-atl/Minerva-s-Tools"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2.5 rounded-[5px] border border-border px-3.5 py-2.5 text-xs transition-colors hover:bg-muted md:flex"
        >
          <GithubLogo aria-hidden="true" size={16} />
          Source on GitHub
          <ArrowUpRight
            aria-hidden="true"
            size={13}
            className="ml-1 text-muted-foreground"
          />
        </a>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="grid size-10 shrink-0 place-items-center rounded-[5px] border border-border transition-colors hover:bg-muted md:hidden"
            >
              <List aria-hidden="true" size={22} />
              <span className="sr-only">Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            showCloseButton={false}
            aria-describedby={undefined}
            className="h-full !w-full !max-w-full overflow-y-auto border-0 bg-background p-0 font-sans text-foreground"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="lab-container flex min-h-[100px] w-full items-center justify-between gap-4 border-b border-border">
              <Brand onSelect={closeMobile} />
              <button
                type="button"
                aria-label="Close navigation"
                onClick={closeMobile}
                className="grid size-10 shrink-0 place-items-center rounded-[5px] border border-border transition-colors hover:bg-muted"
              >
                <X aria-hidden="true" size={21} />
              </button>
            </div>
            <div className="lab-container w-full py-6">
              <Link
                to="/"
                onClick={closeMobile}
                className="mb-5 flex items-center justify-between py-2 text-lg"
              >
                Browse all tools{" "}
                <span className="font-mono text-xs text-muted-foreground">
                  {tools.length}
                </span>
              </Link>
              <Accordion
                type="multiple"
                className="rounded-none border-x-0 border-border [&_a]:!no-underline"
              >
                {categories.map((category) => (
                  <AccordionItem
                    key={category}
                    value={category}
                    className="border-border data-[state=open]:bg-transparent"
                  >
                    <AccordionTrigger className="items-center border-0 px-0 py-5 font-sans text-sm font-normal normal-case tracking-normal hover:bg-transparent hover:text-primary">
                      {category}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-foreground">
                      <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                        {categoryDescriptions[category]}
                      </p>
                      <div className="grid gap-1 sm:grid-cols-2">
                        {tools
                          .filter((tool) => tool.category === category)
                          .map((tool) => (
                            <NavToolLink
                              key={tool.route}
                              tool={tool}
                              onSelect={closeMobile}
                            />
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="mt-7 flex flex-wrap gap-x-7 gap-y-5 text-sm text-muted-foreground">
                {[
                  ["About", "/about"],
                  ["Privacy", "/privacy"],
                  ["Terms", "/terms"],
                ].map(([label, to]) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={closeMobile}
                    className="transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                ))}
                <a
                  href="https://github.com/grant-atl/Minerva-s-Tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-colors hover:text-primary"
                >
                  GitHub <ArrowUpRight aria-hidden="true" size={13} />
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

function Brand({ onSelect }: { onSelect?: () => void }) {
  return (
    <Link
      to="/"
      aria-label="Minerva's Tools"
      onClick={onSelect}
      className="flex min-w-0 items-center gap-3 rounded-[5px] text-[22px] font-semibold tracking-[-1px] sm:text-[26px]"
    >
      <span
        aria-hidden="true"
        className="grid -rotate-[9deg] grid-cols-3 gap-[3px]"
      >
        {Array.from({ length: 9 }, (_, index) => (
          <span
            key={index}
            className="size-1 rounded-full bg-primary [&:nth-child(3n)]:opacity-50"
          />
        ))}
      </span>
      <span className="truncate">
        Minerva&apos;s Tools<span className="text-primary">.</span>
      </span>
    </Link>
  );
}

function NavToolLink({
  tool,
  onSelect,
}: {
  tool: (typeof tools)[number];
  onSelect: () => void;
}) {
  const content = (
    <>
      <tool.icon
        aria-hidden="true"
        size={17}
        className="shrink-0 text-primary"
      />
      <span className="min-w-0">
        <span className="block text-[13px]">{tool.name}</span>
        {tool.tier !== 1 && (
          <span className="text-xs text-muted-foreground">Soon</span>
        )}
      </span>
    </>
  );

  return tool.tier === 1 ? (
    <Link
      to={tool.route}
      onClick={onSelect}
      className="flex min-h-11 items-center gap-3 rounded-[5px] px-2 py-3 transition-colors hover:bg-muted hover:text-primary"
    >
      {content}
    </Link>
  ) : (
    <div className="flex min-h-11 items-center gap-3 px-2 py-3 opacity-50">
      {content}
    </div>
  );
}
