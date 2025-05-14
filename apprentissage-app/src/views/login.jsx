import axios from "axios";
import { useRef } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { setUser, setToken } = useStateContext();

    const handleSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        axiosClient.post("/login", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            });
    };

    return (
        <div className="login-container">
            <div className="bottom-left-image">
                <img src="/images/caracter.png" alt="Décoration"/>
            </div>
            <div className="login-signup-form animated fadeInDown">
                <div className="logo-container">
                    <img src="/logo.png" alt="Logo" className="form-logo" />
                </div>
                <div className="login-signup-form animated fadeInDown">
                    <div className="form">
                        <h1 className="title">Connectez-vous à votre compte</h1>
                        <form onSubmit={handleSubmit}>
                            <input
                                ref={emailRef}
                                type="email"
                                placeholder="Adresse e-mail"
                                required
                            />
                            <input
                                ref={passwordRef}
                                type="password"
                                placeholder="Mot de passe"
                                required
                            />
                            <button type="submit" className="btn btn-block">
                                Se connecter
                            </button>
                            <p className="message">
                                Vous n'avez pas encore de compte ? <Link to='/register'>S'inscrire :)</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}