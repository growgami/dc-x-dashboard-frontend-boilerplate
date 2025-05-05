import { forwardRef } from 'react';
import Card from '../Card';
import { FaXTwitter, FaDiscord } from 'react-icons/fa6';
import { BiGlobe } from 'react-icons/bi';

const Grid13Card = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <Card ref={ref} className="col-start-5 row-start-6 transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1]">
      <div className="p-6 h-full flex items-center justify-center">
        <div className="flex justify-between w-48">
          <a href="#" className="text-4xl text-gray-800 hover:text-blue-700 transition-colors">
            <FaXTwitter />
          </a>
          <a href="#" className="text-4xl text-gray-800 hover:text-indigo-700 transition-colors">
            <FaDiscord />
          </a>
          <a href="#" className="text-4xl text-gray-800 hover:text-green-700 transition-colors">
            <BiGlobe />
          </a>
        </div>
      </div>
    </Card>
  );
});

Grid13Card.displayName = 'Grid13Card';

export default Grid13Card; 