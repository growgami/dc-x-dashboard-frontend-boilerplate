import { forwardRef } from 'react';
import Card from '../Card';
import { Users, LineChart, Heart } from 'lucide-react';

const Grid4Card = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <Card ref={ref} className="col-start-3 row-start-3 transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1]">
      <div className="h-full w-full flex items-center justify-center">
        <div className="grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 text-gray-800">
              <Users size={24} />
            </div>
            <div className="text-xl font-bold text-gray-900">+20%</div>
            <div className="text-sm text-gray-700">Follows</div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 text-gray-800">
              <LineChart size={24} />
            </div>
            <div className="text-xl font-bold text-gray-900">+36%</div>
            <div className="text-sm text-gray-700">Impressions</div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 text-gray-800">
              <Heart size={24} />
            </div>
            <div className="text-xl font-bold text-gray-900">+42%</div>
            <div className="text-sm text-gray-700">Engagements</div>
          </div>
        </div>
      </div>
    </Card>
  );
});

Grid4Card.displayName = 'Grid4Card';

export default Grid4Card; 