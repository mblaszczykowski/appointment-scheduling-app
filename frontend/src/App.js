import './App.css';
import './transitions.css';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import Calendar from "./components/calendar/Calendar";
import Header from "./components/Header";
import Dashboard from "./components/dashboard/Dashboard";
import WelcomeContent from "./components/WelcomeContent";
import {setAuthHeader} from "./util/axios_helper";
import React from "react";
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import ErrorPage from "./components/ErrorPage";
import SettingsSuccess from "./components/dashboard/SettingsSuccess";
import BookingSuccess from "./components/calendar/BookingSuccess";
import ResetPasswordMailForm from "./components/dashboard/ResetPasswordMailForm";
import ResetPassword from "./components/dashboard/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        setAuthHeader(null);
        navigate("/login");
    };

    return (
        <div className="App">
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <Header isLoggedIn={localStorage.getItem("auth_token")!==null} onLogout={handleLogout}/>
                        <ToastContainer />
                        <TransitionGroup>
                            <CSSTransition key={location.key} classNames="fade" timeout={{enter: 500, exit: 0}}>
                                <Routes location={location}>
                                    <Route path="/" element={<WelcomeContent show={"register"}/>}/>
                                    <Route path="/login" element={<WelcomeContent show={"login"}/>}/>
                                    <Route path="/register" element={<WelcomeContent show={"register"}/>}/>
                                    <Route path="/dashboard" element={<Dashboard/>}/>
                                    <Route path="/calendar/:calendarUrl" element={<Calendar/>}/>
                                    <Route path="/settings-success" element={<SettingsSuccess/>}/>
                                    <Route path="/reset-password" element={<ResetPasswordMailForm/>}/>
                                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                                    <Route path="/error" element={<ErrorPage/>}/>
                                    <Route path="/booking-success" element={<BookingSuccess/>}/>
                                </Routes>
                            </CSSTransition>
                        </TransitionGroup>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
