export class ProductImageDto {
  id: number;
  image_path: string;
}

export class CategoryDto {
  id: number;
  name: string;
  slug: string;
  category_type?: {
    id: number;
    name: string;
    slug: string;
    categories?: CategoryDto[];
  };
}

export class ProductDto {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  product_images: ProductImageDto[];
  categories?: CategoryDto[];
}

export class PaginationDto {
  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;
}

export class ProductDetailResponseDto {
  product: ProductDto;
  relatedProducts: ProductDto[];
}

export class PaginatedProductsResponseDto {
  products: ProductDto[];
  pagination: PaginationDto;
  category?: CategoryDto;
}
