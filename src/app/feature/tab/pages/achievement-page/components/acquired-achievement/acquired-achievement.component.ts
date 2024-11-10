import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
    selector: 'app-acquired-achievement',
    templateUrl: './acquired-achievement.component.html'
})
export default class AcquiredAchievementComponent {

    constructor(
        readonly dialogRef: DynamicDialogRef,
        readonly router: Router,
    ) {}

    redirectToAchievements() {
        this.dialogRef.close();
        this.router.navigate(['/tabs/achievement']);
    }

    closeDialog() {
        this.dialogRef.close();
    }
}