"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./button";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { useOrigin } from "@/hooks/use-origin";
import { useToast } from "@/hooks/use-toast";

interface ReferLinkProps {
  title: string;
  description: string;
  link: string;
}

export function CopyLink({ title, description, link }: ReferLinkProps) {
  const { toast } = useToast();
  const onCopy = () => {
    navigator.clipboard.writeText(origin + link);
    toast({
      title: "Success",
      description: "Link copied to clipboard!",
    });
  };

  const origin = useOrigin();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center mt-4 justify-between">
        <code className="relative rounded bg-[#ffffff1a] px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold  overflow-hidden whitespace-nowrap text-ellipsis">
          {origin + link}
        </code>
        <Button
          variant="outline"
          size="icon"
          onClick={onCopy}
          className="flex-shrink-0 ml-2 rounded-md border-white/20"
        >
          <FontAwesomeIcon icon={faCopy} className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
