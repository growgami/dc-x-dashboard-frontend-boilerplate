import { forwardRef } from 'react';
import Card from '../Card';

interface TeamMember {
  name: string;
  role: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Rayls',
    role: 'CEO',
  },
  {
    name: 'Sushil',
    role: 'Growgami',
  },
  {
    name: 'Ethan',
    role: 'Marketing',
  }
];

interface Grid2CardProps {
  onClick?: () => void;
}

const Grid2Card = forwardRef<HTMLDivElement, Grid2CardProps>(({ onClick }, ref) => {
  return (
    <Card
      ref={ref}
      className="col-start-1 col-span-2 row-start-4 transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1] relative overflow-hidden"
      onClick={onClick}
    >
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url('/assets/background/grid1Background/wave-pattern.svg')`,
          backgroundSize: 'cover'
        }}
      />
      
      <div className="relative z-10 h-full flex items-center justify-between px-8 py-10">
        {teamMembers.map((member, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="relative w-18 h-18 rounded-full bg-gray-100 shadow-[6px_6px_12px_#d1d1d1,-6px_-6px_12px_#ffffff] flex items-center justify-center border border-gray-200/30">
              <span className="text-xl font-semibold text-gray-900">
                {member.name.charAt(0)}
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            </div>
            <div className="flex flex-col items-start">
              <h4 className="text-base font-medium text-gray-900">{member.name}</h4>
              <p className="text-sm text-gray-800">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});

Grid2Card.displayName = 'Grid2Card';

export default Grid2Card; 