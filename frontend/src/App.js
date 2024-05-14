import './App.css';
import Footer from "./components/Footer";
import { Route, Routes, useNavigate} from 'react-router-dom';
import Calendar from "./components/Calendar";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";
import WelcomeContent from "./components/WelcomeContent";
import {setAuthHeader} from "./util/axios_helper";
import React, {useState} from "react";
import ErrorPage from "./components/ErrorPage";
import BookingSuccess from "./components/BookingSuccess";


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const handleLogin = () => {
        setIsLoggedIn(true);

    };

    const handleLogout = () => {
        setAuthHeader(null);
        setIsLoggedIn(false);
        navigate("/login")
    };

    const redirectToRegister = () => {
        navigate("/register");
    }
    return (
            <div className="App">

                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <Header isLoggedIn={isLoggedIn} onLogout={handleLogout}/>
                            <Routes>
                                <Route path="/calendar/:calendarUrl" element={<Calendar/>}/>
                                <Route path="/error" element={<ErrorPage/>}/>
                                <Route path="/booking-success" element={<BookingSuccess/>}/>
                                <Route path="/login" element={<LoginForm onLogin={handleLogin}/>}/>
                                <Route path="/register" element={<RegisterForm onRegister={handleLogin}/>}/>
                                <Route path="/dashboard" element={<Dashboard/>}/>
                                <Route path="/" element={<WelcomeContent onRegister={redirectToRegister}/>}/>
                            </Routes>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
    );
}

export default App;
