import { createContext, useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom'  ;
import { BASE_URL } from '../utils/url';
import { useSnackbar } from 'notistack';

const AuthContext = createContext()

export default AuthContext;


export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate()

    let loginUser = async (e )=> {
        e.preventDefault() 
        let response = await fetch(`${BASE_URL}token/`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'email':e.target.email.value, 'password':e.target.password.value})
        })
        let data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            const decodedToken = jwt_decode(data.access)
            setUser(decodedToken)
            localStorage.setItem('authTokens', JSON.stringify(data))
            if (decodedToken.role === 'ADMIN') {
                navigate('/AdminDashboard/home')
            } else if (decodedToken.role === 'EMPLOYE') {
                navigate('/EmployeDashboard/home')
            } else if (decodedToken.role === 'SUPERVISEUR') {
                navigate('/SuperviseurDashboard/home')
            } else {
                enqueueSnackbar('Rôle inconnu !', { variant: 'error' });
            }
        }else{
            enqueueSnackbar(`L'email ou le mot de passe saisi est incorrect. Veuillez réessayer!`, { variant: 'error' });
        }
    }


    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/')
    }


    const updateToken = async () => {
        if (authTokens) {
          const response = await fetch(`${BASE_URL}token/refresh/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'refresh': authTokens?.refresh })
          });
          const data = await response.json();
    
          if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
          } else {
            logoutUser();
          }
        }
      };

    let contextData = {
        user:user,
        authTokens:authTokens,
        setAuthTokens:setAuthTokens,
        setUser:setUser,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }


 
    useEffect(() => {
        let interval;
    
        if (authTokens) {
          setUser(jwt_decode(authTokens.access));
          interval = setInterval(updateToken, 24000000); 
        }
    
        setLoading(false); // Set loading to false in all cases
    
        return () => {
          clearInterval(interval); // Clear interval on cleanup
        };
      }, [authTokens]);
    
    
    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null : children}
        </AuthContext.Provider>
    )
}