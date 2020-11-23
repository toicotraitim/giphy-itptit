import React, { Component } from "react";
import axios from 'axios';
import {SERVER_URL} from '../config.json';
import Header from './header.component';
import Modal from './modal.component';
import { getUser } from '../middleware/auth.js';

export default class Home extends Component {
    constructor (props) {
        super(props);
        this.state = {
            length: 12,
            gif_id: null,
            gif_id: null,
            bst_id: null,
            data: null,
            bst: null,
            favorites: null,
            statusLoad: false,
            error: false,
            isOpenShare: false,
            isOpenBst: false,
            user: null,
        }
    }
     componentDidMount = async () => {
        let favorites = []; 
        const user = await getUser();
        await axios.get(SERVER_URL + "/api/user?user_id="+user._id)
            .then((res) => this.setState({user: res.data}))
            .catch((err) => this.error());
        await axios.get(`https://api.giphy.com/v1/gifs/trending?api_key=St3iGq5nwkH8bzTKJuFrqMVisVItn3cw&limit=${this.state.length}&rating=g`)
            .then(res => this.setState({data: res.data.data}));
        await axios.get(SERVER_URL + "/api/bst?user_id=" +user._id)
            .then((res) => this.setState({bst: res.data}))
            .catch((err) => this.error());
        await axios.get(SERVER_URL + "/api/favorites?user_id=" +user._id)
            .then((res) => {
                Array.from(res.data).map((item) => {
                    favorites.push(item.gif_id);
                })
                this.setState({favorites: favorites, statusLoad: true})
            })
            .catch((err) => this.error());
        document.title = "Trang chủ";
        
    }
    showMore = async () => {
        this.setState({statusLoad: false});
        
        let length = this.state.length + 10;
        this.setState({length: length});
        await axios.get(`https://api.giphy.com/v1/gifs/trending?api_key=St3iGq5nwkH8bzTKJuFrqMVisVItn3cw&limit=${length}&rating=g`)
            .then(res => this.setState({data: res.data.data, statusLoad: true}))
            .catch((err) => this.error());
        
    }
    like = (e) => {
        if(!this.state.user._id) {
            this.props.history.push('/login');
        }
        const data = {
            token: localStorage.getItem("auth-token"),
            gif_id: this.state.gif_id,
            gif_url: this.state.gif_url
        }
        axios.post(SERVER_URL + "/api/favorites/reaction",data)
            .then((res) => {
                if(res.data.success) {
                    const parent = e.target;
                    const icon = parent.querySelector(".icon");
                    icon.classList.toggle("active");
                    return this.success(res.data.success);
                } else {
                    return this.error();
                }
                
            })
            .catch((err) => this.error());
    }

    checkLike = (id) => {
        const favorites = this.state.favorites;
        let check = false;
        const length = favorites.length;
        for (let i = 0; i< length; i++) {
            if(favorites[i] == id) {
                check = true;
                break;
            }
        }
        return check;
    }
    error = (noidung = "") => {
        if (document.querySelector(".noti"))
            document.querySelector(".noti").innerHTML = `<div class="error"> ${noidung ? noidung: 'Đã xảy ra lỗi, vui lòng thử  lại'} </div>`;
    }
    success= (noidung) => {
        if(document.querySelector(".noti"))
            document.querySelector(".noti").innerHTML = '<div class="success"> '+noidung+' </div>';
    }
    addGifToBst = (e) => {
        e.preventDefault();
        if(!this.state.user._id) {
            this.props.history.push('/login');
        }
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
        const data = this.state.data;
        const bst = this.state.bst;
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
                    <div className="noti">
                        
                    </div>
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
                        <h2> Top Trending</h2> 
                        <section className="list-gif"> 
                            <div className="row row_list-gif">
                                {data !== null ? Array.from(data).map((item,i) => { return (
                                <div className="item" key={i}>
                                    <div className="thumbnail">
                                        <img className="" src={item.images.original.url} />
                                        {this.state.user._id ? <div className="addbst"> <button className="btn" onClick={() => this.setState({isOpenBst: true,gif_url: item.images.original.url, gif_id: item.id})}> <i className="far fa-plus-square"></i> </button> </div> : ""}
                                    </div>
                                    <div className="action">
                                        <div className="like" onClick={async (e) => {
                                            await this.setState({gif_id: item.id, gif_url:item.images.original.url});
                                            return this.like(e);
                                        }}>
                                            <span className={"icon" + (this.checkLike(item.id) == true ? " active" : "")}> </span> 
                                            <span className="text"> Add Your Favorites </span>
                                        </div>
                                        <div className="line"></div>
                                        <div className="share"  onClick={() => this.setState({isOpenShare: true,gif_url: item.images.original.url})}>
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