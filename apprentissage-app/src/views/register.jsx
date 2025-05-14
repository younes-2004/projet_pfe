import { useStateContext } from "../contexts/contextprovider";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
export default function Register() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    const navigate = useNavigate();

    const { setUser, setToken } = useStateContext();

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value // Nécessaire pour Laravel
        };

        try {
            const { data } = await axiosClient.post("/register", payload);
            setUser(data.user);
            setToken(data.token);
            navigate('/language-selection'); // Redirection après inscription réussie
        } catch (err) {
            if (err.response?.status === 422) {
                const errors = err.response.data.errors;
                // Affichez les erreurs à l'utilisateur
                alert(`Validation errors:\n${Object.values(errors).flat().join('\n')}`);
            } else {
                console.error('Registration error:', err);
                alert('An error occurred during registration');
            }
        }
    };

    return (
        <div className="login-container">

            <div className="bottom-left-image">
                <img src="images/caracter.png" alt="Décoration" />
            </div>
            <div className="login-signup-form animated fadeInDown">
                <div className="logo-container">
                    <img src="/logo.png" alt="Logo" className="form-logo" />
                </div>
                <div className="form">
                    <h1 className="title">Create A New Account</h1>
                    <form onSubmit={handleSubmit}>
                        <input 
                            ref={nameRef} 
                            type="text" 
                            placeholder="Enter your name" 
                            required 
                        />
                        <input 
                            ref={emailRef} 
                            type="email" 
                            placeholder="Enter your email" 
                            required 
                        />
                        <input 
                            ref={passwordRef} 
                            type="password" 
                            placeholder="Enter a valid password" 
                            required 
                            minLength="8"
                        />
                        <input
                            ref={passwordConfirmationRef}
                            type="password"
                            placeholder="Confirm your password"
                            required
                            minLength="8"
                        />
                        <button className="btn btn-block" type="submit">
                            Register
                        </button>
                        <p className="message">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                    
                    </form>
                </div>
            </div>
        </div>
    );
}