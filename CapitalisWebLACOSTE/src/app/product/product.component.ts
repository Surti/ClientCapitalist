import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Product } from '../world';
import { RestserviceService } from '../restservice.service';
import { print } from 'util';
import { collectExternalReferences } from '@angular/compiler';

declare var require; 
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: Product;  
  server: string;
  progressbar: any;
  lastupdate: number;
  _money: number;
  _qtmulti: any;
  cout: any;

  @Input() set prod(value: Product) {    
    this.product = value;     
 }

  @Input()  set qtmulti(value: number) {    
     this._qtmulti = value;     
     if (this._qtmulti && this.product)
      this.calcMaxCanBuy();  
      this._qtmulti = this.calcMaxCanBuy()[0];
      this.cout = this.calcMaxCanBuy()[1];
  } 

  @Input() set money(value: number) {    
    this._money = value;     
 }
 
  @ViewChild('bar') progressBarItem; 

  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

  @Output() onBuy: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit() {
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, { strokeWidth: 50, color: '#00ff00' }); 
    setInterval(() => { this.calcScore(); this.recalculate(); }, 100); 
    console.log(this.product); 
  }

  startProduction() : void{
    if(this.product.quantite > 0 && this.product.timeleft==0){
      this.product.timeleft = this.product.vitesse;
      this.progressbar.animate(1, { duration: this.product.vitesse });
      this.lastupdate = Date.now(); 
    }
  }

  constructor(private service: RestserviceService) {     
    this.server = service.getServer();
  } 


  buyObject():void{
    // On met a jours la quantité
    this.product.quantite += this.calcMaxCanBuy()[0];
    this.product.cout = this.calcMaxCanBuy()[2];
    //On envoie au parent l'argent dépensé
    this.onBuy.emit(this.cout);

    this.product.palliers.pallier.forEach(u => {
      if (u.unlocked == false) {
        if (this.product.quantite >= u.seuil) {
          u.unlocked = true;
          switch (u.typeratio) {
            case "GAIN":
              this.product.revenu = this.product.revenu * u.ratio;
              break;
            case "VITESSE":
              this.product.vitesse = Math.round(this.product.vitesse / u.ratio);
              this.product.timeleft = Math.round(this.product.timeleft / u.ratio);
              if (this.product.timeleft > 0)
                this.progressbar.animate(1, { duration: this.product.timeleft });
              break;
          }
        }
      }
    });

  }

  calcScore():void {
    if(this.product.timeleft != 0){
      this.product.timeleft -= (Date.now() - this.lastupdate);
      this.lastupdate = Date.now();
      if(this.product.timeleft <= 0){
        // on prévient le composant parent que ce produit a généré son revenu. 
        this.product.timeleft = 0;
        this.progressbar.set(0);
        //console.log(this.product.revenu);
        //console.log(this.product.quantite * this.product.cout);
        //console.log(this.product.revenu);
        this.notifyProduction.emit(this.product);  
      }
    }else{
      if(this.product.managerUnlocked){
        this.startProduction();
      }
    }
  }

  recalculate():void{
    this._qtmulti = this.calcMaxCanBuy()[0];
    this.cout = this.calcMaxCanBuy()[1];
  }

  calcMaxCanBuy():any{
    // On calcule l'achat max pouvant être réalisé par le joueur
    var qTemp = this.product.croissance;
    var x = 0;
    var y = 0;
    var lastProduit = 0;
    if(this._qtmulti == "xMax"){
      do{
        x++;
        y +=  this.product.cout * Math.pow(this.product.croissance,x);
      } while ( y < this._money);
      if( x > 1){
        x--;
        y = 0;
        var i = 0;
        do{
          i++;
          y += this.product.cout * (Math.pow(this.product.croissance,x));
        }while(i <= x);
      }
      lastProduit =  (this.product.cout * (Math.pow(this.product.croissance,x)));
      return [x,y,lastProduit];
    }
    else{
      do{
        x++;
        y += this.product.cout * (Math.pow(this.product.croissance,x));
      }while(x < this._qtmulti);
      lastProduit = (this.product.cout * (Math.pow(this.product.croissance,this._qtmulti)));
      //cout*(1-pow(croissance,quantite))/(1-croissance)
      //y = (this.product.cout * (Math.pow(this.product.croissance,this._qtmulti))) / (1 - this.product.croissance);
      return [this._qtmulti, y, lastProduit];
    } 
  }

}