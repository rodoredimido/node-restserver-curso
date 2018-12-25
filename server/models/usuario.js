const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;


let usuarioShema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es nesesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El e,ail es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        // required: true,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        //required: true,
        default: true
    },
    google: {
        type: Boolean,
        //required: true,
        default: false
    }
});

usuarioShema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioShema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser Unico'
})

module.exports = mongoose.model('Usuario', usuarioShema);