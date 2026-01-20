import { Component, inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonHeader, IonTitle } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular'; // <== IMPORTANTE
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SharedModule } from '../../../shared/shared.module';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { EdiusuComponent } from 'src/app/shared/components/ediusu/ediusu.component';
import { RegistrarAsistenciaComponent } from 'src/app/shared/components/registrar-asistencia/registrar-asistencia.component';
import { HistorialAsistenciasComponent } from 'src/app/shared/components/historial-asistencias/historial-asistencias.component';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  styleUrls: ['./home.page.scss'],
  templateUrl: './home.page.html',
  imports: [IonicModule, SharedModule, NgChartsModule],
})
export class HomePage implements OnInit, OnDestroy {
week: {
  name: string;
  date: string;
  fullDate: string;
  isToday: boolean;
  attended: boolean;
}[] = [];
  dayNames: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  asistencias: any[] = [];
 
  fechaActual: string = '';
  horaActual: string = '';
  private reloj!: any;

  form = new FormGroup({
    id: new FormControl(''),
    HoraAsistencia: new FormControl (''),
    FechaAsistencia: new FormControl(''),
  });


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  //================Variables=========================
  usuarioNombre: string = '';
  usuarioMembresia: string = '';
  usuarioPeso: number = 0;
  usuarioTalla: number = 0;
  UsuarioImc: number = 0;
  UsuarioVasos: number = 0;

  //================Admin Statistics=========================
  totalUsers: number = 0;
  totalInscritos: number = 0;
  totalAdmins: number = 0;
  chartsLoading: boolean = true;
  gymStats: any = {
    totalAttendanceThisMonth: 0,
    newUsersThisMonth: 0,
    membershipsExpiringSoon: 0,
    averageAttendancePerUser: 0,
    totalRevenue: 0,
    peakHour: 'N/A',
    mostPopularDay: 'N/A'
  };

