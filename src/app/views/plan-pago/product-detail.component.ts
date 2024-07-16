import { IonContent, IonCard, IonIcon, IonCardHeader, IonCardTitle, IonCardContent, IonButton,IonTitle, IonButtons, IonToolbar, IonBackButton, IonHeader, IonGrid, IonRow, IonCol, IonSpinner } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../common/services/firestore.service';
import { Storage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Producto } from 'src/app/common/models/producto.model';
import { ActivatedRoute, Router } from '@angular/router';

import { Productoferta } from 'src/app/common/models/productofree.model';
import { CartService } from 'src/app/common/services/cart.service';
import { AlertController } from '@ionic/angular';

@Component({
   selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [IonSpinner, IonCol, IonRow, IonIcon, IonGrid, IonHeader, IonBackButton, IonToolbar, IonButtons,IonButton, IonTitle, CommonModule, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class ProductDetailComponent  implements OnInit {
  planPagoDocs$: Observable<any[]>;
  userId: string;

   productId: string;
  producto: Producto | undefined;

  constructor(
    private firestoreService: FirestoreService,
    private storage: Storage,
     private cartService: CartService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.loadProduct();
  }


async loadProduct() {
    if (this.productId) {
      this.producto = await this.firestoreService.getProductoById(this.productId);
    }
  }

  comprar() {
    const message = `Hola, estoy interesado en el producto ${this.producto.nombre}`;
    const whatsappUrl = `https://wa.me/5491167554362?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

async addToCart(product: Producto) {
    this.cartService.addToCart(product);
    await this.showAlert(product.nombre);
  }

  async showAlert(productName: string) {
    const alert = await this.alertController.create({
      header: 'Producto Agregado',
      message: `${productName} ha sido agregado al carrito.`,
      buttons: ['OK'],
    });

    await alert.present();
  }

  goToCart() {
    this.router.navigate(['/carrito']);
  }



}
