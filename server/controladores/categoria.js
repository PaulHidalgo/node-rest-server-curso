const express = require('express');
const _ = require('underscore');

let {verificaToken, verficaAdminRole} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

/**
 * Mostrar todas las categorias
 */
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario','nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            })

        });
});

/**
 * Mostrar una categoría por ID
 */
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (!categoria) {
            return res.status(200).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada por el ID'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        })

    });
});

/**
 * Crear nueva categoría
 */
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //id de la personal que creó -> req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

/**
 * Actualizar categoría by id
 */
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let descripcion = req.body.descripcion;

    Categoria.findByIdAndUpdate(id, {descripcion}, {new: true, runValidators: true}, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

/**
 * Borrar categoría by id
 */
app.delete('/categoria/:id', [verificaToken, verficaAdminRole], (req, res) => {
    //solo administrador puede borrar categorías
    //Categoria.findByIdAndRemove
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(200).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoría Borrada'
        });
    });

});

module.exports = app;
