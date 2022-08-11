import serial
import time

#Mensaje a postear
mensaje = [0,0,0,0,0] #Servicio, ID, payload1, payload2, payload3
'''
    Servicio: Mensaje/ Llamada / Alerta
    ID: Numero telefonico del remoto
    Payload 1: Estado Bateria del remoto
    Payload 2: Reporte de Estado General del remoto
    Payload 3: Mensaje Extra
    *** En caso de llamada los payload se mantienen en 0
'''

ser = serial.Serial(
    port = 'COM9',
    baudrate = 115200,
    parity = serial.PARITY_NONE,
    stopbits = serial.STOPBITS_ONE,
    bytesize = serial.EIGHTBITS,
    timeout = 1,
)

proceso = True

#En caso de ser mensaje, interesa, el numero de telefono, el estado de bateria
#En caso de ser llamada, interesa, el numero de telefono

#Llamada +CLIP: '<cell number>',number1," ",,"<Id>",0
#SMS +CMT: "<cell number>"","<id>","time-stamp"<Text>
splitCommand = 0
while proceso:
    try:
        data = ser.readline().decode("utf-8")
        
        if (data != "\r\n"):
            '''
            #En caso que sea una llamada
            if (data == "RING\r\n"):
                print("Llamada entrante ...")
            
            try:
                data1=data.split(':')
                if(data1[0]=='+CLIP'):
                    data2 = data1[1].split(',')
                    phone_number = data2[0].translate({ord(i):None for i in ' "'})
                    print(phone_number)
            except:
                print("no data for split")
            '''
            #Si es un mensaje +CMT: "<cell number>","<id>","time-stamp"<Text>
            '''
            try:
                data1=data.split(':')
                if(data1[0]=='+CMT'):
                    data2 = data1[1].split(',')
                    phone_number = data2[0].translate({ord(i):None for i in ' "'})#obtener el num sin ""
                    sender =  data2[1].translate({ord(i):None for i in " '"})
                    sms_content = data2[3]
                    print("numero:" + phone_number)
                    print("emisor:" + sender)
                    print("mensaje: " + sms_content)
            except:
                print("no data for split")
            '''

            #'''
            try:
                data1= data.split(",")
                data2= data1[0].split(":")
                
                if (data2[0]=='+CMT'):
                    phone_number = data2[1].translate({ord(i):None for i in " '"})#obtener el num sin ""
                    sender =  data1[1].translate({ord(i):None for i in " '"})
                    data3 = data1[2].split("'")
                    data4 = data1[3].split("'")
                    time_stamp = data3[1] + data4[0]
                    sms_content = data4[1]
                    print("numero:" + phone_number)
                    print("emisor:" + sender)
                    print("time_stamp:" + time_stamp)
                    print("mensaje: " + sms_content)
                
                #print(data3)
                #print(data4)
            except:
                print("no data to Split")
            #'''
        #print(data)
        time.sleep (1.0)
    except Exception as err:
        print (err)