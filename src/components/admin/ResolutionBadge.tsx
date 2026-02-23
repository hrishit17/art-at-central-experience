import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

interface ResolutionBadgeProps {
  text: string;
}

const ResolutionBadge = ({ text }: ResolutionBadgeProps) => (
  <Badge variant="outline" className="gap-1.5 text-xs font-normal border-primary/20 text-muted-foreground bg-muted/50 px-3 py-1">
    <Info size={12} />
    {text}
  </Badge>
);

export default ResolutionBadge;
