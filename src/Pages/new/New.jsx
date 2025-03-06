import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navigation";
import NewProduct from "./NewProduct";
import NewService from "./NewService";
import NewUser from "./NewUser";
import NewPlan from "./NewPlan";
import NewDriver from "./NewDriver";
import Warehouse from "./Warehouse";
import DailyDump from "./DailyDump";

const New = ({type}) => {
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        {type === 'products' && <NewProduct/>}
        {type === 'services' && <NewService/>}
        {type === 'user' && <NewUser/>}
        {type === 'plan' && <NewPlan/>}
        {type === 'driver' && <NewDriver/>}
        {type === 'warehouse' && <Warehouse/>}
        {type === 'dump' && <DailyDump/>}
      </div>
    </div>
  );
};

export default New;
