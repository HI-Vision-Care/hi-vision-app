// ---- THÊM Ở CUỐI FILE ----
export interface Category {
  id: number;
  categoryName: string;
  description: string;
}

export interface Supplier {
  id: number;
  supplierName: string;
  contactInfo: string;
}

export interface Product {
  id: number;
  sku: string;
  productName: string;
  description: string;
  price: number;
  unit: string;
  imageUrl: string;
  isActive: boolean;
  category: Category;
  supplier: Supplier;
}
