import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { UserService } from '../../services/user';
import { HotelService } from '../../services/hotel';
import { UserDetailsDto, HotelDto, ApiResponse } from '../../models';

@Component({
  standalone: true,
  selector: 'app-assign-hotel',
  templateUrl: './assign-hotel.html',
  styleUrls: ['./assign-hotel.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class AssignHotel implements OnInit {
  assignForm: FormGroup;
  users: UserDetailsDto[] = [];
  hotels: HotelDto[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private hotelService: HotelService,
    private cdr: ChangeDetectorRef
  ) {
    this.assignForm = this.fb.group({
      userId: ['', Validators.required],
      hotelId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadHotels();
  }

  loadUsers(): void {
    this.userService.getAllUsers(1, 100).subscribe({
      next: (res) => {
        // Accessing the items array inside the paginated data
        this.users = res.data?.items || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('User load error', err)
    });
  }

  loadHotels(): void {
    this.hotelService.getHotels().subscribe({
      next: (res: ApiResponse<HotelDto[]>) => {
        // DRILL DOWN: API returns ApiResponse, we need the .data property
        if (res && res.data) {
          this.hotels = res.data;
        } else if (Array.isArray(res)) {
          // Fallback if API returns raw array
          this.hotels = res;
        }
        
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Hotel load error', err);
        this.errorMessage = 'Could not load hotels. Check API connection.';
      }
    });
  }

  assignHotel(): void {
    if (this.assignForm.invalid) return;

    this.loading = true;
    const { userId, hotelId } = this.assignForm.value;

    this.userService.assignHotel(userId, hotelId).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Hotel assigned successfully');
          this.assignForm.reset();
        } else {
          this.errorMessage = res.message || 'Assignment failed';
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'An error occurred during assignment';
        this.loading = false;
      }
    });
  }
}