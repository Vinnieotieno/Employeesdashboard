import {useSelector} from 'react-redux'
import { Link, useNavigate} from 'react-router-dom'
import './datatable.scss'
import Loader from '../Loader'
import {useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useGetInventoriesQuery} from '../../state/servicesApiSlice';

const Warehouse = () => {
    const {userInfo}  = useSelector(state => state.auth)
    const { data, isLoading, refetch} = useGetInventoriesQuery();
    const navigate = useNavigate();

    let columns = [
      { field: "id", headerName: "ID", width: 40 },
      { field: "createdBy", headerName: "Created By", width: 40 },
      {field: "sellerName",headerName: "Seller Name",width: 130,},
      {field: "sellerEmail",headerName: "Seller Email",width: 90,},
      {field: "sellerMobile",headerName: "Seller Mobile",width: 130,},
      {field: "itemName",headerName: "Item Name",width: 130,},
      {field: "itemDescription",headerName: "Item Description",width: 90,},
      {field: "itemQuantity",headerName: "Item Quantity",width: 130,},
      {field: "entryDate",headerName: "Entry Date",width: 130,},
      {field: "exitDate",headerName: "Exit Date",width: 130,},
      {field: "itemStorage",headerName: "Storage Location",width: 130,},
      {field: "itemValue",headerName: "Item Worth",width: 130,},
      {field: "priceTotal",headerName: "Storage Fee",width: 130,}]

      const rows = data?.map((item) => ({
        createdBy: item.createdBy.name,
        id: item._id,
        sellerName: item.sellerName,
        sellerEmail: item.sellerEmail,
        sellerMobile: item.sellerMobile,
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        itemQuantity: item.itemQuantity,
        entryDate: new Date(item.createdAt).toLocaleDateString(),
        exitDate: new Date(item.exitDate).toLocaleDateString(),
        itemStorage: item.itemStorage,
        itemValue: item.itemValue,
        priceTotal: item.priceTotal
      }));

      useEffect(() => {
        refetch();
      }, [data]);

      if (isLoading || !data) {
        return <Loader/>;
      }

      const handleRowClick = (params) => {
        // Get the ID of the clicked row
        const selectedId = params.row.id;
    
        // Navigate to the page using the ID
        navigate(`/warehouse/inventories/${selectedId}`); 
      };
  return (
    <div className='warehouse'>
        <div>
        <div className="titleContainer">
        {userInfo.department === 'Warehouse' ? <h4>Efficiently create, manage, and monitor Inventory for optimal organizational success.</h4> : <h4>Monitor Inventory Easily</h4>}
        {userInfo.department === 'Warehouse' && 
        <div className="links">
        <Link to='/warehouse/new'  className='link'> New Inventory</Link>
        </div>}
        </div>

        <div className="">
      <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>WareHouse Inventories</h3>
      <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} onRowClick={handleRowClick} />
    </div>
    </div>
        </div>
        
    </div>
  )
}

export default Warehouse