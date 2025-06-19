import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Timeoff} from '../../timeoff/model/timeoff.model';
import {TimeoffService} from '../../timeoff/service/timeoff.service';

@Component({
  selector: 'app-timeoff-list',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    NgStyle
  ],
  templateUrl: './timeoff-list.component.html',
  styleUrl: './timeoff-list.component.css'
})
export class TimeoffListComponent implements OnInit {
  timeoffs: Timeoff[] = [];
  filteredTimeoffs: Timeoff[] = [];
  filterText: string = '';
  showDialog: boolean = false;
  selectedTimeoff: Timeoff = {
    id: 0,
    employeeId: 0,
    startDate: new Date(),
    endDate: new Date(),
    typeId: 0,
    status: '',
    reason: '',
    isEarned: false
  };

  constructor(private timeoffService: TimeoffService) {
  }

  ngOnInit(): void {
    this.loadTimeoffs();
  }

  loadTimeoffs(): void {
    this.timeoffService.fetchAllTimeoffs().subscribe(data => {
      this.timeoffs = data;
      this.filteredTimeoffs = data;
    });
  }

  filterTimeoffs(search: string): void {
    debugger
    const term = search.trim().toLowerCase();
    this.filteredTimeoffs = this.timeoffs.filter(item =>
      item.id.toString().includes(term) ||
      item.employeeId.toString().includes(term) ||
      item.startDate.toString().includes(term) ||
      item.endDate.toString().includes(term) ||
      item.typeId.toString().includes(term) ||
      item.status.toLowerCase().includes(term) ||
      item.reason.toLowerCase().includes(term)
    );
  }

  openTimeoffDialog(timeoff?: Timeoff): void {
    if (timeoff) {
      this.selectedTimeoff = timeoff;
    }
    this.showDialog = true;
  }

  deleteTimeoff(id: number): void {
    const isConfirmed = window.confirm('Are you sure you want to delete this timeoff?');
    if (isConfirmed) {
      this.timeoffService.deleteTimeoff(id).subscribe(() => {
        this.timeoffs = this.timeoffs.filter((item) => item.id !== id);
        window.location.reload(); // Optionally remove this and update customers locally
      });
    }
  }

  closeDialog() {
    this.showDialog = false;
  }


  addOrEditTimeoff(timeoff: Timeoff) {
    if (timeoff.id !== 0) {
      this.timeoffService.updateTimeoff(timeoff).subscribe({
        next: (data) => {
          console.log('Timeoff updated:', data);
          this.showDialog = false;
          window.location.reload();
        },
        error: (error) => console.error('Error updating timeoff:', error),
      });
    } else {
      this.timeoffService.createTimeoff(timeoff).subscribe({
        next: (data) => {
          console.log('Timeoff created:', data);
          this.showDialog = false;
          window.location.reload();
        },
        error: (error) => console.error('Error creating timeoff:', error),
      });
    }
  }

  changeTimeoffStatus(id: number) {
    const timeoff: Timeoff = this.timeoffs.find((t) => t.id === id)!;
    timeoff.status = 'approved';
    this.timeoffService.updateTimeoff(timeoff).subscribe({
      next: (data) => {
        console.log('Timeoff updated:', data);
        this.showDialog = false;
        window.location.reload();
      },
      error: (error) => console.error('Error updating timeoff:', error),
    });
  }
}
