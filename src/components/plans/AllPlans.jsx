import './plans.scss'
import Sidebar from '../sidebar/Sidebar'
import Navigation from '../navbar/Navigation'
import { Link, useNavigate} from 'react-router-dom'
import {useEffect} from 'react'
import Loader from '../Loader'
import { useGetPlansQuery } from '../../state/usersApiSlice'
import { DataGrid } from '@mui/x-data-grid';
import {useSelector} from 'react-redux'
import DeleteIcon from '@mui/icons-material/Delete';

const AllPlans = () => {
  const {data, isLoading, refetch} = useGetPlansQuery()
  const navigate = useNavigate();
  const {userInfo}  = useSelector(state => state.auth)

  


  useEffect(() =>{
    refetch()
  },[data])

  let columns = [
    { field: "id", headerName: "ID", width: 80 },
    {field: "title",headerName: "Plan Title",width: 130,},
    {field: "description",headerName: "Description",width: 130,},
    {field: "manager",headerName: "Assigned Managers",width: 130,},
    {field: "planManager",headerName: "Plan Manager",width: 130,},
    {field: "priority",headerName: "Priority",width: 80,},
    {field: "startDate",headerName: "Start Date",width: 130,},
    {field: "endDate",headerName: "End Date",width: 130,},
    {field: "budget",headerName: "Budget",width: 130,},
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        let color = '';
        let backgroundColor = '';
  
        switch (params.value) {
          case 'Incomplete':
            color = 'red';
            backgroundColor = 'rgba(255, 0, 0, 0.1)';
            break;
          case 'Complete':
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
    }
    ,]

    if (isLoading || !data) {
      return <Loader/>;
    }

    const rows = data?.map((item) => ({
      id: item._id,
      title: item.title,
      description: item.description,
      manager: item.manager,
      planManager: item.planManager,
      priority: item.priority,
      startDate:new Date(item.startDate).toLocaleDateString(),
      endDate: new Date(item.endDate).toLocaleDateString(),
      budget: item.budget,
      status: item.status,
    }));

    const userDepartment = userInfo.department; 

    const filteredRows =
    userDepartment === "Management"
      ? rows // Display all rows for Management
      : rows.filter((row) => row.manager === userDepartment);

    const handleRowClick = (params) => {
      // Get the ID of the clicked row
      const selectedId = params.row.id;
  
      navigate(`/plans/single/${selectedId}`); 
    };
  return (
    <div className='AllPlans'>
      <Sidebar/>
      <div className="AllPlansBody">
        <Navigation/>
        <div className="titleContainer">
        {userInfo.department === 'Management' ? <h4>Efficiently create, manage, and monitor plans for optimal organizational success.</h4> : <h4>Complete assigned plans promptly for efficient project execution and success.</h4>}
        {userInfo.department === 'Management' && <div className="links">
              <Link to='/plans/new'  className='link'> New Plan</Link>
            </div>}
            </div>
            <div className="">
      <h3 className="text-center" style={{color:'#6439ff', fontSize:"22px"}}>List of Plans</h3>
      <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={filteredRows} columns={columns} pageSize={5} onRowClick={handleRowClick} />
    </div>
    </div>

      </div>
    </div>
  )
}

export default AllPlans