import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-area-brazo',
  templateUrl: './area-brazo.page.html',
  styleUrls: ['./area-brazo.page.scss'],
  standalone: true,
  imports: [IonicModule, SharedModule],
})
export class AreaBrazoPage implements OnInit {

  category: string = '';
  exercises: any[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.category = params['category'] || '';
      this.loadExercises();
    });
  }

  loadExercises() {
    const mapExercises = (exs: any[]) => {
    return exs.map(ex => ({
      ...ex,
      totalSeries: parseInt(ex.sets.split(' ')[0], 10) || 0,
      completedSeries: 0,
      expanded: false
    }));
  };
  if (this.category === 'Básico') {
    this.exercises = mapExercises([
      {
        name: 'Flexiones de Brazos',
        description: 'Desde las rodillas, baja el pecho hacia el suelo.',
        sets: '3 series',
        reps: '8-10 repeticiones',
        expanded: false,
        completedSeries: 0
      },
      {
        name: 'Curl de Bíceps con Mancuernas',
        description: 'Levanta las mancuernas hacia los hombros.',
        sets: '3 series',
        reps: '10-12 repeticiones',
        expanded: false,
        completedSeries: 0
      },
      {
        name: 'Extensiones de Tríceps',
        description: 'Extiende los brazos hacia atrás con mancuernas.',
        sets: '3 series',
        reps: '10 repeticiones',
        expanded: false,
        completedSeries: 0
      },
      {
        name: 'Flexiones de Diamante',
        description: 'Manos juntas formando diamante para tríceps.',
        sets: '3 series',
        reps: '8-10 repeticiones',
        expanded: false,
        completedSeries: 0
      },
      {
        name: 'Curl Martillo',
        description: 'Levanta mancuernas girando las palmas hacia adentro.',
        sets: '3 series',
        reps: '10 repeticiones',
        expanded: false,
        completedSeries: 0
      }
    ]);
  } else if (this.category === 'Intermedio') {
    this.exercises = mapExercises([
      {
        name: 'Flexiones Diamante',
        description: 'Une las manos en forma de diamante bajo el pecho.',
        sets: '4 series',
        reps: '10-12 repeticiones',
        expanded: false,
        completedSeries: 0
      },
      {
        name: 'Curl de Martillo',
        description: 'Gira las palmas hacia adentro durante el curl.',
        sets: '4 series',
        reps: '12 repeticiones',
        expanded: false,
        completedSeries: 0
      },
      {
        name: 'Press Francés',
        description: 'Acostado, extiende los brazos con barra o mancuerna.',
        sets: '4 series',
        reps: '10 repeticiones',
        expanded: false,
        completedSeries: 0
      },
      {
        name: 'Dips en Paralelas',
        description: 'Baja el cuerpo entre dos barras paralelas.',
        sets: '4 series',
        reps: '8-10 repeticiones',
        expanded: false,
        completedSeries: 0
      },
      {
        name: 'Curl Concentrado',
        description: 'Aísla bíceps apoyando el codo en la rodilla.',
        sets: '4 series',
        reps: '12 repeticiones',
        expanded: false,
        completedSeries: 0
      },
      {
        name: 'Extensiones de Tríceps en Polea',
        description: 'Extiende brazos manteniendo codos pegados al torso.',
        sets: '4 series',
        reps: '10-12 repeticiones',
        expanded: false,
        completedSeries: 0
      }
    ]);
  }
}


  toggleExercise(index: number) {
    this.exercises[index].expanded = !this.exercises[index].expanded;
  }

  updateProgress(index: number, type: string, change: number) {
    if (type === 'series') {
      const maxSeries = parseInt(this.exercises[index].sets.split(' ')[0]);
      this.exercises[index].completedSeries = Math.max(0, Math.min(maxSeries, (this.exercises[index].completedSeries || 0) + change));
    }
  }

}
