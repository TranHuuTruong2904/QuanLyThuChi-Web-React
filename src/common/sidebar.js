import { useContext, useState, useEffect, useMemo } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import axiosApiInstance from "../context/interceptor";
import { Button } from "react-bootstrap";

const Sidebar = ({ isActive }) => {
  const { user, logout } = useContext(AuthContext);
  const [name, setName] = useState([]);

  useEffect(() => {
    axiosApiInstance
      .get(axios.defaults.baseURL + "/api/user/profile")
      .then((response) => setName(response?.data?.userInfoModel.lastname));
  }, []);

 const sidebarItems = useMemo(() => {
   return [
     {
       icon: <i className="fa fa-dashboard me-3"></i>,
       link: "/home",
       title: "Dashboard",
     },
     {
       icon: <i className="fa fa-user-circle me-3"></i>,
       link: "/customer",
       title: "QL người dùng",
     },
     {
       icon: <i className="fa fa-user-circle-o me-3"></i>,
       link: "/profile",
       title: "Hồ sơ",
     },
   ];
 }, []);


 return (
   <>
     <div className={isActive ? "sidenav" : "sidenav2"} id="sidebar-wrapper">
       <div className="sidebar-heading border-bottom ">
         <div className="ms-3 mt-3">
           <img
             alt=""
             width="100"
             height="120"
             src={require("./../assets/images/logo.png")}
           />
         </div>
         {/* <div href="#" className="ms-3 align-items-center text-decoration-none" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={require('./../assets/images/logo.png')} alt="" width="110" height="110" className="rounded-circle me-2" />
                    <h5></h5>
                </div> */}
       </div>
       <PerfectScrollbar className="sidebar-items mt-3">
         <ul className="list-unstyled ps-0">
           {sidebarItems.map((item) => (
             <li className="mb-3 ms-3">
               <Link key={item.title} tag="a" className="" to={item.link}>
                 {item.icon}
                 {isActive && item.title}
               </Link>
             </li>
           ))}
         </ul>
         <Button style={{ marginLeft: "20px" }} onClick={() => logout()}>Đăng xuất</Button>
       </PerfectScrollbar>
     </div>
   </>
 );
};

export default Sidebar;
