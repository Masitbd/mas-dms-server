import { PurchaseReturnService } from '../purchaseReturns.service';
import { IPurchaseReturn } from '../purchaseReturns.interface';
import { PurchaseReturn } from '../purchaseReturns.model';
import { Purchase } from '../../purchases/purchases.model';
import { Supplier } from '../../supplier/supplier.model';
import { User } from '../../user/user.model';
import { Types } from 'mongoose';

describe('PurchaseReturn Service', () => {
  let newPurchaseReturn: IPurchaseReturn;
  let purchaseId: Types.ObjectId;
  let createdBy: Types.ObjectId;

  beforeAll(async () => {
    // you may need to connect to a test database
    const supplier = await Supplier.create({ name: 'Test Supplier PR', contactPerson: 'Jane Doe PR', phone: '1234567892', address: '456 Test Lane PR' });
    const user = await User.create({ uuid: 'test-user-pr', role: 'admin', email: 'pr@example.com', password: 'password' });
    createdBy = user._id;
    const purchase = await Purchase.create({ invoiceNo: 'INV-003', supplierId: supplier._id, purchaseDate: new Date(), totalAmount: 3000, paidAmount: 1500, status: 'partial', createdBy: user._id });
    purchaseId = purchase._id;
  });

  afterAll(async () => {
    // you may need to disconnect from the test database
    await PurchaseReturn.deleteMany({});
    await Purchase.deleteMany({});
    await Supplier.deleteMany({});
    await User.deleteMany({});
  });

  it('should create a new purchase return', async () => {
    const purchaseReturnData: IPurchaseReturn = {
      purchaseId: purchaseId,
      returnDate: new Date(),
      totalRefund: 500,
      reason: 'Damaged goods',
      createdBy: createdBy,
    };

    const result = await PurchaseReturnService.createPurchaseReturn(purchaseReturnData);
    expect(result).toHaveProperty('_id');
    newPurchaseReturn = result;
  });

  it('should get all purchase returns', async () => {
    const result = await PurchaseReturnService.getAllPurchaseReturns();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should get a single purchase return', async () => {
    const result = await PurchaseReturnService.getSinglePurchaseReturn(newPurchaseReturn._id.toString());
    expect(result).toBeTruthy();
    expect(result?.reason).toBe(newPurchaseReturn.reason);
  });

  it('should update a purchase return', async () => {
    const updatedData = { totalRefund: 600 };
    const result = await PurchaseReturnService.updatePurchaseReturn(newPurchaseReturn._id.toString(), updatedData);
    expect(result).toBeTruthy();
    expect(result?.totalRefund).toBe(updatedData.totalRefund);
  });

  it('should delete a purchase return', async () => {
    const result = await PurchaseReturnService.deletePurchaseReturn(newPurchaseReturn._id.toString());
    expect(result).toBeTruthy();
  });
});
