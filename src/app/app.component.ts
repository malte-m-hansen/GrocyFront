import { Component, OnInit } from '@angular/core';
import { StockService } from './stock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  products: any[] = [];
  locations: any[] = [];
  productGroups: any[] = [];
  searchTerm: string = '';
  sortField: string = 'default';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedLocation: number | '' = '';
  selectedGroup: number | '' = '';
  showModal: boolean = false;
  modalProduct: any = null;
  modalStock: any = null;
  isLoading: boolean = false;

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.isLoading = true;
    this.loadProductGroups();
  }

loadProductGroups() {
  this.stockService.getAllProductGroups().subscribe(groups => {
    // Sort groups alphabetically by name
    this.productGroups = groups.sort((a, b) => a.name.localeCompare(b.name));
    this.loadLocations();
  });
}

loadLocations() {
  this.stockService.getAllLocations().subscribe(locations => {
    // Sort locations alphabetically by name
    this.locations = locations.sort((a, b) => a.name.localeCompare(b.name));
    this.loadProducts();
  });
}
  loadProducts() {
  this.stockService.getAllProducts().subscribe(products => {
    const productObservables = products.map(product =>
      this.stockService.getProductStockById(product.id).toPromise().then(stock => ({
        ...product,
        stockAmount: stock.stock_amount,
        stockAmountOpened: stock.stock_amount_opened,
        lastUsed: stock.last_used,
        lastPurchased: stock.last_purchased // <-- Add this line
      }))
    );
    Promise.all(productObservables).then(productsWithStock => {
      this.products = productsWithStock;
      this.isLoading = false;
    });
  });
}

  
onOpen(productId: number, amount: number = 1) {
  this.stockService.openProductById(productId, amount).subscribe(() => {
    this.updateProductStock(productId);
    // If modal is open for this product, update modalStock too
    if (this.modalProduct && this.modalProduct.id === productId) {
      this.stockService.getProductStockById(productId).subscribe(stock => {
        this.modalStock = stock;
      });
    }
  });
}

  getLocationName(locationId: number): string {
    const loc = this.locations.find(l => l.id === locationId);
    return loc ? loc.name : 'Ukendt';
  }

  getGroupName(groupId: number): string {
    const group = this.productGroups.find(g => g.id === groupId);
    return group ? group.name : 'Ukendt';
  }

  get filteredProducts() {
  let filtered = this.products;
  if (this.selectedLocation) {
    filtered = filtered.filter(p => p.location_id === +this.selectedLocation);
  }
  if (this.selectedGroup) {
    filtered = filtered.filter(p => p.product_group_id === +this.selectedGroup);
  }
  if (this.searchTerm) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  return filtered.sort((a, b) => {
    let aValue: any, bValue: any;
    switch (this.sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'stockAmount':
        aValue = a.stockAmount;
        bValue = b.stockAmount;
        break;
      case 'lastUsed':
        aValue = a.lastUsed ? Date.parse(a.lastUsed) : 0;
        bValue = b.lastUsed ? Date.parse(b.lastUsed) : 0;
        break;
      case 'lastPurchased':
        aValue = a.lastPurchased ? Date.parse(a.lastPurchased) : 0;
        bValue = b.lastPurchased ? Date.parse(b.lastPurchased) : 0;
        break;
      case 'default':
      default:
        aValue = a.id;
        bValue = b.id;
    }
    if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}

  setSort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  onAdd(productId: number, amount: number = 1) {
    this.stockService.addProductById(productId, amount).subscribe(() => {
      this.updateProductStock(productId);
    });
  }

  onConsume(productId: number, amount: number = 1) {
    this.stockService.consumeProductById(productId, amount).subscribe(() => {
      this.updateProductStock(productId);
    });
  }

updateProductStock(productId: number) {
  this.stockService.getProductStockById(productId).subscribe(stock => {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      product.stockAmount = stock.stock_amount;
      product.stockAmountOpened = stock.stock_amount_opened;
      product.lastUsed = stock.last_used; // <-- Update lastUsed
      product.lastPurchased = stock.last_purchased; // <-- Update lastPurchased
    }
  });
}

  async onShowDetails(product: any) {
    this.modalProduct = product;
    this.modalStock = null;
    this.showModal = true;
    // Fetch latest stock info for details
    this.stockService.getProductStockById(product.id).subscribe(stock => {
      this.modalStock = stock;
    });
  }

  closeModal() {
    this.showModal = false;
    this.modalProduct = null;
    this.modalStock = null;
  }

    openGrocyEdit(productId: number) {
    window.open(`https://grocy.inhansen.com/product/${productId}`, '_blank');
  }

    filterByLocation(locationId: number) {
    this.selectedLocation = locationId;
    this.closeModal();
  }

  filterByGroup(groupId: number) {
    this.selectedGroup = groupId;
    this.closeModal();
  }

  refreshAll() {
  this.isLoading = true;
  this.loadProductGroups();
}

clearSearch() {
  this.searchTerm = '';
}

clearFilters() {
  this.selectedLocation = '';
  this.selectedGroup = '';
  this.sortField = 'default';
  this.sortDirection = 'asc';
  this.searchTerm = '';
}

get filteredProductGroups() {
  if (!this.selectedLocation) {
    return this.productGroups;
  }
  // Find group IDs that have at least one product in the selected location
  const groupIds = new Set(
    this.products
      .filter(p => p.location_id === +this.selectedLocation)
      .map(p => p.product_group_id)
      .filter(id => id !== null && id !== undefined)
  );
  return this.productGroups.filter(g => groupIds.has(g.id));
}

get filteredLocations() {
  if (!this.selectedGroup) {
    return this.locations;
  }
  // Find location IDs that have at least one product in the selected group
  const locationIds = new Set(
    this.products
      .filter(p => p.product_group_id === +this.selectedGroup)
      .map(p => p.location_id)
      .filter(id => id !== null && id !== undefined)
  );
  return this.locations.filter(l => locationIds.has(l.id));
}

/* onLocationChange() {
  setTimeout(() => {
    this.selectedGroup = '';
  });
} */



}