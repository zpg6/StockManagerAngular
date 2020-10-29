import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-cell',
  templateUrl: './item-cell.component.html',
  styleUrls: ['./item-cell.component.css']
})
export class ItemCellComponent implements OnInit {

  @Input('itemObject') itemObject;


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  getParams(loc: any) {
    return {
      id: this.itemObject.userDesignatedID,
      aisle: loc.aisle,
      aisleSection: loc.aisleSection,
      spot: loc.spot,
      type: loc.type
    }
  }

}
