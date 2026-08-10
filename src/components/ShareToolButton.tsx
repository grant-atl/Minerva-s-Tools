import { useState } from "react";
import { ShareNetwork, Check, Link as LinkIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ShareToolButtonProps {
  toolName: string;
  size?: "sm" | "default";
  variant?: "outline" | "ghost";
}

export default function ShareToolButton({ toolName, size = "sm", variant = "outline" }: ShareToolButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const url = window.location.href;
  const text = `Check out ${toolName} on Minerva's Tools`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: "Link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: toolName, text, url });
      } catch {
        // user cancelled
      }
    } else {
      copyLink();
    }
  };

  const shareTwitter = () => {
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
  };

  if (navigator.share) {
    return (
      <Button size={size} variant={variant} onClick={shareNative} className="gap-1.5">
        <ShareNetwork className="size-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={size} variant={variant} className="gap-1.5">
          <ShareNetwork className="size-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyLink} className="gap-2">
          {copied ? <Check className="size-4" /> : <LinkIcon className="size-4" />}
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareTwitter} className="gap-2">
          <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Share on X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareLinkedIn} className="gap-2">
          <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          Share on LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
