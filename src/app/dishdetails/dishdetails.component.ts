import { Component, OnInit, Input ,ViewChild} from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import { Dish } from '../shared/dish';
import {Params,ActivatedRoute} from '@angular/router';
import {Location } from '@angular/common';
import {DishService} from '../services/dish.service';
import {switchMap} from 'rxjs/operators';
import {Comment} from '../shared/comment';
@Component({
  selector: 'app-dishdetails',
  templateUrl: './dishdetails.component.html',
  styleUrls: ['./dishdetails.component.scss']
})
export class DishdetailsComponent implements OnInit {

  commentForm: FormGroup;
  com:Comment;
  @ViewChild('fform') commentFromDirective;
  dish : Dish;
  dishIds:string[];
  prev:string;
  next:string;

  formErrors={
    'author':'',
    'comment':''
  };  

  validationMessages={
    'author':{
      'required':'name is required',
      'minlength':'name must be at least 2 characters',
    },
    'comment':{
      'required':'name is required',
    }
  };

  constructor(private dishService:DishService,
    private route:ActivatedRoute,
    private location :Location,
    private fb :FormBuilder) {
      this.createForm();
     }

  ngOnInit(): void {
    this.dishService.getDishIds()
    .subscribe((dishIds)=> this.dishIds=dishIds);
   this.route.params
   .pipe(switchMap((params:Params)=>this.dishService.getDish(params['id'])))
    .subscribe(dish => {this.dish= dish; this.setPrevNext(dish.id)});
  }

  setPrevNext(dishId:string){
    const index=this.dishIds.indexOf(dishId);
    this.prev=this.dishIds[(this.dishIds.length + index -1)%this.dishIds.length];
    this.next=this.dishIds[(this.dishIds.length + index +1)%this.dishIds.length];
  }

  goBack():void{
    this.location.back();
    
  }
  createForm(){
      this.commentForm=this.fb.group({
        author:['',[Validators.required,Validators.minLength(2)]],
        rating:5,
        comment:['',Validators.required]
      });
  this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
     
      this.onValueChanged();
    }

  onValueChanged(data?: any){
    this.com=this.commentForm.value;
    if(!this.commentForm){return;}
    const form =this.commentForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        this.formErrors[field]='';
        const control=form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key]+' '; 
            }}}
      }
    }

  }
  onSubmit(){
    var d = new Date();
    var n = d.toISOString();
    this.dish.comments.push({
      author: this.com["author"],
      rating: this.com["rating"],
      comment:this.com["comment"],
      date:n,
    }); 
   
    console.log(this.com);
    this.commentForm.reset();
    this.commentFromDirective.resetForm({
      author:'',
      rating:5,
      comment:''
    });

   
  

  }

}
