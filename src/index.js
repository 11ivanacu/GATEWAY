//Libreras para obtener datos desde el puerto serial y para parsear los datos
const { SerialPort } = require('serialport');
const { ReadlineParser } = require("@serialport/parser-readline");
//import fetch from 'node-fetch';
const fetch = require('node-fetch');


//Crear el objeto que representa el puerto serial, en este caso el arduino mega esta en el COM6
//dependera del arduino y del sistema operativo
const port = new SerialPort(
    {
        path: 'COM3',
        baudRate: 115200
    }
    );

//Parsear el mensaje en el puerto serial, se leera hasta que exista un salto de linea
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

//Abrir el puerto serial
port.on("open", ()=>{
    console.log('serial port open');
    });

//Declaro las variables que se van a publicar
var flag = false; //La bandera se usa cuando el comando que se recibe es +CMT, el mensaje
//llega despues del salto de linea
var mensaje = '';
var phone = '';
var time_stamp = '';
var tipo = ''; 

parser.on('data', data=>{
    console.log('Mensaje', data);
    
    try{
        data0 = data.toString(); //Convierto el mensaje en cadena de caracteres
        data1 = data0.split('"'); //Primera descomposicion del mensaje, cortar en cada comilla simple
        
        //Si es '+CMT' el mensaje llegara despues en el proximo data
        if(flag == true){
            mensaje = data0;
            //var_posteo = "{'phone':" + phone +','+ "'time_stamp':" + time_stamp +','+"'mensaje':" + mensaje +'}';

            //Definir si el mensaje es de estado o es de alarma basado en el contenido de la variable mensaje
            if(mensaje[0] == 'M'){
                tipo = 'alerta';
            }else{
                if (mensaje.length < 30){
                    tipo = 'estado';
                    console.log(mensaje.length);
                }else{
                    tipo = ' ';
                    console.log('mensaje largo');
                }
            }

            var_posteo = {
                deviceID: phone,
                t_stamp: time_stamp,
                sms_cont: mensaje
            }
            console.log(var_posteo);
            console.log(tipo);
            //console.log(typeof(JSON.stringify(var_posteo)));
            //console.log(JSON.stringify(var_posteo));
            registro(var_posteo,tipo);
            flag =false;
        }

        if(data1.length>2){
            //Descomponer '+CMT: ' => ['+CMT',' ']
            data2 = data1[0].split(':');

            if(data2 = '+CMT'){
                flag = true;
                phone = data1[1];
                time_stamp = data1[5];
            }
           //console.log(phone);
        }

        //console.log(data1);
        
    }catch (error){
        console.error(error);
    } 
    
});



function registro(body,tipo){
    console.log(body)
        if(tipo == "alerta"){
            let url= 'http://iot-api.constecoin.com/api/alcantarillas/saveAlarmaAlcantarilla';
            console.log('alerta posteada');
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            };
        
            return new Promise((resolve, reject) => {
                fetch(url, requestOptions)
                .then(res => res.json())
                .then(respuesta => {
                    resolve(respuesta)
                },
                    error => reject(error)
                )
            })
        }else if (tipo == "estado"){
            let url= 'http://iot-api.constecoin.com/api/alcantarillas/saveMensajeAlcantarilla';
            console.log('estado porsteado');
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            };
        
            return new Promise((resolve, reject) => {
                fetch(url, requestOptions)
                .then(res => res.json())
                .then(respuesta => {
                    resolve(respuesta)
                },
                    error => reject(error)
                )
            })
        }
        
        
    }

//var data={
//    id: '000',
//    fecha: '000',
//    mensaje: 'prueba'
//}

//registro(data)

