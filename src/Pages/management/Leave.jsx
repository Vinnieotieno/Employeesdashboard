import {useEffect} from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Navigation from '../../components/navbar/Navigation'
import './management.scss'
import { useGetLeaveQuery } from '../../state/usersApiSlice'
import  Loader from '../../components/Loader'
import { DataGrid } from '@mui/x-data-grid';
import {useSelector} from 'react-redux'
import { useApproveLeaveMutation } from '../../state/usersApiSlice'
import { toast } from 'react-toastify'

const Leave = () => {
  const {data, isLoading, refetch} = useGetLeaveQuery()
  const {userInfo} = useSelector(state => state.auth)

  const [approveLeave] = useApproveLeaveMutation()

  // Remove the infinite loop - useGetLeaveQuery already handles data fetching
  // useEffect(() =>{
  //   refetch()
  // },[data])

  if(isLoading){
    return  <Loader/>
  }

  if(!data || data.length === 0){
    return (
      <div className='leave'>
        <Sidebar/>
        <div className="leaveBody">
          <Navigation/>
          <h4 className="text-center">Leave Applications</h4>
          <div className="text-center mt-4">
            <p>No leave applications found.</p>
          </div>
        </div>
      </div>
    )
  }

  let columns = [
    { field: "id", headerName: "ID", width: 70 },
    {field: "appliedBy",headerName: "Applied By",width: 130,},
    { field: "leaveType", headerName: "Leave Type", width: 130 },
    {field: "reason",headerName: "Reason",width: 280,},
    {field: "startDate",headerName: "Start Date ",width: 180,},
    {field: "endDate",headerName: "End Date ",width: 180,},
    {field: "status",headerName: "Status ",width: 180,},
    { field: "actions", headerName: "Actions", width: 130,
  renderCell: (params) => {
    console.log(params)
    const isCurrentUser = params.row.id === userInfo._id;
    const isManagement = userInfo.department === 'Management' && params.row.status === 'Pending'
    
    if (isCurrentUser) {
      return null; 
    }
    if(isManagement){
      return (
        <button
          onClick={() => handleChangeStatus(params.row.id)} 
          className="btn btn-info btn-sm"
        >
          Approve
        </button>
      );
    }
  },
},
  ]

  

  const rows = data?.map((item, index) => ({
    id: item._id || `temp-${index}`,
    appliedBy: item?.appliedBy?.username || item?.appliedBy?.fname || 'Unknown User',
    leaveType: item.leaveType || 'N/A',
    reason: item.reason || 'No reason provided',
    startDate: item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A',
    endDate: item.endDate ? new Date(item.endDate).toLocaleDateString() : 'N/A',
    status: item.status || 'Pending',
  })) || [];


  console.log(data)
  const handleChangeStatus = async(id) =>{
    approveLeave({id}).unwrap().then(res =>{
      toast.success(res?.message)
      refetch() // Refetch data after successful approval
    }).catch(err =>{
      toast.error(err?.message || err?.data?.message)
    })
  }
 

  return (
    <div className='leave'>
        <Sidebar/>

        <div className="leaveBody">
            <Navigation/>

            <h4 className="text-center">Leave Applications</h4>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              autoHeight
              sx={{
                '& .MuiDataGrid-root': {
                  border: 'none',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: 'none',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-virtualScroller': {
                  backgroundColor: '#fff',
                },
              }}
            />

        </div>
    </div>
  )
}

export default Leave