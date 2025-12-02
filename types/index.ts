export interface Product {
  id?: number;
  NOMBRE: string;
  DETALLE?: string;
  PRECIO: number | string;
  CATEGORIA: string;
  SUBCATEGORIA?: string;
  images?: string[];
  videos?: string[];
  mainImageIndex?: number;
  stock?: number; // Note: In DB it might be STOCK (uppercase) based on backend code, but frontend uses lowercase in interface? Need to verify.
  STOCK?: number; // Adding both for safety until standardized
  codigo_barra?: string;
  POSICION?: number;
  NUM_VENTAS?: number;
  imageCropData?: { [key: number]: any };
  destacado?: boolean;
}

export interface Category {
  id?: number;
  name: string;
}

export interface SaleItem {
  id_producto: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Sale {
  id?: string;
  fecha?: string;
  items: SaleItem[];
  total: number;
  metodo_pago: 'efectivo' | 'transbank' | 'transferencia';
  codigo_autorizacion?: string;
  id_transaccion?: string;
  estado?: string;
}
