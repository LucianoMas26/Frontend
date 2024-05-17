import { Component } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  listProduct: Product[] = [];
  loading: boolean = false;
  constructor(private _productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }
  getProducts() {
    this.loading = true;
    this._productService.getProducts().subscribe((data) => {
      this.listProduct = data;
      console.log(data);
      this.loading = false;
    });
  }

  deleteProduct(id: number) {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar este producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this._productService.deleteProduct(id).subscribe(() => {
          this.getProducts();
        });
      }
    });
  }
}
