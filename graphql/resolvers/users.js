const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');

const {SECRET_KEY} = require('../../config');
const User = require('../../modules/User');
const {validateRegisterInput , validateLoginInput} = require('../../util/validator');


function generalToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username 
     }, SECRET_KEY, {expiresIn: '1h'});
}

module.exports = {
    Mutation: {
        async login(parent, {username,password}){
            const {valid ,errors} = validateLoginInput(username,password);
            
            if(!valid) {
                throw new UserInputError('Errors', {errors}); 
            }

            const user = await User.findOne({username});
            if(!user){
               errors.general ='user not found';
               throw new UserInputError('user not found', {errors}); 
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general ='Wrong crendetials';
                throw new UserInputError('Wrong crendetials', {errors}); 
            }
            const token = generalToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(
             parent,
            {
                registerInput: {username, email, password, confirmPassword}},
                context,
                info
                ){
            // todo: validate user data
            const {valid , errors} = validateRegisterInput(username, email, password, confirmPassword);
if(!valid){
    throw new UserInputError('Erros', {errors});
}
            // todo: make sure user dosent alreay exist
            const user = await User.findOne({username})
            if(user) {
                throw new UserInputError('username is taken', {
                    errors: {
                        username: 'this username is taken'
                    }
                })
            }
            
            //  hash password and create an auth token
            password = await bcrypt.hash(password,12);
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generalToken(res);
        return {
            ...res._doc,
            id: res._id,
            token
        }
        }
    }
}