import { PurchaseService } from '../purchases.service';
import { IPurchase } from '../purchases.interface';
import { Purchase } from '../purchases.model';
import { Supplier } from '../../supplier/supplier.model';
import { User } from '../../user/user.model';
import { Types } from 'mongoose';

describe('Purchase Service', () => {
  let newPurchase: IPurchase;
  let supplierId: Types.ObjectId;
  let userId: Types.ObjectId;

  beforeAll(async () => {
    // you may need to connect to a test database
    const supplier = await Supplier.create({ name: 'Test Supplier', contactPerson: 'John Doe', phone: '1234567890', address: '123 Test Street' });
    supplierId = supplier._id;
    const user = await User.create({ uuid: 'test-user', role: 'admin', email: 'test@example.com', password: 'password' });
    userId = user._id;
  });

  afterAll(async () => {
    // you may need to disconnect from the test database
    await Purchase.deleteMany({});
    await Supplier.deleteMany({});
    await User.deleteMany({});
  });

  it('should create a new purchase', async () => {
    const purchaseData: IPurchase = {
      invoiceNo: 'INV-001',
      supplierId: supplierId,
      purchaseDate: new Date(),
      totalAmount: 1000,
      paidAmount: 500,
      status: 'partial',
      createdBy: userId,
    };

    const result = await PurchaseService.createPurchase(purchaseData);
    expect(result).toHaveProperty('_id');
    newPurchase = result;
  });

  it('should get all purchases', async () => {
    const result = await PurchaseService.getAllPurchases();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should get a single purchase', async () => {
    const result = await PurchaseService.getSinglePurchase(newPurchase._id.toString());
    expect(result).toBeTruthy();
    expect(result?.invoiceNo).toBe(newPurchase.invoiceNo);
  });

  it('should update a purchase', async () => {
    const updatedData = { status: 'paid' };
    const result = await PurchaseService.updatePurchase(newPurchase._id.toString(), updatedData);
    expect(result).toBeTruthy();
    expect(result?.status).toBe(updatedData.status);
  });

  it('should delete a purchase', async () => {
    const result = await PurchaseService.deletePurchase(newPurchase._id.toString());
    expect(result).toBeTruthy();
  });
});
