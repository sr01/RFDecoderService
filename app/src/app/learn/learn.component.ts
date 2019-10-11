import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { SignalComponent } from '../signal/signal.component';
import { Signal, getSampleData } from '../signal/signal'
import { decode, Levels, DecodeResult } from '../signal/decoder';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})
export class LearnComponent implements OnInit {

  @ViewChild('appSignal', { static: false })
  appSignal: SignalComponent;

  scale: number = 10;
  threshold: number = 50;
  signal: Signal;
  decodeResult : DecodeResult;

  constructor() {
    this.signal = new Signal(getSampleData());
    this.decodeResult = decode(this.signal.times, Levels.Low, this.threshold);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.redraw();
  }

  redraw() {
    this.decodeResult = decode(this.signal.times, Levels.Low, this.threshold);
    this.appSignal.clear();
    this.appSignal.drawSignal(this.signal, this.decodeResult, this.scale);
  }

  zoomIn() {
    if (this.scale <= 1) return;

    if (this.scale > 10) {
      this.scale -= 5;
    } else {
      this.scale -= 1;
    }
    this.redraw();
  }

  zoomOut() {
    if (this.scale < 10) {
      this.scale += 1;
    } else {
      this.scale += 5;
    }
    this.redraw();
  }

  thresholdUp() {
    this.threshold += 2;
    this.redraw();
  }

  thresholdDown() {
    this.threshold -= 2;
    this.redraw();
  }
}
