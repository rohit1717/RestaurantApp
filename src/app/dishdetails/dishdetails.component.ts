import { Component, OnInit, Input } from '@angular/core';

import { Dish } from '../shared/dish';
import {Params,ActivatedRoute} from '@angular/router';
import {Location } from '@angular/common';
import {DishService} from '../services/dish.service';


@Component({
  selector: 'app-dishdetails',
  templateUrl: './dishdetails.component.html',
  styleUrls: ['./dishdetails.component.scss']
})
export class DishdetailsComponent implements OnInit {

  dish : Dish;
    
  constructor(private dishservice:DishService,
    private route:ActivatedRoute,
    private location :Location) { }

  ngOnInit(): void {
    let id =this.route.snapshot.params['id'];
    this.dish=this.dishservice.getDish(id);
  }

  goBack():void{
    this.location.back();
    
  }
}
