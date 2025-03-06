import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Navigation from '../navbar/Navigation';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import { Button, Dropdown, Form, Row, Col } from 'react-bootstrap';
import { useGetSinglePlanQuery, useUpdatePlanMutation, useDeletePlanMutation, useUploadDocumentMutation } from '../../state/usersApiSlice'; 
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {toast} from 'react-toastify'
import { useSelector} from 'react-redux'
import './style.scss';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';



const SinglePlan = () => {
    const {userInfo} = useSelector(state => state.auth)
    const params = useParams();
    const [showMenu, setShowMenu] = useState(false);
    const { id } = params;
    const { data, isLoading, refetch } = useGetSinglePlanQuery(id);
    const [updatePlan] = useUpdatePlanMutation()
    const [deletePlan] = useDeletePlanMutation()
    const navigate = useNavigate()
    const [uploadDocument] = useUploadDocumentMutation()

    const CreatedDate = new Date(data?.createdAt).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        
      });
      const handleTaskStatusChange = async (taskStatus) => {
    await updatePlan({updateId:id, status:taskStatus}).unwrap().then(res =>{
        toast.success(res?.message)
    }).catch(err =>{
      console.log(err?.message || err?.data?.message)
        toast.error(err?.message || err?.data?.message)
    })

      }

      const handleDelete = async (id) => {
        try {
          const response = await deletePlan({ id }).unwrap();
          toast.success(response?.message);
          setTimeout(() =>{

            navigate('/plans')
          }, [3000])
        } catch (err) {
          toast.error(err?.data?.message || err?.message);
        }
      };
  useEffect(() => {
    refetch();
  }, [data]);

  if (isLoading || !data) {
    return <Loader/>;
  }
  const ToggleMenu = () =>{
    setShowMenu(!showMenu)
  }

  const handleDocument = async(e) =>{
    e.preventDefault();
    const file = e.target.files[0]
    const data = new FormData();
    data.append('document', file);
    data.append('id', id);

    uploadDocument(data).unwrap().then(res =>{
      toast.success(res?.message)
  }).catch(err =>{
      console.log(err)
      toast.error(err?.data?.message || err?.message)
  })
  }
  return (
    <div className='singlePlan'>
        <Sidebar/>

        <div className="singlePlanBody">
            <Navigation/>

            <div className="newItems">
                <div className="top">
                    <h1>Plan number {data._id}</h1>
                    {data &&
                    <ul style ={{display:'flex'}}>
                      <li style={{listStyle:'none', color:'#6439ff'}}>
                      <div onClick={ToggleMenu} style={{ cursor: 'pointer' }}>
                        <span>Documents</span>
                        {showMenu ? <ArrowDropUpRoundedIcon style={{color:'#7451f8', fontSize:'35px'}}/> : <ArrowDropDownRoundedIcon style={{color:'#7451f8', fontSize:'35px'}}/>}
                    </div>
                    {showMenu && (
                      <ul className='dropDown'>
                        {data.report && data.report.length > 0 && data.report.map((doc, index) =>{
                          return(
                            <li key={index}>
                              <a href={`https://globeflightapi.onrender.com/uploads/${doc}`} style={{ textDecoration: 'none' }}>
                              <span>{doc}</span>
                              </a>
                            </li>
                          )
                        })}
                        {data?.report?.length === 0  && <li>
                        No Document
                        </li>}
                      </ul>
                    )}
                      </li>
                      </ul>}
                </div>
                <div className="bottom">
                    {data.createdBy.fname ? <h1>Created By: {data?.createdBy?.fname} {data?.createdBy?.lname}</h1> :  <h1>Created By: {data?.createdBy?.name} </h1>}
                    <p><b>Created Date:</b> {CreatedDate}</p>
                </div>
                <div className="bottom">
                    <div className="">
                    <ul>
                    <li>Title: <b>{data.title}</b></li>
                    <li>Start Date: <b>{new Date(data.startDate).toLocaleDateString()}</b></li>
                    <li>End Date: <b>{new Date(data.endDate).toLocaleDateString()}</b></li>
                    <li>Assigned Managers: <b>{data.manager}</b></li>
                    <li>Plan Managers: <b>{data.planManager}</b></li>
                    <li>Priority: <b>{data.priority}</b></li>
                    <li>{userInfo.department === 'Management' && <button onClick={() => handleDelete(id)} className="btn btn-danger btn-sm my-1"><DeleteForeverIcon/></button>}</li>
                    <li>{userInfo.department === 'Management' && <button onClick={() =>handleTaskStatusChange('Closed')} className="btn btn-info btn-sm my-1">Close</button>}</li>
                    </ul>
                    </div>
                    <div className="mx-5" style={{maxWidth:'50%'}}>
  <ul>
    <li>Description: <b>{data.description}</b></li>
    {(data.inputFields && data.inputFields.length > 0) && (
      <>
        <li>Tasks</li>
        <ul>
          {data.inputFields.map((field, index) => (
            <li key={index} className="my-2">
              <b>{index + 1}:</b> {field.value}
            </li>
          ))}
        </ul>
    {userInfo.department === data.manager && <li>
        <label htmlFor="file3"  style={{ cursor: 'pointer' }}>
            Upload Report
            <input type="file"  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" name="file3" id="file3" hidden onChange={handleDocument} />
            </label>
    </li>}
          <li>
            Status:{" "}
            <b>
            {data.status === "Incomplete" && (
                <span className="btn btn-danger" onClick={() =>handleTaskStatusChange('Complete')}>{data.status}</span>
              )}
            {data.status === "Complete"  && (
                <span className="btn btn-success" onClick={() =>handleTaskStatusChange('Incomplete')}>{data.status}</span>
              )}
            {data.status === "Closed"  && (
              <span className="btn btn-info">{data.status}</span>
            )}
            </b>
          </li>
      </>
    )}
    
  </ul>
</div>


                </div>
            </div>
        </div>
    </div>
  )
}

export default SinglePlan