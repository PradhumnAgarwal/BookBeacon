import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

export function LoadingButton({
  isLoading,
  children,
  loadingText,
}: {
  isLoading: boolean;
  children: ReactNode;
  loadingText: string;
}) {
  return (
    <Button type="submit" disabled={isLoading}>
      {isLoading && <Loader2 className="animate-spin mr-2" />}
      {isLoading ? loadingText : children}
    </Button>
  );
}
