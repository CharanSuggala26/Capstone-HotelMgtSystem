import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HotelService } from '../../services/hotel';
import { AuthService } from '../../services/auth';
import { HotelDto } from '../../models';

@Component({
  selector: 'app-hotels',
  imports: [CommonModule, RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './hotels.html',
  styleUrl: './hotels.css'
})
export class HotelsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'city', 'phone', 'email', 'totalRooms', 'actions'];
  dataSource = new MatTableDataSource<HotelDto>();
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private hotelService: HotelService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadHotels();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadHotels(): void {
    this.loading = true;
    this.hotelService.getHotels().subscribe({
      next: (response: any) => {
        const hotels = Array.isArray(response) ? response : (response.data || []);
        this.dataSource.data = hotels;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error('❌ Error loading hotels:', error);
      }
    });
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }
}
