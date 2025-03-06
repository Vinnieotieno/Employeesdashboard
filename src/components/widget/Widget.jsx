import {useEffect, useState} from 'react'
import './widget.scss'
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import { useGetUsersQuery, useGetDriversQuery } from '../../state/usersApiSlice';
import { useGetOrdersQuery, useGetExchangeRatesQuery} from '../../state/servicesApiSlice';
import Loader from '../Loader';
import { Link } from 'react-router-dom';

const Widget = ({type}) => {
  const {data:users, isLoading, refetch} = useGetUsersQuery()
  const {data:drivers} = useGetDriversQuery()
  const {data:orders, isLoading:loadingOrders, refetch:lookagain} = useGetOrdersQuery()
  const [exchangeRates, setExchangeRates] = useState({});
  const { data:ExchangeRateData, isLoading:Loading, refetch: updating} = useGetExchangeRatesQuery();

 

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
  }, [users, ExchangeRateData, orders]);

  if (isLoading || !users || !orders || loadingOrders) {
    return <Loader/>;
  }
  var TotalOrders =  orders?.filter(item => item.amount.length !== 0);
  let ApprovedSales = 0; 


  orders?.filter(item => {
    if(item?.amount){
        item?.amount.map((amount, index)=> {
        const currency = item?.currency[index];
        const exchangeRate = exchangeRates[currency] || 1;
        if (item.status === 'Approved') {
          ApprovedSales += amount * exchangeRate;
        } 
      })
    }
  });

 
    
  



  //temporary
  const diff  = 20;
  let data;
  switch(type){
    case 'user':
      data={
        title:"USERS",
        isMoney:false,
        amount : users?.length,
        link:<Link to="/users/all" style={{textDecoration:'none', color:'black'}}>See all Users</Link>,
        icon:(
          <PersonOutlinedIcon className='icon'
          style={{
            backgroundColor: "rgba(218, 165, 32, 0.2)",
            color: "goldenrod",
          }} />
        )
      }
      break;
      case 'driver':
      data={
        title:"Drivers",
        isMoney:false,
        amount : drivers?.length,
        link:<Link to="/users/drivers" style={{textDecoration:'none', color:'black'}}>See all Drivers</Link>,
        icon:(
          <PersonOutlinedIcon className='icon'
          style={{
            backgroundColor: "rgba(218, 165, 32, 0.2)",
            color: "goldenrod",
          }} />
        )
      }
      break;
      case 'order':
      data={
        title:"ORDERS",
        isMoney:false,
        link:<Link to="/sales/orders/list" style={{textDecoration:'none', color:'black'}}>View all Orders</Link>,
        amount : TotalOrders.length,
        icon:(
          <ShoppingCartOutlinedIcon className='icon' 
          style={{
            color: "crimson",
            backgroundColor: "rgba(255, 0, 0, 0.2)",
          }} />
        )
      }
      break;

      case 'earnings':
      data={
        title:"EARNINGS",
        isMoney:true,
        amount : new Intl.NumberFormat('en-KE', {style: 'currency',currency: 'KES'}).format(ApprovedSales),
        link:'View net earnings',
        icon:(
          <MonetizationOnOutlinedIcon className='icon'
          style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }} />
        )
      }
      break;
      case 'balance':
      data={
        title:"BALANCE",
        isMoney:true,
        amount : users?.length,
        link:'See details',
        icon:(
          <AccountBalanceWalletOutlinedIcon className='icon'
          style={{
            backgroundColor: "rgba(128, 0, 128, 0.2)",
            color: "purple",
          }} />
        )
      }
      break;

      case 'sales':
        data={
          title:"SALES REVENUE",
          isMoney:true,
          link:'See details',
          amount : users?.length,
          icon:(
            <AccountBalanceWalletOutlinedIcon className='icon'
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }} />
          )
        }
      break;
      case 'delivery':
        data={
          title:"ORDERS DELIVERED",
          isMoney:false,
          link:'See details',
          amount : users?.length,
          icon:(
            <LocalShippingRoundedIcon className='icon' 
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }} />
          )
        }
      break;

      default:
        break;
  }
  return (
    <div  className='widget'>
        <div className="left">
          <div className="title">{data?.title}</div>
          <div className="counter">{data?.amount}</div>
          <div className="link">{data?.link}</div>
        </div>
        <div className="right">
          <div className="percentage positive"><KeyboardArrowUpIcon /> {diff}%</div>
          {data?.icon}
        </div>
    </div>
  )
}

export default Widget