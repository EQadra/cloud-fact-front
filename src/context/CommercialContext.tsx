// src/context/CommercialContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import type {
  Sale,
  CreateSaleDto,
  UpdateSaleDto,
  SaleItem,
  Payment,
  Purchase,
  CreatePurchaseDto,
  UpdatePurchaseDto,
  PurchaseItem,
  Product,
  // ProductFilters,
  Kardex,
  CreateKardexDto,
  Category,
  Unit,
  Person,
  Series,
  PaginatedResponse,
  PaginationParams,
  // SaleFilters,
  // PurchaseFilters,
  // KardexFilters,
  // SaleStatistics,
  // ProductStatistics,
  // DashboardCommercialData,
  TipoComprobante,
  EstadoVenta,
  EstadoSunat,
  MetodoPago,
  EstadoCompra,
  TipoMovimientoKardex,
} from '../types/index';
// ... resto del código

// =============================================
// INTERFACES DEL CONTEXTO
// =============================================

interface CommercialContextType {
  // ===== VENTAS =====
  sales: Sale[];
  selectedSale: Sale | null;
  salesLoading: boolean;
  salesPagination: { page: number; limit: number; total: number; totalPages: number };
  fetchSales: (params?: PaginationParams & SaleFilters) => Promise<void>;
  fetchSaleById: (id: string) => Promise<Sale>;
  createSale: (data: CreateSaleDto) => Promise<Sale>;
  updateSale: (id: string, data: UpdateSaleDto) => Promise<Sale>;
  deleteSale: (id: string) => Promise<void>;
  sendSaleToSunat: (id: string) => Promise<void>;
  generateSalePdf: (id: string) => Promise<Blob>;
  generateSaleXml: (id: string) => Promise<Blob>;
  
  // ===== COMPRAS =====
  purchases: Purchase[];
  selectedPurchase: Purchase | null;
  purchasesLoading: boolean;
  purchasesPagination: { page: number; limit: number; total: number; totalPages: number };
  fetchPurchases: (params?: PaginationParams & PurchaseFilters) => Promise<void>;
  fetchPurchaseById: (id: string) => Promise<Purchase>;
  createPurchase: (data: CreatePurchaseDto) => Promise<Purchase>;
  updatePurchase: (id: string, data: UpdatePurchaseDto) => Promise<Purchase>;
  deletePurchase: (id: string) => Promise<void>;
  
  // ===== PRODUCTOS =====
  products: Product[];
  selectedProduct: Product | null;
  productsLoading: boolean;
  productsPagination: { page: number; limit: number; total: number; totalPages: number };
  fetchProducts: (params?: PaginationParams & ProductFilters) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product>;
  createProduct: (data: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  
  // ===== CATEGORÍAS =====
  categories: Category[];
  categoriesLoading: boolean;
  fetchCategories: (params?: PaginationParams) => Promise<void>;
  
  // ===== UNIDADES =====
  units: Unit[];
  unitsLoading: boolean;
  fetchUnits: (params?: PaginationParams) => Promise<void>;
  
  // ===== CLIENTES =====
  customers: Person[];
  customersLoading: boolean;
  fetchCustomers: (params?: PaginationParams) => Promise<void>;
  searchCustomers: (query: string) => Promise<Person[]>;
  
  // ===== PROVEEDORES =====
  suppliers: Person[];
  suppliersLoading: boolean;
  fetchSuppliers: (params?: PaginationParams) => Promise<void>;
  searchSuppliers: (query: string) => Promise<Person[]>;
  
  // ===== SERIES =====
  series: Series[];
  fetchSeries: (tipoComprobante?: TipoComprobante) => Promise<void>;
  generateNextNumber: (tipoComprobante: TipoComprobante, serie: string) => Promise<number>;
  
  // ===== KARDEX =====
  kardexEntries: Kardex[];
  kardexLoading: boolean;
  kardexPagination: { page: number; limit: number; total: number; totalPages: number };
  fetchKardex: (params?: PaginationParams & KardexFilters) => Promise<void>;
  createKardexEntry: (data: CreateKardexDto) => Promise<Kardex>;
  getProductStock: (productId: string) => Promise<number>;
  getProductStockByLot: (productId: string, lotId: string) => Promise<number>;
  
  // ===== ESTADÍSTICAS =====
  getSaleStatistics: (filters?: { startDate?: string; endDate?: string }) => Promise<SaleStatistics>;
  getProductStatistics: () => Promise<ProductStatistics>;
  getDashboardCommercialData: () => Promise<DashboardCommercialData>;
  
  // ===== UTILITARIOS =====
  getProductByCode: (code: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
  getLowStockProducts: () => Product[];
}

// =============================================
// CONTEXTO
// =============================================

const CommercialContext = createContext<CommercialContextType | undefined>(undefined);

// =============================================
// PROVIDER
// =============================================

export const CommercialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ===== ESTADOS - VENTAS =====
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [salesLoading, setSalesLoading] = useState(false);
  const [salesPagination, setSalesPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 0,
  });

