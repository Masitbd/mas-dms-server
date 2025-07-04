import { PurchasePaymentService } from '../purchasePayments.service';
import { IPurchasePayment } from '../purchasePayments.interface';
import { PurchasePayment } from '../purchasePayments.model';
import { Purchase } from '../../purchases/purchases.model';
import { Supplier } from '../../supplier/supplier.model';
import { User } from '../../user/user.model';
import { Types } from 'mongoose';

describe('PurchasePayment Service', () => {
  let newPurchasePayment: IPurchasePayment;
  let purchaseId: Types.ObjectId;

  beforeAll(async () => {
    // you may need to connect to a test database
    const supplier = await Supplier.create({ name: 'Test Supplier PP', contactPerson: 'John Doe PP', phone: '1234567891', address: '123 Test Street PP' });
    const user = await User.create({ uuid: 'test-user-pp', role: 'admin', email: 'pp@example.com', password: 'password' });
    const purchase = await Purchase.create({ invoiceNo: 'INV-002', supplierId: supplier._id, purchaseDate: new Date(), totalAmount: 2000, paidAmount: 1000, status: 'partial', createdBy: user._id });
    purchaseId = purchase._id;
  });

  afterAll(async () => {
    // you may need to disconnect from the test database
    await PurchasePayment.deleteMany({});
    await Purchase.deleteMany({});
    await Supplier.deleteMany({});
    await User.deleteMany({});
  });

  it('should create a new purchase payment', async () => {
    const purchasePaymentData: IPurchasePayment = {
      purchaseId: purchaseId,
      paymentDate: new Date(),
      amount: 500,
      method: 'cash',
      note: 'Partial payment',
    };

    const result = await PurchasePaymentService.createPurchasePayment(purchasePaymentData);
    expect(result).toHaveProperty('_id');
    newPurchasePayment = result;
  });

  it('should get all purchase payments', async () => {
    const result = await PurchasePaymentService.getAllPurchasePayments();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should get a single purchase payment', async () => {
    const result = await PurchasePaymentService.getSinglePurchasePayment(newPurchasePayment._id.toString());
    expect(result).toBeTruthy();
    expect(result?.amount).toBe(newPurchasePayment.amount);
  });

  it('should update a purchase payment', async () => {
    const updatedData = { amount: 700 };
    const result = await PurchasePaymentService.updatePurchasePayment(newPurchasePayment._id.toString(), updatedData);
    expect(result).toBeTruthy();
    expect(result?.amount).toBe(updatedData.amount);
  });

  it('should delete a purchase payment', async () => {
    const result = await PurchasePaymentService.deletePurchasePayment(newPurchasePayment._id.toString());
    expect(result).toBeTruthy();
  });
});
