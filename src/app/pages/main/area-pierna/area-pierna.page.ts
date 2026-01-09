import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-area-pierna',
  templateUrl: './area-pierna.page.html',
  styleUrls: ['./area-pierna.page.scss'],
  standalone: true,
  imports: [IonicModule, SharedModule],
})
export class AreaPiernaPage implements OnInit {

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
        { name: 'Sentadillas', description: 'Flexiona las rodillas manteniendo la espalda recta.', sets: '3 series', reps: '10-12 repeticiones' },
        { name: 'Zancadas', description: 'Da un paso largo y baja la pierna trasera hasta casi tocar el suelo.', sets: '3 series', reps: '10 repeticiones por pierna' },
        { name: 'Elevación de Talones', description: 'Para trabajar pantorrillas, sube y baja los talones.', sets: '3 series', reps: '12-15 repeticiones' },
        { name: 'Puente de Glúteos', description: 'Acostado, eleva la cadera apretando glúteos.', sets: '3 series', reps: '10-12 repeticiones' },
        { name: 'Sentadillas Sumos', description: 'Piernas más abiertas, enfocado en aductores.', sets: '3 series', reps: '10-12 repeticiones' }
      ]);
    } else if (this.category === 'Intermedio') {
      this.exercises = mapExercises([
        { name: 'Sentadillas con Mancuernas', description: 'Mayor carga para fuerza y volumen en piernas.', sets: '4 series', reps: '10-12 repeticiones' },
        { name: 'Zancadas con Mancuernas', description: 'Intensifica el trabajo de cuádriceps y glúteos.', sets: '4 series', reps: '10 repeticiones por pierna' },
        { name: 'Peso Muerto Rumano', description: 'Trabaja isquiotibiales y glúteos manteniendo espalda recta.', sets: '4 series', reps: '8-10 repeticiones' },
        { name: 'Elevación de Talones con Peso', description: 'Para pantorrillas con mayor resistencia.', sets: '4 series', reps: '12-15 repeticiones' },
        { name: 'Sentadillas Búlgaras', description: 'Una pierna atrás en banco, trabaja estabilidad y fuerza.', sets: '4 series', reps: '8-10 repeticiones por pierna' },
        { name: 'Puente de Glúteos con Peso', description: 'Mayor intensidad en glúteos y femorales.', sets: '4 series', reps: '10-12 repeticiones' }
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
