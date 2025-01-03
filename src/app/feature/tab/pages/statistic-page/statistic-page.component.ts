import { Component, OnInit, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import UserService, { UserStats } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-statistic-page',
  templateUrl: './statistic-page.component.html',
  styleUrls: ['./statistic-page.component.scss'],
})
export class StatisticPageComponent  implements OnInit {

  data!: ChartData;

  options!: ChartOptions;

  stats = signal<UserStats | null>(null);
  
  constructor(
        readonly auth: Auth,
        readonly userService: UserService,
        readonly route: ActivatedRoute,
    ) {}

  connectedUser = signal(this.auth.currentUser);

  ngOnInit() {
      this.route.url.subscribe(() => {
        this.userService.getStats().subscribe(stats => {
            console.log(stats);
            this.updateData(stats.correctAnswersByCategory);
            this.stats.set(stats);
        });
      });
  }

  private updateData(correctAnswersByCategory: Record<string, number>) {
    const documentStyle = getComputedStyle(document.documentElement);
    this.data = {
        datasets: [
            {
                data: Object.values(correctAnswersByCategory),
                backgroundColor: [
                    documentStyle.getPropertyValue('--red-500'),
                    documentStyle.getPropertyValue('--green-500'),
                    documentStyle.getPropertyValue('--yellow-500'),
                    documentStyle.getPropertyValue('--bluegray-500'),
                    documentStyle.getPropertyValue('--blue-500'),
                ],
                label: 'Acertos',
            }
        ],
        labels: Object.keys(correctAnswersByCategory).map(category => {
            const categories: { [ key: string ]: string} = {
                logic: 'Lógica',
                computing: 'Computação',
                software: 'Software',
                infrastructure: 'Infraestrutura',
                security: 'Segurança',
            }
            return categories[category] || 'Desconhecido';
        })
    };

    this.options = {
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: 'white'
                },
                beginAtZero: false,
                ticks: {
                    display: false 
                }
            }
        }
    };
  }

    calculateAccuracyRate(stats: UserStats): number {
        const { totalAnsweredQuestions, correctAnswersCount } = stats;

        if (totalAnsweredQuestions === 0) {
            return 0; 
        }

        const accuracyRate = (correctAnswersCount / totalAnsweredQuestions) * 100;

        return parseFloat(accuracyRate.toFixed(2)); 
    }

    get userFistName() {
        return this.connectedUser()?.displayName?.split(' ')[0] || '';
    }


}
