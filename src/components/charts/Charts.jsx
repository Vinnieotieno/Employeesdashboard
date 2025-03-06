import {useEffect} from 'react';
import Loader from '../Loader';
import './charts.scss';
import { useGetOrdersQuery } from '../../state/servicesApiSlice';
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: "January", Total: 2200 },
  { name: "February", Total: 2100 },
  { name: "March", Total: 1500 },
  { name: "April", Total: 3000 },
  { name: "May", Total: 2000 },
  { name: "June", Total: 1900 },
  { name: "July", Total: 2200 },
  { name: "August", Total: 2100 },
  { name: "September", Total: 1500 },
  { name: "October", Total: 3000 },
  { name: "November", Total: 2000 },
  { name: "December", Total: 1900 },
];

const Charts = ({ aspect, title }) => {
  const {data, isLoading, refetch} = useGetOrdersQuery()

  useEffect(() =>{
    refetch()

  },[data])

  if(isLoading  || !data){
    return <Loader/>
  }

  if (!data.length) {

    return <div>No data available</div>;
  }

  const groupedData = data?.reduce((groups, entry) => {
    const createdAt = new Date(entry.createdAt);
    const year = createdAt.getFullYear();
    const month = createdAt.getMonth();
  
    const key = `${year}-${month}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(entry);
  
    return groups;
  }, {});

  const monthlySummary = Object?.keys(groupedData)?.map(key => {
    const entries = groupedData[key];
    const monthName = new Date(entries[0].createdAt).toLocaleString('default', { month: 'long' });
  
    const totalRevenue = entries.reduce((sum, entry) => sum + (entry.revenue || 0), 0);
    const totalOperationalExpense = entries.reduce((sum, entry) => sum + (entry.operationalExpense || 0), 0);
    const totalNonOperationalExpense = entries.reduce((sum, entry) => sum + (entry.nonOperationalExpense || 0), 0);
    const totalExpenses = totalOperationalExpense + totalNonOperationalExpense;
  
    const profit = totalRevenue - totalExpenses;
  
    return {
      monthName,
      totalRevenue,
      totalExpenses,
      profit
    };
  });
  return (
    <div className='chart'>
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%"  aspect={aspect}>
        <AreaChart
          data={monthlySummary}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="monthName" stroke="green" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="totalRevenue"
            stroke="#888"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
