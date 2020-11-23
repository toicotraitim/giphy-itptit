const Bst = require('../models/bst.model');
exports.getBst = async (req,res) => {

        return Bst.find({user_id: req.query.user_id}).sort({ createdAt: -1}).limit(parseInt(req.query.limit))
                        .then((response) => res.json(response))
                        .catch((err) => res.json(err));
}
exports.getBstById =async (req,res) => {
    return Bst.findOne({_id: req.query.id})
                    .then((response) => res.json(response))
                    .catch((err) => res.json(err));
}
exports.addBst = async (req,res) => {
    if(req.body.name == "" || req.body.thumbnail == "") {
        return res.json({error: "Không được để trống"});
    }
    await Bst.findOne({name: req.body.name, user_id: req.decoded._id})
            .then(async(response) => {
                if(response) {
                    return res.status(200).json({error: "Bộ sưu tập đã tồn tại"});
                } else {
                    const newBst = await new Bst({
                        name: req.body.name,
                        thumbnail: req.body.thumbnail,
                        user_id: req.decoded._id
                        
                    }); 
                    await newBst.save()
                        .then(() => res.json({ success: 'Thêm thành công'}))
                        .catch(error => res.status(400).json(error));
                }
            })
            .catch((err) => res.json(err));
    
}