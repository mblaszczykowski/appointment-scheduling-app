import './App.css';
import './transitions.css';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import Calendar from "./components/calendar/Calendar";
import Header from "./components/page/Header";
import Dashboard from "./components/dashboard/Dashboard";
import WelcomeContent from "./components/page/WelcomeContent";
import {setAuthHeader, request} from "./util/axios_helper";
import React, {useEffect, useState} from "react";
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import ErrorPage from "./components/page/ErrorPage";
import BookingSuccess from "./components/calendar/BookingSuccess";
import ResetPasswordMailForm from "./components/dashboard/ResetPasswordMailForm";
import ResetPassword from "./components/dashboard/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CancelMeeting from "./components/dashboard/CancelMeeting";
import AdminPage from "./components/page/AdminPage";

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isUserAdmin, setIsUserAdmin] = useState(false);

    useEffect(() => {
        const checkIfAdmin = () => {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                setIsUserAdmin(false);
                return;
            }
            request('GET', '/api/users', {})
                .then((response) => {
                    setIsUserAdmin(response.data.isAdmin);
                })
                .catch((error) => {
                    console.error("Failed to check admin status:", error);
                    setIsUserAdmin(false);
                });
        };

        checkIfAdmin();
    }, []);

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
                                    {isUserAdmin && (
                                        <Route path="/adminpage" element={<AdminPage/>}/>
                                    )}
                                    <Route path="/reset-password" element={<ResetPasswordMailForm/>}/>
                                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                                    <Route path="/cancel-meeting/:token" element={<CancelMeeting />} />
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
