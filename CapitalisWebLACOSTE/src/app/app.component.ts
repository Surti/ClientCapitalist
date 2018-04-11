import { Component } from '@angular/core';

import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world'; 
import { ToasterService } from 'angular2-toaster';
 
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title : string;
  world: World = new World(); 
  server: string;
  buy: any = 1;
  new: string = "";
  newCash: string = "";
  username: string;



  constructor(private service: RestserviceService, private toast: ToasterService) {     
    this.server = service.getServer();     
    this.username = localStorage.getItem("username");
    this.service.setUser(this.username);
    console.log(this.service.getUser());
    this.service.getWorld().then(
      world => {       
          this.world = world;
          this.title = world.name;     
      }); 
  }

  onUsernameChanged():void{
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username);
    console.log(this.username);
    this.service.getWorld();
  }
  
  buyManager(m):void{
    this.world.money -= m.seuil;
    m.unlocked = true;
    this.world.products.product[m.idcible-1].managerUnlocked = true; 
    this.toast.pop('success','Manager hired ! ', m.name);
    this.new = "";
    this.newCash = "";
    this.testNew();
    this.testNewUpgrade();
    this.service.putManager(m);
  }


  buyUpgrade(u):void{
    this.world.money -= u.seuil;
    u.unlocked = true;
    // Finir de verifier a qui va l'upgrade
    this.toast.pop('success','Upgrade buy ! ', u.name);
    this.new = "";
    this.newCash = "";
    this.testNewUpgrade();
    this.testNew();
  }


  onProductionDone(p : Product):void {
     this.world.money += p.revenu * p.quantite;
     this.world.score += p.revenu * p.quantite;
     this.new = "";
     this.testNew();
     this.testNewUpgrade();
     this.service.putProduct(p);
  }

  onBuyDone(n: number):void {
    this.world.money -= n;
    this.world.score -= n;
    this.new = "";
    this.testNew();
    this.testNewUpgrade();
 }

  changeBuy():void{
    if(this.buy == 1){
      this.buy = 10;
    }else if(this.buy == 10){
      this.buy = 100;
    }else if(this.buy == 100){
      this.buy = "xMax";
    }else{
      this.buy = 1;
    }
  }

  testNew():void{
     for( let manager of this.world.managers.pallier){
       if(manager.seuil <= this.world.money && manager.unlocked == false){
         this.new = "New";
       }
     }
  }

  testNewUpgrade():void{
    for( let upgrade of this.world.upgrades.pallier){
      if(upgrade.seuil <= this.world.money && upgrade.unlocked == false){
        this.newCash = "New";
      }
    }
 }
}
