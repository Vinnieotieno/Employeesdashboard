import {useEffect, useMemo} from 'react';
import './stats.scss'
import { useGetProductsQuery, useGetKpisQuery } from '../../state/productsApiSlice'
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { AreaChart, BarChart, Bar, Area, XAxis, YAxis,ZAxis, CartesianGrid,PieChart,Pie,Cell,ScatterChart,Scatter, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetOrdersQuery} from '../../state/servicesApiSlice'
import Loader from '../../components/Loader'

const Row2 = () => {
  const { data: operationalData } = useGetKpisQuery();
  const { data: productData } = useGetProductsQuery();
  const pieColors = ['aqua', 'rgba(127, 255, 212, 0.553)'];

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
  
  // Calculate total revenue and expenses for each month
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
      profit,
      totalOperationalExpense,
      totalNonOperationalExpense
    };
  });
  

  const pieData = [
    { name: "Campaigns", value: 600 },
    { name: "Target", value: 400 },
  ];

  return (
    <div className='row2'>
        <div className="left">
        <div className="flexContainer">
          <div className="floatleft">
            <div className="title">Operational and Non-Operational Expenses</div>
            <div className="text">Operational and Non-Operational expenses </div>
          </div>
          <div className="floatright">
            <div className="percentage positive"><KeyboardArrowUpIcon /> 4%</div>
          </div>
        </div>
      <ResponsiveContainer width="100%" height="100%" aspect={3/2}>
          <AreaChart
            width={500}
            height={400}
            data={monthlySummary}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
            <linearGradient id="Operational" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="blue" stopOpacity={0.8} />
              <stop offset="95%" stopColor="blue" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="NonOperational" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="green" stopOpacity={0.8} />
              <stop offset="95%" stopColor="green" stopOpacity={0} />
            </linearGradient>
          </defs>
            <XAxis dataKey="name" tickCount={12} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="totalOperationalExpense" stroke='blue' fill="url(#Operational)" />
            <Area type="monotone" dataKey="totalNonOperationalExpense" stroke='green' fill="url(#NonOperational)" />
          </AreaChart>
        </ResponsiveContainer>
        </div>
        <div className="center">
        <div className="flexContainer">
          <div className="floatleft">
            <div className="title">Expense Month By Month</div>
            <div className="text">Expense incurred each Month </div>
          </div>
          <div className="floatright">
            <div className="percentage positive"><KeyboardArrowUpIcon /> 4%</div>
          </div>
        </div>
      <ResponsiveContainer width="100%" height="100%" aspect={3/2}>
      <BarChart
        width={500}
        height={300}
        data={monthlySummary}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <defs>
            <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="aqua" stopOpacity={0.8} />
              <stop offset="95%" stopColor="aqua" stopOpacity={0} />
            </linearGradient>
          </defs>
        <XAxis dataKey="monthName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalExpenses" fill="url(#revenue)" />
      </BarChart>
    </ResponsiveContainer>
        </div>
        <div className="right">
        <div className="flexContainer">
          <div className="floatleft">
            <div className="title">Profit Month By Month</div>
            <div className="text">Profit gained each Month </div>
          </div>
          <div className="floatright">
            <div className="percentage positive"><KeyboardArrowUpIcon /> 4%</div>
          </div>
        </div>
      <ResponsiveContainer width="100%" height="100%" aspect={3/2}>
      <BarChart
        width={500}
        height={300}
        data={monthlySummary}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <defs>
            <linearGradient id="revenue2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#293855" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#293855" stopOpacity={0} />
            </linearGradient>
          </defs>
        <XAxis dataKey="monthName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="profit" fill="url(#revenue2)" />
      </BarChart>
    </ResponsiveContainer>
        </div>
    </div>
  )
}

export default Row2