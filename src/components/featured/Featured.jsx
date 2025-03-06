import {useEffect, useState}from 'react'
import './featured.scss'
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import  {useGetOrdersQuery, useGetExchangeRatesQuery} from '../../state/servicesApiSlice'

const Featured = () => {
    const {data, isLoading, refetch} = useGetOrdersQuery()
    const [dailyRevenue, setDailyRevenue] = useState(0)
    const [weeklyRevenue, setWeeklyRevenue] = useState(0)
    const [monthlyRevenue, setMonthlyRevenue] = useState(0)
    const [exchangeRates, setExchangeRates] = useState({});
    const { data:ExchangeRateData, isLoading:Loading, refetch: updating} = useGetExchangeRatesQuery();
    
    useEffect(() =>{
        refetch()
        if(!isLoading && data){
            const CurrentDate = new Date();
            const oneDay = 24 * 60 * 1000;
            const oneWeek = oneDay * 7;
            const oneMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() * oneDay

            const revenueData = data.map(order =>({
                revenue: order.revenue,
                createdAt: new Date(order.updatedAt)
            }));

            const filteredRevenueData = revenueData.filter(order => typeof order.revenue === 'number');

            const todayRevenue = filteredRevenueData
            .filter(order => isSameDay(order.createdAt, CurrentDate))
            .reduce((sum, order) => sum + order.revenue, 0);

            const weekRevenue = filteredRevenueData
            .filter(order => isSameWeek(order.createdAt, CurrentDate))
            .reduce((sum, order) => sum + order.revenue, 0);

            const monthRevenue = filteredRevenueData
            .filter(order => isSameMonth(order.createdAt, CurrentDate))
            .reduce((sum, order) => sum + order.revenue, 0);

            function isSameDay(date1, date2) {
            return (
                date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate()
            );
            }

            function isSameWeek(date1, date2) {
                const oneDayInMillis = 24 * 60 * 60 * 1000;
                const oneWeekInMillis = oneDayInMillis * 7;
                
                const startOfWeekDate1 = new Date(date1);
                startOfWeekDate1.setDate(date1.getDate() - date1.getDay());
              
                const startOfWeekDate2 = new Date(date2);
                startOfWeekDate2.setDate(date2.getDate() - date2.getDay());
              
                return Math.abs(startOfWeekDate1 - startOfWeekDate2) <= oneWeekInMillis;
              }
            function isSameMonth(date1, date2) {
            return (
                date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth()
            );
            }

            setDailyRevenue(todayRevenue);
            setWeeklyRevenue(weekRevenue);
            setMonthlyRevenue(monthRevenue);


            
        }
        if(ExchangeRateData?.length > 0){
            const formattedExchangeRates = {
              USD: ExchangeRateData[0]?.USD || 0,
              EUR: ExchangeRateData[0]?.EUR || 0,
              Pound: ExchangeRateData[0]?.Pound || 0,
            };
            setExchangeRates(formattedExchangeRates);
          }
    }, [isLoading, data, ExchangeRateData])


    let ApprovedSales = 0;
    data?.filter(item => {
        item.amount.map((amount, index)=> {
                const currency = item.currency[index];
                const exchangeRate = exchangeRates[currency] || 1;
                if (item.status === 'Approved' && `${new Date(item.updatedAt).getDate()}/${new Date(item.updatedAt).getMonth()}/${new Date(item.updatedAt).getFullYear()}` === `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`) {
                    ApprovedSales += amount * exchangeRate;
                } 
            })
    });

  return (
    <div className='featured'>
        <div className="top">
            <h1>Total Revenue</h1>
            <MoreVertIcon fontSize='small'/>
        </div>
        <div className="bottom">
            <div className="featuredChart">
                <CircularProgressbar value={70} text='70%' strokeWidth={5}/>
            </div>
            <p className="title">Total Sales made today</p>
            <p className="amount">{new Intl.NumberFormat('en-KE', {style: 'currency',currency: 'KES'}).format(ApprovedSales)}</p>
            <p className="desc">Generated Revenue Over Time</p>
            <div className="summary">
                <div className="item">
                    <div className="itemTitle">Today</div>
                    <div className="itemResult positive">
                        <KeyboardArrowUpOutlinedIcon fontSize='small' />
                        <div className="resultAmount">{new Intl.NumberFormat('en-KE', {style: 'currency',currency: 'KES'}).format(dailyRevenue)}</div>
                    </div>
                </div>
                <div className="item">
                    <div className="itemTitle">This Week</div>
                    <div className="itemResult negative">
                        <KeyboardArrowDownIcon fontSize='small' />
                        <div className="resultAmount">{new Intl.NumberFormat('en-KE', {style: 'currency',currency: 'KES'}).format(weeklyRevenue)}</div>
                    </div>
                </div>
                <div className="item">
                    <div className="itemTitle">This Month</div>
                    <div className="itemResult positive">
                        <KeyboardArrowUpOutlinedIcon fontSize='small' />
                        <div className="resultAmount">{new Intl.NumberFormat('en-KE', {style: 'currency',currency: 'KES'}).format(monthlyRevenue)}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Featured