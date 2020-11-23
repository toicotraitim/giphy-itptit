import React from "react";

export default function Modal({open,title,children,onClose}) {
    if(!open) return null;
    return (
        <div className="box-modal" id="share">
            <div className="modal">
                <div className="title">
                    <span className="float-right" onClick={onClose}><i className="fas fa-times"></i></span>
                    <h3> {title} </h3>
                </div>
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    );
}