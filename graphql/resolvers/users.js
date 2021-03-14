const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../../config');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const { UserInputError } = require('apollo-server-errors');

function generateToken(user) {
    return jwt.sign(
    {
        id: user.id,
        email: user.email,
        username: user.username
        },
        SECRET_KEY,
        { expiresIn: '1h' }
    );
}


module.exports = {
    Mutation:{

        async login(_, { username, password }) {//ตรวจสอบการล็อคอิน
            
            const {errors, valid} = validateLoginInput(username,password);
            const user = await User.findOne({ username });

            if(!valid){
                throw new UserInputError('Errors',{errors});
            }
            if(!user){
                errors.general = 'User not found';
                throw new UserInputError('User not found',{errors});
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match){
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', { errors });
            }

            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            };
        },

        async register(_,{//ตรวจสอบข้อมูลการสมัคร
            registerInput:{username,email,password,confirmPassword}
        }, context, info){
            // TODO: Validate user data
            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
            );
            if (!valid) {
                throw new UserInputError('Errors',{errors});
            }
            // TODO: Make sure user doesnt already exist
            // TODO: hash password and create an auth token
            password = await bcrypt.hash(password, 12);// hash password 

            const newUser = new User({//บันทึกข้อมูล ตามโมเดลที่สร้างไว้
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();//ตรงนี้บันทึกลง db

            const token = generateToken(res);

            return{
                ...res._doc,
                id:res._id,
                token
            };
        }
    }
};