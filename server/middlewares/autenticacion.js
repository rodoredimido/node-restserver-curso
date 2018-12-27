const jwt = require('jsonwebtoken');

// ============================
// verificar tokens
// ============================

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();

    });
};


// ============================
// verificar Admin Role
// ============================

// res.json({
//     token
// })
// esto se llama para que pueda continuar el codigo


let verificaAdmin_Role = (req, res, next) => {
    let token = req.get('token');
    let usuario = req.usuario;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        if (usuario.role !== 'ADMIN_ROLE' && decoded.usuario !== 'ADMIN_ROLE') {
            return res.json({
                ok: false,
                err: {
                    message: 'El Uuario no es administrador'
                }
            });
        }

        next();
    });


    // jwt.verify(token, process.env.SEED, (err, decoded) => {
    //     if (err) {
    //         return res.status(401).json({
    //             ok: false,
    //             err: {
    //                 message: 'Token no valido'
    //             }
    //         });
    //     }
    //     req.usuario = decoded.usuario;
    //     next();

    // });


};






module.exports = {
    verificaToken,
    verificaAdmin_Role
}