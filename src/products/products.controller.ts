import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { Model } from 'mongoose';
import { Product } from './product.model';
import { ProductService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiCreatedResponse({ type: Product })
  @Post()
  @UsePipes(new ValidationPipe())
  async addProduct(@Body() body: Product) {
    let { title, description, price } = body;
    const generatedId = await this.productService.insertProduct(
      title,
      description,
      price,
    );
    return { id: generatedId };
  }

  @ApiOkResponse({ type: Product, isArray: true })
  @Get()
  async getProducts() {
    const products = await this.productService.getProducts();
    return products.map((prod) => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    }));
  }

  @ApiOkResponse({ type: Product })
  @ApiNotFoundResponse()
  @Get(':id')
  async getProduct(@Param('id') prodId: string) {
    return await this.productService.getSingleProduct(prodId);
  }

  @Patch(':id')
  async updateProduct(@Param('id') prodId: string, @Body() body: Product) {
    let { title, description, price } = body;
    await this.productService.updateProduct(prodId, title, description, price);
    return null;
  }

  @Delete(':id')
  async removeProduct(@Param('id') prodId: string) {
    await this.productService.deleteProduct(prodId);
    return null;
  }
}
