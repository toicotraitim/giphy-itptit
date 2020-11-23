const Cnbst = require('../models/cnbst.model');
const Bst = require('../models/bst.model');

exports.getCnbst = async (req,res) => {
        return Cnbst.find({bst_id: req.query.bst_id}).sort({ createdAt: -1}).limit(parseInt(req.query.limit))
                        .then((response) => res.json(response))
                        .catch((err) => res.json(err));
}
exports.addCnbst = async (req,res) => {
    if(!req.body.bst && req.body.gif_id && req.body.gif_url) {
        return res.json({error: "Xảy ra lỗi"});
    } else {

        await Bst.findOne({_id: req.body.bst, user_id: req.decoded._id})
                .then((response) => {

                    if(!response) {
                        return res.json({error: "Bộ sưu tập không tồn thại"});
                    }
                }).catch((err) => res.json(err));
    }
    await Cnbst.findOne({bst_id: req.body.bst, gif_id: req.body.gif_id})
            .then(async(response) => {
                if(response) {
                    return res.status(200).json({error: "Gif này đã có trong bộ sưu tâp"});
                } else {
                    const newCnbst = await new Cnbst({
                        gif_id: req.body.gif_id,
                        gif_url: req.body.gif_url,
                        bst_id: req.body.bst
                        
                    }); 
                    await newCnbst.save()
                        .then(() => res.json({ success: 'Thêm thành công'}))
                        .catch(error => res.status(400).json(error));
                }
            })
            .catch((err) => res.json(err));
    
}
exports.removeCnbst = async (req,res) => {
    Cnbst.findOne({_id: req.body.id})
        .then((response) => {
            if(response) {
                Bst.findOne({_id: response.bst_id})
                    .then((ress) => {
                        if(ress) {
                            if(ress.user_id != req.decoded._id) {
                                return res.json({error: "Lỗi"});
                            } else {
                                Cnbst.deleteOne({_id: req.body.id})
                                    .then((resss) => res.json({success: "Đã xóa"}))
                                    .catch((errr) => res.json({error: "lỗi"}));
                            }
                        } else {
                            return res.json({error: "Lỗi"});
                        }
                    }).catch((err) => {
                        return res.json({error: "Lỗi"});
                    });
            } else {
                return res.json({error: "Lỗi"}); 
            }
        }).catch((error) => {
            return res.json({error: "Lỗi"});

        })
}