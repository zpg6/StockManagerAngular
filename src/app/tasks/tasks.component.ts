import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemModel } from '../item-model';
import { LocationModel } from '../location-model';
import { LocationType } from '../location-type.enum';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {

  employees: any[];

  outstanding: any[] = [];

  completed: any[] = [];

  approved: any[] = [];

  seeded = false;

  @ViewChild('newTaskItemID') newTaskItemID: ElementRef;

  @ViewChild('newTaskEmployee') newTaskEmployee: ElementRef;

  @ViewChild('newTaskItemSrcAisle') newTaskItemSrcAisle: ElementRef;
  @ViewChild('newTaskItemSrcAisleSection') newTaskItemSrcAisleSection: ElementRef;
  @ViewChild('newTaskItemSrcSpot') newTaskItemSrcSpot: ElementRef;
  @ViewChild('newTaskItemSrcType') newTaskItemSrcType: ElementRef;

  @ViewChild('newTaskItemDestAisle') newTaskItemDestAisle: ElementRef;
  @ViewChild('newTaskItemDestAisleSection') newTaskItemDestAisleSection: ElementRef;
  @ViewChild('newTaskItemDestSpot') newTaskItemDestSpot: ElementRef;
  @ViewChild('newTaskItemDestType') newTaskItemDestType: ElementRef;


  constructor(private ar: ActivatedRoute, private messageService: MessageService, private http: HttpClient) {

    let url = this.messageService.getMessageOnce().apiRootURL + '/users/get-all'
    var body = {
      storeID: this.messageService.getMessageOnce().user.storeID
    }
    http.post<any[]>(url, body).toPromise().then(result => {
      this.employees = result.filter(emp => {
        return emp?.id
      })

      this.employees.forEach(emp => {

        body['userID'] = emp.id
        console.log(body)
        let outstandingTaskURL = this.messageService.getMessageOnce().apiRootURL + '/user/tasks/get/outstanding'
        http.post<any[]>(outstandingTaskURL, body).toPromise().then(tasks => {
          if (tasks.length > 0) {
            this.outstanding = this.outstanding.concat(tasks.filter(task => {
              return task.id && task.id !== ''
            }))
          }
        })

        let completedTaskURL = this.messageService.getMessageOnce().apiRootURL + '/user/tasks/get/completed'
        http.post<any[]>(completedTaskURL, body).toPromise().then(tasks => {
          if (tasks.length > 0) {
            this.completed = this.completed.concat(tasks.filter(task => {
              return task.id && task.id !== ''
            }))
          }
        })

        let approvedTaskURL = this.messageService.getMessageOnce().apiRootURL + '/user/tasks/get/approved'
        http.post<any[]>(approvedTaskURL, body).toPromise().then(tasks => {
          if (tasks.length > 0) {
            this.approved = this.approved.concat(tasks.filter(task => {
              return task.id && task.id !== ''
            }))
          }
        })


      })

    })

  }

  ngAfterViewInit(): void {
    let params = this.ar.snapshot.queryParamMap
    console.log(params.keys)
    if (params.keys.length > 0) {
      this.seeded = true;
      this.newTaskItemID.nativeElement.value = params.get('id')
      this.newTaskItemSrcAisle.nativeElement.value = params.get('aisle')
      this.newTaskItemSrcAisleSection.nativeElement.value = params.get('aisleSection')
      this.newTaskItemSrcSpot.nativeElement.value = params.get('spot')
      if (params.keys.includes('type')) {
        this.newTaskItemSrcType.nativeElement.value = params.get('type') as LocationType
      }
    }
  }

  sendNewTask() {
    let id = this.newTaskItemID.nativeElement.value
    let srcAisle = this.newTaskItemSrcAisle.nativeElement.value
    let srcAisleSection = this.newTaskItemSrcAisleSection.nativeElement.value
    let srcSpot = this.newTaskItemSrcSpot.nativeElement.value
    let srcType = this.newTaskItemSrcType.nativeElement.value
    let destAisle = this.newTaskItemDestAisle.nativeElement.value
    let destAisleSection = this.newTaskItemDestAisleSection.nativeElement.value
    let destSpot = this.newTaskItemDestSpot.nativeElement.value
    let destType = this.newTaskItemDestType.nativeElement.value

    let assignedEmployeeID = ''
    this.employees.forEach(emp => {
      if (this.newTaskEmployee.nativeElement.value === emp.name) {
        assignedEmployeeID = emp.id
      }
    })

    var body = {
      storeID: this.messageService.getMessageOnce().user.storeID,
      assignedEmployeeID: assignedEmployeeID,
      src: {
        aisle: srcAisle,
        aisleSection: srcAisleSection,
        spot: srcSpot,
        type: srcType
      },
      dest: {
        aisle: destAisle,
        aisleSection: destAisleSection,
        spot: destSpot,
        type: destType
      },
      userDesignatedID: id,
    }

    console.log(body)

    let url = this.messageService.getMessageOnce().apiRootURL + '/task/create'

    this.http.post<any[]>(url, body).toPromise().then(result => {
      console.log(result)
      this.outstanding.push(result)
    })

  }


  completeTask(id: string) {
    var body = {
      storeID: this.messageService.getMessageOnce().user.storeID,
      taskID: id,
    }
    let url = this.messageService.getMessageOnce().apiRootURL + '/task/complete'

    this.http.post<any[]>(url, body).toPromise().then(result => {
      console.log(result)
      this.completed.push(result)
      this.outstanding = this.outstanding.filter(task => {
        task.id !== id
      })
    })

  }

  approveTask(id: string) {
    var body = {
      storeID: this.messageService.getMessageOnce().user.storeID,
      taskID: id,
    }
    let url = this.messageService.getMessageOnce().apiRootURL + '/task/approve'

    this.http.post<any[]>(url, body).toPromise().then(result => {
      console.log(result)
      this.approved.push(result)
      this.completed = this.completed.filter(task => {
        task.id !== id
      })
    })

  }

}
