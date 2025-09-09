// import { PaymentService } from '../payments.service';
// import { IPayment } from '../payments.interface';
// import { Payment } from '../payments.model';
// import { Order } from '../../orders/orders.model';
// import { User } from '../../user/user.model';
// import { Types } from 'mongoose';

// describe('Payment Service', () => {
//   let newPayment: IPayment;
//   let orderId: Types.ObjectId;

//   beforeAll(async () => {
//     // you may need to connect to a test database
//     const user = await User.create({ uuid: 'test-user-payment', role: 'customer', email: 'payment@example.com', password: 'password' });
//     const order = await Order.create({ userId: user._id, orderDate: new Date(), total: 300, status: 'pending', shippingAddress: '456 Payment Rd' });
//     orderId = order._id;
//   });

//   afterAll(async () => {
//     // you may need to disconnect from the test database
//     await Payment.deleteMany({});
//     await Order.deleteMany({});
//     await User.deleteMany({});
//   });

//   it('should create a new payment', async () => {
//     const paymentData: IPayment = {
//       orderId: orderId,
//       amount: 300,
//       method: 'card',
//       status: 'completed',
//       paidAt: new Date(),
//     };

//     const result = await PaymentService.createPayment(paymentData);
//     expect(result).toHaveProperty('_id');
//     newPayment = result;
//   });

//   it('should get all payments', async () => {
//     const result = await PaymentService.getAllPayments();
//     expect(Array.isArray(result)).toBe(true);
//     expect(result.length).toBeGreaterThan(0);
//   });

//   it('should get a single payment', async () => {
//     const result = await PaymentService.getSinglePayment(newPayment._id.toString());
//     expect(result).toBeTruthy();
//     expect(result?.amount).toBe(newPayment.amount);
//   });

//   it('should update a payment', async () => {
//     const updatedData = { status: 'failed' };
//     const result = await PaymentService.updatePayment(newPayment._id.toString(), updatedData);
//     expect(result).toBeTruthy();
//     expect(result?.status).toBe(updatedData.status);
//   });

//   it('should delete a payment', async () => {
//     const result = await PaymentService.deletePayment(newPayment._id.toString());
//     expect(result).toBeTruthy();
//   });
// });
