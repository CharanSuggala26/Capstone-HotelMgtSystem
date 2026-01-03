import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of, timer } from 'rxjs';
import { catchError, finalize, take } from 'rxjs/operators';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

import { HotelService } from '../../services/hotel';
import { ReservationService } from '../../services/reservation';
import { UserService } from '../../services/user';
import { ReservationStatus, PaymentStatus } from '../../models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class Reports implements OnInit, OnDestroy {
  loading = true;

  stats = {
    totalRevenue: 0,
    occupancyRate: 0,
    activeReservations: 0,
    totalUsers: 0,
    totalHotels: 0
  };

  public lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  public doughnutChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(
    private hotelService: HotelService,
    private reservationService: ReservationService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.loading = true;
  }

  fetchData(): void {
    this.loading = true;

    forkJoin({
      hotels: this.hotelService.getHotels().pipe(catchError(() => of([]))),
      reservations: this.reservationService.getAllReservations().pipe(catchError(() => of([]))),
      users: this.userService.getAllUsers(1, 1000).pipe(catchError(() => of({ totalCount: 0 }))),
      bills: this.reservationService.getBills().pipe(catchError(() => of([])))
    }).pipe(
      take(1),
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges(); // Manually force UI update
      })
    ).subscribe((res: any) => {
      this.processData(res);
    });
  }

  private processData(res: any) {
    const hotels = res.hotels?.data || res.hotels || [];
    const reservations = res.reservations?.data || res.reservations || [];
    const bills = res.bills?.data || res.bills || [];
    const userResult = res.users?.data || res.users;

    this.stats.totalHotels = hotels.length;
    this.stats.totalRevenue = bills
      .filter((b: any) => b.paymentStatus === PaymentStatus.Paid || b.paymentStatus === 2)
      .reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);

    const totalRooms = hotels.reduce((sum: number, h: any) => sum + (h.totalRooms || 0), 0) || 1;
    this.stats.activeReservations = reservations.filter((r: any) =>
      r.status === ReservationStatus.CheckedIn || r.status === 3
    ).length;

    // Calculate Occupancy based on date overlap and active status (Booked, Confirmed, CheckedIn)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const occupiedRooms = reservations.filter((r: any) => {
      const status = r.status;
      const isActive =
        status === ReservationStatus.Booked || status === 1 ||
        status === ReservationStatus.Confirmed || status === 2 ||
        status === ReservationStatus.CheckedIn || status === 3;

      if (!isActive) return false;

      const checkIn = new Date(r.checkInDate);
      const checkOut = new Date(r.checkOutDate);
      // Normalize dates to compare only days
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);

      // Occupied if today is within [checkIn, checkOut)
      return today >= checkIn && today < checkOut;
    }).length;

    this.stats.occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
    this.stats.totalUsers = userResult?.totalCount || 0;

    // Calculate last 6 months dynamically
    const last6Months = [];
    const revenueByMonth = new Array(6).fill(0);

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      last6Months.push(d.toLocaleString('default', { month: 'short' }));
    }

    // Process Revenue per Month
    const paidBills = bills.filter((b: any) =>
      (b.paymentStatus === PaymentStatus.Paid || b.paymentStatus === 2) && b.paidAt
    );

    paidBills.forEach((b: any) => {
      const paidDate = new Date(b.paidAt);
      const diffMonths = (today.getFullYear() - paidDate.getFullYear()) * 12 + (today.getMonth() - paidDate.getMonth());

      if (diffMonths >= 0 && diffMonths < 6) {
        // index 0 = 5 months ago, index 5 = current month
        const index = 5 - diffMonths;
        revenueByMonth[index] += (b.totalAmount || 0);
      }
    });

    this.lineChartData = {
      labels: last6Months,
      datasets: [{
        label: 'Revenue',
        data: revenueByMonth,
        borderColor: '#4e73df',
        backgroundColor: 'rgba(78, 115, 223, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };

    this.doughnutChartData = {
      labels: ['Booked', 'Checked In', 'Cancelled'],
      datasets: [{
        data: [
          reservations.filter((r: any) => r.status === 1 || r.status === ReservationStatus.Booked).length,
          reservations.filter((r: any) => r.status === 3 || r.status === ReservationStatus.CheckedIn).length,
          reservations.filter((r: any) => r.status === 5 || r.status === ReservationStatus.Cancelled).length
        ],
        backgroundColor: ['#4e73df', '#1cc88a', '#e74a3b']
      }]
    };
  }
}