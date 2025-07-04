import { OrderItemService } from '../orderItems.service';
import { IOrderItem } from '../orderItems.interface';
import { OrderItem } from '../orderItems.model';
import { Order } from '../../orders/orders.model';
import { Medicine } from '../../medicines/medicines.model';
import { User } from '../../user/user.model';
import { Generic } from '../../mGeneric/generic.model';
import { Category } from '../../medicineCategory/mCategory.model';
import { Types } from 'mongoose';

describe('OrderItem Service', () => {
  let newOrderItem: IOrderItem;
  let orderId: Types.ObjectId;
  let productId: Types.ObjectId;

  beforeAll(async () => {
    // you may need to connect to a test database
    const user = await User.create({ uuid: 'test-user-order-item', role: 'customer', email: 'orderitem@example.com', password: 'password' });
    const order = await Order.create({ userId: user._id, orderDate: new Date(), total: 100, status: 'pending', shippingAddress: '123 Order Item St' });
    orderId = order._id;
    const generic = await Generic.create({ name: 'Test Generic OI' });
    const category = await Category.create({ name: 'Test Category OI' });
    const medicine = await Medicine.create({ name: 'Test Medicine OI', genericName: generic._id, category: category._id, unit: 'tablet', alertQty: 5 });
    productId = medicine._id;
  });

  afterAll(async () => {
    // you may need to disconnect from the test database
    await OrderItem.deleteMany({});
    await Order.deleteMany({});
    await Medicine.deleteMany({});
    await User.deleteMany({});
    await Generic.deleteMany({});
    await Category.deleteMany({});
  });

  it('should create a new order item', async () => {
    const orderItemData: IOrderItem = {
      orderId: orderId,
      productId: productId,
      batchNo: 'BATCH-OI-001',
      quantity: 5,
      price: 20,
    };

    const result = await OrderItemService.createOrderItem(orderItemData);
    expect(result).toHaveProperty('_id');
    newOrderItem = result;
  });

  it('should get all order items', async () => {
    const result = await OrderItemService.getAllOrderItems();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should get a single order item', async () => {
    const result = await OrderItemService.getSingleOrderItem(newOrderItem._id.toString());
    expect(result).toBeTruthy();
    expect(result?.batchNo).toBe(newOrderItem.batchNo);
  });

  it('should update an order item', async () => {
    const updatedData = { quantity: 7 };
    const result = await OrderItemService.updateOrderItem(newOrderItem._id.toString(), updatedData);
    expect(result).toBeTruthy();
    expect(result?.quantity).toBe(updatedData.quantity);
  });

  it('should delete an order item', async () => {
    const result = await OrderItemService.deleteOrderItem(newOrderItem._id.toString());
    expect(result).toBeTruthy();
  });
});
