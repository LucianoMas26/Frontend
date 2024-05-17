import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css'],
})
export class AddEditProductComponent {
  form: FormGroup;
  loading: boolean = false;
  id: number;
  operation: string = 'Agregar';
  constructor(
    private fb: FormBuilder,
    private _productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      grams: ['', Validators.required],
      stock: ['', Validators.required],
    });
    this.id = Number(this.aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.id != 0) {
      this.operation = 'Editar';
      this.getProduct(this.id);
    }
  }

  getProduct(id: number) {
    this.loading = true;
    this._productService.getProduct(id).subscribe((data: Product) => {
      console.log(data);
      this.loading = false;
      this.form.setValue({
        name: data.title,
        price: data.compareprice,
        description: data.description,
        grams: data.grams,
        stock: data.stock,
      });
    });
  }

  addProduct() {
    if (this.form.invalid) {
      this.toastr.error(
        'Por favor, complete todos los campos correctamente',
        'Error'
      );
      return;
    }
    const product: Product = {
      title: this.form.value.name,
      compareprice: this.form.value.price,
      description: this.form.value.description,
      grams: this.form.value.grams,
      stock: this.form.value.stock,
      barcode: this.generateBarcode(),
      price: this.calculatePrice(this.form.value.price),
      handle: this.generateHandle(this.form.value.name),
      sku: this.generateSKU(),
    };
    this.loading = true;

    if (this.id !== 0) {
      product.id = this.id;
      this._productService.updateProduct(this.id, product).subscribe(() => {
        this.loading = false;
        this.toastr.info(
          `El producto ${product.title} fue actualizado con exito`,
          'Producto actualizado'
        );
        this.router.navigate(['/dashboard']);
      });
    } else {
      this._productService.saveProduct(product).subscribe(() => {
        this.loading = false;
        this.toastr.success(
          `El producto ${product.title} fue registrado con exito`,
          'Producto registrado'
        );
        this.router.navigate(['/dashboard']);
      });
    }
  }

  private generateBarcode(): string {
    const barcode = Math.floor(Math.random() * 10000000000000).toString();
    return barcode;
  }

  private generateHandle(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-');
  }

  private calculatePrice(compareprice: number): number {
    return compareprice * 0.9;
  }

  private generateSKU(): string {
    const sku = Math.floor(Math.random() * 100000000000).toString();
    return sku;
  }
}
