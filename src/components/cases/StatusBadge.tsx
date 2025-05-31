
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Case } from "@/lib/types";
import { AlertTriangle, Info, CheckCircle, Search, AlertCircleIcon, Anchor } from "lucide-react"; // Added Anchor as a placeholder if needed

interface StatusBadgeProps {
  status: Case['status'];
  priority: Case['priority_level'];
  className?: string;
}

export default function StatusBadge({ status, priority, className }: StatusBadgeProps) {
  const statusConfig = {
    New: {
      label: "New",
      className: "bg-blue-100 text-blue-700 border-blue-300",
      icon: <AlertCircleIcon className="h-3 w-3 mr-1" />,
    },
    Investigating: {
      label: "Investigating",
      className: "bg-yellow-100 text-yellow-700 border-yellow-300",
      icon: <Search className="h-3 w-3 mr-1" />,
    },
    Found: {
      label: "Found",
      className: "bg-green-100 text-green-700 border-green-300",
      icon: <CheckCircle className="h-3 w-3 mr-1" />,
    },
    // Example for a custom status if needed for Pakistan context
    // "Referred": { 
    //   label: "Referred",
    //   className: "bg-purple-100 text-purple-700 border-purple-300",
    //   icon: <Anchor className="h-3 w-3 mr-1" /> 
    // },
  };

  const priorityConfig = {
    High: {
      label: "High",
      className: "bg-red-100 text-red-700 border-red-300",
      icon: <AlertTriangle className="h-3 w-3 mr-1" />,
    },
    Medium: {
      label: "Medium",
      className: "bg-orange-100 text-orange-700 border-orange-300",
      icon: <Info className="h-3 w-3 mr-1" />,
    },
    Low: {
      label: "Low",
      className: "bg-gray-100 text-gray-700 border-gray-300",
      icon: <Info className="h-3 w-3 mr-1" />,
    },
  };

  const currentStatus = statusConfig[status as keyof typeof statusConfig] || statusConfig.New;
  const currentPriority = priorityConfig[priority] || priorityConfig.Low;

  return (
    <div className={cn("flex flex-col sm:flex-row gap-2 items-start sm:items-center", className)}>
      <Badge variant="outline" className={cn("flex items-center text-xs py-1 px-2", currentStatus.className)}>
        {currentStatus.icon}
        {currentStatus.label}
      </Badge>
      <Badge variant="outline" className={cn("flex items-center text-xs py-1 px-2", currentPriority.className)}>
        {currentPriority.icon}
        {currentPriority.label} Priority
      </Badge>
    </div>
  );
}
