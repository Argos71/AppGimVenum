import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-area-pecho',
  templateUrl: './area-pecho.page.html',
  styleUrls: ['./area-pecho.page.scss'],
  standalone: true,
  imports: [IonicModule, SharedModule],
})
export class AreaPechoPage implements OnInit {

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
    const mapExercises = (exs: any[]) => exs.map(ex => ({
      ...ex,
      totalSeries: parseInt(ex.sets.split(' ')[0], 10) || 0,
      completedSeries: 0,
      expanded: false
    }));

    if (this.category === 'Básico') {
      this.exercises = mapExercises([
        { name: 'Flexiones de Pecho', description: 'Desde el suelo, baja el pecho hasta casi tocarlo.', sets: '3 series', reps: '10-12 repeticiones' },
        { name: 'Press de Pecho con Mancuernas', description: 'Acostado, empuja las mancuernas hacia arriba.', sets: '3 series', reps: '10 repeticiones' },
        { name: 'Aperturas con Mancuernas', description: 'Brazos abiertos y cerrando sobre el pecho.', sets: '3 series', reps: '10-12 repeticiones' },
        { name: 'Fondos en Banco', description: 'Baja el cuerpo usando un banco para trabajar el pectoral.', sets: '3 series', reps: '8-10 repeticiones' },
        { name: 'Flexiones con Manos Juntas', description: 'Mayor enfoque en el pectoral interno.', sets: '3 series', reps: '10 repeticiones' }
      ]);
    } else if (this.category === 'Intermedio') {
      this.exercises = mapExercises([
        { name: 'Press Inclinado con Mancuernas', description: 'Trabaja la parte superior del pecho.', sets: '4 series', reps: '10-12 repeticiones' },
        { name: 'Press de Pecho con Barra', description: 'Mayor carga para fuerza y volumen.', sets: '4 series', reps: '8-10 repeticiones' },
        { name: 'Aperturas en Polea', description: 'Estiramiento y contracción máxima del pectoral.', sets: '4 series', reps: '10-12 repeticiones' },
        { name: 'Fondos en Paralelas', description: 'Mayor intensidad, trabaja pecho y tríceps.', sets: '4 series', reps: '8-12 repeticiones' },
        { name: 'Flexiones Diamante', description: 'Enfocadas en el pecho interno.', sets: '4 series', reps: '10-12 repeticiones' },
        { name: 'Press Declinado', description: 'Mayor enfoque en la parte inferior del pecho.', sets: '4 series', reps: '8-10 repeticiones' }
      ]);
    }
  }

  toggleExercise(index: number) {
    this.exercises[index].expanded = !this.exercises[index].expanded;
  }

  updateProgress(index: number, type: string, change: number) {
    if (type === 'series') {
      const maxSeries = this.exercises[index].totalSeries;
      this.exercises[index].completedSeries = Math.max(0, Math.min(maxSeries, (this.exercises[index].completedSeries || 0) + change));
    }
  }

}
