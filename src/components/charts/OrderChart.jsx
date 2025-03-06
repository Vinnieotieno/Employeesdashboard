import React from 'react'
import './charts.scss'
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, CartesianGrid } from 'recharts';

const data = [{
      name: 'Nairobi',
      uv: 9000,
      pv: 2400,
      amt: 2400,},
    {
      name: 'Kisumu',
      uv: 3600,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Eldoret',
      uv: 2050,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Mombasa',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Kitui',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Taita Taveta',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Nakuru',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  const data2 = [
    {
      name: 'Fashion and Apparel',
      stockOut: 4000,
      stockIn: 2400,
      amt: 2400,
    },
    {
      name: 'Food and Beverage',
      stockOut: 3000,
      stockIn: 1398,
      amt: 2210,
    },
    {
      name: 'Automotive Parts',
      stockOut: 2000,
      stockIn: 9800,
      amt: 2290,
    },
    {
      name: 'Industrial Equipment',
      stockOut: 2780,
      stockIn: 3908,
      amt: 2000,
    },
    {
      name: 'Household Goods',
      stockOut: 1890,
      stockIn: 4800,
      amt: 2181,
    },
    {
      name: 'Electronics',
      stockOut: 2390,
      stockIn: 3800,
      amt: 2500,
    },
  ];
const OrderChart = () => {
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];
    const getPath = (x, y, width, height) => {
        return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
        ${x + width / 2}, ${y}
        C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
        Z`;
      };
    const TriangleBar = (props) => {
        const { fill, x, y, width, height } = props;
        return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
      };

    
  return (
    <div className="OrderChart">
        <div className=" chartContainer">
        <div className=" inventory">
            <h4><InventoryRoundedIcon/> Inventory Stock ~ <i>Services</i> </h4>
            <p>Efficiently handle and monitor inventory levels in the warehouse to ensure smooth service delivery and timely stock replenishment</p>
            <div className="" style={{ width: '90%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                data={data2}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stockOut" stackId="a" fill="green" />
                <Bar dataKey="stockIn" stackId="a" fill="orange" />
                </BarChart>
      </ResponsiveContainer>
            </div>
            </div>
            <div className=" sellingCities">
                <h4><TrendingUpRoundedIcon/> Top Cities in Services Sales </h4>
                <p>Explore the most flourishing markets for services, where demand is thriving, and lucrative opportunities abound. 
                    Stay ahead by gaining invaluable insights!"</p>
            <BarChart
            width={700}
            height={200}
            data={data}
            margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="uv" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
                {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                ))}
            </Bar>
            </BarChart>
            </div>

        </div>
    </div>
  )
}

export default OrderChart