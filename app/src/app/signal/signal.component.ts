import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Signal } from '../signal/signal'
import { DecodeResult } from '../signal/decoder';

@Component({
  selector: 'app-signal',
  templateUrl: './signal.component.html',
  styleUrls: ['./signal.component.css']
})
export class SignalComponent implements OnInit {

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;

  constructor() { }


  ngOnInit() {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = this.canvas.nativeElement.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    this.canvas.nativeElement.width = rect.width * dpr;
    this.canvas.nativeElement.height = rect.height * dpr;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    this.ctx.scale(dpr, dpr);
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
  }

  drawSignal(signal: Signal, decodeResult : DecodeResult, scaleX: number): void {

    let x = 5
    let yLow = 140
    let yText = 150
    let yHigh = 50
    let signalLevel = 0

    this.ctx.font = "10px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();

    //move to start
    this.ctx.moveTo(x, yLow);

    for (var i = 0; i < signal.times.length; i++) {
      let pulseWidth = signal.times[i] / scaleX
      let d = 0;
      if (decodeResult.values != null && decodeResult.values.length > i) {
        d = decodeResult.values[i]
      }

      if (signalLevel == 0) {
        this.drawHigh(x, yHigh, pulseWidth, yText, d)
      } else {
        this.drawLow(x, yLow, pulseWidth, yText, d)
      }

      x = x + pulseWidth
      signalLevel = this.nextSignal(signalLevel)
    }

    // Make the line visible
    this.ctx.stroke();
  }

  private nextSignal(signalLevel) {
    return signalLevel == 0 ? 1 : 0;
  }

  private drawHigh(x, yHigh, pulseWidth, yText, text) {
    this.ctx.lineTo(x, yHigh);
    this.ctx.lineTo(x + pulseWidth, yHigh);
    this.ctx.fillText(text, x + (pulseWidth / 2), yText)
  }

  private drawLow (x, yLow, pulseWidth, yText, text) {
    this.ctx.lineTo(x, yLow)
    this.ctx.lineTo(x + pulseWidth, yLow)
    this.ctx.fillText(text, x + (pulseWidth / 2), yText)
  }
}
