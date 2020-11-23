import React, { Component } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import {SERVER_URL} from '../config.json';
import { getUser } from '../middleware/auth.js';


export default class gifList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
            errors: "",
            success: null
        }
    }
    inputFocus = (e) => {
        let label = e.target.labels[0];
        label.style.fontSize = "0.7em";
        label.style.top = "-1em";
        label.style.color = "#000";

    }
    inputBlur = (e) => {
        let label = e.target.labels[0];
        if (e.target.value !== "") return;
        label.style.fontSize = "1em";
        label.style.top = "10px";
        label.style.color = "#636e72";
    }
    componentDidMount = async function() {
        document.title = "Đăng kí";
        const user = await getUser();
        if(user._id) this.props.history.push('/');
    }
    error = (noidung) => {
        if(document.querySelector(".noti"))
            document.querySelector(".noti").innerHTML = '<div class="error"> '+noidung+' </div>';
    }
    success= (noidung) => {
        if(document.querySelector(".noti"))
            document.querySelector(".noti").innerHTML = '<div class="success"> '+noidung+' </div>';
    }
    submitForm = (e) => {
        e.preventDefault();
        const user = {
            username: this.state.username,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            email: this.state.email
        };
        axios.post(SERVER_URL + '/api/register', user)
            .then(res => {
                if (res.data.errors !== undefined) {
                    this.setState({ errors: res.data.errors});
                } else if(res.data.success !== undefined) {
                    this.success(res.data.success);
                    setTimeout(() => {
                        this.props.history.push('/login');
                    },3000);
                }
            })
    }
    render() {
        const errors = this.state.errors;
        return (
            <section className="form">
                <div className="noti"></div>
                
                <form id="formRegister" onSubmit={this.submitForm}>
                    <h1> Đăng Kí </h1>
                    {this.state.errors != "" ? (<p className="error"> {errors[0].message} </p> ): '' }
                    <div className="form-group">
                        <label for="username">
                            Username
                        </label>
                        <input className="form-input" type="text" id="username" onFocus={this.inputFocus} onBlur={this.inputBlur} onChange={(e) => {this.setState({username: e.target.value})}}/>
                    </div>
                    <div className="form-group">
                        <label for="password">
                            Password
                        </label>
                        <input className="form-input" type="password" id="password" onFocus={this.inputFocus} onBlur={this.inputBlur} onChange={(e) => {this.setState({password: e.target.value})}}/>
                    </div>

                    <div className="form-group">
                        <label for="confirmPassword">
                            Confirm Password
                        </label>
                        <input className="form-input" type="password" id="confirmPassword" onFocus={this.inputFocus} onBlur={this.inputBlur} onChange={(e) => {this.setState({confirmPassword: e.target.value})}}/>
                    </div>

                    <div className="form-group">
                        <label for="email">
                            Email
                        </label>
                        <input className="form-input" type="text" id="email" onFocus={this.inputFocus} onBlur={this.inputBlur} onChange={(e) => {this.setState({email: e.target.value})}}/>
                    </div>

                    <div className="form-button">
                        <button className="btn-submit"> Register </button>
                    </div>
                    <div className="flex">
                        <Link to="/"> Home </Link>
                        <Link to="/login"> Login </Link>  
                    </div>
                </form>
            </section>

        );
    }
}