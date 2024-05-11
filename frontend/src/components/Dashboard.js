import * as React from 'react';

import {getUserIdFromToken, request, setAuthHeader} from '../util/axios_helper';

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    };

    componentDidMount() {
        // tutaj wyswietlamh miedzy innymi spotkania zabookowane z getAppointmentsByUserId
        request(
            "GET",
            "/api/appointments/user/" + getUserIdFromToken(),
            {}).then(
            (response) => {
                this.setState({data: response.data})
            }).catch(
            (error) => {
                if (error.response.status === 401) {
                    setAuthHeader(null);
                } else {
                    this.setState({data: error.response.code})
                }

            }
        );
    };

  render() {
    return (
        <div className="row justify-content-md-center">
            <div>
                <div>
                    <div>
                        <h5 className="card-title">Dashboard</h5>
                        <p className="card-text">User's (id: {getUserIdFromToken()}) appointments: </p>
                        <br/><p style={{color: "red"}}>note: data has to be processed before display</p>

                        <ul>
                            {this.state.data && this.state.data
                                .map((line) =>
                                    <li key={line}>{line}</li>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
  };
}