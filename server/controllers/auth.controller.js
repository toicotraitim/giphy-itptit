const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/auth.model');
const { SECRET, TOKEN_LIFE } = require('../config/config.json');
exports.getUserController = async(req,res) => {
    const user_id = req.query.user_id;
    User.findOne({_id: user_id})
        .then((response) => res.json(response))
        .catch((err) => res.json(err));
} 
exports.registerController = async(req,res) => {
    const { username, password, confirmPassword, email } = req.body;
    let errors = [];
    if(username != "" && password != "" && confirmPassword != "" && email != "")  {
        await User.findOne({username: username})
            .then((res) => {
                if(res) {
                    let error = {"message": "Tài khoản đã tồn tại" };
                    errors.push(error);
                }
            })
            .catch(err => res.json({error: err}));
        if(password !== confirmPassword) {
            let error = {"message": "Mật khẩu không khớp"};
            errors.push(error);
        }
    } else {
        let error = {"message": "Vui lòng điền đầy đủ thông tin" };
        errors.push(error);
    }
    if(errors.length == 0) {
        const hasPassword = await bcrypt.hashSync(password, 10);
        const newUser = await new User({
            username,
            email,
            password: hasPassword,
            introduce: "",
            avatar: "",
            cover: ""
        });
        await newUser.save()
            .then(() => res.json({ success: 'Đăng kí thành công'}))
            .catch(error => res.status(400).json(error));
    } else {
        return res.json({errors: errors});
    }
}
exports.loginController = async(req,res) => {
    const token = jwt.sign(req.user.toJSON(), SECRET, {
        expiresIn: TOKEN_LIFE,
    });
    const response = {
        token,
        success: "Đăng nhập thành công"
    }
    return res.status(200).json(response);
};
exports.updateController = async (req,res) => {
    let avatar = req.body.avatar || req.decoded.avatar;
    let cover = req.body.cover || req.decoded.cover;
    let introduce = req.body.introduce || req.decoded.introduce;
    const data = {
        avatar,
        cover,
        introduce
    }
    User.findOneAndUpdate({_id: req.decoded._id},data)
        .then((response) => {
            User.findOne({_id: response._id})
                .then((ress) => res.json({user:ress, success: "cập nhật thành công"}))
                .catch((err) => res.json({error: err}));
        })
        .catch((err) => res.json({error: err}));
}