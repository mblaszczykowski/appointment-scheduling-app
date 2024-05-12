import React from 'react';
import {CSSTransition, SwitchTransition} from 'react-transition-group';
import {getAuthToken, request, setAuthHeader} from '../util/axios_helper';
import Dashboard from './Dashboard';
import LoginForm from './LoginForm';
import WelcomeContent from './WelcomeContent';
import Calendar from "./Calendar";
import Header from "./Header";
import RegisterForm from "./RegisterForm";

export default class AppContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            componentToShow: getAuthToken() != null ? "dashboard" : "welcome",
            isLoggedIn: getAuthToken() != null
        };
    };

    dashboard = () => {
        this.setState({componentToShow: "dashboard"});
    };

    login = () => {
        this.setState({componentToShow: "login"});
    };

    register = () => {
        this.setState({componentToShow: "register"});
    };

    logout = () => {
        this.setState({componentToShow: "welcome"});
        this.setState({isLoggedIn: false});
        setAuthHeader(null);
    };

    onLogin = (obj) => {
        const {login, password} = obj;
        let email = login;
        request(
            "POST",
            "/api/auth/login",
            {
                email,
                password,
            }).then(
            (response) => {
                setAuthHeader(response.data);
                this.setState({componentToShow: "dashboard"});
                this.setState({isLoggedIn: true});
                //window.location = "/";
            }).catch(
            (error) => {
                setAuthHeader(null);
                this.setState({componentToShow: "welcome"})
            }
        );
    };

    onRegister = (obj) => {
        const {firstname, lastname, email, password, calendarUrl, availableFromHour, availableToHour, availableDays} = obj;
        console.log(obj);
        request(
            "POST",
            "api/users",
            {
                firstname,
                lastname,
                email,
                password,
                calendarUrl,
                availableFromHour,
                availableToHour,
                availableDays,
            }).then(
            (response) => {
                setAuthHeader(response.data);
                this.setState({componentToShow: "dashboard"});
                this.setState({isLoggedIn: true});
                //window.location = "/";
            }).catch(
            (error) => {
                setAuthHeader(null);
                this.setState({componentToShow: "welcome"})
            }
        );
    };

    renderComponent() {
        switch (this.state.componentToShow) {
            case "welcome":
                return <WelcomeContent/>;
            case "login":
                return <LoginForm onLogin={this.onLogin}/>;
            case "register":
                return <RegisterForm onRegister={this.onRegister}/>;
            case "dashboard":
                return <Dashboard/>;
            case "calendar":
                return <Calendar/>;
            default:
                return null;
        }
    }

    render() {
        return (
            <>
                <Header
                    calendar={this.dashboard}
                    login={this.login}
                    register={this.register}
                    logout={this.logout}
                    isLoggedIn={this.state.isLoggedIn}
                />

                <SwitchTransition mode="out-in">
                    <CSSTransition
                        key={this.state.componentToShow}
                        timeout={300}
                        classNames="fade"
                    >
                        <div>
                            {this.renderComponent()}
                        </div>
                    </CSSTransition>
                </SwitchTransition>
            </>
        );
    };
}
