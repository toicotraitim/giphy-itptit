import React, { Component } from "react";
import axios from 'axios';
import {SERVER_URL} from '../config.json';
import { Link } from "react-router-dom";
import { getUser } from '../middleware/auth.js';
import Header from './header.component';
import Modal from './modal.component';
export default class Profile extends Component {
    constructor (props) {
        super(props);
        this.state = {
            length: 6,
            lengthFavorites: 9,
            namebst: "",
            thumbnail: "",
            introduce: "",
            avatar: "",
            cover: "",
            statusLoad: false,
            isOpenSettingProfile: false,
            isOpenSettingIntroduce: false,
            isOpenAddBst: false
        }
        // console.log(props.match.params);
    }
    componentDidMount = async function() {
        const user = await getUser();
        if(!user._id) this.props.history.push('/login');
        await axios.get(SERVER_URL + "/api/user?user_id="+user._id)
            .then((res) => this.setState({user: res.data,avatar: res.data.avatar, cover: res.data.cover, introduce: res.data.introduce}))
            .catch((err) => this.error());
        await axios.get(SERVER_URL + "/api/bst?user_id="+user._id+"&limit="+this.state.length)
            .then((res) => this.setState({data: res.data, statusLoad: true}))
            .catch((err) => this.error());
        document.title = this.state.user ? this.state.user.username : 'Profile';
    }
    showMore = async () => {
        this.setState({statusLoad: false});
        
        let length = this.state.length + 10;
        this.setState({length: length});
        await axios.get(SERVER_URL + "/api/bst?user_id="+this.state.user._id+"&limit="+length)
            .then(res => this.setState({data: res.data, statusLoad: true}))
            .catch((err) => this.error());
    }
    delete = (e) => {
        const data = {
            token: localStorage.getItem("auth-token"),
            gif_id: e.target.getAttribute("data-id"),
            gif_url: e.target.getAttribute("data-url")
        }
        axios.post(SERVER_URL + "/api/favorites/reaction",data)
            .then((res) => {
                e.target.parentNode.parentNode.remove();
            })
            .catch((err) => this.error());
    }
    error = (noidung) => {
        if(document.querySelector(".noti"))
            document.querySelector(".noti").innerHTML = '<div class="error"> '+noidung+' </div>';
    }
    success= (noidung) => {
        if(document.querySelector(".noti"))
            document.querySelector(".noti").innerHTML = '<div class="success"> '+noidung+' </div>';
    }
    addBst = (e) => {
        this.setState({statusLoad: false});
        e.preventDefault();
        if (this.state.namebst == "" || this.state.thumbnail == "") {
            alert("Không được bỏ trống");
        } else {
            const data = {
                token: localStorage.getItem("auth-token"),
                name: this.state.namebst,
                thumbnail: this.state.thumbnail
            }
            axios.post(`${SERVER_URL}/api/bst/add`, data)
                .then(async (res) => {
                    if(res.data.success) {
                        await axios.get(SERVER_URL + "/api/bst?user_id="+this.state.user._id+"&limit="+this.state.length)
                                .then((res) => this.setState({data: res.data, statusLoad: true}))
                                .catch((err) => this.error());
                        return this.success(res.data.success);
                    } else {
                        return this.error(res.data.error);
                    }
                })
                .catch((err) => console.log(err));
        }
        
    }
    editProfile = (e) => {
        this.setState({statusLoad: false});
        e.preventDefault();
        const data = {
            token: localStorage.getItem("auth-token"),
            avatar: this.state.avatar,
            cover: this.state.cover,
            introduce: this.state.introduce
        }
        axios.post(`${SERVER_URL}/api/user/update`, data)
            .then((res) => {
                if(res.data.success) {
                    this.setState({user: res.data.user, statusLoad: true});
                    return this.success(res.data.success);
                } else {
                    return this.error(res.data.error);
                }
            })
            .catch((err) => this.error(err));
    }
    render() {
        let user= this.state.user;
        let data= this.state.data;
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
                    <Modal open={this.state.isOpenSettingProfile} onClose={() => this.setState({isOpenSettingProfile: false})} title="Chỉnh sửa chi tiết">
                        <form onSubmit={this.editProfile}>
                            <div className="form-group">
                                <input type="text" id="avatar" placeholder="Link Avatar" onChange={(e) => this.setState({avatar: e.target.value})} defaultValue={user.avatar ? user.avatar : "./avatar.jpg"}/>
                            </div>
                            <div className="form-group">
                                <input type="url" id="cover" placeholder="Link Cover" onChange={(e) => this.setState({cover: e.target.value})} defaultValue={user.cover ? user.cover : "./cover.jpg"}/>
                            </div>
                            <button className="btn"> Chỉnh sửa </button>
                        </form>
                    </Modal>
                    <Modal open={this.state.isOpenSettingIntroduce} onClose={() => this.setState({isOpenSettingIntroduce: false})} title="Chỉnh sửa giới thiệu">
                        <form onSubmit={this.editProfile}>
                            <div className="form-group">
                                <textarea type="text" id="introduce" onChange={(e) => this.setState({introduce: e.target.value})} defaultValue={user ? user.introduce: ''} rows="5"/>
                            </div>
                            <button className="btn"> Chỉnh sửa </button>
                        </form>
                    </Modal>
                    <Modal open={this.state.isOpenAddBst} onClose={() => this.setState({isOpenAddBst: false})} title="Thêm bộ sưu tập">
                        <form onSubmit={this.addBst}>
                            <div className="form-group">
                                <input type="text" id="namebst" placeholder="Tên bộ sưu tập" onChange={(e) => this.setState({namebst: e.target.value})}/>
                            </div>
                            <div className="form-group">
                                <input type="url" id="thumbnail" placeholder="Link bìa" onChange={(e) => this.setState({thumbnail: e.target.value})}/>
                            </div>
                            <button className="btn"> Tạo </button>
                        </form>
                    </Modal>
                    <div className="container">
                        <section className="profile"> 
                            <div className="profile__head">
                                <div className="cover">
                                    <img src={user.cover ? user.cover : "./cover.jpg"} alt=""/>
                                </div>
                                <div className="user">
                                    <img src={user.avatar ? user.avatar : "./avatar.jpg"} className="user__avatar" alt="" />
                                    <p className="user__fullname"> {user ? user.username : ''}</p>
                                </div>
                                <button className="btn" onClick={(e) => this.setState({isOpenSettingProfile: true})}> Chỉnh sửa </button> 
                            </div>
                            <div  className="row row_profile">
                                <div>
                                    <div className="introduce">
                                        <h1> Giới thiệu </h1>
                                        <p> {user.introduce ? user.introduce: ''} </p>
                                        <button className="btn btn-grey"  onClick={(e) => this.setState({isOpenSettingIntroduce: true})}> Chỉnh sửa giới thiệu </button>
                                    </div>
                                </div>
                                <div>
                                    <div className="btn__add-bst">
                                        <button className="btn btn-primary float-right" onClick={(e) => this.setState({isOpenAddBst: true})}> Thêm bộ sưu tập </button>
                                    </div>
                                    <section className="bst">
                                        <div className="row row_bst">
                                        {data !== null ? Array.from(data).map((item,i) => { return (
                                            <div className="item" key={i}> 
                                                <div className="thumbnail">
                                                    <img src={item.thumbnail} alt="" />
                                                </div>
                                                <div className="name">
                                                    {item.name}
                                                </div>
                                                <div className="view"> 
                                                    <Link to={"/bst/"+item._id}> View</Link>
                                                </div>
                                            </div>
                                        )}): ''}
                                        </div>
                                        <div className="showMore"> <button onClick={() => this.showMore()} className="btn btn-primary"> Xem thêm </button> </div>
                                    </section>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

            );
        }
    }
}