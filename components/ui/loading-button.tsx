import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MouseEvent, ReactNode } from "react";

export function LoadingButton({
  isLoading,
  children,
  loadingText,
  onClick
}: {
  isLoading: boolean;
  children: ReactNode;
  loadingText: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>)=>void
}) {
  return (
    <Button onClick={(e) =>{onClick?.(e) }} type="submit" disabled={isLoading}>
      {isLoading && <Loader2 className="animate-spin mr-2" />}
      {isLoading ? loadingText : children}
    </Button>
  );
}
