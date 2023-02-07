import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 
  // Creamos un formulario
  loginForm!: FormGroup;

  constructor( private fb: FormBuilder ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({ 
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      lineamiento: ['', [Validators.required]],
    })
  }

  cargarArchivo( event: Event, target: string, type_file: string | string[] ) {
    // Obtenemos el archivo
    const referenciaHTML = event.target as HTMLInputElement;
    const archivo = (referenciaHTML.files as FileList)[0];
    const mensaje = document.querySelector(`small[data-text="${target}"]`) as HTMLElement;
    const mensajeArchivo = document.querySelector(`span[data-text="${target}"]`) as HTMLElement;

    // Si existe el archivo
    if ( archivo ) {
      // Obtenemos el tamaño del archivo MB
      const tamanio_archivo = archivo.size / 1000000; 
      const nombre_archivo = archivo.name;
      // Hacemos unas validaciones
      if ( tamanio_archivo > 2 ) { // Si el tamaño de archivo supera los 2MB
        mensaje.textContent = 'El tamaño del archivo debe ser menor a 2MB';
        this.loginForm.get('lineamiento')?.setValue(null);
        return;
      } 
      // Si el archivo no tiene una terminación de acuerdo al tipo de archivo
      if ( !nombre_archivo.endsWith( type_file as string ) ) {
        mensaje.textContent = 'El archivo solo acepta: ' + type_file + ' por favor seleccione otro';
        this.loginForm.get('lineamiento')?.setValue(null);
        return;
      }
      // Si el archivo termina en el tipo y es menor a 2MB
      if ( nombre_archivo.endsWith( type_file as string ) && tamanio_archivo <= 2 ) {
        mensaje.textContent = 'Archivo aceptado';
        this.loginForm.get('lineamiento')?.setValue(archivo);
        mensajeArchivo.textContent = nombre_archivo;
      }
    } else { // Si no existe
      mensaje.textContent = 'Seleccione un archivo';
      mensajeArchivo.textContent = 'Subir archivo';
      this.loginForm.get('lineamiento')?.setValue(null);
    }


  }

  async onSubmit() {
    if( this.loginForm.invalid ) 
      return;
    // Creamos un nuevo formdata
    const formData = new FormData();
    const formValues = this.loginForm.value;
    // Recorremos nuestro objeto de formulario
    for( const o in formValues ) {
      formData.append( o, formValues[o] );
    }

    // Hacemos la peticion al servidor
    try {
      const resp = await fetch('http://localhost:5000/registro',{ method: 'POST', body: formData });
      const data = await resp.json();
      console.log('Data: ', data );
    } catch (error) {
      console.log('Error: ', error );
    }
    
  }

}
