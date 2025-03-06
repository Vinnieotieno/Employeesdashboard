import {useState,useEffect} from 'react';
import { useGetOrdersQuery, useGetExchangeRatesQuery } from '../../state/servicesApiSlice';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../Loader'
import {Link} from 'react-router-dom'
import './datatable.scss'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import SummaryReport from '../documents/SummaryReport';
import DumpReports from '../documents/DumpReports';
import QuotationReports from '../documents/QuotationReports';

const getWorkingDaysInMonth = (year, month) => {
    const totalDays = new Date(year, month + 1, 0).getDate(); // Get the total number of days in the month
    let workingDays = 0;
  
    for (let day = 1; day <= totalDays; day++) {
      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
  
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Monday to Friday
        workingDays++;
      }
    }
  
    return workingDays;
  };

const DumpReportTable = () => {
    const {userInfo} = useSelector(state => state.auth)
    const { data, isLoading, refetch} = useGetOrdersQuery();
    const [exchangeRates, setExchangeRates] = useState({});
    const { data:ExchangeRateData, isLoading:Loading, refetch: updating} = useGetExchangeRatesQuery();
    const navigate = useNavigate();
    const params = useParams()

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

    const currentUserData = data.filter(item => item.createdBy._id === userInfo._id && item.amount.length !== 0);

    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const day = currentDate.getDate()

    const filteredData = currentUserData.filter(item => {
        const itemUpdatedDate = new Date(item.createdAt);
        const itemYear = itemUpdatedDate.getFullYear();
        const itemMonth = itemUpdatedDate.getMonth();
        const itemDay = itemUpdatedDate.getDate();
      
        return year === itemYear && month === itemMonth && day === itemDay;
      });

      const columns = [
        { field: "id", headerName: "ID", width: 80 },
        {field: "companyName",headerName: "Company Name",width: 130,},
        {field: "contactPerson",headerName: "Contact Person",width: 130,},
        {field: "email",headerName: "Email",width: 150,},
        {field: "mobile",headerName: "Mobile Number",width: 130,},
        {field: "engagementPurpose",headerName: "Engagement Purpose",width: 150,},
        {field: "action",headerName: "Action",width: 80,},
        {field: "service",headerName: "Service",width: 130,},
      ];
      
      const Quotationcolumns = [
        { field: "id", headerName: "ID", width: 80 },
        {field: "updatedAt",headerName: "Quote Date",width: 160,},
        {field: "companyName",headerName: "Quote Client",width: 160,},
        {field: "origin",headerName: "Country of Consignment",width: 160,},
        {field: "amount",headerName: "Quote Value",width: 160,},
        {
            field: 'status',
            headerName: 'Quote Stage',
            width: 130,
            renderCell: (params) => {
              let color = '';
              let backgroundColor = '';
        
              switch (params.value) {
                case 'Not Approved':
                  color = 'red';
                  backgroundColor = 'rgba(255, 0, 0, 0.1)';
                  break;
                case 'Pending':
                  color = 'blue';
                  backgroundColor = 'rgba(0, 0, 255, 0.1)';
                  break;
                case 'Approved':
                  color = 'green';
                  backgroundColor = 'rgba(0, 255, 0, 0.1)';
                  break;
                default:
                  break;
              }
        
              return (
                <div
                  style={{
                    color: color,
                    backgroundColor: backgroundColor,
                    textAlign: 'center',
                    padding: '5px',
                    borderRadius: '4px',
                  }}
                >
                  {params.value}
                </div>
              );
            },
          },
      ];
      const Quotationrows = currentUserData?.map((item) => {
        const equivalentAmountsInKsh = item.amount.map((amount, index) => {
          const currency = item.currency[index];
          const exchangeRate = exchangeRates[currency] || 1; 
          return (amount * exchangeRate); 
        });
      
        const sumEquivalentAmountsInKsh = equivalentAmountsInKsh.reduce((total, amount) => total + amount, 0);
      
        return {
          id: item._id,
          companyName: item.companyName,
          updatedAt: new Date(item.updatedAt).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          origin: item.origin,
          amount: new Intl.NumberFormat('en-KE', {style: 'currency',currency: 'KES'}).format(sumEquivalentAmountsInKsh), 
          status: item.status,
        };
      });
      

      const rows = filteredData?.map((item) => ({
        id: item._id,
        companyName: item.companyName,
        contactPerson: item.contactPerson,
        email: item.email,
        mobile: item.mobile,
        engagementPurpose: item.engagementPurpose,
        action: item.action,
        service: item.order,
        updatedAt: item.updatedAt,
        origin: item.origin,
        currency: item.currency,
        amount:item.amount,
        status:item.status
      }));
      
      //Group data depending on date
      const groupedData = currentUserData.reduce((groups, item) => {
        const updatedAtDate = item.updatedAt.split('T')[0]; // Extract date part
        if (!groups[updatedAtDate]) {
          groups[updatedAtDate] = [];
        }
        groups[updatedAtDate].push(item);
        return groups;
      }, {});

      let introductionCount = 0;
      let followUpCount = 0;
      let newCalls = 0;
      let totalAmountInKES = 0;
      let ApprovedSales = 0;
      let group;
      
      Object.keys(groupedData).forEach((date) => {
        group = groupedData[date];
      
        group.forEach((item) => {
          if (item.engagementPurpose === 'Introduction') {
            introductionCount++;
          } else if (item.engagementPurpose === 'Follow Up') {
            followUpCount++;
          } else if (item.engagementPurpose === 'New Account') {
            newCalls++;
          }
      
          // Iterate over currency and amount arrays
          item.currency.forEach((currency, index) => {
            const exchangeRate = exchangeRates[currency] || 1;
            const amount = item.amount[index];
            
            if (item.status === 'Approved') {
              ApprovedSales += amount * exchangeRate;
            }
            
            totalAmountInKES += amount * exchangeRate;
          });
        });
      });
    const summarycolumns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "date", headerName: "Date", width: 150 },
        {field: "newcalls",headerName: "New Calls",width: 150,},
        {field: "followups",headerName: "Follow Ups",width: 150,},
        {field: "quotes",headerName: "Quotes",width: 150,},
        {field: "quotevalue",headerName: "Quote Value",width: 150,},
        {field: "sales",headerName: "Sales",width: 150,},
        {field: "newclient",headerName: "New Client",width: 150,},
        {field: "target",headerName: "Sales Target",width: 150,},
        {field: "variance",headerName: "Variance",width: 150,},

      ];

      const summaryRows = [
        {
          id: Math.floor(Math.random() * 1000000) + Date.now(), 
          date:Object.keys(groupedData),
          newcalls: newCalls,
          followups: followUpCount,
          quotes: group.length, 
          quotevalue: new Intl.NumberFormat('en-KE', {style: 'currency',currency: 'KES'}).format(totalAmountInKES), 
          sales:new Intl.NumberFormat('en-KE', {style: 'currency',currency: 'KES'}).format(ApprovedSales) , 
          newclient: introductionCount, 
          target: new Intl.NumberFormat('en-KE', {style: 'currency',currency: 'KES'}).format(parseInt(userInfo.salesTarget, 10)/getWorkingDaysInMonth(new Date().getFullYear(),new Date().getMonth())),
          variance: new Intl.NumberFormat('en-KE', {style: 'currency',currency: 'KES'}).format(parseInt(userInfo.salesTarget, 10)/getWorkingDaysInMonth(new Date().getFullYear(),new Date().getMonth()) - ApprovedSales)
        },
      ];
      
      //Monthly data with current user hence calculating the total amount of sales done in the month
    const monthlycurrentUserData = data.filter(
      (item) =>
        item.createdBy._id === userInfo._id &&
        new Date(item.updatedAt).getMonth() === month &&
        new Date(item.updatedAt).getFullYear() === year && item.status === "Approved"
    );

      const totalAmounts = {};
      monthlycurrentUserData.forEach((item) => {
        item.currency.forEach((currency, index) => {
          const exchangeRate = exchangeRates[currency] || 1; // Default to 1 if currency not found
          const convertedAmount = item.amount[index] * exchangeRate;
      
          if (!totalAmounts[currency]) {
            totalAmounts[currency] = 0;
          }
          totalAmounts[currency] += convertedAmount;
        });
});

