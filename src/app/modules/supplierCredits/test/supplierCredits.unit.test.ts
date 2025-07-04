import { SupplierCreditService } from '../supplierCredits.service';
import { ISupplierCredit } from '../supplierCredits.interface';
import { SupplierCredit } from '../supplierCredits.model';
import { Supplier } from '../../supplier/supplier.model';
import { PurchaseReturn } from '../../purchaseReturns/purchaseReturns.model';
import { Purchase } from '../../purchases/purchases.model';
import { User } from '../../user/user.model';
import { Types } from 'mongoose';

describe('SupplierCredit Service', () => {
  let newSupplierCredit: ISupplierCredit;
  let supplierId: Types.ObjectId;
  let returnId: Types.ObjectId;

  beforeAll(async () => {
    // you may need to connect to a test database
    const supplier = await Supplier.create({ name: 'Test Supplier SC', contactPerson: 'Jane SC', phone: '1234567894', address: '789 SC Ave' });
    supplierId = supplier._id;
    const user = await User.create({ uuid: 'test-user-sc', role: 'admin', email: 'sc@example.com', password: 'password' });
    const purchase = await Purchase.create({ invoiceNo: 'INV-005', supplierId: supplier._id, purchaseDate: new Date(), totalAmount: 5000, paidAmount: 2500, status: 'partial', createdBy: user._id });
    const purchaseReturn = await PurchaseReturn.create({ purchaseId: purchase._id, returnDate: new Date(), totalRefund: 200, reason: 'Overstock', createdBy: user._id });
    returnId = purchaseReturn._id;
  });

  afterAll(async () => {
    // you may need to disconnect from the test database
    await SupplierCredit.deleteMany({});
    await Supplier.deleteMany({});
    await PurchaseReturn.deleteMany({});
    await Purchase.deleteMany({});
    await User.deleteMany({});
  });

  it('should create a new supplier credit', async () => {
    const supplierCreditData: ISupplierCredit = {
      supplierId: supplierId,
      returnId: returnId,
      creditAmount: 200,
      used: false,
    };

    const result = await SupplierCreditService.createSupplierCredit(supplierCreditData);
    expect(result).toHaveProperty('_id');
    newSupplierCredit = result;
  });

  it('should get all supplier credits', async () => {
    const result = await SupplierCreditService.getAllSupplierCredits();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should get a single supplier credit', async () => {
    const result = await SupplierCreditService.getSingleSupplierCredit(newSupplierCredit._id.toString());
    expect(result).toBeTruthy();
    expect(result?.creditAmount).toBe(newSupplierCredit.creditAmount);
  });

  it('should update a supplier credit', async () => {
    const updatedData = { used: true };
    const result = await SupplierCreditService.updateSupplierCredit(newSupplierCredit._id.toString(), updatedData);
    expect(result).toBeTruthy();
    expect(result?.used).toBe(updatedData.used);
  });

  it('should delete a supplier credit', async () => {
    const result = await SupplierCreditService.deleteSupplierCredit(newSupplierCredit._id.toString());
    expect(result).toBeTruthy();
  });
});
