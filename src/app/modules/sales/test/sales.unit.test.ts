import { SalesService } from '../sales.service';
import { ISale } from '../sales.interface';
import { Sale } from '../sales.model';
import { User } from '../../user/user.model';
import { Payment } from '../../payments/payments.model';
import { Types } from 'mongoose';

describe('Sales Service', () => {
  let newSale: ISale;
  let userId: Types.ObjectId;
  let paymentId: Types.ObjectId;

  beforeAll(async () => {
    // you may need to connect to a test database
    const user = await User.create({ uuid: 'test-user-sale', role: 'customer', email: 'sale@example.com', password: 'password' });
    userId = user._id;
    // Assuming Payment model exists and can be created for testing
    // const payment = await Payment.create({ orderId: new Types.ObjectId(), amount: 100, method: 'cash', status: 'completed', paidAt: new Date() });
    // paymentId = payment._id;
  });

  afterAll(async () => {
    // you may need to disconnect from the test database
    await Sale.deleteMany({});
    await User.deleteMany({});
    // await Payment.deleteMany({});
  });

  it('should create a new sale', async () => {
    const saleData: ISale = {
      userId: userId,
      orderDate: new Date(),
      total: 150,
      status: 'pending',
      shippingAddress: '456 Test Ave',
    };

    const result = await SalesService.createSale(saleData);
    expect(result).toHaveProperty('_id');
    newSale = result;
  });

  it('should get all sales', async () => {
    const result = await SalesService.getAllSales();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should get a single sale', async () => {
    const result = await SalesService.getSingleSale(newSale._id.toString());
    expect(result).toBeTruthy();
    expect(result?.total).toBe(newSale.total);
  });

  it('should update a sale', async () => {
    const updatedData = { status: 'delivered' };
    const result = await SalesService.updateSale(newSale._id.toString(), updatedData);
    expect(result).toBeTruthy();
    expect(result?.status).toBe(updatedData.status);
  });

  it('should delete a sale', async () => {
    const result = await SalesService.deleteSale(newSale._id.toString());
    expect(result).toBeTruthy();
  });
});
