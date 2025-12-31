import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { HotelService } from '../../services/hotel';
import { AuthService } from '../../services/auth';
import { RoomDto, RoomType, RoomStatus, HotelDto } from '../../models';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './rooms.html',
  styleUrls: ['./rooms.css']
})
export class RoomsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['roomNumber', 'type', 'capacity', 'basePrice', 'status', 'hotelName', 'actions'];
  dataSource = new MatTableDataSource<RoomDto>([]);
  roomForm: FormGroup;
  editing = false;
  hotelIdFromRoute: number | null = null;

  hotels: HotelDto[] = [];
  isAdmin = false;
  isManager = false;

  roomTypes = [
    { value: RoomType.Single, label: 'Single' },
    { value: RoomType.Double, label: 'Double' },
    { value: RoomType.Suite, label: 'Suite' },
    { value: RoomType.Deluxe, label: 'Deluxe' }
  ];

  roomStatuses = [
    { value: RoomStatus.Available, label: 'Available' },
    { value: RoomStatus.Occupied, label: 'Occupied' },
    { value: RoomStatus.Maintenance, label: 'Maintenance' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {
    this.roomForm = this.fb.group({
      id: [null],
      roomNumber: ['', Validators.required],
      type: [RoomType.Single, Validators.required],
      capacity: [1, [Validators.required, Validators.min(1)]],
      basePrice: [0, [Validators.required, Validators.min(0)]],
      status: [RoomStatus.Available, Validators.required],
      hotelId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    // route param override
    const idParam = this.route.snapshot.paramMap.get('id');
    this.hotelIdFromRoute = idParam ? Number(idParam) : null;
    if (this.hotelIdFromRoute) {
      this.roomForm.patchValue({ hotelId: this.hotelIdFromRoute });
    }

    // react to user/roles and load hotels (for selector)
    this.auth.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.isAdmin = this.auth.hasRole('Admin');
        this.isManager = this.auth.hasRole('HotelManager');

        // auto-assign manager's hotel if user payload contains it and no route override
        if (this.isManager && (user as any)?.hotelId && !this.hotelIdFromRoute) {
          this.hotelIdFromRoute = (user as any).hotelId;
          this.roomForm.patchValue({ hotelId: this.hotelIdFromRoute });
        }

        // If Admin or Manager, load hotels for selector (allow switching)
        if (this.isAdmin || this.isManager) {
          this.hotelService.getHotels()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: any) => {
              const items = (res && res.data) || (Array.isArray(res) ? res : []);
              this.hotels = items;
              // If there is no hotelId yet but hotels list exists, optionally set default
              if (!this.roomForm.value.hotelId && this.hotels.length === 1) {
                this.roomForm.patchValue({ hotelId: this.hotels[0].id });
              }
              this.reload();
            });
        } else {
          // Non-admin/non-manager: just load all rooms or based on route param
          this.reload();
        }
      });

    // reload whenever hotel selection in the form changes
    this.roomForm.get('hotelId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.reload());
  }

  loadAllRooms(): void {
    this.hotelService.getRooms().pipe(takeUntil(this.destroy$)).subscribe(res => {
      const items = (res && (res as any).data) || (Array.isArray(res) ? res : []);
      this.dataSource.data = items;
    });
  }

  loadRoomsByHotel(hotelId: number): void {
    this.hotelService.getRoomsByHotel(hotelId).pipe(takeUntil(this.destroy$)).subscribe(res => {
      const items = (res && (res as any).data) || (Array.isArray(res) ? res : []);
      this.dataSource.data = items;
    });
  }

  startEdit(room: RoomDto): void {
    this.editing = true;
    this.roomForm.patchValue(room);
  }

  cancelEdit(): void {
    this.editing = false;
    this.roomForm.reset({
      type: RoomType.Single,
      status: RoomStatus.Available,
      capacity: 1,
      basePrice: 0,
      hotelId: this.hotelIdFromRoute ?? null
    });
  }

  save(): void {
    if (this.roomForm.invalid) return;

    const value = this.roomForm.value;
    if (this.editing && value.id) {
      this.hotelService.updateRoom(value.id, value).subscribe((res: any) => {
        if (res?.success !== false) {
          this.reload();
          this.cancelEdit();
        } else {
          alert(res?.message || 'Failed updating room');
        }
      });
    } else {
      this.hotelService.createRoom(value).subscribe((res: any) => {
        if (res?.success !== false) {
          this.reload();
          this.cancelEdit();
        } else {
          alert(res?.message || 'Failed creating room');
        }
      });
    }
  }

  deleteRoom(id: number): void {
    if (!confirm('Delete this room?')) return;
    this.hotelService.deleteRoom(id).subscribe((res: any) => {
      if (res?.success !== false) {
        this.reload();
      } else {
        alert(res?.message || 'Failed deleting room');
      }
    });
  }

  // <-- NEW: called from template selectionChange()
  onHotelSelectionChange(): void {
    this.reload();
  }

  reload(): void {
    const selectedHotelId = this.roomForm.value.hotelId ?? this.hotelIdFromRoute;
    if (selectedHotelId) {
      this.loadRoomsByHotel(Number(selectedHotelId));
    } else {
      this.loadAllRooms();
    }
  }

  displayType(t: RoomType): string {
    return this.roomTypes.find(x => x.value === t)?.label ?? String(t);
  }

  displayStatus(s: RoomStatus): string {
    return this.roomStatuses.find(x => x.value === s)?.label ?? String(s);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}