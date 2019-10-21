#include <ELECHOUSE_CC1101_RCS_DRV.h>
#include "WiFiEsp.h"
#include "WiFiEspUdp.h"
#include "math.h"

// RF receive setup
#define SAMPLESIZE 400
static unsigned int timings[SAMPLESIZE];
static int pos = 0;
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

char ssid[] = "melon";       // your network SSID (name)
char pass[] = "mmmmmmm8";    // your network password
int status = WL_IDLE_STATUS; // the Wifi radio's status

void callback(char *topic, byte *payload, unsigned int length)
{
  // handle message arrived
}

#define MQTT_TOPIC "arduino/receivers/rf868/sr-rc-7001"

// Initialize the wifi client object
char server[] = "192.168.15.106";
int serverPort = 4000;

WiFiEspClient client;

void setup()
{
  ELECHOUSE_cc1101.setRxBW(8);     // set Receive filter bandwidth (default = 812khz) 1 = 58khz, 2 = 67khz, 3 = 81khz, 4 = 101khz, 5 = 116khz, 6 = 135khz, 7 = 162khz, 8 = 203khz, 9 = 232khz, 10 = 270khz, 11 = 325khz, 12 = 406khz, 13 = 464khz, 14 = 541khz, 15 = 650khz, 16 = 812khz.
  ELECHOUSE_cc1101.setMHZ(868.35); // Here you can set your basic frequency. The lib calculates the frequency automatically (default = 433.92).The cc1101 can: 300-348 MHZ, 387-464MHZ and 779-928MHZ. Read More info from datasheet.
  ELECHOUSE_cc1101.Init();         // must be set to initialize the cc1101! set TxPower  PA10, PA7, PA5, PA0, PA_10, PA_15, PA_20, PA_30.
  ELECHOUSE_cc1101.SetRx();        // set Receive on

  // initialize serial for debugging
  Serial.begin(115200);
  // initialize serial for ESP module
  espSerial.begin(9600);
  // initialize ESP module
  WiFi.init(&espSerial);

  // check for the presence of the shield
  if (WiFi.status() == WL_NO_SHIELD)
  {
    Serial.println("WiFi shield not present");
    // don't continue
    while (true)
      ;
  }

  // attempt to connect to WiFi network
  while (status != WL_CONNECTED)
  {
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

boolean isRFReceived()
{
  boolean result = false;
  for (unsigned int i = 0; i < 7; i++)
  {
    if (timings[i] != 0)
    {
      result = true;
      break;
    }
  }
  return result;
}

void beginSend()
{
  Serial.println("sending...");
  //byte START_SIGNAL[] = {7, 7, 7, 7};
  //client.write(START_SIGNAL, 4);
}

void endSend()
{
  byte END_SIGNAL[] = {6, 6, 6, 6};
  client.write(END_SIGNAL, 4);
  Serial.println("");
}

void sendTiming(unsigned int timing, boolean isLast)
{
  Serial.print(timing);
  if (!isLast)
  {
    Serial.print(",");
  }
}

void connectTcpClient()
{

  if (!client.connected())
  {
    // close any connection before send a new request
    // this will free the socket on the WiFi shield
    client.stop();

    Serial.println("tcp client connecting...");
    // if there's a successful connection
    if (client.connect(server, serverPort))
    {
      Serial.println("connected.");
    }
    else
    {
      // if you couldn't make a connection
      Serial.println("Connection failed");
    }
  }
}

void sendTcpData(unsigned int number)
{
  byte low = number && 0xff;
  byte high = (number >> 8) && 0xff;
  client.write(low);
  client.write(high);
}

void readServerResponse()
{
  // if there's incoming data from the net connection send it out the serial port
  // this is for debugging purposes only
  while (client.available())
  {
    char c = client.read();
    Serial.write(c);
  }
}

void copyIntBufToByteBuf(unsigned int *src, byte *dest, int start, int end)
{
  int destIndex = 0;
  for (int i = start; i < end; i++)
  {
    dest[destIndex++] = lowByte(src[i]);
    dest[destIndex++] = highByte(src[i]);
  }
}

void sendTiming(int start, int end)
{
  int BUF_SIZE = 100; //even number!
  byte buffer[BUF_SIZE];

  int len = end - start - 1;
  int chunkSize = floor(len / BUF_SIZE);

  int srcIndex = start;
  int destIndex = 0;

  while (srcIndex < end)
  {
    //Serial.print(timings[srcIndex]);
    //Serial.print(",");

    buffer[destIndex] = lowByte(timings[srcIndex]);
    buffer[destIndex + 1] = highByte(timings[srcIndex]);
    
    // Serial.print(buffer[destIndex]);
    // Serial.print(",");
    // Serial.print(buffer[destIndex + 1]);
    // Serial.print(",");
    
    destIndex += 2;
    if (destIndex == BUF_SIZE)
    {
      client.write(buffer, destIndex);
      destIndex = 0;
    }
    srcIndex++;
  }

  //send tail
  if (destIndex > 0)
  {
    client.write(buffer, destIndex);
  }

  // for (int i = start; i < end; i++)
  // {
  //   sendTiming(timings[i], false);
  // }
}

void loop()
{
  connectTcpClient();

  attachInterrupt(interruptPin, handleInterrupt, CHANGE);
  // Serial.println("reading");
  delay(1000);
  detachInterrupt(interruptPin);

  if (isRFReceived())
  {
    beginSend();

    int finalstate = digitalRead(receiverPin);

    sendTiming(pos + finalstate, SAMPLESIZE);

    sendTiming(0, pos);

    endSend();
  }
  resetBuffer();
}