  // ===== ESTADOS - COMPRAS =====
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const [purchasesPagination, setPurchasesPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 0,
  });

  // ===== ESTADOS - PRODUCTOS =====
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsPagination, setProductsPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 0,
  });

  // ===== ESTADOS - CATEGORÍAS =====
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // ===== ESTADOS - UNIDADES =====
  const [units, setUnits] = useState<Unit[]>([]);
  const [unitsLoading, setUnitsLoading] = useState(false);

  // ===== ESTADOS - CLIENTES =====
  const [customers, setCustomers] = useState<Person[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  // ===== ESTADOS - PROVEEDORES =====
  const [suppliers, setSuppliers] = useState<Person[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState(false);

  // ===== ESTADOS - SERIES =====
  const [series, setSeries] = useState<Series[]>([]);

  // ===== ESTADOS - KARDEX =====
  const [kardexEntries, setKardexEntries] = useState<Kardex[]>([]);
  const [kardexLoading, setKardexLoading] = useState(false);
  const [kardexPagination, setKardexPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 0,
  });

  // =============================================
  // FUNCIONES - VENTAS
  // =============================================

  const fetchSales = useCallback(async (params?: PaginationParams & SaleFilters) => {
    setSalesLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params?.customerId) queryParams.append('customerId', params.customerId);
      if (params?.branchId) queryParams.append('branchId', params.branchId);
      if (params?.tipoComprobante) queryParams.append('tipoComprobante', params.tipoComprobante);
      if (params?.estado) queryParams.append('estado', params.estado);
      if (params?.sunatEstado) queryParams.append('sunatEstado', params.sunatEstado);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.minTotal) queryParams.append('minTotal', params.minTotal.toString());
      if (params?.maxTotal) queryParams.append('maxTotal', params.maxTotal.toString());

      const response = await api.get<PaginatedResponse<Sale>>(`/sales?${queryParams.toString()}`);
      setSales(response.data.data);
      setSalesPagination({
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages,
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    } finally {
      setSalesLoading(false);
    }
  }, []);

  const fetchSaleById = useCallback(async (id: string): Promise<Sale> => {
    setSalesLoading(true);
    try {
      const response = await api.get<Sale>(`/sales/${id}`);
      setSelectedSale(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching sale:', error);
      throw error;
    } finally {
      setSalesLoading(false);
    }
  }, []);

  const createSale = useCallback(async (data: CreateSaleDto): Promise<Sale> => {
    setSalesLoading(true);
    try {
      const response = await api.post<Sale>('/sales', data);
      setSales(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    } finally {
      setSalesLoading(false);
    }
  }, []);

  const updateSale = useCallback(async (id: string, data: UpdateSaleDto): Promise<Sale> => {
    setSalesLoading(true);
    try {
      const response = await api.patch<Sale>(`/sales/${id}`, data);
      setSales(prev => prev.map(s => s.id === id ? response.data : s));
      if (selectedSale?.id === id) setSelectedSale(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating sale:', error);
      throw error;
    } finally {
      setSalesLoading(false);
    }
  }, [selectedSale]);

  const deleteSale = useCallback(async (id: string): Promise<void> => {
    setSalesLoading(true);
    try {
      await api.delete(`/sales/${id}`);
      setSales(prev => prev.filter(s => s.id !== id));
      if (selectedSale?.id === id) setSelectedSale(null);
    } catch (error) {
      console.error('Error deleting sale:', error);
      throw error;
    } finally {
      setSalesLoading(false);
    }
  }, [selectedSale]);

  const sendSaleToSunat = useCallback(async (id: string): Promise<void> => {
    setSalesLoading(true);
    try {
      await api.post(`/sales/${id}/send-sunat`);
      await fetchSaleById(id);
    } catch (error) {
      console.error('Error sending sale to SUNAT:', error);
      throw error;
    } finally {
      setSalesLoading(false);
    }
  }, [fetchSaleById]);

  const generateSalePdf = useCallback(async (id: string): Promise<Blob> => {
    try {
      const response = await api.get(`/sales/${id}/pdf`, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }, []);

  const generateSaleXml = useCallback(async (id: string): Promise<Blob> => {
    try {
      const response = await api.get(`/sales/${id}/xml`, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error('Error generating XML:', error);
      throw error;
    }
  }, []);

  // =============================================
  // FUNCIONES - COMPRAS
  // =============================================

  const fetchPurchases = useCallback(async (params?: PaginationParams & PurchaseFilters) => {
    setPurchasesLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params?.supplierId) queryParams.append('supplierId', params.supplierId);
      if (params?.branchId) queryParams.append('branchId', params.branchId);
      if (params?.tipoComprobante) queryParams.append('tipoComprobante', params.tipoComprobante);
      if (params?.estado) queryParams.append('estado', params.estado);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);

      const response = await api.get<PaginatedResponse<Purchase>>(`/purchases?${queryParams.toString()}`);
      setPurchases(response.data.data);
      setPurchasesPagination({
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages,
      });
    } catch (error) {
      console.error('Error fetching purchases:', error);
      throw error;
    } finally {
      setPurchasesLoading(false);
    }
  }, []);

  const fetchPurchaseById = useCallback(async (id: string): Promise<Purchase> => {
    setPurchasesLoading(true);
    try {
      const response = await api.get<Purchase>(`/purchases/${id}`);
      setSelectedPurchase(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching purchase:', error);
      throw error;
    } finally {
      setPurchasesLoading(false);
    }
  }, []);

  const createPurchase = useCallback(async (data: CreatePurchaseDto): Promise<Purchase> => {
    setPurchasesLoading(true);
    try {
      const response = await api.post<Purchase>('/purchases', data);
      setPurchases(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating purchase:', error);
      throw error;
    } finally {
      setPurchasesLoading(false);
    }
  }, []);

  const updatePurchase = useCallback(async (id: string, data: UpdatePurchaseDto): Promise<Purchase> => {
    setPurchasesLoading(true);
    try {
      const response = await api.patch<Purchase>(`/purchases/${id}`, data);
      setPurchases(prev => prev.map(p => p.id === id ? response.data : p));
      if (selectedPurchase?.id === id) setSelectedPurchase(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating purchase:', error);
      throw error;
    } finally {
      setPurchasesLoading(false);
    }
  }, [selectedPurchase]);

  const deletePurchase = useCallback(async (id: string): Promise<void> => {
    setPurchasesLoading(true);
    try {
      await api.delete(`/purchases/${id}`);
      setPurchases(prev => prev.filter(p => p.id !== id));
      if (selectedPurchase?.id === id) setSelectedPurchase(null);
    } catch (error) {
      console.error('Error deleting purchase:', error);
      throw error;
    } finally {
      setPurchasesLoading(false);
    }
  }, [selectedPurchase]);

  // =============================================
  // FUNCIONES - PRODUCTOS
  // =============================================

  const fetchProducts = useCallback(async (params?: PaginationParams & ProductFilters) => {
    setProductsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params?.unidadId) queryParams.append('unidadId', params.unidadId);
      if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params?.activo !== undefined) queryParams.append('activo', String(params.activo));
      if (params?.esMedicamento !== undefined) queryParams.append('esMedicamento', String(params.esMedicamento));
      if (params?.stockMinimo) queryParams.append('stockMinimo', 'true');

      const response = await api.get<PaginatedResponse<Product>>(`/products?${queryParams.toString()}`);
      setProducts(response.data.data);
      setProductsPagination({
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id: string): Promise<Product> => {
    setProductsLoading(true);
    try {
      const response = await api.get<Product>(`/products/${id}`);
      setSelectedProduct(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data: Partial<Product>): Promise<Product> => {
    setProductsLoading(true);
    try {
      const response = await api.post<Product>('/products', data);
      setProducts(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<Product>): Promise<Product> => {
    setProductsLoading(true);
    try {
      const response = await api.patch<Product>(`/products/${id}`, data);
      setProducts(prev => prev.map(p => p.id === id ? response.data : p));
      if (selectedProduct?.id === id) setSelectedProduct(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    } finally {
      setProductsLoading(false);
    }
  }, [selectedProduct]);

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    setProductsLoading(true);
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      if (selectedProduct?.id === id) setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    } finally {
      setProductsLoading(false);
    }
  }, [selectedProduct]);

  // =============================================
  // FUNCIONES - CATEGORÍAS, UNIDADES, CLIENTES, PROVEEDORES
  // =============================================

  const fetchCategories = useCallback(async (params?: PaginationParams) => {
    setCategoriesLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await api.get<PaginatedResponse<Category>>(`/categories?${queryParams.toString()}`);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const fetchUnits = useCallback(async (params?: PaginationParams) => {
    setUnitsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);

      const response = await api.get<PaginatedResponse<Unit>>(`/units?${queryParams.toString()}`);
      setUnits(response.data.data);
    } catch (error) {
      console.error('Error fetching units:', error);
      throw error;
    } finally {
      setUnitsLoading(false);
    }
  }, []);

  const fetchCustomers = useCallback(async (params?: PaginationParams) => {
    setCustomersLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      queryParams.append('tipo', 'CLIENTE');

      const response = await api.get<PaginatedResponse<Person>>(`/persons?${queryParams.toString()}`);
      setCustomers(response.data.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    } finally {
      setCustomersLoading(false);
    }
  }, []);

  const searchCustomers = useCallback(async (query: string): Promise<Person[]> => {
    try {
      const response = await api.get<Person[]>(`/persons/search?tipo=CLIENTE&q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }, []);

  const fetchSuppliers = useCallback(async (params?: PaginationParams) => {
    setSuppliersLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      queryParams.append('tipo', 'PROVEEDOR');

      const response = await api.get<PaginatedResponse<Person>>(`/persons?${queryParams.toString()}`);
      setSuppliers(response.data.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    } finally {
      setSuppliersLoading(false);
    }
  }, []);

  const searchSuppliers = useCallback(async (query: string): Promise<Person[]> => {
    try {
      const response = await api.get<Person[]>(`/persons/search?tipo=PROVEEDOR&q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching suppliers:', error);
      throw error;
    }
  }, []);

  // =============================================
  // FUNCIONES - SERIES
  // =============================================

  const fetchSeries = useCallback(async (tipoComprobante?: TipoComprobante) => {
    try {
      const queryParams = new URLSearchParams();
      if (tipoComprobante) queryParams.append('tipoComprobante', tipoComprobante);

      const response = await api.get<Series[]>(`/series?${queryParams.toString()}`);
      setSeries(response.data);
    } catch (error) {
      console.error('Error fetching series:', error);
      throw error;
    }
  }, []);

  const generateNextNumber = useCallback(async (tipoComprobante: TipoComprobante, serie: string): Promise<number> => {
    try {
      const response = await api.get<{ correlativo: number }>(
        `/series/next-number?tipoComprobante=${tipoComprobante}&serie=${serie}`
      );
      return response.data.correlativo;
    } catch (error) {
      console.error('Error generating next number:', error);
      throw error;
    }
  }, []);

  // =============================================
  // FUNCIONES - KARDEX
  // =============================================

  const fetchKardex = useCallback(async (params?: PaginationParams & KardexFilters) => {
    setKardexLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.productId) queryParams.append('productId', params.productId);
      if (params?.lotId) queryParams.append('lotId', params.lotId);
      if (params?.tipoMovimiento) queryParams.append('tipoMovimiento', params.tipoMovimiento);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);

      const response = await api.get<PaginatedResponse<Kardex>>(`/kardex?${queryParams.toString()}`);
      setKardexEntries(response.data.data);
      setKardexPagination({
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages,
      });
    } catch (error) {
      console.error('Error fetching kardex:', error);
      throw error;
    } finally {
      setKardexLoading(false);
    }
  }, []);

  const createKardexEntry = useCallback(async (data: CreateKardexDto): Promise<Kardex> => {
    setKardexLoading(true);
    try {
      const response = await api.post<Kardex>('/kardex', data);
      setKardexEntries(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating kardex entry:', error);
      throw error;
    } finally {
      setKardexLoading(false);
    }
  }, []);

  const getProductStock = useCallback(async (productId: string): Promise<number> => {
    try {
      const response = await api.get<{ stock: number }>(`/products/${productId}/stock`);
      return response.data.stock;
    } catch (error) {
      console.error('Error getting product stock:', error);
      throw error;
    }
  }, []);

  const getProductStockByLot = useCallback(async (productId: string, lotId: string): Promise<number> => {
    try {
      const response = await api.get<{ stock: number }>(`/products/${productId}/lots/${lotId}/stock`);
      return response.data.stock;
    } catch (error) {
      console.error('Error getting product stock by lot:', error);
      throw error;
    }
  }, []);

  // =============================================
  // FUNCIONES - ESTADÍSTICAS
  // =============================================

  const getSaleStatistics = useCallback(async (filters?: { startDate?: string; endDate?: string }): Promise<SaleStatistics> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.startDate) queryParams.append('startDate', filters.startDate);
      if (filters?.endDate) queryParams.append('endDate', filters.endDate);

      const response = await api.get<SaleStatistics>(`/sales/statistics?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error getting sale statistics:', error);
      throw error;
    }
  }, []);

  const getProductStatistics = useCallback(async (): Promise<ProductStatistics> => {
    try {
      const response = await api.get<ProductStatistics>('/products/statistics');
      return response.data;
    } catch (error) {
      console.error('Error getting product statistics:', error);
      throw error;
    }
  }, []);

  const getDashboardCommercialData = useCallback(async (): Promise<DashboardCommercialData> => {
    try {
      const response = await api.get<DashboardCommercialData>('/commercial/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }, []);

  // =============================================
  // FUNCIONES UTILITARIAS
  // =============================================

  const getProductByCode = useCallback((code: string): Product | undefined => {
    return products.find(p => p.codigo.toLowerCase() === code.toLowerCase());
  }, [products]);

  const searchProducts = useCallback((query: string): Product[] => {
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
      p.nombre.toLowerCase().includes(lowerQuery) ||
      p.codigo.toLowerCase().includes(lowerQuery) ||
      p.descripcion?.toLowerCase().includes(lowerQuery)
    );
  }, [products]);

  const getLowStockProducts = useCallback((): Product[] => {
    return products.filter(p => p.stockActual <= p.stockMinimo && p.activo);
  }, [products]);

  // =============================================
  // EFECTOS
  // =============================================

  useEffect(() => {
    fetchSales();
    fetchProducts();
    fetchCategories();
    fetchUnits();
    fetchCustomers();
    fetchSuppliers();
    fetchSeries();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // =============================================
  // VALUE DEL CONTEXTO
  // =============================================

  const value: CommercialContextType = {
    // Ventas
    sales,
    selectedSale,
    salesLoading,
    salesPagination,
    fetchSales,
    fetchSaleById,
    createSale,
    updateSale,
    deleteSale,
    sendSaleToSunat,
    generateSalePdf,
    generateSaleXml,

    // Compras
    purchases,
    selectedPurchase,
    purchasesLoading,
    purchasesPagination,
    fetchPurchases,
    fetchPurchaseById,
    createPurchase,
    updatePurchase,
    deletePurchase,

    // Productos
    products,
    selectedProduct,
    productsLoading,
    productsPagination,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,

    // Categorías
    categories,
    categoriesLoading,
    fetchCategories,

    // Unidades
    units,
    unitsLoading,
    fetchUnits,

    // Clientes
    customers,
    customersLoading,
    fetchCustomers,
    searchCustomers,

    // Proveedores
    suppliers,
    suppliersLoading,
    fetchSuppliers,
    searchSuppliers,

    // Series
    series,
    fetchSeries,
    generateNextNumber,

    // Kardex
    kardexEntries,
    kardexLoading,
    kardexPagination,
    fetchKardex,
    createKardexEntry,
    getProductStock,
    getProductStockByLot,

    // Estadísticas
    getSaleStatistics,
    getProductStatistics,
    getDashboardCommercialData,

    // Utilitarios
    getProductByCode,
    searchProducts,
    getLowStockProducts,
  };

  return (
    <CommercialContext.Provider value={value}>
      {children}
    </CommercialContext.Provider>
  );
};

// =============================================
// HOOK PERSONALIZADO
// =============================================

export const useCommercial = (): CommercialContextType => {
  const context = useContext(CommercialContext);
  if (!context) {
    throw new Error('useCommercial must be used within a CommercialProvider');
  }
  return context;
};