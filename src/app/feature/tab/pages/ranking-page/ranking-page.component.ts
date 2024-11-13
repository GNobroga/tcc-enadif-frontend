import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AnimationController, ViewDidEnter } from '@ionic/angular';
import RankingService, { UserRanking } from 'src/app/core/services/ranking.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking-page.component.html',
  styleUrls: ['./ranking-page.component.scss'],
})
export class RankingPageComponent implements ViewDidEnter {

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
    return this.getUserRanking(2);
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

}
