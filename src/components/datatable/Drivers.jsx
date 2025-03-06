import { DataGrid } from '@mui/x-data-grid';
import Loader from '../Loader'
import {useEffect} from 'react';
import { useGetDriversQuery } from '../../state/usersApiSlice';
import { toast } from 'react-toastify';
import {useSelector} from 'react-redux'
import DeleteIcon from '@mui/icons-material/Delete';
import { useDeleteDriverMutation } from '../../state/usersApiSlice';

const Drivers = () => {
    const { data, isLoading, refetch} = useGetDriversQuery();
    const {userInfo} = useSelector(state => state.auth)
    const [deleteDriver] = useDeleteDriverMutation()

    let columns = [
        { field: "id", headerName: "ID", width: 40 },
        {field: "name",headerName: "Name",width: 130,},
        {field: "email",headerName: "Email",width: 90,},
        {field: "nationalId",headerName: "National ID",width: 130,},
        {field: "licence",headerName: "Licence Number",width: 130,},
        {field: "expire",headerName: "License Expiry",width: 90,},
        {field: "licenceClass",headerName: "Licence Class",width: 130,},
        {field: "emergency",headerName: "Emergency Contact",width: 130,},
        { field: "actions", headerName: "Actions", width: 130,
  renderCell: (params) => {
    const isCurrentUser = params.row.id === userInfo._id;
    const isManagement = userInfo.department === 'Management'
    
    if (isCurrentUser) {
      return null; 
    }
    if(isManagement){
      return (
        <button
          onClick={() => handleDelete(params.row.id)} 
          className="btn btn-danger btn-sm"
        >
          <DeleteIcon/>
        </button>
      );
    }
  },
},
    ]

    const handleDelete = async(id) => {
      deleteDriver({id}).unwrap().then(res =>{
        toast.success(res?.message)
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
        name: item.name,
        email: item.email,
        nationalId: item.nationalId,
        licence: item.licence,
        expire: new Date(item.expire).toLocaleDateString(),
        licenceClass:item.licenceClass,
        emergency:item.emergency
      }));
  return (
    <div className="">
        <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>Drivers</h3>
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
    </div>
  )
}

export default Drivers