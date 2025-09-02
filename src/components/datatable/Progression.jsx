import {useEffect, useState} from 'react';
import { useGetOrdersQuery, useChangeProgressMutation } from '../../state/servicesApiSlice';
import { DataGrid } from '@mui/x-data-grid';
import Loader from '../Loader'
import  {Row, Col, Button} from 'react-bootstrap'
import { toast } from 'react-toastify';
import {useSelector} from 'react-redux'
import {Link, useParams} from 'react-router-dom'
import AutoModeOutlinedIcon from '@mui/icons-material/AutoModeOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import ProgressManagementModal from '../modals/ProgressManagementModal';

const Progression = () => {
    const { data, isLoading, refetch} = useGetOrdersQuery();
    const [changeProgress] = useChangeProgressMutation()
    const {userInfo} = useSelector(state => state.auth)
    const params = useParams()
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    

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
            headerName: "Quick Action",
            width: 150,
            renderCell: (params) => {
              if (params.row.progress === "Initial") {
                return (
                  <button className="btn btn-primary btn-sm" onClick={() => handleInitialToTransit(params.id)}>
                    Start Transit
                  </button>
                );
              } else if (params.row.progress === "On Transit") {
                return (
                  <button className="btn btn-warning btn-sm" onClick={() => handleTransitToArrived(params.id)}>
                    Mark Arrived
                  </button>
                );
              } else if (params.row.progress === "Arrived") {
                return (
                  <button className="btn btn-info btn-sm" onClick={() => handleArrivedToClearance(params.id)}>
                    Start Clearance
                  </button>
                );
              } else if (params.row.progress === "Clearance") {
                return (
                  <button className="btn btn-success btn-sm" onClick={() => handleClearanceToDelivery(params.id)}>
                    Mark Delivered
                  </button>
                );
              } else {
                return null;
              }
            },
          },
          {
            field: "manage",
            headerName: "Manage",
            width: 120,
            renderCell: (params) => {
              return (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleManageProgress(params.row)}
                >
                  Manage
                </Button>
              );
            },
          },
      ];

      const handleInitialToTransit = async(id) => {
        const Progress = 'On Transit'
        await changeProgress({Progress, id}).unwrap().then(res =>{
            toast.success(res?.message)
            refetch()
        }).catch(err =>{
            toast.error(err?.message || err?.data?.message)
        })
      };

      const handleTransitToArrived = async(id) => {
        const Progress = 'Arrived'
        await changeProgress({Progress, id}).unwrap().then(res =>{
            toast.success(res?.message)
            refetch()
        }).catch(err =>{
            toast.error(err?.message || err?.data?.message)
        })
      };

      const handleArrivedToClearance = async(id) => {
        const Progress = 'Clearance'
        await changeProgress({Progress, id}).unwrap().then(res =>{
            toast.success(res?.message)
            refetch()
        }).catch(err =>{
            toast.error(err?.message || err?.data?.message)
        })
      };

      const handleClearanceToDelivery = async(id) => {
        const Progress = 'Delivery'
        await changeProgress({Progress, id}).unwrap().then(res =>{
            toast.success(res?.message)
            refetch()
        }).catch(err =>{
            toast.error(err?.message || err?.data?.message)
        })
      };

      const handleManageProgress = (orderRow) => {
        // Find the full order data
        const fullOrderData = data.find(order => order._id === orderRow.id);
        setSelectedOrder(fullOrderData);
        setShowProgressModal(true);
      };

      const handleProgressUpdate = () => {
        refetch();
        setShowProgressModal(false);
        setSelectedOrder(null);
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
  const initialOrders = rows.filter(item => item.progress === "Initial")
  const transitAirShip = rows.filter((item) => item.progress === "On Transit" && item.service === "Air Freight");
  const transitSeaShip = rows.filter(item => item.progress === "On Transit" && item.service === "Sea Freight")
  const arrivedAirShip = rows.filter((item) => item.progress === "Arrived" && item.service === "Air Freight");
  const arrivedSeaShip = rows.filter(item => item.progress === "Arrived" && item.service === "Sea Freight")
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
        { params.delivered !== 'delivered'  && <>
        {/* Initial Orders Section */}
        <Row className ="mt-5">
            <Col md={12}>
            <div className="">
                <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>Initial Orders (Ready to Start Transit)</h3>
                <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={initialOrders} columns={columns} pageSize={5} />
                </div>
            </div>
            </Col>
        </Row>

        {/* On Transit Section */}
        <Row className ="mt-5">
            <Col md={6}>
            <div className="">
                <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>In Transit - Air Freight</h3>
                <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={transitAirShip} columns={columns} pageSize={5} />
                </div>
            </div>
            </Col>
            <Col md={6}>
            <div className="">
                <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>In Transit - Sea Freight</h3>
                <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={transitSeaShip} columns={columns} pageSize={5} />
                </div>
            </div>
            </Col>
        </Row>

        {/* Arrived Section */}
        <Row className ="mt-5">
            <Col md={6}>
            <div className="">
                <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>Arrived - Air Freight</h3>
                <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={arrivedAirShip} columns={columns} pageSize={5} />
                </div>
            </div>
            </Col>
            <Col md={6}>
            <div className="">
                <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>Arrived - Sea Freight</h3>
                <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={arrivedSeaShip} columns={columns} pageSize={5} />
                </div>
            </div>
            </Col>
        </Row>
        {/* Clearance Section */}
        <Row className ="mt-5">
            <Col md={6}>
            <div className="">
                <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>Clearance - Air Freight</h3>
                <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={clearedAirShip} columns={columns} pageSize={5} />
                </div>
            </div>
            </Col>
            <Col md={6}>
            <div className="">
                <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>Clearance - Sea Freight</h3>
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

        {/* Progress Management Modal */}
        <ProgressManagementModal
            show={showProgressModal}
            onHide={() => setShowProgressModal(false)}
            orderData={selectedOrder}
            onProgressUpdate={handleProgressUpdate}
        />
    </div>
  )
}

export default Progression