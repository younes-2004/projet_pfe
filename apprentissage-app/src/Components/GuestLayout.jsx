import { Outlet, Navigate } from "react-router-dom"; // Ajoutez Navigate
import { useStateContext } from "../contexts/contextprovider";
export default function GuestLayout() {
    const { token } = useStateContext();
    
    if (token) {  
        return <Navigate to='/' replace />;
    }
    
    return (
        <div>
            <div></div>
            <Outlet /> {/* Correction de la faute de frappe */}
        </div>
    );
}