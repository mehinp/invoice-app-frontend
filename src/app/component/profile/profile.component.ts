import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject, map, startWith, catchError, delay } from 'rxjs';
import { DataState } from 'src/app/enum/datastate.enum';
import { EventType } from 'src/app/enum/event-type.enum';
import { Key } from 'src/app/enum/key.enum';
import { CustomHttpResponse, Profile } from 'src/app/interface/appstates';
import { State } from 'src/app/interface/state';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileState$: Observable<State<CustomHttpResponse<Profile>>>
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  private showLogsSubject = new BehaviorSubject<boolean>(false);
  showLogs$ = this.showLogsSubject.asObservable();
  public readonly DataState = DataState;
  public readonly EventType = EventType;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.profileState$ = this.userService.profile$()
      .pipe(
        map(response => {
          console.log(response)
          this.dataSubject.next(response);
          return {
            dataState: DataState.LOADED, appData: response
          };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            appData: this.dataSubject.value,
            error,
          });
        })
      )
  }

  updateProfile(profileForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.update$(profileForm.value)
      .pipe(
        map(response => {
          console.log(response)
          this.dataSubject.next({ ...response, data: response.data });
          this.isLoadingSubject.next(false);
          return {
            dataState: DataState.LOADED, appData: this.dataSubject.value
          };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({
            dataState: DataState.LOADED,
            appData: this.dataSubject.value,
            error,
          });
        })
      )
  }


  updatePassword(passwordForm: NgForm): void {
    this.isLoadingSubject.next(true);
    if (passwordForm.value.newPassword === passwordForm.value.confirmNewPassword) {
      this.profileState$ = this.userService.updatePassword$(passwordForm.value)
        .pipe(
          map(response => {
            console.log(response)
            this.dataSubject.next({ ...response, data: response.data });
            this.isLoadingSubject.next(false);
            passwordForm.reset();
            return {
              dataState: DataState.LOADED, appData: this.dataSubject.value
            };
          }),
          startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
          catchError((error: string) => {
            this.isLoadingSubject.next(false);
            return of({
              dataState: DataState.LOADED,
              appData: this.dataSubject.value,
              error,
            });
          })
        )
    } else {
      passwordForm.reset();
      console.log("Passwords don't match.")
      this.isLoadingSubject.next(false);
    }
  }

  updateRole(roleForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.updateRole$(roleForm.value.roleName)
      .pipe(
        map(response => {
          console.log(response)
          this.dataSubject.next({ ...response, data: response.data });
          this.isLoadingSubject.next(false);
          return {
            dataState: DataState.LOADED, appData: this.dataSubject.value
          };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({
            dataState: DataState.LOADED,
            appData: this.dataSubject.value,
            error,
          });
        })
      )
  }

  updateAccountSettings(settingsForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.updateAccountSettings$(settingsForm.value)
      .pipe(
        map(response => {
          console.log(response)
          this.dataSubject.next({ ...response, data: response.data });
          this.isLoadingSubject.next(false);
          return {
            dataState: DataState.LOADED, appData: this.dataSubject.value
          };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({
            dataState: DataState.LOADED,
            appData: this.dataSubject.value,
            error,
          });
        })
      )
  }

  updatePicture(image: File): void {
    if (image) {
      this.isLoadingSubject.next(true);
      this.profileState$ = this.userService.updateImage$(this.getFormData(image))
        .pipe(
          map(response => {
            console.log(response)
            this.dataSubject.next({ ...response, data: {... response.data, 
              user: {... response.data.user, imageUrl: `${response.data.user.imageUrl}?time=${new Date().getTime()}`}}});
            this.isLoadingSubject.next(false);
            return {
              dataState: DataState.LOADED, appData: this.dataSubject.value
            };
          }),
          startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
          catchError((error: string) => {
            this.isLoadingSubject.next(false);
            return of({
              dataState: DataState.LOADED,
              appData: this.dataSubject.value,
              error,
            });
          })
        )
    }
  }

  toggleLogs(): void {
    this.showLogsSubject.next(!this.showLogsSubject.value)
  }

  private getFormData(image: File): FormData {
    const formData = new FormData();
    formData.append('image', image);
    return formData
  }


}