// Calculate the overall total amount for the current month in KES
let overallTotalAmountInKES = 0;

Object.keys(totalAmounts).forEach((currency) => {
  overallTotalAmountInKES += totalAmounts[currency];
});

let percentagePerformance = (overallTotalAmountInKES/(parseInt(userInfo.salesTarget, 10) ))*100
if(percentagePerformance === NaN){
    percentagePerformance = 0
}else{
    percentagePerformance = percentagePerformance
}



  return (
    <div className='dumbsalesreport'>
        <div className="titleContainer">
        {params.report === 'dumb' ? <h4>Daily Dump Activities Report</h4> : null}
        {params.report === 'quotation' ? <h4>Quotation  Report</h4> : null}
        {params.report === 'summary' ? <h4>Sales Report Summary</h4> : null}
                <div className="links">
                <Link to='/sales/report/dumb'  className='link'><LocalActivityIcon/> Dump Report</Link>
                <Link to='/sales/report/quotation'  className='link'><CategoryRoundedIcon/> Quotation Report</Link>
                <Link to='/sales/report/summary'  className='link'><TrendingUpRoundedIcon/> Summary Report</Link>
                <Link to='/predictions'  className='link'><PsychologyOutlinedIcon/> Prediction</Link>
                </div>
                </div>
        {params.report === 'dumb' ? (<>{filteredData?.length === 0 ? (<>
            <h4 style={{color:'#6439ff', fontSize:'22px', fontWeight:'800'}} className="text-center">{`You haven't made any dump activities Today!, ${userInfo.name}`}</h4>
        </>):(<div className="">
      <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
      <span style={{float:'right'}} className="mx-5"> <DumpReports data={filteredData} documentName={'Dump'} /></span>
    </div>
    </div>)}</>) : (null)}
    {params.report === 'quotation' ?(
    <div className="">
    <div style={{ height: 400, width: '100%' }}>
    <DataGrid rows={Quotationrows} columns={Quotationcolumns} pageSize={5} />
    <span style={{float:'right'}} className="mx-5"> <QuotationReports data={Quotationrows} documentName={'Quotations'} /></span>
    
  </div>
  </div>
    ) : null}
    {params.report === 'summary' ?(
    <div className="">
        <div style={{display:"flex", justifyContent:'space-between'}}>
            <h4 style={{color:'#6439ff', fontSize:'19px', padding:'10px'}}>Daily Summary</h4>
        <h4 style={{color:'#6439ff', fontSize:'19px', padding:'10px'}}>Number of Working Days this month: {getWorkingDaysInMonth(new Date().getFullYear(),new Date().getMonth())} </h4>
        </div>
    <div style={{ height: 400, width: '100%' }}>
    <DataGrid rows={summaryRows} columns={summarycolumns} pageSize={5} />
    <span style={{float:'right'}} className="m-5 "> <SummaryReport data={summaryRows} documentName={'summary'} /></span>
    <div style={{display:"flex", justifyContent:'center',margin:'20px', alignItems:'center'}}>
            <div className="">
            <h4 style={{color:'#6439ff', fontSize:'22px', padding:'10px', fontWeight:'800'}}>Monthly Summary</h4>
                <h4 style={{color:'#6439ff', fontSize:'19px', }}><b>Monthly Target:</b>{new Intl.NumberFormat('en-KE', {style: 'currency',currency: 'KES'}).format(userInfo.salesTarget)}</h4>
                <h4 style={{color:'#6439ff', fontSize:'19px', }}><b>Monthly Actual:</b>{new Intl.NumberFormat('en-KE', {style: 'currency',currency: 'KES'}).format(overallTotalAmountInKES)}</h4>
                <h4 style={{color:'#6439ff', fontSize:'19px', }}><b>Variance:</b>{new Intl.NumberFormat('en-KE', {style: 'currency',currency: 'KES'}).format(overallTotalAmountInKES - userInfo.salesTarget)}</h4>
                <h4 style={{color:'#6439ff', fontSize:'19px', }}><b>% Performance:</b> {percentagePerformance.toFixed(2)}%</h4>
            </div>
        </div>
  </div>
  </div>
    ) : null}
    </div>
  )
}

export default DumpReportTable