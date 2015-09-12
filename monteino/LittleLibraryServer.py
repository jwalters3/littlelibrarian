import serial
import http.client, time


def main():

    openState = False
    ser = serial.Serial('/dev/ttyUSB0', 115200)

    while 1:
        msg = ser.readline()
        log(msg)
        if msg[0:5] == b'#Open' and not(openState):
            openState = True
            sendOpenM2X('1')
            #sendTwilio()
        elif msg[0:5] == b'#Clos':
            sendOpenM2X('0')
            openState = False

def sendOpenM2X(value):
    headers = {"Content-type": "application/json", "X-M2X-KEY": "f8217d70e0640dacbcf3ad79022ea058",
            "Accept": "application/json"}
    params = '{{"value":{0}}}'.format(value)
    conn = http.client.HTTPSConnection("api-m2x.att.com")
    conn.request("PUT", "/v2/devices/2c302add43eb67b7622fa81ce53326e4/streams/Door/value", params,
            headers)

    response = conn.getresponse()
    log(str(response.status) + " " + response.reason)
    data = response.read()
    log(data)


#def sendTwilio():

def log(msg):
    print('{0} :: {1}'.format(time.strftime("%Y-%m-%d %H:%M"), msg))


if __name__ == "__main__":
    main()
