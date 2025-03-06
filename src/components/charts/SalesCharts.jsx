import {useEffect, useState} from 'react'
import './salesChart.scss'
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, CartesianGrid } from 'recharts';
import { useGetExchangeRatesQuery } from '../../state/servicesApiSlice';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';

const servicesInventory = [{name: 'Air Freight',ServiceRendered: 2000, WorkOrder: 1200, amount: 1200, },
    {name: 'Sea Freight',ServiceRendered: 1500,WorkOrder: 699,amount: 1105,},
    {name: 'Consolidation',ServiceRendered: 1000,WorkOrder: 4900,amount: 1145,},
    {name: 'Custom Brokerage',ServiceRendered: 1390,WorkOrder: 1954,amount: 1000,},
    {name: 'Warehousing',ServiceRendered: 945,WorkOrder: 2400,amount: 1090,},
    {name: 'Distribution and Regional Transport',ServiceRendered: 1195,WorkOrder: 1900,amount: 1250,},
    {name: 'E-commerce',ServiceRendered: 1595,WorkOrder: 2520,amount: 1660,},];


const colors = ['#0088FE','#00C49F','#FFBB28','#FF8042','red','pink','#FF3E4D','#00A5A7', '#FFBC42', '#3A405A', '#F64C72', '#9E6B8E', '#78A3D1', '#FF3A20', '#E36282', '#8E9AAF', '#9A1750', '#D1A5A1', '#FFAE03', '#6B5B95', '#E05A47','#FFC1A6', '#3E92CC', '#C5D86D', '#F18D9E',];

const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
    Z`;
  };
const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

const SalesCharts = ({data}) => {
  const { data:ExchangeRateData, isLoading:Loading, refetch: updating} = useGetExchangeRatesQuery();
  const [fromSalesDate, setFromSalesDate] = useState('')
  const [toSalesDate, setToSalesDate] = useState('')
  const [exchangeRates, setExchangeRates] = useState({});
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    updating()

    if(ExchangeRateData?.length > 0){
      const formattedExchangeRates = {
        USD: ExchangeRateData[0]?.USD || 0,
        EUR: ExchangeRateData[0]?.EUR || 0,
        Pound: ExchangeRateData[0]?.Pound || 0,
      };
      setExchangeRates(formattedExchangeRates);
    }

  }, [ExchangeRateData]);

  const ToggleMenu = () =>{
    setShowCustom(!showCustom)
  }

  const SalesData = data.filter((item =>{
    const isApproved = item.status === "Approved"
    const updatedAtDate = new Date(item.updatedAt);

    if(!fromSalesDate && !toSalesDate){
      return(isApproved)
    }

    if(fromSalesDate && toSalesDate){
      const fromDateObj = new Date(fromSalesDate);
        const toDateObj = new Date(toSalesDate);

        return (
          updatedAtDate >= fromDateObj &&
          updatedAtDate <= toDateObj &&
          isApproved
        );
    }
    return true;
  }))

  const salesAmountByCountry = {}
  SalesData.map(item =>{
    const country = item.origin;
    item.currency.forEach((currency, index) =>{
      const exchangeRate = exchangeRates[currency] || 1;
      const convertedAmount = item.amount[index] * exchangeRate;
      if(!salesAmountByCountry[country]){
        salesAmountByCountry[country] = 0
      }
      salesAmountByCountry[country] +=convertedAmount
    })
    

  })

  const salesPerformance = Object.keys(salesAmountByCountry).map((country) =>({
    country: country,
    salesAmount: salesAmountByCountry[country]
  }))
  return (
   <div className="salesCharts">
    <div  className="chartsContainer">
        <div className="inventory">
            <h4><InventoryRoundedIcon/> Inventory Stock ~ <i>Services</i> </h4>
            <p>Efficiently handle and monitor inventory levels in the warehouse to ensure smooth service delivery and timely stock replenishment</p>
            <div className="" style={{ width: '90%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
            data={servicesInventory}
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
            <Bar dataKey="WorkOrder" stackId="a" fill="green" />
            <Bar dataKey="ServiceRendered" stackId="a" fill="orange" />
            </BarChart>
            </ResponsiveContainer>
            </div>
        </div>
        <div className="citySales">

            <h4><TrendingUpRoundedIcon/> Ranking Per Country </h4>
            <div className="d-flex">
            <div onClick={ToggleMenu} style={{ cursor: 'pointer', padding:'10px', position:'relative' }}>
                  <span>Custom</span>
                  {showCustom ? <ArrowDropDownRoundedIcon style={{color:'#7451f8', fontSize:'35px'}}/> : <ArrowDropUpRoundedIcon style={{color:'#7451f8', fontSize:'35px'}}/> }
                  {showCustom && (
                    <ul style={{top:'100%', left:'10px',backgroundColor:'#fff',padding:'10px', zIndex:'1', width:'280px', position:'absolute'}}>
                      <li style={{ textDecoration: 'none', display:'flex' }}>
                        <span>From: <input type="date" className="form-control" value={fromSalesDate} onChange={(e) => setFromSalesDate(e.target.value)} onClick={(e) => e.stopPropagation()} /></span>
                        <span>To: <input type="date" className="form-control"value={toSalesDate} onChange={(e) => setToSalesDate(e.target.value)} min={fromSalesDate} onClick={(e) => e.stopPropagation()} /></span>
                      </li>
                    </ul>
                  )}
                  </div>
            <p>Discover thriving service markets with high demand and lucrative opportunities for exploration. </p>
            </div>
            <div className="" style={{ width: '90%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
            width={700}
            height={300}
            data={salesPerformance}
            margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country" />
            <YAxis />
            <Bar dataKey="salesAmount" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
            {salesPerformance.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % 20]} />
            ))}
            </Bar>
            </BarChart>
            </ResponsiveContainer>
            </div>
        </div>
    </div>
   </div>
  )
}

export default SalesCharts