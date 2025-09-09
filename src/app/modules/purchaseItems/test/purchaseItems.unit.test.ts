// import { PurchaseItemService } from '../purchaseItems.service';
// import { IPurchaseItem } from '../purchaseItems.interface';
// import { PurchaseItem } from '../purchaseItems.model';
// import { Purchase } from '../../purchases/purchases.model';
// import { Medicine } from '../../medicines/medicines.model';
// import { Supplier } from '../../supplier/supplier.model';
// import { User } from '../../user/user.model';
// import { Generic } from '../../mGeneric/generic.model';
// import { Category } from '../../medicineCategory/mCategory.model';
// import { Types } from 'mongoose';

// describe('PurchaseItem Service', () => {
//   let newPurchaseItem: IPurchaseItem;
//   let purchaseId: Types.ObjectId;
//   let medicineId: Types.ObjectId;

//   beforeAll(async () => {
//     // you may need to connect to a test database
//     const supplier = await Supplier.create({ name: 'Test Supplier', contactPerson: 'John Doe', phone: '1234567890', address: '123 Test Street' });
//     const user = await User.create({ uuid: 'test-user', role: 'admin', email: 'test@example.com', password: 'password' });
//     const purchase = await Purchase.create({ invoiceNo: 'INV-001', supplierId: supplier._id, purchaseDate: new Date(), totalAmount: 1000, paidAmount: 500, status: 'partial', createdBy: user._id });
//     purchaseId = purchase._id;
//     const generic = await Generic.create({ name: 'Test Generic' });
//     const category = await Category.create({ name: 'Test Category' });
//     const medicine = await Medicine.create({ name: 'Test Medicine', genericName: generic._id, category: category._id, unit: 'tablet', alertQty: 10 });
//     medicineId = medicine._id;
//   });

//   afterAll(async () => {
//     // you may need to disconnect from the test database
//     await PurchaseItem.deleteMany({});
//     await Purchase.deleteMany({});
//     await Medicine.deleteMany({});
//     await Supplier.deleteMany({});
//     await User.deleteMany({});
//     await Generic.deleteMany({});
//     await Category.deleteMany({});
//   });

//   it('should create a new purchase item', async () => {
//     const purchaseItemData: IPurchaseItem = {
//       purchaseId: purchaseId,
//       productId: medicineId,
//       quantity: 100,
//       purchaseRate: 10,
//       sellRate: 15,
//       batchNo: 'B-001',
//       expiryDate: new Date(),
//     };

//     const result = await PurchaseItemService.createPurchaseItem(purchaseItemData);
//     expect(result).toHaveProperty('_id');
//     newPurchaseItem = result;
//   });

//   it('should get all purchase items', async () => {
//     const result = await PurchaseItemService.getAllPurchaseItems();
//     expect(Array.isArray(result)).toBe(true);
//     expect(result.length).toBeGreaterThan(0);
//   });

//   it('should get a single purchase item', async () => {
//     const result = await PurchaseItemService.getSinglePurchaseItem(newPurchaseItem._id.toString());
//     expect(result).toBeTruthy();
//     expect(result?.batchNo).toBe(newPurchaseItem.batchNo);
//   });

//   it('should update a purchase item', async () => {
//     const updatedData = { quantity: 120 };
//     const result = await PurchaseItemService.updatePurchaseItem(newPurchaseItem._id.toString(), updatedData);
//     expect(result).toBeTruthy();
//     expect(result?.quantity).toBe(updatedData.quantity);
//   });

//   it('should delete a purchase item', async () => {
//     const result = await PurchaseItemService.deletePurchaseItem(newPurchaseItem._id.toString());
//     expect(result).toBeTruthy();
//   });
// });
