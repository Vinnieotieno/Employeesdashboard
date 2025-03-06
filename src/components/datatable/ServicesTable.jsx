import {useEffect} from 'react';
import { useGetOrdersQuery } from '../../state/servicesApiSlice';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader'
import { useParams } from 'react-router-dom';
import Orders from '../documents/Orders';

const ServicesTable = () => {
  const { data, isLoading, refetch} = useGetOrdersQuery();
  const navigate = useNavigate();
  const params = useParams()
  

  useEffect(() => {
    refetch();
  }, [data]);
  
  let columns = [
    {field: "createdBy",headerName: "Created By",width: 130,},
    { field: "id", headerName: "ID", width: 80 },
    {field: "companyName",headerName: "Company Name",width: 130,},
    {field: "contactPerson",headerName: "Contact Person",width: 130,},
    {field: "email",headerName: "Email",width: 130,},
    {field: "mobile",headerName: "Mobile Number",width: 130,},
    {field: "engagementPurpose",headerName: "Engagement Purpose",width: 130,},
    {field: "service",headerName: "Service",width: 130,},
    {field: "origin",headerName: "Origin",width: 130,},
    {field: "destination",headerName: "Destination",width: 130,},
    {
      field: 'status',
      headerName: 'Status',
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
    {
      field: "progress",
      headerName: "Progress",
      width: 130,
      renderCell: (params) => {
        let textColor = "";
        let backgroundColor = "";

        switch (params.value) {
          case "Initial":
            textColor = "maroon";
            backgroundColor = "rgba(128, 0, 0, 0.1)";
            break;
          case "On Transit":
            textColor = "gold";
            backgroundColor = "rgba(255, 215, 0, 0.1)";
            break;
          case "Arrived":
            textColor = "blue";
            backgroundColor = "rgba(0, 0, 255, 0.1)";
            break;
          case "Clearance":
            textColor = "green";
            backgroundColor = "rgba(0, 128, 0, 0.1)";
            break;
          case "Delivery":
            textColor = "darkgreen";
            backgroundColor = "rgba(0, 100, 0, 0.1)";
            break;
          default:
            break;
        }

        return (
          <div
            style={{
              color: textColor,
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

  if (isLoading || !data) {
    return <Loader/>;
  }

  const Quotes = params.list === 'list' ? data.filter(item => item.amount.length !== 0) : data.filter(item => item.amount.length === 0);

  const rows = Quotes?.map((item) => ({
    createdBy: item.createdBy.name,
    id: item._id,
    companyName: item.companyName,
    contactPerson: item.contactPerson,
    email: item.email,
    mobile: item.mobile,
    engagementPurpose: item.engagementPurpose,
    service: item.order,
    origin: item.origin,
    destination: item.destination,
    shipperEmail: item.shipperEmail,
    shipperMobile: item.shipperPhone,
    status: item.status,
    progress:item.progress
  }));

  const handleRowClick = (params) => {
    // Get the ID of the clicked row
    const selectedId = params.row.id;

    // Navigate to the page using the ID
    navigate(`/sales/order/${selectedId}`); 
  };

  return (
    <div className="">
      <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>List of all {params.list === 'list' ? 'Quotes' : 'Dump'}</h3>
      <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} onRowClick={handleRowClick} />
      <span style={{float:'right'}} className="mx-5"> <Orders data={rows} documentName={'Orders-Dump'} /></span>
    </div>
    </div>
  );
};

export default ServicesTable;
