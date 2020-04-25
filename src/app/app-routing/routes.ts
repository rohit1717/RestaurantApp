import {Routes} from  '@angular/router';

import { MenuComponent } from '../menu/menu.component';
import { DishdetailsComponent } from '../dishdetails/dishdetails.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';


export const routes:Routes=[
    {path:'home' ,component :HomeComponent},
    {path:'menu',component:MenuComponent},
    {path:'aboutus',component:AboutComponent},
    {path:'dishdetail/:id', component:DishdetailsComponent},
    {path:'contactus',component:ContactComponent},
    {path:'' ,redirectTo:'/home',pathMatch:'full'}
];