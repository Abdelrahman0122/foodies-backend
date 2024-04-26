import { Body, Controller, Headers, Post, RawBodyRequest, Req, Request, Param, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateResponse, FindAllResponse, FindOneResponse, Public, Role, Roles, swagger } from 'src/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderFactoryService } from './factory/order.factory';
import { CreateOrderDto } from './dto';
import { Order } from 'src/models';
@ApiTags(swagger.MobileOrder)
@Controller('client/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderFactoryService: OrderFactoryService
  ) { }

  @Roles(Role.Client)
  @Post('createCashOrder')
  async createCashOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: Express.Request
  ) {
    const createOrderResponse = new CreateResponse<Order>();
    try {
      const order =
        await this.orderFactoryService.createNewOrder(createOrderDto,
          req.user['_id']);
      const orderCreated = await this.orderService.createCashOrder(order);
      createOrderResponse.success = true;
      createOrderResponse.data = orderCreated;
    } catch (error) {
      createOrderResponse.success = false;
      throw error;
    }

    return createOrderResponse;
  }

  @Roles(Role.Client)
  @Post('createOnlineOrder')
  async createOnlineOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: Express.Request
  ) {
    const createOrderResponse = new CreateResponse<Order>();
    try {
      const order =
        await this.orderFactoryService.createNewOrder(createOrderDto,
          req.user['_id']);
      const orderCreated = await this.orderService.createOnlineOrder(order,
        req.user
      );
      createOrderResponse.success = true;
      createOrderResponse.data = orderCreated;
    } catch (error) {
      createOrderResponse.success = false;
      throw error;
    }
    return createOrderResponse;
  }

  
  @Roles(Role.Client)
  @Get('getOrders')
  async getOrders(@Request() req: Express.Request) {
    const getOrdersResponse = new FindAllResponse<Order>();
    try {
      const orders = await this.orderService.getOrders(req.user['_id']);
      getOrdersResponse.success = true;
      getOrdersResponse.data = orders.data;
      getOrdersResponse.currentPage = orders.currentPage;
      getOrdersResponse.numberOfPages = orders.numberOfPages;
      getOrdersResponse.numberOfRecords = orders.numberOfRecords;
    } catch (error) {
      getOrdersResponse.success = false;
      throw error;
    }

    return getOrdersResponse;
  }

  @Roles(Role.Client)
  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string) {
    const getOrdersResponse = new FindOneResponse<Order>();
    try {
      const order = await this.orderService.getOrderById(orderId);
      getOrdersResponse.success = true;
      getOrdersResponse.data = order;

    } catch (error) {
      getOrdersResponse.success = false;
      throw error;
    }

    return getOrdersResponse;
  }



  @Public()
  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') stripeSignature: string
  ) {
    console.log('req.rawBody', req);

    return await this.orderService.handleStripeWebhook(req, stripeSignature.toString());
  }
}
