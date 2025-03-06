import React, { useEffect } from 'react'
import './delivery.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navigation from '../../components/navbar/Navigation'
import Widget from '../../components/widget/Widget'
import { useGetOrdersQuery } from '../../state/servicesApiSlice';
import { DataGrid } from '@mui/x-data-grid';
import Loader from '../../components/Loader'
import { useNavigate } from 'react-router-dom'

const Delivery = () => {
  const { data, isLoading, refetch} = useGetOrdersQuery();
  const navigate = useNavigate()

  useEffect(() =>{
    refetch()
  },[data])

  if(isLoading || !data){
    return <Loader/>
  }

  let columns = [
    { field: "id", headerName: "ID", width: 40 },
    {field: "companyName",headerName: "Client",width: 130,},
    {field: "service",headerName: "Service",width: 90,},
    {field: "origin",headerName: "Origin",width: 90,},
    {field: "destination",headerName: "Destination",width: 90,},
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
    {field: "driver",headerName: "Driver",width: 150,},
  ];

  

  const rows = data?.map((item) => ({
    id: item._id,
    companyName: item.companyName,
    service: item.order,
    origin: item.origin,
    destination: item.destination,
    progress:item.progress,
    driver:item.driver
  }));

  const deliveredShipments = rows?.filter(item => item?.progress === "Delivery" )

  const handleRowClick = (params) => {
    // Get the ID of the clicked row
    const selectedId = params.row.id;

    // Navigate to the page using the ID
    navigate(`/sales/order/${selectedId}`); 
  };
  return (
    <div className="delivery">
      <Sidebar/>
      <div className="deliveryContainer">
        <Navigation/>
        <div className="deliveryDetails">
          <div className="widgets">
            <Widget type='earnings'/>
            <Widget type='driver'/>
            <Widget type='delivery'/>
            <Widget type='order'/>
          </div>
          <div className="">
                <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>Delivery Orders</h3>
                <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={deliveredShipments} columns={columns} pageSize={5} onRowClick={handleRowClick}  />
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Delivery