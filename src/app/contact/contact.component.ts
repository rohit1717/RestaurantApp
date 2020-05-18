import { Component, OnInit ,ViewChild,Inject} from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import{Feedback,ContactType} from '../shared/feedback';
import {switchMap} from 'rxjs/operators';
import {Params,ActivatedRoute} from '@angular/router';
import {Location } from '@angular/common';
import  {FeedbackService} from '../services/feedback.service';
import {visibility,flyInOut,expand} from '../animations/app.animation';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':'display:block;'
  },
  animations:[
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class ContactComponent implements OnInit {


  feedbackForm:FormGroup;
  feedback:Feedback;
  contactType=ContactType;
  feedbackcopy:Feedback;
  errMess:string;
  visibility='shown';
  visibility1='hidden';
  @ViewChild('fform') feedbackFormDirective;

  formErrors={
    'firstname':'',
    'lastname':'',
    'telnum':'',
    'email':''
  };

  validationMessages={
    'firstname':{
      'required':'First name is required',
      'minlength':'first name must be at least 2 characters',
      'maxlength':'first name cannot be more than 25 character'
    },
    'lastname':{
      'required':'last name is required',
      'minlength':'last name must be at least 2 characters',
      'maxlength':'last name cannot be more than 25 character'
    },
    'telnum':{
      'required':'tel number name is required',
      'pattern':'tel number must contain only number'
    },
    'email':{
      'required':'lastt name is required',
      'email':'email not in valid format'
    }
  };
isLoading:boolean;
isShowingResponse:boolean;
  constructor(private fb :FormBuilder,private route:ActivatedRoute,
    private feedbackService:FeedbackService
    ) {
    this.createForm();
    this.isLoading=false;
    this.isShowingResponse=false;
   }

  ngOnInit(): void {
  }

  createForm(){
    this.feedbackForm=this.fb.group({
      firstname:['',[Validators.required,Validators.minLength(2),Validators.maxLength(25)]],
      lastname:['',[Validators.required,Validators.minLength(2),Validators.maxLength(25)]],
      telnum:[0,[Validators.required,Validators.pattern]],
      email:['',[Validators.required,Validators.email]],
      agree:false,
      contacttype:'None',
      message:''
    });

this.feedbackForm.valueChanges
.subscribe(data=>this.onValueChanged(data));


    this.onValueChanged();
  }
  
  onValueChanged(data?:any){
    if(!this.feedbackForm){return;}
    const form =this.feedbackForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        this.formErrors[field]='';
        const control =form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key]+' ';
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.isLoading=true;
    this.visibility="hidden"
    this.feedback=this.feedbackForm.value;
    this.feedbackService.submitFeedback(this.feedback)
    .subscribe(feedback=>{
      this.feedback=feedback;
      console.log(this.feedback);
      
      this.isShowingResponse=true;
      this.visibility1="shown";
      setTimeout(()=>{
        this.visibility1="hidden";
        this.visibility="shown";
        this.isShowingResponse=false;
        this.isLoading=false;
      },5000);
    },          
    errmess => {
      this.feedback = null;
      this.feedbackcopy = null;
      this.errMess = <any>errmess;
    } 
    );
    
    this.feedbackForm.reset({
      firstname:'',
      lastname:'',
      telnum:0,
      email:'',
      agree:false,
      contacttype:'None',
      message:''
    },
    );
    this.feedbackFormDirective.resetForm();
    
    
  }

}
