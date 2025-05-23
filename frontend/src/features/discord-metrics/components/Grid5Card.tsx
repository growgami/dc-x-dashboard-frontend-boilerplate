import { forwardRef } from 'react';
import Card from '../../../components/ui/cards/Card';
import { Users, MessageSquare } from 'lucide-react';

interface Grid5CardProps {
  onClick?: () => void;
}

const Grid5Card = forwardRef<HTMLDivElement, Grid5CardProps>(({ onClick }, ref) => {
  return (
    <Card
      ref={ref}
      className="col-start-4 row-start-1 transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1]"
      onClick={onClick}
    >
      <div className="h-full w-full flex items-center justify-center px-4">
        <div className="grid grid-cols-2 gap-6 w-full">
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 text-gray-800">
              <Users size={24} />
            </div>
            <div className="text-xl font-bold text-gray-900">+258%</div>
            <div className="text-sm text-gray-700">Members</div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 text-gray-800">
              <MessageSquare size={24} />
            </div>
            <div className="text-xl font-bold text-gray-900">+893</div>
            <div className="text-sm text-gray-700">Engagements</div>
          </div>
        </div>
      </div>
    </Card>
  );
});

Grid5Card.displayName = 'Grid5Card';

export default Grid5Card; 