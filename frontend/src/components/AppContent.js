import React from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { request, setAuthHeader } from '../util/axios_helper';
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

    onLogin = (e, username, password) => {
        e.preventDefault();
        request(
            "POST",
            "/login",
            {
                login: username,
                password: password
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

    onRegister = (event, firstName, lastName, username, password) => {
        event.preventDefault();
        request(
            "POST",
            "/register",
            {
                firstName: firstName,
                lastName: lastName,
                login: username,
                password: password
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
                return <WelcomeContent />;
            case "login":
                return <LoginForm onLogin={this.onLogin} />;
            case "register":
                return <RegisterForm onRegister={this.onRegister} />;
            case "messages":
                return <LoggedInContent />;
            case "calendar":
                return <Calendar />;
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
