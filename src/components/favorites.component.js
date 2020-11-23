import React, { Component } from "react";
import axios from 'axios';
import {SERVER_URL} from '../config.json';
import { getUser } from '../middleware/auth.js';
import Header from './header.component';
import Modal from './modal.component';

export default class Favorites extends Component {
    constructor (props) {
        super(props);
        this.state = {
            length: 12,
            data: null,
            bst: null,
            statusLoad: false,
            gif_id: null,
            gif_url: null,
            bst_id: null,
            isOpenShare: false,
            isOpenBst: false,

        }
    }
    componentDidMount = async function() {
        const user = await getUser();
        if(!user._id) this.props.history.push('/login');
        await axios.get(SERVER_URL + "/api/bst?user_id=" +user._id)
            .then((res) => this.setState({bst: res.data}))
            .catch((err) => this.error());
        await axios.get(SERVER_URL + "/api/favorites?user_id="+user._id+"&limit="+this.state.length)
            .then((res) => this.setState({data: res.data, statusLoad: true}))
            .catch((err) => this.error());
        this.setState({user_id: user._id});
        document.title = "Your Favorites";

    }
    showMore = async () => {
        this.setState({statusLoad: false});
        
        let length = this.state.length + 10;
        this.setState({length: length});
        await axios.get(SERVER_URL + "/api/favorites?user_id="+this.state.user_id+"&limit="+length)
            .then(res => this.setState({data: res.data, statusLoad: true}))
            .catch((err) => this.error());
    }
    delete = (e) => {
        const data = {
            token: localStorage.getItem("auth-token"),
            gif_id: this.state.gif_id
        }
        if(e.target.parentNode.parentNode.classList.value == "item") {
            axios.post(SERVER_URL + "/api/favorites/remove-reaction",data)
                .then((res) => {
                    if(res.data.success) {

                        e.target.parentNode.parentNode.remove();
                        return this.success(res.data.success);
                    } else {
                        return this.error(res.data.error);
                    }
                })
                .catch((err) => this.error());
        } else {
            return this.error();
        }
    }
    error = () => {
        if(document.querySelector(".noti"))
            document.querySelector(".noti").innerHTML = '<div class="error"> Đã xảy ra lỗi, vui lòng thử lại </div>';
    }
    success= (noidung) => {
        if(document.querySelector(".noti"))
            document.querySelector(".noti").innerHTML = '<div class="success"> '+noidung+' </div>';
    }
    addGifToBst = (e) => {
        e.preventDefault();
        if(!this.state.bst_id) {
            alert("Bạn chưa chọn bộ sưu tập");
        } else {
            const data = {
                token: localStorage.getItem("auth-token"),
                gif_id: this.state.gif_id,
                gif_url: this.state.gif_url,
                bst: this.state.bst_id
            }
            axios.post(`${SERVER_URL}/api/cnbst/add`,data)
                .then((res) => {
                    if(res.data.success) {
                        this.success(res.data.success);

                    } else {
                        this.error(res.data.error);
                    }
                }).catch((err) => {
                    this.error();
                    
                });
        }
    }
    render() {
        const bst = this.state.bst;
        const data= this.state.data;
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
                    <div className="noti"></div>
                    <Modal open={this.state.isOpenShare} onClose={() => this.setState({isOpenShare: false})} title="Share">
                        <form>
                            <div className="form-group">
                                <textarea type="text" placeholder="share" defaultValue={this.state.gif_url ? this.state.gif_url : ""} rows="5"/>
                            </div>
                        </form>
                    </Modal>
                    <Modal open={this.state.isOpenBst} onClose={() => this.setState({isOpenBst: false})} title="Thêm vào bộ sưu tập">
                        <form onSubmit={this.addGifToBst}>
                            <div className="form-group">
                                <input type="hidden" defaultValue={this.state.gif_id ? this.state.gif_id : ""} /> 
                            </div>
                            <div className="form-group">
                                <select onChange={(e) => this.setState({bst_id: e.target.value})}>
                                    <option> Chọn bộ sưu tập </option>
                                    {bst ? Array.from(bst).map((item,index) => {
                                    return (
                                        <option value={item._id} key={index}> {item.name} </option>
                                    ) 
                                    }) : ''}
                                </select>
                            </div>
                            <button className="btn"> Thêm </button>
                        </form>
                    </Modal>
                    <div className="container">
                        <h2> Your Favorites </h2>
                        <section className="list-gif"> 
                            <div className="row row_list-gif">
                                {data !== null ? Array.from(data).map((item,i) => { return (
                                <div className="item" key={i}>
                                    <div className="thumbnail">
                                        <img className="" src={item.gif_url} />
                                        <div className="addbst"> <button className="btn" onClick={() => this.setState({isOpenBst: true,gif_url: item.gif_url, gif_id: item.gif_id})}> <i className="far fa-plus-square"></i> </button> </div>

                                    </div>
                                    <div className="action">
                                        <div className="delete" onClick={async(e) => {
                                            await this.setState({gif_id: item.gif_id});
                                            return this.delete(e);
                                        }}>
                                            <span className="icon"> </span> 
                                            <span className="text"> Delete </span>
                                        </div>
                                        <div className="line"></div>
                                        <div className="share" onClick={() => this.setState({isOpenShare: true,gif_url: item.gif_url})}>
                                            <span className="icon"> </span> 
                                            <span className="text"> Share It </span>
                                        </div>
                                    </div>
                                </div>) }) : ''
                                }
                            </div>
                            <div className="showMore"> <button onClick={this.showMore} className="btn btn-primary"> Xem thêm </button> </div>
                        </section>
                        
                    </div>
                </div>

            );
        }
    }
}