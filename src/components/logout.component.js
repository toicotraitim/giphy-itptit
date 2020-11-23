import React, { Component } from "react";
import { getUser } from '../middleware/auth.js';

import Header from './header.component';

export default class gifList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            statusLoad: true
        }
    }
    componentDidMount = async function() {
        document.title = "Đăng xuất";
        const user = await getUser();
        if(!user._id) this.props.history.push('/login');
        this.setState({statusLoad: true});
    }
    logout =  () => {
        localStorage.removeItem("auth-token");
        this.props.history.push('/');
    }
    render() {
        if(!this.state.statusLoad) {
            return (
                <div className="loading">
                    <div className="loadingWrapper">
                    <div id="loading"> </div>
                    <h1>Loading . . .</h1>
                    </div>
                </div>
            );
        } else  {
            return (
                <div className="site"> 
                    <Header />
                    <div className="container">
                        <div className="panel">
                            <div className="panel-title">
                                Đăng xuất
                            </div>
                            <div className="panel-content">
                                <p>Bạn có chắc chắn muốn đăng xuất không?</p> 
                                <div> <button className="btn btn-primary" onClick={this.logout}>  Đăng xuất </button></div>
                            </div>
                        </div>
                    </div>
                </div>

            );
        }
    }
}