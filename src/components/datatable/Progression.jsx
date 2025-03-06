import {useEffect} from 'react';
import { useGetOrdersQuery, useChangeProgressMutation } from '../../state/servicesApiSlice';
import { DataGrid } from '@mui/x-data-grid';
import Loader from '../Loader'
import  {Row, Col} from 'react-bootstrap'
import { toast } from 'react-toastify';
import {useSelector} from 'react-redux'
import {Link, useParams} from 'react-router-dom'
import AutoModeOutlinedIcon from '@mui/icons-material/AutoModeOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';

const Progression = () => {
    const { data, isLoading, refetch} = useGetOrdersQuery();
    const [changeProgress] = useChangeProgressMutation()
    const {userInfo} = useSelector(state => state.auth)
    const params = useParams()

    

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
        {
            field: "action",
            headerName: "Action",
            width: 110,
            renderCell: (params) => {
              if (params.row.progress === "On Transit") {
                return (
                  <button className="btn btn-warning" onClick={() => handleAction(params.id)}>Cleared</button>
                );
              } else if (params.row.progress === "Clearance") {
                return (
                  <button className="btn btn-success" onClick={() => handleClearance(params.id)}>Delivered</button>
                );
              } else {
                return null; // Return null for other progress values or add another case if needed
              }
            },
          },
      ];

      const handleAction = async(id) => {
        const Progress = 'Clearance'
        await changeProgress({Progress, id}).unwrap().then(res =>{
            toast.success(res?.message)
            refetch()
        }).catch(err =>{
            toast.error(err?.message || err?.data?.message)
        })
      };

      const handleClearance = async(id) => {
        const Progress = 'Delivery'
        await changeProgress({Progress, id}).unwrap().then(res =>{
            toast.success(res?.message)
            refetch()
        }).catch(err =>{
            toast.error(err?.message || err?.data?.message)
        })
      };
      

    useEffect(() => {
        refetch();
      }, [data]);

      if (isLoading || !data) {
        return <Loader/>;
      }

      
  const rows = data?.map((item) => ({
    id: item._id,
    companyName: item.companyName,
    service: item.order,
    origin: item.origin,
    destination: item.destination,
    progress:item.progress
  }));
  const expectedAirShip = rows.filter((item) => item.progress === "On Transit" && item.service === "Air Freight");
  const expectedSeaShip = rows.filter(item => item.progress === "On Transit" && item.service === "Sea Freight")
  const clearedAirShip = rows.filter((item) => item.progress === "Clearance" && item.service === "Air Freight");
  const clearedSeaShip = rows.filter(item => item.progress === "Clearance" && item.service === "Sea Freight")
  const deliveredShipments = rows.filter(item => item.progress === "Delivery" )

  return (
    <div className ='progression'>
        <div className="titleContainer">
            <h4>Operational Excellence Unleashed: Streamlining Logistics for Elevated Performance</h4>
            {userInfo.department === 'Operations' &&<div className="links">
                    <Link to='/sales/orders'  className='link'><RequestQuoteOutlinedIcon/> Orders</Link>
                    <Link to='/sales/progression/delivered'  className='link'><AutoModeOutlinedIcon/> Delivered Orders</Link>
                </div>}
                </div>
        { params.delivered !== 'delivered'  && <><Row className ="mt-5">
            <Col md={6}>
            <div className="">
                <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>Expected Air Shipment</h3>
                <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={expectedAirShip} columns={columns} pageSize={5} />
                </div>
            </div>
            </Col>                
            <Col md={6}>
            <div className="">
                <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>Expected Sea Shipment</h3>
                <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={expectedSeaShip} columns={columns} pageSize={5} />
                </div>
            </div>
            </Col>
        </Row>
        <Row className ="mt-5">
            <Col md={6}>
            <div className="">
                <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>Clearance Shipment By Air</h3>
                <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={clearedAirShip} columns={columns} pageSize={5} />
                </div>
            </div>
            </Col>                
            <Col md={6}>
            <div className="">
                <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>Clearance Shipment By Sea </h3>
                <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={clearedSeaShip} columns={columns} pageSize={5} />
                </div>
            </div>
            </Col>
        </Row></>}
        {params.delivered === 'delivered' && <>
        <div className="">
                <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>Delivered Orders</h3>
                <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={deliveredShipments} columns={columns} pageSize={5} />
                </div>
            </div>
        </>}
    </div>
  )
}

export default Progression