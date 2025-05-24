import { Star, Edit, Share, Trash } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface HistoryItemProps {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  onMoreClick: () => void;
  isFavorite?: boolean;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
}

const HistoryItem = ({ 
  icon, 
  iconBg, 
  title, 
  description, 
  onMoreClick, 
  isFavorite = false,
  onEdit = () => {},
  onShare = () => {},
  onDelete = () => {}
}: HistoryItemProps) => {
  return (
    <div className="history-item relative group">
      <span className="history-icon" style={{ background: iconBg }}>
        <i className={`bi ${icon}`}></i>
      </span>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-bold text-[1.07rem] text-[#222] mb-0.5 truncate">{title}</span>
        <span className="text-[#959595] text-[0.99rem] font-medium truncate">{description}</span>
      </div>
      
      {/* Action buttons with tooltips - all in one provider for better performance */}
      <div className="flex items-center space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                onClick={onMoreClick}
              >
                <Star size={18} className={isFavorite ? "fill-yellow-400 text-yellow-400" : ""} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                onClick={onEdit}
              >
                <Edit size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                onClick={onShare}
              >
                <Share size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500"
                onClick={onDelete}
              >
                <Trash size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default HistoryItem;
