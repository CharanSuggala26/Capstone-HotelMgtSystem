import { Routes, createUrlTreeFromSnapshot, ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { HotelsComponent } from './components/hotels/hotels';
import { ReservationsComponent } from './components/reservations/reservations';
import { RoomBookingComponent } from './components/room-booking/room-booking';
import { authGuard } from './guards/auth-guard';
import { RoomsComponent } from './components/rooms/rooms';
import { Reports } from './components/reports/reports';

import { Welcome } from './components/welcome/welcome';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'hotels', pathMatch: 'full' },
      { path: 'hotels', component: HotelsComponent },
      { path: 'hotels/:id/book', component: RoomBookingComponent },
      { path: 'reservations', component: ReservationsComponent },
      { path: 'bills', loadComponent: () => import('./components/bills/bills').then(m => m.BillsComponent) },
      { path: 'bills/:id', loadComponent: () => import('./components/bill-detail/bill-detail').then(m => m.BillDetailComponent) },
      {
        path: 'admin/users',
        loadComponent: () => import('./components/user-list/user-list').then(m => m.UserListComponent),
        canActivate: [() => inject(AuthService).hasRole('Admin') ? true : createUrlTreeFromSnapshot(inject(ActivatedRoute).snapshot, ['/unauthorized'])]
      },
      {
        path: 'admin/users/:id/edit',
        loadComponent: () => import('./components/user-edit/user-edit').then(m => m.UserEditComponent),
        canActivate: [() => inject(AuthService).hasRole('Admin') ? true : createUrlTreeFromSnapshot(inject(ActivatedRoute).snapshot, ['/unauthorized'])]
      },
      {
        path: 'admin/hotels',
        loadComponent: () => import('./components/hotel-admin-list/hotel-admin-list').then(m => m.HotelAdminListComponent),
        canActivate: [() => inject(AuthService).hasRole('Admin') ? true : createUrlTreeFromSnapshot(inject(ActivatedRoute).snapshot, ['/unauthorized'])]
      },
      { path: 'admin/assign', loadComponent: () => import('./components/assign-hotel/assign-hotel').then(m => m.AssignHotel), canActivate: [() => inject(AuthService).hasRole('Admin') ? true : createUrlTreeFromSnapshot(inject(ActivatedRoute).snapshot, ['/unauthorized'])] },
      {
        path: 'admin/reports', component: Reports, canActivate: [() => {
          const auth = inject(AuthService);
          return (auth.hasRole('Admin') || auth.hasRole('HotelManager')) ? true : createUrlTreeFromSnapshot(inject(ActivatedRoute).snapshot, ['/unauthorized']);
        }]
      },
      {
        path: 'admin/seasonal-rates',
        loadComponent: () => import('./components/seasonal-rates/seasonal-rates').then(m => m.SeasonalRatesComponent),
        canActivate: [() => {
          const auth = inject(AuthService);
          return (auth.hasRole('Admin') || auth.hasRole('HotelManager')) ? true : createUrlTreeFromSnapshot(inject(ActivatedRoute).snapshot, ['/unauthorized']);
        }]
      },
      { path: 'rooms', loadComponent: () => import('./components/rooms/rooms').then(m => m.RoomsComponent) },
      { path: 'hotels/:id/rooms', loadComponent: () => import('./components/rooms/rooms').then(m => m.RoomsComponent) },
      {
        path: 'admin/hotels/new',
        loadComponent: () => import('./components/hotel-edit/hotel-edit').then(m => m.HotelEditComponent),
        canActivate: [() => inject(AuthService).hasRole('Admin') ? true : createUrlTreeFromSnapshot(inject(ActivatedRoute).snapshot, ['/unauthorized'])]
      },
      {
        path: 'admin/hotels/:id/edit',
        loadComponent: () => import('./components/hotel-edit/hotel-edit').then(m => m.HotelEditComponent),
        canActivate: [() => inject(AuthService).hasRole('Admin') ? true : createUrlTreeFromSnapshot(inject(ActivatedRoute).snapshot, ['/unauthorized'])]
      }
    ]
  },
  { path: 'unauthorized', loadComponent: () => import('./components/unauthorized/unauthorized').then(m => m.UnauthorizedComponent) },
  { path: '**', redirectTo: '/login' }
];
