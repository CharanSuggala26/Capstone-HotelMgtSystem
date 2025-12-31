import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HotelService } from '../../services/hotel';
import { HotelDto } from '../../models';
import { Router,RouterModule,RouterLink } from '@angular/router';

@Component({
    selector: 'app-hotel-admin-list',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterModule,RouterLink],
    templateUrl: './hotel-admin-list.html',
    styleUrl: './hotel-admin-list.css'
})
export class HotelAdminListComponent implements OnInit {
    displayedColumns: string[] = ['name', 'city', 'phone', 'totalRooms', 'actions'];
    dataSource = new MatTableDataSource<HotelDto>();
    router: any;

    constructor(
        private hotelService: HotelService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadHotels();
    }

    loadHotels(): void {
        this.hotelService.getHotels().subscribe((response: any) => {
            const hotels = Array.isArray(response) ? response : (response.data || []);
            this.dataSource.data = hotels;
            this.cdr.detectChanges(); // Force detection to resolve NG0100
        });
    }

    deleteHotel(id: number): void {
        if (confirm('Are you sure you want to delete this hotel?')) {
            this.hotelService.deleteHotel(id).subscribe((response: any) => {
                if (response.success !== false) {
                    this.loadHotels();
                }
            });
        }
    }

     editHotelAdmin(id: number | null): void {
        if (!id) {
            console.warn('editHotelAdmin called with invalid id:', id);
            return;
        }
        console.log('Navigating to edit hotel with id:', id);
        this.router.navigate(['/dashboard/admin/hotels', id, 'edit']);
    }
}
