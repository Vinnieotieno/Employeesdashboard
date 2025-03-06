import {useEffect} from 'react'
import { useGetUsersQuery } from '../../state/usersApiSlice'
import Loader from '../Loader'
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDeleteUserMutation } from '../../state/usersApiSlice';
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'

const UserTable = () => {
  const { data, isLoading, refetch} = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation()
  const {userInfo} = useSelector(state => state.auth)

  useEffect(() => {
    refetch();
  }, [data]);
  if (isLoading || !data) {
    return <Loader/>;
  }
  const columns = [
    {field: "id",headerName: "ID",width: 20,},
    {field: "employeeId",headerName: "Employee ID",width: 100,},
    {
      field: 'image',
      headerName: 'Photo',
      width: 100,
      renderCell: (params) => {
       
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={params.value ? `http://localhost:3000/${params.value}` : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'}  style={{ width: '40px', height: '40px', borderRadius:'50%' }} />
          </div>
        );
      },
    },
    {field: "fname",headerName: "First Name",width: 130,},
    { field: "lname", headerName: "Last Name", width: 130 },
    { field: "email", headerName: "Email", width: 130 },
    { field: "mobile", headerName: "Phone Number", width: 130 },
    { field: "emergency", headerName: "Emergency Contact", width: 130 },
    {field: "department",headerName: "Department",width: 130,},
    { field: "jobtitle", headerName: "Job Title", width: 130 },
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
  ];

  const handleDelete = async(id) => {
    await deleteUser({id}).unwrap().then(res =>{
      toast.success(res?.message)
    }).catch(err =>{
      toast.error(err?.data?.message || err?.message)
    })
  };
  const rows = data?.map((item) => ({
    id: item._id,
    image: item.image,
    employeeId: item.employeeId,
    fname: item.fname,
    lname: item.lname,
    email: item.email,
    mobile: item.mobile,
    emergency: item.emergency,
    department: item.department,
    jobtitle: item.jobtitle,
  }));
  return (
    <div className="">
      <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>All Employees</h3>
      <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={1} />

    </div>
    </div>
  )
}

export default UserTable