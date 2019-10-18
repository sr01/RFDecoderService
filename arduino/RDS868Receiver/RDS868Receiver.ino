
#include <ELECHOUSE_CC1101_RCS_DRV.h>

#define SAMPLESIZE 500

static unsigned int timings[SAMPLESIZE];
static unsigned int pos = 0;
static unsigned long lastTime = 0;

static int receiverPin = 2;
static int interruptPin = 0;

void setup()
{
  ELECHOUSE_cc1101.setRxBW(8);     // set Receive filter bandwidth (default = 812khz) 1 = 58khz, 2 = 67khz, 3 = 81khz, 4 = 101khz, 5 = 116khz, 6 = 135khz, 7 = 162khz, 8 = 203khz, 9 = 232khz, 10 = 270khz, 11 = 325khz, 12 = 406khz, 13 = 464khz, 14 = 541khz, 15 = 650khz, 16 = 812khz.
  ELECHOUSE_cc1101.setMHZ(868.35); // Here you can set your basic frequency. The lib calculates the frequency automatically (default = 433.92).The cc1101 can: 300-348 MHZ, 387-464MHZ and 779-928MHZ. Read More info from datasheet.
  ELECHOUSE_cc1101.Init();         // must be set to initialize the cc1101! set TxPower  PA10, PA7, PA5, PA0, PA_10, PA_15, PA_20, PA_30.
  ELECHOUSE_cc1101.SetRx();        // set Receive on

  interruptPin = digitalPinToInterrupt(receiverPin);

  Serial.begin(115200);
}

void resetBuffer()
{
  for (unsigned int i = 0; i < SAMPLESIZE; i++)
  {
    timings[i] = 0;
  }
}

void loop()
{

  while (true)
  {
    attachInterrupt(interruptPin, handleInterrupt, CHANGE);

    Serial.println("reading...");

    delay(2000);

    detachInterrupt(interruptPin);

    int finalstate = digitalRead(receiverPin);

    for (unsigned int i = pos + finalstate; i < SAMPLESIZE; i++)
    {
      Serial.print(timings[i]);
      Serial.print(",");
    }

    for (unsigned int i = 0; i < pos; i++)
    {
      Serial.print(timings[i]);
      Serial.print(",");
    }

    Serial.println("");
    Serial.println("restarting...");

    resetBuffer();
  }
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
