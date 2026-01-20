import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { SharedModule } from 'src/app/shared/shared.module';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface UserReport {
  user: User;
  attendanceCount: number;
  totalHours: number;
  lastAttendance?: string;
  membershipStatus: 'active' | 'expiring' | 'expired';
  daysUntilExpiry: number;
}

interface GymStats {
  totalAttendanceThisMonth: number;
  averageAttendancePerUser: number;
  membershipsExpiringSoon: number;
  expiredMemberships: number;
  newUsersThisMonth: number;
  totalRevenue: number;
  mostPopularDay: string;
  peakHour: string;
  attendanceBySchedule: { [hour: string]: number };
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
  imports: [IonicModule, CommonModule, SharedModule],
})
export class ReportesPage implements OnInit {
exportFromDate: string | null = null;
exportToDate: string | null = null;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  // Estadísticas generales
  totalUsers: number = 0;
  totalAdmins: number = 0;
  totalInscritos: number = 0;

  // Datos detallados
  usersReports: UserReport[] = [];
  loading: boolean = true;

  // Nuevas estadísticas avanzadas
  gymStats: GymStats = {
    totalAttendanceThisMonth: 0,
    averageAttendancePerUser: 0,
    membershipsExpiringSoon: 0,
    expiredMemberships: 0,
    newUsersThisMonth: 0,
    totalRevenue: 0,
    mostPopularDay: '',
    peakHour: '',
    attendanceBySchedule: {}
  };

  // Alertas
  alerts: string[] = [];

  constructor() { }

  async ngOnInit() {
    await this.loadReports();
  }

