const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');


let app = express()

let Producto = require('../models/producto');


// =================================
// Obtener productos
// =================================

app.get('/productos', verificaToken, (req, res) => {
    // Trae todos los productos
    // populate: usuario Categoria
    // Paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);



    Producto.find({ disponible: true })
        .skip(desde) // desde
        .limit(limite) // cuantos
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            Producto.count({ disponible: true /*aqui debe ser igual a find*/ }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos: productosDB,
                    cuantos: conteo
                });
            })

        });
});


// =================================
// Obtener un producto por ID
// =================================

app.get('/productos/:id', verificaToken, (req, res) => {
    // Trae un producto
    // populate: usuario Categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productosDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'No existe un producto con esta ID'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productosDB
            })
        });
});

// =================================
// Buscar producto
// =================================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
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
        })



});

// =================================
// Crear un nuevo PRoducto
// =================================

app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    //
    let usuario_id = req.usuario._id
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: Number(body.precioUni),
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: usuario_id
    });
    //console.log(usuario);

    producto.save((err, productoDB) => {
        // console.log(err);
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
                    message: 'No fue posible salvar la categoria'
                }
            })
        }


        res.status(201).json({
            ok: true,
            producto: productoDB
        })

    });

});


// =================================
// Actualizar un  PRoducto
// =================================

app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;
    // let body = _.pick(req.body, ['nombre', 'tipo', 'descripcion']);
    let body = req.body; //_.pick(req.body, ['nombre', 'tipo', 'descripcion']);

    let producto = {
        nombre: body.nombre,
        precioUni: Number(body.precioUni),
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        // usuario: usuario_id
    };

    //Usuario.findById( id, (err, usuarioDB) )

    // delete body.password;
    // delete body.google;
    Producto.findByIdAndUpdate(
        id, producto, { new: true, runValidators: true }, (err, productoDB) => {

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
                        message: 'No existe la categoria en la base de datos'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        })

});

// =================================
// Borrar un  PRoducto
// =================================

app.delete('/productos/:id', verificaToken, (req, res) => {

    // noe s eliminarlo de la base de datoes es actalizar si 
    // es  disponible
    // res.json('Delete Usuarios');

    let id = req.params.id;
    disponible = {
            disponible: false
        }
        // forma uno
        // Producto.findByIdAndUpdate(
        //     id, disponible, { new: true }, (err, productoBorrado) => {

    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         }
    //         if (!productoBorrado) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err: {
    //                     message: 'Usuario no existe'
    //                 }
    //             });
    //         }

    //         res.json({
    //             ok: true,
    //             producto: productoBorrado
    //         });
    //     });
    // forma 2
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!productoBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto borrado'
            })
        });
    })

});







module.exports = app;