import { StockService } from '../stock.service';
import { IStock } from '../stock.interface';
import { Stock } from '../stock.model';
import { PurchaseItem } from '../../purchaseItems/purchaseItems.model';
import { Purchase } from '../../purchases/purchases.model';
import { Medicine } from '../../medicines/medicines.model';
import { Supplier } from '../../supplier/supplier.model';
import { User } from '../../user/user.model';
import { Generic } from '../../mGeneric/generic.model';
import { Category } from '../../medicineCategory/mCategory.model';
import { Types } from 'mongoose';

describe('Stock Service', () => {
  let newStock: IStock;
  let purchaseItemId: Types.ObjectId;
  let medicineId: Types.ObjectId;

  beforeAll(async () => {
    // you may need to connect to a test database
    const supplier = await Supplier.create({ name: 'Test Supplier', contactPerson: 'John Doe', phone: '1234567890', address: '123 Test Street' });
    const user = await User.create({ uuid: 'test-user', role: 'admin', email: 'test@example.com', password: 'password' });
    const purchase = await Purchase.create({ invoiceNo: 'INV-001', supplierId: supplier._id, purchaseDate: new Date(), totalAmount: 1000, paidAmount: 500, status: 'partial', createdBy: user._id });
    const generic = await Generic.create({ name: 'Test Generic' });
    const category = await Category.create({ name: 'Test Category' });
    const medicine = await Medicine.create({ name: 'Test Medicine', genericName: generic._id, category: category._id, unit: 'tablet', alertQty: 10 });
    medicineId = medicine._id;
    const purchaseItem = await PurchaseItem.create({ purchaseId: purchase._id, productId: medicine._id, quantity: 100, purchaseRate: 10, sellRate: 15, batchNo: 'B-001', expiryDate: new Date() });
    purchaseItemId = purchaseItem._id;
  });

  afterAll(async () => {
    // you may need to disconnect from the test database
    await Stock.deleteMany({});
    await PurchaseItem.deleteMany({});
    await Purchase.deleteMany({});
    await Medicine.deleteMany({});
    await Supplier.deleteMany({});
    await User.deleteMany({});
    await Generic.deleteMany({});
    await Category.deleteMany({});
  });

  it('should create a new stock', async () => {
    const stockData: IStock = {
      productId: medicineId,
      purchaseItemId: purchaseItemId,
      batchNo: 'B-001',
      expiryDate: new Date(),
      quantityIn: 100,
      quantityOut: 0,
      currentQuantity: 100,
    };

    const result = await StockService.createStock(stockData);
    expect(result).toHaveProperty('_id');
    newStock = result;
  });

  it('should get all stock', async () => {
    const result = await StockService.getAllStocks();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should get a single stock', async () => {
    const result = await StockService.getSingleStock(newStock._id.toString());
    expect(result).toBeTruthy();
    expect(result?.batchNo).toBe(newStock.batchNo);
  });

  it('should update a stock', async () => {
    const updatedData = { currentQuantity: 90 };
    const result = await StockService.updateStock(newStock._id.toString(), updatedData);
    expect(result).toBeTruthy();
    expect(result?.currentQuantity).toBe(updatedData.currentQuantity);
  });

  it('should delete a stock', async () => {
    const result = await StockService.deleteStock(newStock._id.toString());
    expect(result).toBeTruthy();
  });
});
