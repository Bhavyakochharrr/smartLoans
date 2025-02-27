import React from "react";
import Navbar from "./NavBar"; // Default Navbar
import {useAuth} from "../../Home/contexts/AuthContext" ;

const RoleBasedNavbar = () => {
  const {role}=useAuth(); // Fetch role from sessionStorage (or use Context/Redux)
  //const [darkMode, setDarkMode] = useState(false);
  if (role?.includes('banker') || role?.includes('user') || role?.includes('admin')) {
    return ;
  }
  // if(role?.includes('user')){
  //   return <CustomerNavBar/>
  // }
  

  return <Navbar />; // Default Navbar
};

export default RoleBasedNavbar;
