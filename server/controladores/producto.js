const express = require('express');

const {verificaToken} = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

/**
 *Obtener todos los productos
 */
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto
        .find({disponible: true})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count((err, conteo) => {

                res.json({
                    ok: true,
                    productos,
                    conteo
                });
            });

        });
});

/**
 * Obtener producto by id
 */
app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto
        .findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto con el id no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

/**
 * Buscar productos
 */
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    //Expresión regular
    //i : insensible a mayus y minus
    let regex = new RegExp(termino, 'i');

    Producto
        .find({nombre: regex})
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        });
});


/**
 * Crear un nuevo producto
 */
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    });
});

/**
 * Actualiza un producto
 */
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let body = req.body;

    Producto
        .findById(id, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se ha encontrado producto'
                    }
                });
            }

            productoDB.nombre = body.nombre || productoDB.nombre;
            productoDB.precioUni = body.precioUni || productoDB.precioUni;
            productoDB.descripcion = body.descripcion || productoDB.descripcion;
            productoDB.disponible = body.disponible || productoDB.disponible;
            productoDB.categoria = body.categoria || productoDB.categoria;

            productoDB.save((err, productoGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    producto: productoGuardado
                });
            });
        });
});

app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let disponibilidad = {
        disponible: false
    };

    Producto
        .findByIdAndUpdate(id, disponibilidad, {new: true}, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se ha encontrado producto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});


module.exports = app;