  //================Charts Data=========================
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        display: true,
      },
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Sin datos'],
    datasets: [{
      data: [1],
      backgroundColor: ['#E0E0E0'],
      hoverBackgroundColor: ['#E0E0E0']
    }],
  };
  public pieChartType: ChartType = 'pie';

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
      x: {
        grid: {
          display: true,
        },
      },
    },
  };
  public barChartData: ChartData<'bar', number[], string | string[]> = {
    labels: ['Sin datos'],
    datasets: [{
      data: [0],
      label: 'Asistencias',
      backgroundColor: '#E0E0E0',
      hoverBackgroundColor: '#E0E0E0'
    }],
  };
  public barChartType: ChartType = 'bar';

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
      x: {
        grid: {
          display: true,
        },
      },
    },
  };
  public lineChartData: ChartData<'line', number[], string | string[]> = {
    labels: ['Sin datos'],
    datasets: [{
      data: [0],
      label: 'Usuarios Registrados',
      borderColor: '#E0E0E0',
      backgroundColor: 'rgba(224, 224, 224, 0.2)',
      fill: true,
      tension: 0.4,
    }],
  };
  public lineChartType: ChartType = 'line';

  //================New Charts Data=========================
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        display: true,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
    },
  };
  public doughnutChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: ['Sin datos'],
    datasets: [{
      data: [1],
      backgroundColor: ['#E0E0E0'],
      hoverBackgroundColor: ['#E0E0E0']
    }],
  };
  public doughnutChartType: ChartType = 'doughnut';

  public areaChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      }
    }
  };
  public areaChartData: ChartData<'line', number[], string | string[]> = {
    labels: ['Sin datos'],
    datasets: [{
      data: [0],
      label: 'Membresías por Vencer',
      borderColor: '#E0E0E0',
      backgroundColor: 'rgba(224, 224, 224, 0.2)',
      fill: true,
      tension: 0.4
    }],
  };
  public areaChartType: ChartType = 'line';

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: true,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      }
    }
  };
  public radarChartData: ChartData<'radar', number[], string | string[]> = {
    labels: ['Sin datos'],
    datasets: [{
      data: [0],
      label: 'Asistencias por Día',
      borderColor: '#E0E0E0',
      backgroundColor: 'rgba(224, 224, 224, 0.2)',
      pointBackgroundColor: '#E0E0E0',
      pointBorderColor: '#E0E0E0'
    }],
  };
  public radarChartType: ChartType = 'radar';

  //================New Control/Monitoring Charts=========================
  public revenueChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
      x: {
        grid: {
          display: true,
        },
      },
    },
  };
  public revenueChartData: ChartData<'line', number[], string | string[]> = {
    labels: ['Sin datos'],
    datasets: [{
      data: [0],
      label: 'Ingresos Mensuales',
      borderColor: '#4BC0C0',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
      tension: 0.4,
    }],
  };
  public revenueChartType: ChartType = 'line';

  public activityHeatmapOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
      x: {
        grid: {
          display: true,
        },
      },
    },
  };
  public activityHeatmapData: ChartData<'bar', number[], string | string[]> = {
    labels: ['Sin datos'],
    datasets: [{
      data: [0],
      label: 'Actividad por Hora',
      backgroundColor: '#9966FF',
      hoverBackgroundColor: '#9966FF'
    }],
  };
  public activityHeatmapType: ChartType = 'bar';

  public membershipStatusOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        display: true,
      },
    },
  };
  public membershipStatusData: ChartData<'doughnut', number[], string | string[]> = {
    labels: ['Sin datos'],
    datasets: [{
      data: [1],
      backgroundColor: ['#E0E0E0'],
      hoverBackgroundColor: ['#E0E0E0']
    }],
  };
  public membershipStatusType: ChartType = 'doughnut';

  //==================Constructor======================
  constructor(
    private menuCtrl: MenuController,
    private afAuth: AngularFireAuth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc
        .signUp(this.form.value as User)
        .then(async res => {
          await this.firebaseSvc.updateUser(this.form.value.FechaAsistencia);
          
          let uid = res.user.uid;
                            
          
        })
        .catch((error) => {
          console.log(error);

          this.utilsSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  ngOnInit() {

    this.actualizarFechaHora();

    this.reloj = setInterval(() => {
      this.actualizarFechaHora();
    }, 1000);

    //===================Calculadora de Fecha=======================
    const today = new Date();
const currentDayIndex = today.getDay();

const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - currentDayIndex);

this.week = [];

for (let i = 0; i < 7; i++) {
  const date = new Date(startOfWeek);
  date.setDate(startOfWeek.getDate() + i);

  this.week.push({
  name: this.dayNames[date.getDay()],
  date: date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
  }),
  fullDate: date.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }),
  isToday: date.toDateString() === today.toDateString(),
  attended: false,
});

}

    //========================Calculadora de IMC=====================
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const uid = user.uid;
        const path = `users/${uid}`;
        this.firebaseSvc.getDocument(path).then((userData: User) => {
          this.usuarioNombre = userData?.nombre || 'Usuario';
          this.usuarioMembresia = userData?.tipoMembresia || 'Usuario';
          this.usuarioPeso = Number(userData?.peso);
          this.usuarioTalla = Number(userData?.estatura);
          this.calcularIMC();
          this.calcularVasos();
          this.loadAsistencias();
          if (this.usuarioMembresia === 'Administrador') {
            this.loadChartData();
          }
        });
      }
    });
  }

  async loadAsistencias() {
  const user = await this.afAuth.currentUser;
  if (!user) return;

  const path = `users/${user.uid}/asistencias`;
  this.asistencias = await this.firebaseSvc.getCollection(path);

  this.week = this.week.map(day => ({
    ...day,
    attended: this.asistencias.some(a => a.FechaAsistencia === day.fullDate),
  }));
}



  //========================== HORARIO ==============================

