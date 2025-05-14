import { createContext, useContext, useState } from "react";
import axiosClient from "../axiosClient";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Retirez la valeur par défaut 'firdaousse'
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    // Ajout de la fonction de déconnexion
    const onLogout = async () => {
        try {
            await axiosClient.post('/logout');
        } finally {
            setToken(null);
            setUser(null);
        }
    };

    return (
        <StateContext.Provider value={{ 
            user,
            setUser,
            token,
            setToken,
            onLogout // N'oubliez pas d'ajouter cette fonction
        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);