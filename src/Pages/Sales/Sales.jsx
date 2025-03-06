import {useEffect, useState} from 'react'
import './sales.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navigation from '../../components/navbar/Navigation'
import {Link} from 'react-router-dom'
import { useMediaQuery } from '@mui/material';
import { BarChart, Bar, Cell, XAxis, YAxis,  Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import SalesCharts from '../../components/charts/SalesCharts'
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import {useSelector} from 'react-redux'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import { useGetOrdersQuery, useGetExchangeRatesQuery } from '../../state/servicesApiSlice'
import Loader from '../../components/Loader'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import AutoModeOutlinedIcon from '@mui/icons-material/AutoModeOutlined';



const colors = ['#0088FE','#00C49F','#FFBB28','#FF8042','red','pink','#00A5A7', '#FFBC42', '#3A405A', '#F64C72', '#9E6B8E', '#78A3D1', '#FF3A20', '#E36282', '#8E9AAF', '#9A1750', '#D1A5A1', '#FFAE03', '#6B5B95', '#E05A47','#FFC1A6', '#3E92CC', '#C5D86D', '#F18D9E',];
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

const Sales = () => {
    const isMediumScreen = useMediaQuery('(min-width: 576px) and (max-width: 991.98px)');
  const isSmallScreen = useMediaQuery('(max-width: 575.98px)');
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const {userInfo} = useSelector(state => state.auth)
  const { data, isLoading, refetch} = useGetOrdersQuery();
  const { data:ExchangeRateData, isLoading:Loading, refetch: updating} = useGetExchangeRatesQuery();
  const [showCustom, setShowCustom] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({});
  const shouldHideDiv = isSmallScreen || isMediumScreen;


  const ToggleMenu = () =>{
    setShowCustom(!showCustom)
  }

  useEffect(() => {
    refetch();
    updating()

    if(ExchangeRateData?.length > 0){
      const formattedExchangeRates = {
        USD: ExchangeRateData[0]?.USD || 0,
        EUR: ExchangeRateData[0]?.EUR || 0,
        Pound: ExchangeRateData[0]?.Pound || 0,
      };
      setExchangeRates(formattedExchangeRates);
    }

  }, [data, ExchangeRateData]);

  if (isLoading || !data) {
    return <Loader />;
}

  const monthlyData = data.filter(
    (item) =>{
      const isApproved = item.status === "Approved"
      const updatedAtDate = new Date(item.updatedAt);
      if(!fromDate && !toDate){
        const currentDate = new Date();

        return (
          updatedAtDate.getMonth() === currentDate.getMonth() &&
          updatedAtDate.getFullYear() === currentDate.getFullYear() &&
          isApproved
        );
      }

      if (fromDate && toDate) {
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);
        return (
          updatedAtDate >= fromDateObj &&
          updatedAtDate <= toDateObj &&
          isApproved
        );
      }

      return true;
    }
  );

  const salesAmountBySalesperson = {};

monthlyData.map(item =>{
    const name = item.createdBy.name;
    item.currency.forEach((currency, index) =>{
      const exchangeRate = exchangeRates[currency] || 1;
      const convertedAmount = item.amount[index] * exchangeRate;

      if (!salesAmountBySalesperson[name]) {
        salesAmountBySalesperson[name] = 0;
      }
      salesAmountBySalesperson[name] += convertedAmount;
      
    })
})

const salesPerformance = Object.keys(salesAmountBySalesperson).map((name) => ({
    name: name,
    salesAmount: salesAmountBySalesperson[name],
  }));

      
  return (
    <div className="sales">
        <Sidebar/>
        <div className="salesContainer">
            <Navigation/>
            <div className="salesPageDetails">
            <div className="titleContainer">
            <h4>Comprehensive Sales Performance</h4>
                <div className="links">
                    {userInfo.department === 'Sales' && <>
                    <Link to='/sales/orders/list'  className='link'><CategoryRoundedIcon/> Orders</Link>  
                    <Link to='/sales/report/dumb'  className='link'><InventoryRoundedIcon/> Sales Report</Link>
                    <Link to='/plans'  className='link'><AutoModeOutlinedIcon/> Plans</Link>
                      </>
                   }
                </div>
            </div>
             <div className="salesPerformance" style={{ width: '90%', marginTop:'20px'  }}>
                <div style={{  display:'flex', justifyContent:'space-between',fontSize:'16px', color:'#6439ff' }} className="">
                <h4 style={{fontSize:'17px'}}>Sales Performance</h4>
                <div style={{display: 'flex'}}>
                    
                <div onClick={ToggleMenu} style={{ cursor: 'pointer', padding:'10px', position:'relative' }}>
                  <span>Custom</span>
                  {showCustom ? <ArrowDropDownRoundedIcon style={{color:'#7451f8', fontSize:'35px'}}/> : <ArrowDropUpRoundedIcon style={{color:'#7451f8', fontSize:'35px'}}/> }
                  {showCustom && (
                    <ul style={{top:'100%', left:'10px',backgroundColor:'#fff',padding:'10px', zIndex:'1', width:'300px', position:'absolute'}}>
                      <li style={{ textDecoration: 'none', display:'flex' }}>
                        <span>From: <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} onClick={(e) => e.stopPropagation()} /></span>
                        <span>To: <input type="date" className="form-control"value={toDate} onChange={(e) => setToDate(e.target.value)} min={fromDate} onClick={(e) => e.stopPropagation()} /></span>
                      </li>
                    </ul>
                  )}
                  </div>
                <p style={{padding:'10px'}}>Monthly </p>
                </div>

                </div>
                <div className="" style={{ width: '100%', height: '300px', marginBottom:'30px' }}>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                width={1400}
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
                <XAxis dataKey="name" />
                <YAxis />
                <Legend/>
                <Bar dataKey="salesAmount" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
                    {salesPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                    ))}
                </Bar>
                </BarChart>
                </ResponsiveContainer>
                </div>
            </div>
            <SalesCharts data={data}/>
            </div>
        </div>
    </div>
  )
}

export default Sales