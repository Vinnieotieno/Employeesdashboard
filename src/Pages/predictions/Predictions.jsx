import React, { useMemo, useState, useEffect } from 'react';
import './predictions.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navigation';
import { useGetKpisQuery } from '../../state/productsApiSlice';
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import regression from 'regression';
import { useGetOrdersQuery} from '../../state/servicesApiSlice'
import Loader from '../../components/Loader'

const Predictions = () => {
  const [isPredictions, setIsPredictions] = useState(false);
  const { data: kpiData } = useGetKpisQuery();

  const {data, isLoading, refetch} = useGetOrdersQuery()

  useEffect(() =>{
    refetch()

  },[data])

  const formattedData = useMemo(() => {
    if (!kpiData) return [];
    const monthData = kpiData[0].monthlyData;
  
    const formatted = monthData.map(({ revenue }, i) => {
      return [i, revenue];
    });
    const regressionLine = regression.linear(formatted);
  
    return monthData.map(({ month, revenue }, i) => {
      return {
        name: month,
        'Actual Revenue': revenue,
        'Predicted Revenue': isPredictions ? regressionLine.predict(i + 12)[1] : null,
      };
    });
  }, [kpiData, isPredictions]);
  
  console.log(formattedData);


 

  

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
      profit
    };
  });

  const formattedRegressionData = monthlySummary.map((dataPoint, i) => {
    return [i, dataPoint.totalRevenue];
  });

  const regressionResult = regression.linear(formattedRegressionData);
const regressionLine = regressionResult.points;

const formattedDataWithRegression = monthlySummary.map((dataPoint, i) => {
  const predictedRevenue = regressionLine[i] ? regressionLine[i][1] : null;
  return {
    ...dataPoint,
    'Predicted Revenue': predictedRevenue,
  };
});

console.log(formattedDataWithRegression)

  return (
    <div className="predictions">
      <Sidebar />
      <div className="predictionsContainer">
        <Navbar />
        <div className="box">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="">
              <h5>Revenue and Predictions</h5>
              <h6>Charted revenue and Predicted revenue based on simple linear Regression model</h6>
            </div>
            <button
              onClick={() => setIsPredictions(!isPredictions)}
              style={{
                color: '#6439ff',
                background: '',
                boxShadow: '0.1rem 0.1rem 0.1rem 0.1rem gray',
                border: 'none',
                borderRadius: '10px',
              }}
            >
              {isPredictions ? 'Hide Predicted Revenue' : 'Show Predicted Revenue for Next Year'}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={formattedDataWithRegression}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
              {isPredictions && (
                <Line type="monotone" dataKey="Predicted Revenue" stroke="aqua"/>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
