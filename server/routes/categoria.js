const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categorias');


// =================================
// Mostrar todas las categoria
// =================================
app.get('/categoria', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // Categoria.find({ /*aqui debe ser igual*/ }, 'descripcion') // solo vendra descripcion
    Categoria.find({ /*aqui debe ser igual*/ })
        // .skip(desde)
        // .limit(limite)
        .sort('descripcion')
        .populate('usuario', 'nombre email') // esto llama la tabla del usuario segun el prodicto creado
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({ /*aqui debe ser igual a find*/ }, (err, conteo) => {
                res.json({
                    ok: true,
                    categoria,
                    cuantos: conteo
                })
            });


        });
});

// =================================
// Mostrar Una categoria por ID
// =================================

app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'La categoria nop exsiste'
                }
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es Valido'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
    // Categoria.finsById(....)
});

// =================================
// Crear una categoria
// =================================

app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nieva categoria
    let usuario_id = req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        //nombre: body.nombre,
        //tipo: body.tipo,
        descripcion: body.descripcion, //bcrypt.hashSync(body.password, 10),
        usuario: usuario_id
    });
    //console.log(usuario);

    categoria.save((err, categoriaDB) => {
        // console.log(err);
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No fue posible salvar la categoria'
                }
            })
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });


});


// =================================
// ACTUALIZAR  Una categoria por ID
// =================================

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    // let body = _.pick(req.body, ['nombre', 'tipo', 'descripcion']);
    let body = req.body; //_.pick(req.body, ['nombre', 'tipo', 'descripcion']);

    let descCategoria = {
        descripcion: body.descripcion
    }

    //Usuario.findById( id, (err, usuarioDB) )

    // delete body.password;
    // delete body.google;
    Categoria.findByIdAndUpdate(
        id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe la categoria en la base de datos'
                    }
                })
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });
        })


});


// =================================
// eliminar  Una categoria por ID
// =================================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Solo un administrador puede eliminar  o borrar categorias
    // Categoria.finsById(....)

    let id = req.params.id;




    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no existe'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBorrado
        })
    })



});

module.exports = app;