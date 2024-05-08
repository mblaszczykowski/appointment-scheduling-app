import React from 'react';
import {CSSTransition, SwitchTransition} from 'react-transition-group';
import {request, setAuthHeader} from '../util/axios_helper';
import LoggedInContent from './LoggedInContent';
import LoginForm from './LoginForm';
import WelcomeContent from './WelcomeContent';
import Calendar from "./Calendar";
import Header from "./Header";
import RegisterForm from "./RegisterForm";

export default class AppContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            componentToShow: "welcome",
            isLoggedIn: false
        };
    };

    calendar = () => {
        this.setState({componentToShow: "calendar"});
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
        request(
            "POST",
            "/login",
            {
                login,
                password,
            }).then(
            (response) => {
                setAuthHeader(response.data.token);
                this.setState({componentToShow: "messages"});
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
        const {firstName, lastName, username, password} = obj;
        request(
            "POST",
            "/register",
            {
                firstName,
                lastName,
                login: username,
                password
            }).then(
            (response) => {
                setAuthHeader(response.data.token);
                this.setState({componentToShow: "messages"});
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
            case "messages":
                return <LoggedInContent/>;
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
                    calendar={this.calendar}
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
