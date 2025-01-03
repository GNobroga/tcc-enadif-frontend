import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { WeekdayDisplayComponent } from './components/weekday-display/weekday-display.component';
import { WeekdaySequenceDialogComponent } from './components/weekday-sequence-dialog/weekday-sequence-dialog.component';
import { AchievementPageComponent } from './pages/achievement-page/achievement-page.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { ChatMessageComponent } from './pages/chat-page/components/chat-message/chat-message.component';
import { CommunityPage } from './pages/community-page/community-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CreateNotePageComponent } from './pages/notepad-page/create-note-page/create-note-page.component';
import { NotepadPageComponent } from './pages/notepad-page/notepad-page.component';
import { PerfilPageComponent } from './pages/perfil-page/perfil-page.component';
import { RankingPageComponent } from './pages/ranking-page/ranking-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { StatisticPageComponent } from './pages/statistic-page/statistic-page.component';
import { StudyPageComponent } from './pages/study-page/study-page.component';
import { TabRoutingModule } from './tab-routing.module';
import { TabComponent } from './tab.component';
import { ChangeNameComponent } from './components/change-name/change-name.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserStatsComponent } from './pages/user-profile/components/user-stats/user-stats.component';
import { UserAchievementComponent } from './pages/user-profile/components/user-achievement/user-achievement.component';
import ChatMenuComponent from './pages/chat-page/components/chat-menu/chat-menu.component';
import ConfirmPasswordComponent from './components/confirm-password/confirm-password.component';
import AcquiredAchievementComponent from './pages/achievement-page/components/acquired-achievement/acquired-achievement.component';
import AchievementViewComponent from './pages/achievement-page/components/achievement-view/achievement-view.component';


@NgModule({
  declarations: [
    AchievementViewComponent,
    AcquiredAchievementComponent,
    ChatMenuComponent,
    TabComponent,
    HomePageComponent,
    AchievementPageComponent,
    RankingPageComponent,
    PerfilPageComponent,
    StatisticPageComponent,
    WeekdayDisplayComponent,
    WeekdaySequenceDialogComponent,
    StudyPageComponent,
    SearchPageComponent,
    NotepadPageComponent,
    CreateNotePageComponent,
    ChatPageComponent,
    ChatMessageComponent,
    CommunityPage,
    ChangeNameComponent,
    UserProfileComponent,
    UserStatsComponent,
    UserAchievementComponent,
    ConfirmPasswordComponent
  ],
  imports: [
    SharedModule,
    TabRoutingModule,
    CoreModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class TabModule { }
