import './App.css';
import './transitions.css';
import Footer from "./components/Footer";
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import Calendar from "./components/calendar/Calendar";
import Header from "./components/Header";
import Dashboard from "./components/dashboard/Dashboard";
import WelcomeContent from "./components/WelcomeContent";
import {setAuthHeader} from "./util/axios_helper";
import React, {useState} from "react";
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import ErrorPage from "./components/ErrorPage";
import SettingsSuccess from "./components/dashboard/SettingsSuccess";
import BookingSuccess from "./components/calendar/BookingSuccess";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setAuthHeader(null);
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <div className="App">
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout}/>
                        <TransitionGroup>
                            <CSSTransition key={location.key} classNames="fade" timeout={{enter: 500, exit: 0}}>
                                <Routes location={location}>
                                    <Route path="/"
                                           element={<WelcomeContent onRegister={handleLogin} onLogin={handleLogin}
                                                                    show={"register"}/>}/>
                                    <Route path="/login"
                                           element={<WelcomeContent onRegister={handleLogin} onLogin={handleLogin}
                                                                    show={"login"}/>}/>
                                    <Route path="/register"
                                           element={<WelcomeContent onRegister={handleLogin} onLogin={handleLogin}
                                                                    show={"register"}/>}/>
                                    <Route path="/dashboard" element={<Dashboard/>}/>
                                    <Route path="/calendar/:calendarUrl" element={<Calendar/>}/>
                                    <Route path="/settings-success" element={<SettingsSuccess/>}/>
                                    <Route path="/calendar/:calendarUrl" element={<Calendar/>}/>
                                    <Route path="/error" element={<ErrorPage/>}/>
                                    <Route path="/booking-success" element={<BookingSuccess/>}/>
                                </Routes>
                            </CSSTransition>
                        </TransitionGroup>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default App;
