import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReservationService } from '../../services/reservation';
import { AuthService } from '../../services/auth';
import { ReservationDto, ReservationStatus } from '../../models';

@Component({
  selector: 'app-reservations',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatCardModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css'
})
export class ReservationsComponent implements OnInit {
  displayedColumns: string[] = ['hotelName', 'roomNumber', 'checkInDate', 'checkOutDate', 'numberOfGuests', 'totalAmount', 'status', 'actions'];
  dataSource = new MatTableDataSource<ReservationDto>();
  loading = false;
  ReservationStatus = ReservationStatus;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadReservations();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadReservations(): void {
    this.loading = true;
    this.reservationService.getReservations().subscribe({
      next: (response: any) => {
        // Handle if backend returns array directly
        if (Array.isArray(response)) {
          this.dataSource.data = response;
        }
        // Handle if backend returns ApiResponse format
        else if (response && response.success && response.data) {
          this.dataSource.data = response.data;
        }
        else {
          this.dataSource.data = [];
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error loading reservations:', error);
      }
    });
  }

  getStatusText(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.Booked: return 'Booked';
      case ReservationStatus.Confirmed: return 'Confirmed';
      case ReservationStatus.CheckedIn: return 'Checked In';
      case ReservationStatus.CheckedOut: return 'Checked Out';
      case ReservationStatus.Cancelled: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getStatusColor(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.Booked: return 'accent';
      case ReservationStatus.Confirmed: return 'primary';
      case ReservationStatus.CheckedIn: return 'primary';
      case ReservationStatus.CheckedOut: return '';
      case ReservationStatus.Cancelled: return 'warn';
      default: return '';
    }
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  checkIn(reservationId: number): void {
    this.reservationService.checkIn(reservationId).subscribe({
      next: () => this.loadReservations(),
      error: (error) => console.error('Check-in failed:', error)
    });
  }

  checkOut(reservationId: number): void {
    this.reservationService.checkOut(reservationId).subscribe({
      next: () => this.loadReservations(),
      error: (error) => console.error('Check-out failed:', error)
    });
  }
}
