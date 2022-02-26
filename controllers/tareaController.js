const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');


// Crea una nueva tarea
exports.crearTarea = async( req, res) => {
    // Revisar si hay errores
    const errores = validationResult( req );
    if( !errores.isEmpty() ) {
        return res.status( 400 ).json( { errores : errores.array() } )
    }

    
    try {
        
        // Extrar el proyecto y comprobar si existe
        const { proyecto : proyectoExistente } = req.body;

        const proyecto = await Proyecto.findById( proyectoExistente );
        if( !proyecto ) {
            return res.status( 404 ).json( { msg : 'Proyecto no encontrado' } );
        }

        // revisar si el proyecto actual pertenece al usuario autenticado
        if( proyecto.creador.toString() !== req.usuario.id ) {
            return res.tatus( 401 ).json( { msg : 'No autorizado' } )
        }

        // creamos la tarea
        const tarea = new Tarea( req.body );
        await tarea.save();
        res.json( { tarea } );
    } catch (error) {
        console.log( error );
        res.status( 500 ).send('Hubo un error')
    }
}

// Traer tareas por proyecto
exports.obtenerTareas = async( req, res ) => {
    
    try {
        // Extraer el proyecto
        const { proyecto : proyectoExistente } = req.query;

        const proyecto = await Proyecto.findById( proyectoExistente );
        if( !proyecto ) {
            return res.status( 404 ).json( { msg : 'Proyecto no encontrado' } );
        }

        // revisar si el proyecto actual pertenece al usuario autenticado
        if( proyecto.creador.toString() !== req.usuario.id ) {
            return res.tatus( 401 ).json( { msg : 'No autorizado' } )
        }

        // Obtener las tareas por proyecto
        const tareas = await Tarea.find( { proyecto } );
        res.json( { tareas } );
    } catch (error) {
        console.log( error );
        res.status( 500 ).send('Hubo un error');
    }
}

// Actualizar tarea
exports.actualizarTarea = async( req, res) => {
    try {
        // Extraer el proyecto
        const { proyecto : proyectoExistente, nombre, estado } = req.body;

        // Revisar si la tarea existe
        let tarea = await Tarea.findById( req.params.id );

        if(!tarea) {
            return res.tatus( 404 ).json( { msg : 'No existe esa tarea' } )
        }

        // Extraer proyecto
        const proyecto = await Proyecto.findById( proyectoExistente );

        // revisar si el proyecto actual pertenece al usuario autenticado
        if( proyecto.creador.toString() !== req.usuario.id ) {
            return res.tatus( 401 ).json( { msg : 'No autorizado' } )
        }

        // Crear un objeto con la nueva información
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;

        nuevaTarea.estado = estado;

        // Guardar la tarea
        tarea = await Tarea.findOneAndUpdate( { _id : req.params.id }, nuevaTarea, { new : true} );
        res.json( { tarea } )
    } catch (error) {
        console.log( error );
        res.status( 500 ).send('Hubo un error');
    }
}

// Eliminar tarea
exports.eliminarTarea = async( req, res ) => {
    try {
        // Extraer el proyecto
        const { proyecto : proyectoExistente } = req.query;

        // Revisar si la tarea existe
        let tarea = await Tarea.findById( req.params.id );

        if(!tarea) {
            return res.tatus( 404 ).json( { msg : 'No existe esa tarea' } )
        }

        // Extraer proyecto
        const proyecto = await Proyecto.findById( proyectoExistente );

        // revisar si el proyecto actual pertenece al usuario autenticado
        if( proyecto.creador.toString() !== req.usuario.id ) {
            return res.tatus( 401 ).json( { msg : 'No autorizado' } )
        }

        // Eliminar tarea
        await Tarea.findOneAndRemove( { _id : req.params.id } );
        res.json( { msg: 'Tarea eliminada' } )
    } catch (error) {
        console.log( error );
        res.status( 500 ).send('Hubo un error');
    }
}