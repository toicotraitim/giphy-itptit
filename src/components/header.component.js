import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getUser } from '../middleware/auth.js';


export default class gifList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        }
    }
    componentDidMount = async function() {
        document.title = "Đăng nhập";
        const user = await getUser();
        // console.log(user);
        this.setState({user: user});
        this.state.loading = true;
        this.render();
    }

    render() {
        const user = this.state.user;
        let user_id;
        if(user) {
            if(user._id) 
                user_id = user._id;
        }
        return (
            <div className="header">
                <header>
                    <div className="logo">
                        <Link to="/">LOGO</Link>
                    </div>
                    <div className="dropdown">
                        <button> 
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        {user_id ? 
                            ( <ul>
                                <li> <Link to="/profile">Profile</Link></li>    
                                <li> <Link to="/favorites">Favorites</Link></li>
                                <li> <Link to="/logout">Logout</Link></li>    
                            </ul> )
                            : ( <ul>
                                <li> <Link to="/login">Đăng nhập</Link></li>    
                                <li> <Link to="/register">Đăng kí</Link></li>
                            </ul> )
                        }
                    </div>
                </header>
            </div>

        );
    }
}