import fetch from 'node-fetch';
// const fetch = require('node-fetch');

function registro(body){
    console.log(body)
        let url= 'http://iot-api.constecoin.com/api/cacao/writeData';
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

var data={
    id: '000',
    fecha: '000',
    mensaje: 'prueba'
}

registro(data)