import express, { json, Request, Response } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import { root_path } from "./root_path";
import cors from "cors";
import path from "path";
import fs from 'fs';

// Creamos la instancia de express
const app = express();

// Creamos los middlewares
app.use( cors() );
app.use( json() );

// Creamos unas rutas
app.post('/registro', [ fileUpload() ] , async ( req: Request, res: Response ) => {
    // Intentamos acceder al body
    const { email, password } = req.body;
    
    // Hacemos unas validaciones
    if ( !email || !password )
        return res.status(400).json({ estado: false, mensaje: "Debe de proporcionar el correo y/o el password" });
    // Verificamos el archivo
    if ( !req.files?.lineamiento ) {
        return res.status(400).json({ estado: false, mensaje: "Debe de proporcionar el archivo" });
    }
    // Verificamos ahora propiedades deñ archivo
    const archivo = req.files?.lineamiento as UploadedFile
    const nombre_file = archivo.name;
    const size_file = archivo.size / 1000000;

    // Si el archivo no es un zip
    if ( !nombre_file.endsWith('.zip')  ) {
        return res.status(400).json({ estado: false, mensaje: "El archivo debe ser un zip" });
    }

    // Si el tamaño del archivo excede 1 MB entonces no es valido
    if ( size_file > 2 ) {
        return res.status(400).json({ estado: false, mensaje: "El archivo debe ser menor o igual a 1MB" });
    }
    try {
        // Movems el archivo
        const path_file = path.join(root_path, 'uploads', nombre_file);
        // Podemos comprobar si el archivo existe
        if ( fs.existsSync( path_file ) ) 
            return res.status(400).json({ estado: false, mensaje: "Archivo ya subido, ingrese otro o cambiele el nombre" });

        await archivo.mv( path_file );
        return res.status(200).json({ estado: true, mensaje: "Archivo subido" });        
    } catch (error) {
        return res.status(500).json({ estado: false, mensaje: "Ocurrio un error al subir el archivo" })
    }
});

// Creamos un servidor
app.listen( 5000, () => {
    console.log('servidor en el puerto: ', 5000);
})

