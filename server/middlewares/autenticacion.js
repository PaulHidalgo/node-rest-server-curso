const jwt = require('jsonwebtoken');

/**
 * Verificar Token
 */
let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

/**
 * Verifica AdminRole
 */

let verficaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(200).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })

    }

    next();
};

/**
 * Verifica Token para imagen
 */

let verficaTokenImg = (req, res, next) => {

    let token=req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

module.exports = {
    verificaToken,
    verficaAdminRole,
    verficaTokenImg
};
