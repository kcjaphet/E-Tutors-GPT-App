
import React from 'react';
import { cn } from "@/lib/utils";

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  isSelected?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  isSelected = false 
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-lg border p-4 transition-all duration-200 subtle-shadow",
        "hover:bg-secondary/50 hover:-translate-y-1 hover:shadow-md",
        isSelected 
          ? "border-primary bg-primary/5" 
          : "border-border bg-card"
      )}
    >
      <div className="flex flex-col gap-2">
        <div className={cn(
          "mb-2 rounded-full w-10 h-10 flex items-center justify-center",
          isSelected 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground group-hover:bg-primary/20"
        )}>
          {icon}
        </div>
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default ToolCard;
