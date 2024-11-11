import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Auth } from '@angular/fire/auth';
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

  currentUser = this.auth.currentUser!;

  constructor(
    readonly animationController: AnimationController,
    readonly rankingService: RankingService,
    readonly auth: Auth,
  ) { }

  ionViewDidEnter() {
     this.rankingService.listAll().subscribe(data => this.rankings = data);
  }

  // Index 0 is the first ranking
  getUserRanking(index: number): UserRanking | null {
    if (!this.rankings.length) return null;
    if (index < 0 || index >= this.rankings.length) return null;
    return this.rankings[index];
  }

  get firstUserRanking() {
    return this.getUserRanking(0);
  }

  get secondUserRanking() {
    return this.getUserRanking(1);
  }

  get thirdUserRanking() { 
    return this.getUserRanking(3);
  }

  getFirstName(name: string) {
    if (!name) return '';
    return name.split(' ')[0];
  }

  isLoggedUser(userId: string) {
    if (!userId) return false;
    return userId === this.currentUser.uid;
  }

  get hasTopRankings() {
    return this.firstUserRanking || this.secondUserRanking || this.thirdUserRanking;
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
