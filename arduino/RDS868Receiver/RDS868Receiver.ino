#include <ELECHOUSE_CC1101_RCS_DRV.h>
#include "WiFiEsp.h"
#include "WiFiEspUdp.h"

// RF receive setup
#define SAMPLESIZE 400
static unsigned int timings[SAMPLESIZE];
static unsigned int pos = 0;
static unsigned long lastTime = 0;
static int receiverPin = 2;
static int interruptPin = 0;

// WiFi setup

#define sw_serial_rx_pin 4 //  Connect this pin to TX on the esp8266
#define sw_serial_tx_pin 6 //  Connect this pin to RX on the esp8266

// Emulate espSerial on pins 6/7 if not present
#ifndef HAVE_HWSERIAL1
#include "SoftwareSerial.h"
SoftwareSerial espSerial(sw_serial_rx_pin, sw_serial_tx_pin); // RX, TX
#endif

char ssid[] = "melon";            // your network SSID (name)
char pass[] = "mmmmmmm8";        // your network password
int status = WL_IDLE_STATUS;     // the Wifi radio's status

void callback(char* topic, byte* payload, unsigned int length) {
  // handle message arrived
}

#define MQTT_TOPIC "arduino/receivers/rf868/sr-rc-7001"

// Initialize the wifi client object
WiFiEspClient client;
char server[] = "192.168.15.106";
int serverPort = 33333;

WiFiEspUDP Udp;

void setup()
{
  ELECHOUSE_cc1101.setRxBW(8);     // set Receive filter bandwidth (default = 812khz) 1 = 58khz, 2 = 67khz, 3 = 81khz, 4 = 101khz, 5 = 116khz, 6 = 135khz, 7 = 162khz, 8 = 203khz, 9 = 232khz, 10 = 270khz, 11 = 325khz, 12 = 406khz, 13 = 464khz, 14 = 541khz, 15 = 650khz, 16 = 812khz.
  ELECHOUSE_cc1101.setMHZ(868.35); // Here you can set your basic frequency. The lib calculates the frequency automatically (default = 433.92).The cc1101 can: 300-348 MHZ, 387-464MHZ and 779-928MHZ. Read More info from datasheet.
  ELECHOUSE_cc1101.Init();         // must be set to initialize the cc1101! set TxPower  PA10, PA7, PA5, PA0, PA_10, PA_15, PA_20, PA_30.
  ELECHOUSE_cc1101.SetRx();        // set Receive on
  interruptPin = digitalPinToInterrupt(receiverPin);

  // initialize serial for debugging
  Serial.begin(115200);
  // initialize serial for ESP module
  espSerial.begin(9600);
  // initialize ESP module
  WiFi.init(&espSerial);

  // check for the presence of the shield
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    // don't continue
    while (true);
  }

  // attempt to connect to WiFi network
  while ( status != WL_CONNECTED) {
    //Serial.print("Attempting to connect to WPA SSID: ");
    //Serial.println(ssid);
    // Connect to WPA/WPA2 network
    status = WiFi.begin(ssid, pass);
  }

  //Serial.println("You're connected to the network");

//  printWifiStatus();
}

void handleInterrupt()
{
  const long time = micros();
  timings[pos] = time - lastTime;
  lastTime = time;
  if (++pos > SAMPLESIZE - 1)
  {
    pos = 0;
  }
}

void resetBuffer()
{
  for (unsigned int i = 0; i < SAMPLESIZE; i++)
  {
    timings[i] = 0;
  }
}

boolean isRFReceived(){
  boolean result = false;
  for(unsigned int i=0; i<7; i++){
      if(timings[i] !=0){
        result = true;
        break;
      }
  }
  return result;
}

void beginSend(){
  byte buffer[]= {1,2,3};
  
  Serial.print("open udp connection, result: ");
  int result = Udp.beginPacket(server, serverPort); 
  Serial.println(result);

  Serial.print("write to udp connection, result: ");
  result = Udp.write(buffer, 3);
  Serial.println(result);

  Serial.print("close udp connection, result: ");
  result = Udp.endPacket();
  Serial.println(result);
}

void sendTiming(int timing, boolean isLast){
  Serial.print(timing);
  if(!isLast){
    Serial.print(",");
  }
}

void endSend(){
  Serial.println("");
}

void loop()
{
    attachInterrupt(interruptPin, handleInterrupt, CHANGE);
    Serial.println("reading");
    delay(1000);
    detachInterrupt(interruptPin);

    if(isRFReceived()){

      beginSend();
      
      int finalstate = digitalRead(receiverPin);
      for (unsigned int i = pos + finalstate; i < SAMPLESIZE; i++)
      {
        sendTiming(timings[i], pos==0);
      }
  
      for (unsigned int i = 0; i < pos; i++)
      {
        sendTiming(timings[i], i==pos-1);
      }  

      endSend();
    }
    resetBuffer();
}
