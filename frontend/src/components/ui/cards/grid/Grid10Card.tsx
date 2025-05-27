import { forwardRef, useMemo } from 'react';
import Card from '../Card';
import { LineChart, Users, UserPlus } from 'lucide-react';
import { useTimeRange } from "@/context/TimeRangeContext"

// Real data from x-metrics.csv (views = impressions, followers)
const rawXMetricsData = [
  { date: "2025-04-01", impressions: 1551, followers: 5 },
  { date: "2025-04-02", impressions: 800, followers: 3 },
  { date: "2025-04-03", impressions: 7187, followers: 2 },
  { date: "2025-04-04", impressions: 4660, followers: 13 },
  { date: "2025-04-05", impressions: 1537, followers: 2 },
  { date: "2025-04-06", impressions: 921, followers: 1 },
  { date: "2025-04-07", impressions: 2713, followers: 5 },
  { date: "2025-04-08", impressions: 2069, followers: 2 },
  { date: "2025-04-09", impressions: 1305, followers: 4 },
  { date: "2025-04-10", impressions: 2965, followers: 11 },
  { date: "2025-04-11", impressions: 2496, followers: 5 },
  { date: "2025-04-12", impressions: 1532, followers: 4 },
  { date: "2025-04-13", impressions: 706, followers: 4 },
  { date: "2025-04-14", impressions: 2373, followers: 3 },
  { date: "2025-04-15", impressions: 2444, followers: 6 },
  { date: "2025-04-16", impressions: 2755, followers: 11 },
  { date: "2025-04-17", impressions: 1382, followers: 18 },
  { date: "2025-04-18", impressions: 1185, followers: 14 },
  { date: "2025-04-19", impressions: 464, followers: 15 },
  { date: "2025-04-20", impressions: 501, followers: 123 },
  { date: "2025-04-21", impressions: 613, followers: 42 },
  { date: "2025-04-22", impressions: 1603, followers: 35 },
  { date: "2025-04-23", impressions: 1943, followers: 123 },
  { date: "2025-04-24", impressions: 159936, followers: 3125 },
  { date: "2025-04-25", impressions: 572635, followers: 47211 },
  { date: "2025-04-26", impressions: 113301, followers: 4527 },
  { date: "2025-04-27", impressions: 53464, followers: 2262 },
  { date: "2025-04-28", impressions: 58384, followers: 2812 },
  { date: "2025-04-29", impressions: 81353, followers: 5074 },
  { date: "2025-04-30", impressions: 52758, followers: 2318 },
  { date: "2025-05-01", impressions: 32653, followers: 1288 },
  { date: "2025-05-02", impressions: 27049, followers: 942 },
  { date: "2025-05-03", impressions: 20106, followers: 899 },
  { date: "2025-05-04", impressions: 14418, followers: 801 },
  { date: "2025-05-05", impressions: 17177, followers: 704 },
  { date: "2025-05-06", impressions: 20664, followers: 1039 },
  { date: "2025-05-07", impressions: 19487, followers: 837 },
  { date: "2025-05-08", impressions: 16220, followers: 623 },
  { date: "2025-05-09", impressions: 12754, followers: 448 },
  { date: "2025-05-10", impressions: 10743, followers: 593 },
  { date: "2025-05-11", impressions: 9445, followers: 572 },
  { date: "2025-05-12", impressions: 9546, followers: 223 },
  { date: "2025-05-13", impressions: 15054, followers: 280 },
  { date: "2025-05-14", impressions: 15177, followers: 545 },
  { date: "2025-05-15", impressions: 12324, followers: 284 },
  { date: "2025-05-16", impressions: 18197, followers: 266 },
  { date: "2025-05-17", impressions: 15024, followers: 178 },
  { date: "2025-05-18", impressions: 8525, followers: 137 },
  { date: "2025-05-19", impressions: 13894, followers: 339 },
  { date: "2025-05-20", impressions: 10174, followers: 89 },
  { date: "2025-05-21", impressions: 15956, followers: 106 },
  { date: "2025-05-22", impressions: 17691, followers: 99 },
  { date: "2025-05-23", impressions: 10239, followers: 145 },
  { date: "2025-05-24", impressions: 5796, followers: 210 },
  { date: "2025-05-25", impressions: 7416, followers: 320 },
  { date: "2025-05-26", impressions: 2373, followers: 91 }
]

