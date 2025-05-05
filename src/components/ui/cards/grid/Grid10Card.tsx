import { forwardRef } from 'react';
import Card from '../Card';
import { LineChart, Users, UserPlus } from 'lucide-react';

const Grid10Card = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <Card ref={ref} className="col-start-4 row-start-5 transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1]">
      <div className="h-full flex items-center justify-center p-4">
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="flex flex-col items-center text-center">
            <div className="mb-1 text-gray-800">
              <LineChart size={20} />
            </div>
            <div className="text-lg font-bold text-gray-900">125K</div>
            <div className="text-xs text-gray-700 leading-tight">X Weekly<br />Impressions</div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-1 text-gray-800">
              <Users size={20} />
            </div>
            <div className="text-lg font-bold text-gray-900">45.2K</div>
            <div className="text-xs text-gray-700 leading-tight">X Total<br />Followers</div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-1 text-gray-800">
              <UserPlus size={20} />
            </div>
            <div className="text-lg font-bold text-gray-900">12.8K</div>
            <div className="text-xs text-gray-700 leading-tight">Discord Total<br />Members</div>
          </div>
        </div>
      </div>
    </Card>
  );
});

Grid10Card.displayName = 'Grid10Card';

export default Grid10Card; 