  async loadReports() {
    try {
      this.loading = true;

      // Obtener todos los usuarios
      const users = await this.firebaseSvc.getCollection('users') as User[];

      this.totalUsers = users.length;
      this.totalAdmins = users.filter(u => u.tipoMembresia === 'Administrador').length;
      this.totalInscritos = users.filter(u => u.tipoMembresia === 'Inscrito').length;

      // Procesar cada usuario para obtener sus asistencias
      this.usersReports = await Promise.all(
        users.map(async (user) => {
          const userReport = await this.processUserData(user);
          return userReport;
        })
      );

      // Calcular estadísticas avanzadas
      await this.calculateAdvancedStats(users);

      // Generar alertas
      this.generateAlerts();

    } catch (error) {
      console.error('Error loading reports:', error);
      this.utilsSvc.presentToast({
        message: 'Error al cargar los reportes',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      this.loading = false;
    }
  }

  exportToExcel() {

  const titleStyle = {
    font: { bold: true, sz: 16 },
    alignment: { horizontal: 'center', vertical: 'center' }
  };

  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '1F4E78' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  const cellStyle = {
    border: {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  const zebraStyle = {
    fill: { fgColor: { rgb: 'F2F2F2' } }
  };

  /* =========================
     HOJA 1: ESTADÍSTICAS
     ========================= */
  const statsData = [
    ['REPORTE GENERAL DEL GIMNASIO'],
    [],
    ['Indicador', 'Valor'],
    ['Total de Usuarios', this.totalUsers],
    ['Usuarios Inscritos', this.totalInscritos],
    ['Administradores', this.totalAdmins],
    ['Asistencias Este Mes', this.gymStats.totalAttendanceThisMonth],
    ['Promedio Asistencias / Usuario', this.gymStats.averageAttendancePerUser.toFixed(2)],
    ['Membresías por Vencer', this.gymStats.membershipsExpiringSoon],
    ['Membresías Vencidas', this.gymStats.expiredMemberships],
    ['Nuevos Usuarios Este Mes', this.gymStats.newUsersThisMonth],
    ['Ingresos Estimados (Bs)', this.gymStats.totalRevenue],
    ['Día Más Popular', this.gymStats.mostPopularDay],
    ['Hora Pico', this.gymStats.peakHour]
  ];

  const wsStats = XLSX.utils.aoa_to_sheet(statsData);

  wsStats['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
  wsStats['!cols'] = [{ wch: 40 }, { wch: 30 }];

  wsStats['A1'].s = titleStyle;
  wsStats['A3'].s = headerStyle;
  wsStats['B3'].s = headerStyle;

  for (let r = 3; r < statsData.length; r++) {
    wsStats[`A${r + 1}`].s = { ...cellStyle, ...(r % 2 === 0 ? zebraStyle : {}) };
    wsStats[`B${r + 1}`].s = { ...cellStyle, ...(r % 2 === 0 ? zebraStyle : {}) };
  }

  /* =========================
     HOJA 2: USUARIOS
     ========================= */
  const usersData = [
    ['LISTADO DETALLADO DE USUARIOS'],
    [],
    [
      'Nombre',
      'Membresía',
      'Asistencias',
      'Horas',
      'Estado',
      'Días Restantes',
      'Última Asistencia',
      'Inscripción',
      'Finalización'
    ],
    ...this.usersReports.map(r => [
      r.user.nombre,
      r.user.tipoMembresia,
      r.attendanceCount,
      r.totalHours,
      r.membershipStatus === 'active'
        ? 'Activa'
        : r.membershipStatus === 'expiring'
        ? 'Por Vencer'
        : 'Vencida',
      r.daysUntilExpiry >= 0 ? r.daysUntilExpiry : '—',
      r.lastAttendance ? this.formatDate(r.lastAttendance) : 'Sin registro',
      this.formatDate(r.user.FechaInscripcion),
      this.formatDate(r.user.FechaFinalizacion)
    ])
  ];

  const wsUsers = XLSX.utils.aoa_to_sheet(usersData);

  wsUsers['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }];
  wsUsers['!cols'] = [
    { wch: 25 }, { wch: 18 }, { wch: 14 },
    { wch: 12 }, { wch: 16 }, { wch: 16 },
    { wch: 20 }, { wch: 16 }, { wch: 16 }
  ];

  wsUsers['A1'].s = titleStyle;

  usersData[2].forEach((_, c) => {
    wsUsers[XLSX.utils.encode_cell({ r: 2, c })].s = headerStyle;
  });

  for (let r = 3; r < usersData.length; r++) {
    for (let c = 0; c < 9; c++) {
      wsUsers[XLSX.utils.encode_cell({ r, c })].s = {
        ...cellStyle,
        ...(r % 2 === 0 ? zebraStyle : {})
      };
    }
  }

  /* =========================
     HOJA 3: ASISTENCIAS POR HORARIO
     ========================= */
  const scheduleData = [
    ['ASISTENCIAS POR HORARIO'],
    ['Distribución de asistencias por hora (este mes)'],
    [],
    ['Hora', 'Asistencias'],
    ...Object.entries(this.gymStats.attendanceBySchedule)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([hour, count]) => [`${hour}:00`, count])
  ];

  const wsSchedule = XLSX.utils.aoa_to_sheet(scheduleData);

  wsSchedule['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
  wsSchedule['!cols'] = [{ wch: 15 }, { wch: 15 }];

  wsSchedule['A1'].s = titleStyle;
  wsSchedule['A4'].s = headerStyle;
  wsSchedule['B4'].s = headerStyle;

  for (let r = 4; r < scheduleData.length; r++) {
    wsSchedule[`A${r + 1}`].s = cellStyle;
    wsSchedule[`B${r + 1}`].s = cellStyle;
  }

  /* =========================
     EXPORTAR
     ========================= */
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsStats, 'Estadísticas');
  XLSX.utils.book_append_sheet(wb, wsUsers, 'Usuarios');
  XLSX.utils.book_append_sheet(wb, wsSchedule, 'Asistencias por Horario');

  const buffer = XLSX.write(wb, {
    bookType: 'xlsx',
    type: 'array',
    cellStyles: true
  });

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  saveAs(blob, `Reporte_Gimnasio_${new Date().toISOString().slice(0,10)}.xlsx`);
}

  async processUserData(user: User): Promise<UserReport> {
    try {
      // Obtener asistencias del usuario
      const attendances = await this.firebaseSvc.getCollection(`users/${user.uid}/asistencias`);

      let totalHours = 0;
      let lastAttendance = '';
      let membershipStatus: 'active' | 'expiring' | 'expired' = 'active';
      let daysUntilExpiry = 0;

      if (attendances && attendances.length > 0) {
        // Calcular horas totales (cada asistencia cuenta como 1 hora)
        totalHours = attendances.length;

        // Obtener la última asistencia
        const sortedAttendances = attendances.sort((a, b) =>
          new Date(b.FechaAsistencia + ' ' + b.HoraAsistencia).getTime() -
          new Date(a.FechaAsistencia + ' ' + a.HoraAsistencia).getTime()
        );
        lastAttendance = sortedAttendances[0].FechaAsistencia;
      }

      // Calcular estado de membresía
      if (user.FechaFinalizacion) {
        const expiryDate = new Date(user.FechaFinalizacion);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0) {
          membershipStatus = 'expired';
        } else if (daysUntilExpiry <= 30) {
          membershipStatus = 'expiring';
        }
      }

      return {
        user,
        attendanceCount: attendances ? attendances.length : 0,
        totalHours,
        lastAttendance,
        membershipStatus,
        daysUntilExpiry
      };

    } catch (error) {
      console.error(`Error processing user ${user.uid}:`, error);
      return {
        user,
        attendanceCount: 0,
        totalHours: 0,
        membershipStatus: 'active',
        daysUntilExpiry: 0
      };
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  }

  getUserWithMostHours(): UserReport | null {
    if (this.usersReports.length === 0) return null;
    return this.usersReports.reduce((prev, current) =>
      prev.totalHours > current.totalHours ? prev : current
    );
  }

  async calculateAdvancedStats(users: User[]) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let totalAttendanceThisMonth = 0;
    const dayCounts: { [key: string]: number } = {};
    const hourCounts: { [key: string]: number } = {};
    let totalAllAttendances = 0;

    // Procesar todas las asistencias de una vez para optimizar
    for (const report of this.usersReports) {
      totalAllAttendances += report.attendanceCount;

      try {
        const attendances = await this.firebaseSvc.getCollection(`users/${report.user.uid}/asistencias`);
        if (attendances && attendances.length > 0) {
          for (const attendance of attendances) {
            const attendanceDate = new Date(attendance.FechaAsistencia);

            // Contar asistencias del mes actual
            if (attendanceDate.getMonth() === currentMonth && attendanceDate.getFullYear() === currentYear) {
              totalAttendanceThisMonth++;

              // Contar por día de la semana
              const dayName = attendanceDate.toLocaleDateString('es-ES', { weekday: 'long' });
              dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;

              // Contar por hora
              if (attendance.HoraAsistencia) {
                const hour = attendance.HoraAsistencia.split(':')[0];
                hourCounts[hour] = (hourCounts[hour] || 0) + 1;
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error calculating stats for user ${report.user.uid}:`, error);
      }
    }

    // Encontrar día más popular
    let mostPopularDay = 'Sin datos';
    let maxDayCount = 0;
    for (const [day, count] of Object.entries(dayCounts)) {
      if (count > maxDayCount) {
        maxDayCount = count;
        mostPopularDay = day;
      }
    }

    // Encontrar hora pico
    let peakHour = 'Sin datos';
    let maxHourCount = 0;
    for (const [hour, count] of Object.entries(hourCounts)) {
      if (count > maxHourCount) {
        maxHourCount = count;
        peakHour = `${hour}:00`;
      }
    }

    // Calcular membresías
    const membershipsExpiringSoon = this.usersReports.filter(r =>
      r.membershipStatus === 'expiring').length;

    const expiredMemberships = this.usersReports.filter(r =>
      r.membershipStatus === 'expired').length;

    // Calcular nuevos usuarios este mes
    const newUsersThisMonth = users.filter(u => {
      if (!u.FechaInscripcion) return false;
      const inscriptionDate = new Date(u.FechaInscripcion);
      return inscriptionDate.getMonth() === currentMonth &&
             inscriptionDate.getFullYear() === currentYear;
    }).length;

    // Calcular ingresos estimados (precio base por membresía mensual)
    const basePrice = 50; // precio base por mes
    const totalRevenue = this.totalInscritos * basePrice;

    this.gymStats = {
      totalAttendanceThisMonth,
      averageAttendancePerUser: this.totalInscritos > 0 ? totalAllAttendances / this.totalInscritos : 0,
      membershipsExpiringSoon,
      expiredMemberships,
      newUsersThisMonth,
      totalRevenue,
      mostPopularDay,
      peakHour,
      attendanceBySchedule: hourCounts
    };
  }

  generateAlerts() {
    this.alerts = [];

    // Alertas de membresías por vencer
    if (this.gymStats.membershipsExpiringSoon > 0) {
      this.alerts.push(`⚠️ ${this.gymStats.membershipsExpiringSoon} membresías vencen en menos de 30 días`);
    }

    // Alertas de membresías vencidas
    if (this.gymStats.expiredMemberships > 0) {
      this.alerts.push(`🚨 ${this.gymStats.expiredMemberships} membresías han vencido`);
    }

    // Alertas de baja asistencia
    const lowAttendanceUsers = this.usersReports.filter(r =>
      r.membershipStatus === 'active' && r.attendanceCount < 5).length;

    if (lowAttendanceUsers > 0) {
      this.alerts.push(`📉 ${lowAttendanceUsers} usuarios con baja asistencia (< 5 sesiones)`);
    }

    // Alertas de nuevos usuarios
    if (this.gymStats.newUsersThisMonth > 0) {
      this.alerts.push(`🎉 ${this.gymStats.newUsersThisMonth} nuevos usuarios este mes`);
    }
  }
}
