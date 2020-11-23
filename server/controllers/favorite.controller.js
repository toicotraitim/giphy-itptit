const Favorite = require('../models/favorite.model');
exports.getFavorite = async (req,res) => {
        return Favorite.find({user_id: req.query.user_id}).sort({ createdAt: -1}).limit(parseInt(req.query.limit))
                        .then((response) => res.json(response))
                        .catch((err) => res.json(err));
}
exports.reactionFavorite = async (req,res) => {
    const gif_id = req.body.gif_id;
    const gif_url = req.body.gif_url;

    await Favorite.findOne({gif_id: gif_id,user_id: req.decoded._id})
                .then(async (gif) => {
                    if(gif) {
                        Favorite.deleteOne({gif_id,
                            user_id: req.decoded._id})
                        .then(() => res.json({ success: 'Xóa thành công'}))
                        .catch(error => res.json(error));
                    } else {
                        const newFavorite = await new Favorite({
                            gif_id,
                            gif_url,
                            user_id: req.decoded._id
                        });
                        await newFavorite.save()
                        .then(() => res.json({ success: 'Thêm thành công'}))
                        .catch(error => res.json(error));
                    }
                })
                .catch((err) => res.json(err));
    
}
exports.removeReaction = async (req,res) => {
    const gif_id = req.body.gif_id;
    const user_id = req.decoded._id;
    await Favorite.findOneAndDelete({gif_id: gif_id,user_id: user_id})
                .then((response) => {

                    if(response) {
                        return res.json({success: "Đã xóa"})
                    } else {
                        return res.json({error: "Lỗi"});
                    }
                })
                .catch((err) => res.json(err));
    
}
