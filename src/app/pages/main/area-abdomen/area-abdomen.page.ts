import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-area-abdomen',
  templateUrl: './area-abdomen.page.html',
  styleUrls: ['./area-abdomen.page.scss'],
  standalone: true,
  imports: [IonicModule, SharedModule],
})
export class AreaAbdomenPage implements OnInit {

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
        { name: 'Crunch Tradicional', description: 'Elevación del torso desde posición supina.', sets: '3 series', reps: '12-15 repeticiones' },
        { name: 'Elevación de Piernas', description: 'Acostado, sube las piernas rectas al techo.', sets: '3 series', reps: '10-12 repeticiones' },
        { name: 'Plancha Frontal', description: 'Mantén el cuerpo recto apoyado sobre antebrazos.', sets: '3 series', reps: '30-45 segundos' },
        { name: 'Plancha Lateral', description: 'Equilibrio lateral trabajando oblicuos.', sets: '3 series', reps: '30 segundos por lado' },
        { name: 'Crunch Bicicleta', description: 'Alterna codos y rodillas contrarias.', sets: '3 series', reps: '12-15 repeticiones' }
      ]);
    } else if (this.category === 'Intermedio') {
      this.exercises = mapExercises([
        { name: 'Crunch con Peso', description: 'Sostén un disco o mancuerna mientras realizas crunches.', sets: '4 series', reps: '12-15 repeticiones' },
        { name: 'Elevación de Piernas con Mancuerna', description: 'Sujeta un peso entre los pies para más resistencia.', sets: '4 series', reps: '10-12 repeticiones' },
        { name: 'Plancha Frontal con Peso', description: 'Coloca peso sobre espalda mientras mantienes la plancha.', sets: '4 series', reps: '40-60 segundos' },
        { name: 'Plancha Lateral con Elevación de Cadera', description: 'Eleva la cadera para intensidad extra en oblicuos.', sets: '4 series', reps: '30-40 segundos por lado' },
        { name: 'Crunch Bicicleta Avanzado', description: 'Ejecuta más rápido y controlando movimiento.', sets: '4 series', reps: '15-20 repeticiones' },
        { name: 'Mountain Climbers', description: 'Movimientos rápidos de rodillas al pecho desde posición de plancha.', sets: '4 series', reps: '30-40 repeticiones' }
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
