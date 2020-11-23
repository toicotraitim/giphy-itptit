import React, { Component } from "react";
import axios from 'axios';
import {SERVER_URL} from '../config.json';
import { getUser } from '../middleware/auth.js';
import Header from './header.component';
import Modal from './modal.component';

export default class Cnbst extends Component {
    constructor (props) {
        super(props);
        this.state = {
            length: 12,
            bst: null,
            items: null,
            statusLoad: false,
            gif_id: null,
            gif_url: null,
            bst_id: props.match.params.id,
        }
    }
    componentDidMount = async function() {
        const user = await getUser();
        if(!user._id) this.props.history.push('/login');
        await axios.get(`${SERVER_URL}/api/bst/get?token=${localStorage.getItem("auth-token")}&id=${this.state.bst_id}`)
            .then((res) => this.setState({bst: res.data}))
            .catch((err) => this.error());
        await axios.get(`${SERVER_URL}/api/cnbst?token=${localStorage.getItem("auth-token")}&bst_id=${this.state.bst_id}&limit=${this.state.length}`)
            .then((res) => this.setState({items: res.data, statusLoad: true}))
            .catch((err) => this.error());
        document.title = this.state.bst ? this.state.bst.name : "Bô sưu tập";
        console.log(this.state.items);
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
            id: this.state.gif_id
        }
        if(e.target.parentNode.parentNode.classList.value == "item") {
            axios.post(SERVER_URL + "/api/cnbst/remove",data)
                .then((res) => {
                    console.log(res);
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
    render() {
        const items = this.state.items;
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
                    <div className="container">
                        <h2> {this.state.bst.name} </h2>
                        <section className="list-gif"> 
                            <div className="row row_list-gif">
                                {items !== null ? Array.from(items).map((item,i) => { return (
                                <div className="item" key={i}>
                                    <div className="thumbnail">
                                        <img className="" src={item.gif_url} />

                                    </div>
                                    <div className="action">
                                        <div className="delete" onClick={async(e) => {
                                            await this.setState({gif_id: item._id});
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