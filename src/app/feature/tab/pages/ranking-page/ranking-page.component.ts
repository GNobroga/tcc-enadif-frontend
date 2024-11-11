import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AnimationController, ViewDidEnter } from '@ionic/angular';
import RankingService, { UserRanking } from 'src/app/core/services/ranking.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking-page.component.html',
  styleUrls: ['./ranking-page.component.scss'],
})
export class RankingPageComponent implements ViewDidEnter,  AfterViewInit {

  @ViewChildren('personRank')
  children!: QueryList<ElementRef>;

  rankings: Array<UserRanking> = [];

  constructor(
    readonly animationController: AnimationController,
    readonly rankingService: RankingService,
  ) { }

  ionViewDidEnter() {
     this.rankingService.listAll().subscribe(data => this.rankings = data);
  }

  ngAfterViewInit(): void {
      this.children?.forEach((e, index) => this.animateElement(e.nativeElement, (index + 1) * 500));
  }

  animateElement(e: HTMLElement, duration: number) {
    this.animationController.create()
    .addElement(e)
    .fromTo('transform', 'translateY(2rem)', 'translateY(0)')
    .fromTo('opacity', '0', '1')
    .easing('ease-in-out')
    .duration(duration)
    .fill('forwards')
    .play();

  }

}