ngOnDestroy() {
    if (this.reloj) {
      clearInterval(this.reloj);
    }
  }

  actualizarFechaHora() {
    const ahora = new Date();

    this.fechaActual = ahora.toLocaleDateString('es-BO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    this.horaActual = ahora.toLocaleTimeString('es-BO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  registrarAsistencia() {
    console.log('Asistencia registrada:', new Date());

    // Aquí luego puedes guardar en Firebase
    // this.firebaseSvc.addAsistencia(...)
  }




  //==========================Rutas==============================

  goUsuarios() {
    this.router.navigate(['/main/home/usuarios']); // <- uso correcto de this.router
  }
  goEdiUsuarios() {
    this.utilsSvc.presentModal({ component: EdiusuComponent });
  }

  async goRegistrarAsis() {
    const result = await this.utilsSvc.presentModal({ component: RegistrarAsistenciaComponent });
    if (result?.success) {
      // Recargar asistencias después de registrar una nueva
      this.loadAsistencias();
    }
  }

goHistorialAsis() {
    this.utilsSvc.presentModal({ component: HistorialAsistenciasComponent
 });
  }
  goToSignUp() {
    this.router.navigate(['/main']); // <- uso correcto de this.router
  }
  goProfile() {
    this.router.navigate(['/main/profile']); // <- uso correcto de this.router
  }
  goCategoria() {
    this.router.navigate(['/main/categoria-entrenamientos']); // <- uso correcto de this.router
  }

  goContactos() {
    this.router.navigate(['/main/contacts']); // <- uso correcto de this.router
  }
  //===================Calculadora de IMC=====================
  calcularIMC() {
    const alturaMetros = this.usuarioTalla / 100;
    this.UsuarioImc = +(
      this.usuarioPeso /
      (alturaMetros * alturaMetros)
    ).toFixed(2);
  }

  calcularVasos() {
    const mlPorDia = this.usuarioPeso * 35;
    this.UsuarioVasos = Math.round(mlPorDia / 250);
  }

  //borrador
  verPerfil() {
    this.menuCtrl.close();
    this.utilsSvc.routerLink('srcapppagesmainprofile');
  }

  verAreas() {
    this.menuCtrl.close();
    this.utilsSvc.routerLink('srcapppagesmainprofile');
  }

  verUsuarios() {
    this.menuCtrl.close();
    this.utilsSvc.routerLink('/admin/usuarios');
  }

  editarUsuarios() {
    this.menuCtrl.close();
    this.utilsSvc.routerLink('/admin/editar-usuarios');
  }

  sacarReportes() {
    this.menuCtrl.close();
    this.utilsSvc.routerLink('/main/reportes');
  }

  //fin borrador

  abrirConfiguracion() {
    this.utilsSvc.routerLink('/profile');
  }
  openMenu() {
    this.menuCtrl.close(); // 👈 Cierra el menú
    this.menuCtrl.open('main-menu');
  }
  openLeftMenu() {
    this.menuCtrl.close(); // 👈 Cierra el menú
    this.menuCtrl.open('left-menu');
  }

  openRightMenu() {
    this.menuCtrl.close(); // 👈 Cierra el menú
    this.menuCtrl.open('right-menu');
  }

  signOut() {
    this.firebaseSvc.signOut();
    this.menuCtrl.close(); // 👈 Cierra el menú
  }


  user(): User{
    return this.utilsSvc.getFromLocalStorage('user')
  }

  //=========== Obtener Usuarios ===========
  //getUsuarios() {
    //this.firebaseSvc.getCollectionData('users').subscribe((users: any[]) => {
      //this.usuarios = users;
  //  });
  //}

  //=================== Actualiza la informacion del usuario =====================

  AddUsuarios( user?: User) {
    this.utilsSvc.presentModal({
      component: EdiusuComponent,
      cssClass: 'ediusu-modal-class',
      componentProps: { user },
    });
  }

async setUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;


      this.firebaseSvc
        .setDocument(path, this.form.value)
        .then(async res => {
          
          this.utilsSvc.saveInLocalStorage('user', this.form.value)
          this.utilsSvc.routerLink('/main/home');
          this.form.reset();

        })
        .catch((error) => {
          console.log(error);

          this.utilsSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;

      this.firebaseSvc
        .getDocument(path)
        .then((user: User) => {
          this.utilsSvc.saveInLocalStorage('user', user);
          this.utilsSvc.routerLink('/main/home');
          this.form.reset();

          this.utilsSvc.presentToast({
            message: `Te damos la bienvenida ${user?.nombre || 'usuario'}`,
            duration: 1500,
            color: 'danger',
            position: 'middle',
            icon: 'person-circle-outline',
          });
        })
        .catch((error) => {
          console.log(error);

          this.utilsSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  goPlanNutricional() {
    this.router.navigate(['/main/plan-nutricional']);
  }

  //=================== Load Chart Data for Admin =====================
  async loadChartData() {
    try {
      this.chartsLoading = true;
      console.log('Loading chart data...');

      // Load all users for statistics and charts
      const users = await this.firebaseSvc.getCollection('users');
      console.log('Users loaded:', users.length);

      if (!users || users.length === 0) {
        console.warn('No users found in database');
        this.chartsLoading = false;
        return;
      }

      // Calculate basic statistics
      await this.calculateBasicStats(users);

      // Load chart data - assign directly to ensure proper updates
      console.log('Loading pie chart data...');
      this.pieChartData = await this.loadPieChartData(users);

      console.log('Loading bar chart data...');
      this.barChartData = await this.loadBarChartData();

      console.log('Loading line chart data...');
      this.lineChartData = this.loadLineChartData(users);

      console.log('Loading doughnut chart data...');
      const doughnutData = await this.loadDoughnutChartData(users);
      // Force complete replacement of chart data
      this.doughnutChartData = JSON.parse(JSON.stringify(doughnutData));
      console.log('Doughnut chart data set:', this.doughnutChartData);

      // Force chart update by triggering change detection
      setTimeout(() => {
        this.doughnutChartData = { ...this.doughnutChartData };
        this.cdr.detectChanges();
      }, 50);

      console.log('Loading area chart data...');
      this.areaChartData = this.loadAreaChartData(users);

      console.log('Loading radar chart data...');
      this.radarChartData = await this.loadRadarChartData();

      console.log('Loading revenue chart data...');
      this.revenueChartData = this.loadRevenueChartData(users);

      console.log('Loading activity heatmap data...');
      this.activityHeatmapData = await this.loadActivityHeatmapData(users);

      console.log('Loading membership status data...');
      this.membershipStatusData = this.loadMembershipStatusData(users);

      console.log('Chart data loaded successfully');
      console.log('Pie chart data:', this.pieChartData);
      console.log('Bar chart data:', this.barChartData);
      console.log('Doughnut chart data:', this.doughnutChartData);

      // Force change detection multiple times to ensure charts update
      this.cdr.detectChanges();
      setTimeout(() => this.cdr.detectChanges(), 100);
      setTimeout(() => this.cdr.detectChanges(), 500);

    } catch (error) {
      console.error('Error loading chart data:', error);
      this.utilsSvc.presentToast({
        message: 'Error al cargar los datos de las gráficas',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });

      // Set default values in case of error
      this.totalUsers = 0;
      this.totalAdmins = 0;
      this.totalInscritos = 0;
      this.gymStats = {
        totalAttendanceThisMonth: 0,
        newUsersThisMonth: 0,
        membershipsExpiringSoon: 0,
        averageAttendancePerUser: 0,
        totalRevenue: 0,
        peakHour: 'Sin datos',
        mostPopularDay: 'Sin datos'
      };
    } finally {
      this.chartsLoading = false;
      this.cdr.detectChanges();
    }
  }

  async calculateBasicStats(users: any[]) {
    this.totalUsers = users.length;
    this.totalAdmins = users.filter(user => user.tipoMembresia === 'Administrador').length;
    this.totalInscritos = users.filter(user => user.tipoMembresia !== 'Administrador').length;

    // Calculate memberships expiring soon (next 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    this.gymStats.membershipsExpiringSoon = users.filter(user => {
      if (!user.FechaFinalizacion) return false;
      const expiryDate = new Date(user.FechaFinalizacion);
      return expiryDate >= now && expiryDate <= thirtyDaysFromNow;
    }).length;

    // Calculate new users this month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    this.gymStats.newUsersThisMonth = users.filter(user => {
      if (!user.FechaInscripcion) return false;
      const regDate = new Date(user.FechaInscripcion);
      return regDate >= startOfMonth;
    }).length;

    // Calculate real attendance stats for this month
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    let totalAttendanceThisMonth = 0;
    let totalAllAttendances = 0;
    const dayCounts: { [key: string]: number } = {};
    const hourCounts: { [key: string]: number } = {};

    // Process all attendances to get real data
    for (const user of users) {
      try {
        const attendances = await this.firebaseSvc.getCollection(`users/${user.uid}/asistencias`);
        if (attendances && attendances.length > 0) {
          totalAllAttendances += attendances.length;

          for (const attendance of attendances) {
            const attendanceDate = new Date(attendance.FechaAsistencia);

            // Count attendances this month
            if (attendanceDate.getMonth() === currentMonth && attendanceDate.getFullYear() === currentYear) {
              totalAttendanceThisMonth++;

              // Count by day of week
              const dayName = attendanceDate.toLocaleDateString('es-ES', { weekday: 'long' });
              dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;

              // Count by hour
              if (attendance.HoraAsistencia) {
                const hour = attendance.HoraAsistencia.split(':')[0];
                hourCounts[hour] = (hourCounts[hour] || 0) + 1;
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error calculating stats for user ${user.uid}:`, error);
      }
    }

    // Calculate average attendance per user
    this.gymStats.averageAttendancePerUser = this.totalInscritos > 0 ? +(totalAllAttendances / this.totalInscritos).toFixed(1) : 0;

    // Set real attendance count
    this.gymStats.totalAttendanceThisMonth = totalAttendanceThisMonth;

    // Find most popular day
    let mostPopularDay = 'Sin datos';
    let maxDayCount = 0;
    for (const [day, count] of Object.entries(dayCounts)) {
      if (count > maxDayCount) {
        maxDayCount = count;
        mostPopularDay = day;
      }
    }
    this.gymStats.mostPopularDay = mostPopularDay;

    // Find peak hour
    let peakHour = 'Sin datos';
    let maxHourCount = 0;
    for (const [hour, count] of Object.entries(hourCounts)) {
      if (count > maxHourCount) {
        maxHourCount = count;
        peakHour = `${hour}:00`;
      }
    }
    this.gymStats.peakHour = peakHour;

    // Calculate estimated revenue (base price per membership)
    const basePrice = 50; // precio base por mes
    this.gymStats.totalRevenue = this.totalInscritos * basePrice;
  }

  async loadPieChartData(users: any[]): Promise<ChartData<'pie', number[], string | string[]>> {
    const attendanceByMembership: { [key: string]: number } = {};

    // Initialize counts for each membership type
    const membershipTypes = ['Inscrito', 'Administrador'];
    membershipTypes.forEach(type => {
      attendanceByMembership[type] = 0;
    });

    // Count attendances by membership type
    for (const user of users) {
      const membershipType = user.tipoMembresia || 'Usuario';
      if (!attendanceByMembership[membershipType]) {
        attendanceByMembership[membershipType] = 0;
      }

      try {
        const attendances = await this.firebaseSvc.getCollection(`users/${user.uid}/asistencias`);
        if (attendances && attendances.length > 0) {
          attendanceByMembership[membershipType] += attendances.length;
        }
      } catch (error) {
        console.error(`Error loading attendances for pie chart: ${user.uid}`, error);
      }
    }

    const labels = Object.keys(attendanceByMembership);
    const data = Object.values(attendanceByMembership);

    console.log('Pie chart data (attendance by membership):', { labels, data });

    return {
      labels: labels,
      datasets: [{
        data: data as number[],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    };
  }

  async loadBarChartData(): Promise<ChartData<'bar', number[], string | string[]>> {
    // Show attendance for the last 7 days
    const last7Days = [];
    const attendanceCounts: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      last7Days.push(dateString);
    }

    // Get real attendance data from all users for the last 7 days
    try {
      const users = await this.firebaseSvc.getCollection('users');

      for (const dateString of last7Days) {
        let dailyCount = 0;

        for (const user of users) {
          try {
            const attendances = await this.firebaseSvc.getCollection(`users/${user.uid}/asistencias`);
            if (attendances) {
              dailyCount += attendances.filter(attendance => attendance.FechaAsistencia === dateString).length;
            }
          } catch (error) {
            console.error(`Error loading attendances for user ${user.uid}:`, error);
          }
        }

        attendanceCounts.push(dailyCount);
      }
    } catch (error) {
      console.error('Error loading bar chart data:', error);
      // Fallback to zero values if there's an error
      attendanceCounts.push(...Array(7).fill(0));
    }

    console.log('Bar chart data:', { labels: last7Days, data: attendanceCounts });

    return {
      labels: last7Days,
      datasets: [{
        data: attendanceCounts,
        label: 'Asistencias',
        backgroundColor: '#36A2EB',
        hoverBackgroundColor: '#36A2EB'
      }]
    };
  }

  loadLineChartData(users: any[]): ChartData<'line', number[], string | string[]> {
    // Group users by registration month
    const registrationsByMonth = users.reduce((acc, user) => {
      if (user.FechaInscripcion) {
        const date = new Date(user.FechaInscripcion);
        const monthYear = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
        acc[monthYear] = (acc[monthYear] || 0) + 1;
      }
      return acc;
    }, {});

    const sortedMonths = Object.keys(registrationsByMonth).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const data = sortedMonths.map(month => registrationsByMonth[month]);

    console.log('Line chart data:', { labels: sortedMonths, data });

    return {
      labels: sortedMonths,
      datasets: [{
        data: data,
        label: 'Usuarios Registrados',
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4
      }]
    };
  }

  async loadDoughnutChartData(users: any[]): Promise<ChartData<'doughnut', number[], string | string[]>> {
    // Show attendance distribution by time intervals for current month
    const timeIntervals = {
      '6 am a 12 pm': 0,  // Morning
      '12 pm a 20 pm': 0  // Afternoon/Evening
    };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    console.log('Loading doughnut chart data for month:', currentMonth, 'year:', currentYear);
    console.log('Total users to process:', users.length);

    let totalAttendancesProcessed = 0;
    let totalAttendancesFound = 0;

    // Get attendance data from all users for current month only
    for (const user of users) {
      // Skip admin users for attendance stats
      if (user.tipoMembresia === 'Administrador') {
        console.log(`Skipping admin user: ${user.uid}`);
        continue;
      }

      try {
        const attendances = await this.firebaseSvc.getCollection(`users/${user.uid}/asistencias`);
        console.log(`User ${user.uid} (${user.nombre}) has ${attendances?.length || 0} attendances`);
        totalAttendancesFound += attendances?.length || 0;

        if (attendances && attendances.length > 0) {
          attendances.forEach(attendance => {
            console.log('Processing attendance:', attendance);

            // Check if attendance is from current month
            if (attendance.FechaAsistencia) {
              // Handle different date formats: "DD/MM/YYYY" or ISO string
              let attendanceDate: Date;
              if (attendance.FechaAsistencia.includes('/')) {
                // Format: "DD/MM/YYYY"
                const [day, month, year] = attendance.FechaAsistencia.split('/');
                attendanceDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
              } else {
                // Try standard date parsing
                attendanceDate = new Date(attendance.FechaAsistencia);
              }

              console.log('Parsed attendance date:', attendanceDate, 'Month:', attendanceDate.getMonth(), 'Year:', attendanceDate.getFullYear());

              if (attendanceDate.getMonth() === currentMonth && attendanceDate.getFullYear() === currentYear) {
                console.log('Attendance is from current month');
                totalAttendancesProcessed++;

                // Try different possible field names for time
                let horaAsistencia = attendance.HoraAsistencia || attendance.horaAsistencia || attendance.hora || attendance.time;

                if (horaAsistencia) {
                  console.log('Found time field:', horaAsistencia);

                  // Handle different time formats
                  let hour = 0;
                  if (typeof horaAsistencia === 'string') {
                    // Try to extract hour from string like "14:30" or "14:30:00"
                    const timeParts = horaAsistencia.split(':');
                    hour = parseInt(timeParts[0]);
                  } else if (typeof horaAsistencia === 'number') {
                    hour = horaAsistencia;
                  } else if (horaAsistencia instanceof Date) {
                    hour = horaAsistencia.getHours();
                  }

                  console.log('Extracted hour:', hour);

                  if (!isNaN(hour) && hour >= 0 && hour < 24) {
                    // Group by time intervals
                    if (hour >= 6 && hour < 12) {
                      timeIntervals['6 am a 12 pm']++;
                      console.log('Incremented count for morning interval');
                    } else if (hour >= 12 && hour < 20) {
                      timeIntervals['12 pm a 20 pm']++;
                      console.log('Incremented count for afternoon interval');
                    }
                  } else {
                    console.log('Invalid hour value:', hour);
                  }
                } else {
                  console.log('No time field found in attendance');
                }
              } else {
                console.log('Attendance not from current month');
              }
            } else {
              console.log('No FechaAsistencia field found');
            }
          });
        }
      } catch (error) {
        console.error(`Error loading attendances for doughnut chart: ${user.uid}`, error);
      }
    }

    console.log('Total attendances found across all users:', totalAttendancesFound);
    console.log('Total attendances processed for current month:', totalAttendancesProcessed);
    console.log('Time intervals counts:', timeIntervals);

    // Prepare data for chart
    let labels = Object.keys(timeIntervals);
    let data = Object.values(timeIntervals);

    // If no data, show a default state
    if (data.every(count => count === 0)) {
      console.log('No attendance data found for current month, showing default state');
      labels = ['Sin datos'];
      data = [1];
    }

    console.log('Final doughnut chart data:', { labels, data, timeIntervals });

    return {
      labels: labels,
      datasets: [{
        data: data as number[],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    };
  }

  loadAreaChartData(users: any[]): ChartData<'line', number[], string | string[]> {
    // Show memberships expiring in the next 30 days (timeline)
    const next30Days = [];
    const expiryCounts: number[] = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      next30Days.push({
        date: date,
        label: date.toLocaleDateString('es-BO', {
          day: '2-digit',
          month: '2-digit'
        })
      });
    }

    // Count memberships expiring each day using proper date comparison
    next30Days.forEach(dayInfo => {
      const count = users.filter(user => {
        if (!user.FechaFinalizacion) return false;
        const expiryDate = new Date(user.FechaFinalizacion);
        // Compare year, month, and day to avoid time issues
        return expiryDate.getFullYear() === dayInfo.date.getFullYear() &&
               expiryDate.getMonth() === dayInfo.date.getMonth() &&
               expiryDate.getDate() === dayInfo.date.getDate();
      }).length;
      expiryCounts.push(count);
    });

    const labels = next30Days.map(day => day.label);

    console.log('Area chart data:', { labels, data: expiryCounts });

    return {
      labels: labels,
      datasets: [{
        data: expiryCounts,
        label: 'Membresías por Vencer',
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4
      }]
    };
  }

  async loadRadarChartData(): Promise<ChartData<'radar', number[], string | string[]>> {
    // Show attendance distribution by day of the week for current month
    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayCounts: { [key: string]: number } = {};

    // Initialize counts
    daysOfWeek.forEach(day => {
      dayCounts[day] = 0;
    });

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    try {
      const users = await this.firebaseSvc.getCollection('users');

      for (const user of users) {
        try {
          const attendances = await this.firebaseSvc.getCollection(`users/${user.uid}/asistencias`);
          if (attendances) {
            attendances.forEach(attendance => {
              // Check if attendance is from current month
              if (attendance.FechaAsistencia) {
                const attendanceDate = new Date(attendance.FechaAsistencia);
                if (attendanceDate.getMonth() === currentMonth && attendanceDate.getFullYear() === currentYear) {
                  const dayName = daysOfWeek[attendanceDate.getDay()];
                  dayCounts[dayName]++;
                }
              }
            });
          }
        } catch (error) {
          console.error(`Error loading attendances for radar chart: ${user.uid}`, error);
        }
      }
    } catch (error) {
      console.error('Error loading radar chart data:', error);
    }

    const labels = daysOfWeek.map(day => day.charAt(0).toUpperCase() + day.slice(1));
    const data = daysOfWeek.map(day => dayCounts[day]);

    console.log('Radar chart data:', { labels, data });

    return {
      labels: labels,
      datasets: [{
        data: data,
        label: 'Asistencias por Día',
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointBackgroundColor: '#36A2EB',
        pointBorderColor: '#36A2EB'
      }]
    };
  }

  loadRevenueChartData(users: any[]): ChartData<'line', number[], string | string[]> {
    // Show revenue trends over the last 6 months
    const last6Months = [];
    const revenueData: number[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthLabel = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
      last6Months.push(monthLabel);
    }

    // Calculate revenue for each month (simplified: active users * base price)
    const basePrice = 50; // precio base por mes
    last6Months.forEach((monthLabel, index) => {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - (5 - index));

      // Count active users for this month (simplified calculation)
      const activeUsers = users.filter(user => {
        if (!user.FechaInscripcion) return false;
        const regDate = new Date(user.FechaInscripcion);
        return regDate <= monthDate;
      }).length;

      const revenue = activeUsers * basePrice;
      revenueData.push(revenue);
    });

    console.log('Revenue chart data:', { labels: last6Months, data: revenueData });

    return {
      labels: last6Months,
      datasets: [{
        data: revenueData,
        label: 'Ingresos Mensuales',
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4
      }]
    };
  }

  async loadActivityHeatmapData(users: any[]): Promise<ChartData<'bar', number[], string | string[]>> {
    // Show activity distribution by hour of day for current month
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    const hourCounts: { [key: string]: number } = {};

    // Initialize counts
    hours.forEach(hour => {
      hourCounts[hour] = 0;
    });

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    try {
      for (const user of users) {
        try {
          const attendances = await this.firebaseSvc.getCollection(`users/${user.uid}/asistencias`);
          if (attendances) {
            attendances.forEach(attendance => {
              // Check if attendance is from current month
              if (attendance.FechaAsistencia) {
                const attendanceDate = new Date(attendance.FechaAsistencia);
                if (attendanceDate.getMonth() === currentMonth && attendanceDate.getFullYear() === currentYear) {
                  // Extract hour from time
                  let horaAsistencia = attendance.HoraAsistencia || attendance.horaAsistencia || attendance.hora || attendance.time;
                  if (horaAsistencia) {
                    let hour = 0;
                    if (typeof horaAsistencia === 'string') {
                      const timeParts = horaAsistencia.split(':');
                      hour = parseInt(timeParts[0]);
                    } else if (typeof horaAsistencia === 'number') {
                      hour = horaAsistencia;
                    } else if (horaAsistencia instanceof Date) {
                      hour = horaAsistencia.getHours();
                    }

                    if (!isNaN(hour) && hour >= 0 && hour < 24) {
                      const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
                      hourCounts[hourLabel]++;
                    }
                  }
                }
              }
            });
          }
        } catch (error) {
          console.error(`Error loading attendances for activity heatmap: ${user.uid}`, error);
        }
      }
    } catch (error) {
      console.error('Error loading activity heatmap data:', error);
    }

    const data = hours.map(hour => hourCounts[hour]);

    console.log('Activity heatmap data:', { labels: hours, data });

    return {
      labels: hours,
      datasets: [{
        data: data,
        label: 'Actividad por Hora',
        backgroundColor: '#9966FF',
        hoverBackgroundColor: '#9966FF'
      }]
    };
  }

  loadMembershipStatusData(users: any[]): ChartData<'doughnut', number[], string | string[]> {
    // Show membership status distribution
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const statusCounts = {
      'Activas': 0,
      'Por Vencer': 0,
      'Vencidas': 0
    };

    users.forEach(user => {
      if (user.tipoMembresia === 'Administrador') return; // Skip admins

      if (!user.FechaFinalizacion) {
        statusCounts['Activas']++; // Assume active if no expiry date
        return;
      }

      const expiryDate = new Date(user.FechaFinalizacion);
      if (expiryDate > thirtyDaysFromNow) {
        statusCounts['Activas']++;
      } else if (expiryDate >= now && expiryDate <= thirtyDaysFromNow) {
        statusCounts['Por Vencer']++;
      } else if (expiryDate < now) {
        statusCounts['Vencidas']++;
      }
    });

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);

    console.log('Membership status data:', { labels, data, statusCounts });

    return {
      labels: labels,
      datasets: [{
        data: data as number[],
        backgroundColor: ['#4BC0C0', '#FFCE56', '#FF6384'],
        hoverBackgroundColor: ['#4BC0C0', '#FFCE56', '#FF6384']
      }]
    };
  }
}
