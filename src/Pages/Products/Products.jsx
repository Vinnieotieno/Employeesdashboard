import React from 'react'
import './products.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navigation from '../../components/navbar/Navigation'
import { Link } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { useGetProductsQuery } from '../../state/productsApiSlice';

const Products = () => {
  const { data, isLoading} = useGetProductsQuery();
  console.log(data)

  if (isLoading) {
    return <div>Loading...</div>;

  }

  const columns =[
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 100 },
    {
      field: "price",
      headerName: "Price",
      width: 100,
    },
  
    {
      field: "category",
      headerName: "Category",
      width: 100,
    },
    {
      field: "description",
      headerName: "Description",
      width: 160,
    },
    {
      field: "expense",
      headerName: "Expense",
      width: 160,
    },
    {
      field: "transactions",
      headerName: "Transactions",
      width: 160,
    },
  ]
  const rows = data?.map((item) => ({
    id: item.id,
    title:item.title,
    price:item.price,
    category: item.category,
    description: item.description,
    expense: item.expense,
    transactions: item.transactions,
  }));
  return (
    <div className="products">
        <Sidebar/>
        <div className="productsContainer">
            <Navigation/>
            <div className="productDetails">
                <div className="" style={{float:'right', margin:'10px 40px'}}>
                <Link to="/products/new" style={{ textDecoration: "none" }}>
                <div className="viewButton">Add New Product</div>
                </Link>
                </div>
                <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={5} />
              </div>
            </div>
        </div>
    </div>
  )
}

export default Products