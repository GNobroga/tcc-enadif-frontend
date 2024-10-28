import { AfterViewInit, Component, ElementRef, OnDestroy, signal, ViewChild } from '@angular/core';
import { Gesture, GestureController, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements AfterViewInit, OnDestroy {


  @ViewChild(IonContent, { read: ElementRef })
  ionContentRef!: ElementRef<HTMLElement>;

  gesture!: Gesture;

  readonly MAX_STEP_SIZE = 3;

  constructor(
    private gestureController: GestureController
  ) {}

  currentStep = signal(1);

  ngAfterViewInit(): void {
      const previous = this.previousStep.bind(this);
      const next = this.nextStep.bind(this);
      let stopGesture = false;
      this.gesture = this.gestureController.create({
        gestureName: '',
        el: this.ionContentRef.nativeElement,
        onMove: detail => {
          if (stopGesture) {
            stopGesture = false;
            return;
          }
          detail.deltaX > 0 ? previous() : next();
          stopGesture = true;
        },
      });

      this.gesture.enable();
  }

  ngOnDestroy(): void {
      this.gesture.destroy();
  }

  nextStep() {
    if (this.currentStep() >= this.MAX_STEP_SIZE) return;
    this.currentStep.set(this.currentStep() + 1);
  }

  previousStep() {
    if (this.currentStep() <= 1) return;
    this.currentStep.set(this.currentStep() - 1);
  }

}
