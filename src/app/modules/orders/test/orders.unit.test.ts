// import { OrderService } from '../orders.service';
// import { IOrder } from '../orders.interface';
// import { Order } from '../orders.model';
// import { User } from '../../user/user.model';
// import { Payment } from '../../payments/payments.model';
// import { Types } from 'mongoose';

// describe('Order Service', () => {
//   let newOrder: IOrder;
//   let userId: Types.ObjectId;
//   let paymentId: Types.ObjectId;

//   beforeAll(async () => {
//     // you may need to connect to a test database
//     const user = await User.create({ uuid: 'test-user-order', role: 'customer', email: 'order@example.com', password: 'password' });
//     userId = user._id;
//     // Assuming Payment model exists and can be created for testing
//     // const payment = await Payment.create({ orderId: new Types.ObjectId(), amount: 100, method: 'cash', status: 'completed', paidAt: new Date() });
//     // paymentId = payment._id;
//   });

//   afterAll(async () => {
//     // you may need to disconnect from the test database
//     await Order.deleteMany({});
//     await User.deleteMany({});
//     // await Payment.deleteMany({});
//   });

//   it('should create a new order', async () => {
//     const orderData: IOrder = {
//       userId: userId,
//       orderDate: new Date(),
//       total: 250,
//       status: 'pending',
//       shippingAddress: '789 Test Lane',
//     };

//     const result = await OrderService.createOrder(orderData);
//     expect(result).toHaveProperty('_id');
//     newOrder = result;
//   });

//   it('should get all orders', async () => {
//     const result = await OrderService.getAllOrders();
//     expect(Array.isArray(result)).toBe(true);
//     expect(result.length).toBeGreaterThan(0);
//   });

//   it('should get a single order', async () => {
//     const result = await OrderService.getSingleOrder(newOrder._id.toString());
//     expect(result).toBeTruthy();
//     expect(result?.total).toBe(newOrder.total);
//   });

//   it('should update an order', async () => {
//     const updatedData = { status: 'shipped' };
//     const result = await OrderService.updateOrder(newOrder._id.toString(), updatedData);
//     expect(result).toBeTruthy();
//     expect(result?.status).toBe(updatedData.status);
//   });

//   it('should delete an order', async () => {
//     const result = await OrderService.deleteOrder(newOrder._id.toString());
//     expect(result).toBeTruthy();
//   });
// });