// Real data from member-growth.csv
const rawDiscordMemberData = [
  { date: "2025-04-01", members: 6886 },
  { date: "2025-04-02", members: 6880 },
  { date: "2025-04-03", members: 6872 },
  { date: "2025-04-04", members: 6867 },
  { date: "2025-04-05", members: 6864 },
  { date: "2025-04-06", members: 6861 },
  { date: "2025-04-07", members: 6861 },
  { date: "2025-04-08", members: 6859 },
  { date: "2025-04-09", members: 6855 },
  { date: "2025-04-10", members: 6855 },
  { date: "2025-04-11", members: 6856 },
  { date: "2025-04-12", members: 6861 },
  { date: "2025-04-13", members: 6860 },
  { date: "2025-04-14", members: 6853 },
  { date: "2025-04-15", members: 6861 },
  { date: "2025-04-16", members: 6920 },
  { date: "2025-04-17", members: 6916 },
  { date: "2025-04-18", members: 6902 },
  { date: "2025-04-19", members: 6916 },
  { date: "2025-04-20", members: 7026 },
  { date: "2025-04-21", members: 7049 },
  { date: "2025-04-22", members: 7072 },
  { date: "2025-04-23", members: 7152 },
  { date: "2025-04-24", members: 10124 },
  { date: "2025-04-25", members: 54117 },
  { date: "2025-04-26", members: 56282 },
  { date: "2025-04-27", members: 57059 },
  { date: "2025-04-28", members: 60305 },
  { date: "2025-04-29", members: 70411 },
  { date: "2025-04-30", members: 76619 },
  { date: "2025-05-01", members: 79047 },
  { date: "2025-05-02", members: 80571 },
  { date: "2025-05-03", members: 82454 },
  { date: "2025-05-04", members: 84263 },
  { date: "2025-05-05", members: 87197 },
  { date: "2025-05-06", members: 90134 },
  { date: "2025-05-07", members: 91897 },
  { date: "2025-05-08", members: 92696 },
  { date: "2025-05-09", members: 93411 },
  { date: "2025-05-10", members: 93890 },
  { date: "2025-05-11", members: 94261 },
  { date: "2025-05-12", members: 94769 },
  { date: "2025-05-13", members: 95060 },
  { date: "2025-05-14", members: 95615 },
  { date: "2025-05-15", members: 96161 },
  { date: "2025-05-16", members: 96371 },
  { date: "2025-05-17", members: 96814 },
  { date: "2025-05-18", members: 97131 },
  { date: "2025-05-19", members: 97595 },
  { date: "2025-05-20", members: 97933 },
  { date: "2025-05-21", members: 99140 },
  { date: "2025-05-22", members: 99179 },
  { date: "2025-05-23", members: 99344 },
  { date: "2025-05-24", members: 99665 },
  { date: "2025-05-25", members: 99936 },
  { date: "2025-05-26", members: 100108 },
  { date: "2025-05-27", members: 100306 }
]

const Grid10Card = forwardRef<HTMLDivElement>((props, ref) => {
  const { timeRange } = useTimeRange()

  const metrics = useMemo(() => {
    let xData;
    
    switch (timeRange) {
      case "daily":
        // Last 7 days
        xData = rawXMetricsData.slice(-7);
        break;
      case "weekly":
        // Last 4 weeks (sample every 7 days)
        xData = rawXMetricsData.filter((_, index) => index % 7 === 0).slice(-4);
        break;
      case "monthly":
        // Last 2 months (sample every 15 days)
        xData = rawXMetricsData.filter((_, index) => index % 15 === 0).slice(-2);
        break;
      default:
        xData = rawXMetricsData.slice(-7);
    }

    // Calculate X Impressions (sum for the period)
    const totalImpressions = xData.reduce((sum, day) => sum + day.impressions, 0);
    
    // Get X Total Followers (static value)
    const totalFollowers = 163200;
    
    // Get Discord Total Members (latest value - cumulative)
    const totalDiscordMembers = rawDiscordMemberData[rawDiscordMemberData.length - 1].members;

    return {
      impressions: totalImpressions,
      followers: totalFollowers,
      discordMembers: totalDiscordMembers
    };
  }, [timeRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getImpressionsLabel = () => {
    switch (timeRange) {
      case "daily": return "X Daily\nImpressions";
      case "weekly": return "X Weekly\nImpressions";
      case "monthly": return "X Monthly\nImpressions";
      default: return "X Weekly\nImpressions";
    }
  };

  return (
    <Card
      ref={ref}
      className="col-start-4 row-start-5 transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1]"
    >
      <div className="h-full flex items-center justify-center p-4">
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="flex flex-col items-center text-center">
            <div className="mb-1 text-gray-800">
              <LineChart size={20} />
            </div>
            <div className="text-lg font-bold text-gray-900">{formatNumber(metrics.impressions)}</div>
            <div className="text-xs text-gray-700 leading-tight">{getImpressionsLabel()}</div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-1 text-gray-800">
              <Users size={20} />
            </div>
            <div className="text-lg font-bold text-gray-900">{formatNumber(metrics.followers)}</div>
            <div className="text-xs text-gray-700 leading-tight">X Total<br />Followers</div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-1 text-gray-800">
              <UserPlus size={20} />
            </div>
            <div className="text-lg font-bold text-gray-900">{formatNumber(metrics.discordMembers)}</div>
            <div className="text-xs text-gray-700 leading-tight">Discord Total<br />Members</div>
          </div>
        </div>
      </div>
    </Card>
  );
});

Grid10Card.displayName = 'Grid10Card';

export default Grid10Card; 