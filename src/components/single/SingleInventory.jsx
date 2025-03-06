import { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Navigation from '../navbar/Navigation';
import './style.scss';
import { useParams } from 'react-router-dom';
import { useGetSingleInventoryQuery, useUpdateInventoryMutation } from '../../state/servicesApiSlice';
import { useGetDriversQuery } from '../../state/usersApiSlice';
import Loader from '../Loader';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const SingleInventory = () => {
  const params = useParams();
  const [driver, setDriver] = useState('');
  const { id } = params;
  const { data, isLoading, refetch } = useGetSingleInventoryQuery(id);
  const { data: drivers, refetch: RefetchingDriver } = useGetDriversQuery();
  const [updateInventory] = useUpdateInventoryMutation();

  useEffect(() => {
    refetch();
    RefetchingDriver();
  }, [data, drivers]);

  if (isLoading || !data || !drivers) {
    return <Loader />;
  }

  const CreatedDate = new Date(data?.createdAt).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const assignDriver = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:8000/payments/assign-driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inventoryId: id, driverId: driver }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        refetch(); // Refetch inventory data to update the UI
      } else {
        //inventory not founde
        toast.error(result.message);
      }
    } catch (err) {
      console.log(err);
      toast.error('An error occurred while assigning the driver.');
    }
  };

  return (
    <div className="singleInventory">
      <Sidebar />

      <div className="singleInventoryBody">
        <Navigation />

        <div className="newItems">
          <div className="top">
            <h1>Inventory number {data?._id}</h1>
          </div>
          <div className="bottom">
            {data.createdBy.fname ? (
              <h1>
                Created By: {data?.createdBy?.fname} {data?.createdBy?.lname}
              </h1>
            ) : (
              <h1>Created By: {data?.createdBy?.name} </h1>
            )}
            <p>
              <b>Created Date:</b> {CreatedDate}
            </p>
          </div>
          <div className="bottom">
            <div className="">
              <ul>
                <li>
                  Item Name: <b>{data.itemName}</b>
                </li>
                <li>
                  Item Description: <b>{data.itemDescription}</b>
                </li>
                <li>
                  Item Storage: <b>{data.itemStorage}</b>
                </li>
                <li>
                  Item Dimensions: <b>{data.itemDimensions}</b>
                </li>
                <li>
                  Item Handling: <b>{data.itemHandling}</b>
                </li>
                <li>
                  Item Measurement: <b>{data.itemMeasurement}</b>
                </li>
                <li>
                  Item Packaging: <b>{data.itemPackaging}</b>
                </li>
                <li>
                  Item Value: <b>{data.itemValue}</b>
                </li>
                <li>
                  Item Measurement: <b>{data.itemMeasurement}</b>
                </li>
                <li>
                  Exit Date: <b>{new Date(data.exitDate).toLocaleDateString()}</b>
                </li>
                {/* <button onClick={() => handleDelete(id)} className="btn btn-danger btn-sm my-3"><DeleteForeverIcon/></button> */}
              </ul>
            </div>
            <div className="">
              <ul>
                <li>
                  Seller Name: <b>{data.sellerName}</b>
                </li>
                <li>
                  Seller Email: <b>{data.sellerEmail}</b>
                </li>
                <li>
                  Seller Phone Number: <b>{data.sellerMobile}</b>
                </li>
                <li>
                  Service Price: <b>{data.priceTotal}</b>
                </li>
                {data?.driver && (
                  <li>
                    Driver: <b>{data.driver}</b>
                  </li>
                )}
              </ul>
              {!data?.driver ? (
                <div className="mt-5">
                  <h1 className="text-center">
                    Assign Driver <small style={{ fontSize: '14px', color: '#666' }}>(If Applicable)</small>
                  </h1>
                  <Form onSubmit={assignDriver}>
                    <Form.Group controlId="validationCustom03">
                      <Form.Label>Assign Driver</Form.Label>
                      <Form.Select
                        value={driver}
                        onChange={(e) => setDriver(e.target.value)}
                        className="formInput"
                        required
                      >
                        <option value="">Select a Driver</option>
                        {drivers.map((driver) => (
                          <option key={driver._id} value={driver._id}>
                            {driver.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please select a Driver
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Button type={'submit'} className="mt-4" variant={'warning'}>
                      Assign
                    </Button>
                  </Form>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleInventory;