// import { PurchaseReturnItemService } from '../purchaseReturnItems.service';
// import { IPurchaseReturnItem } from '../purchaseReturnItems.interface';
// import { PurchaseReturnItem } from '../purchaseReturnItems.model';
// import { PurchaseReturn } from '../../purchaseReturns/purchaseReturns.model';
// import { PurchaseItem } from '../../purchaseItems/purchaseItems.model';
// import { Purchase } from '../../purchases/purchases.model';
// import { Medicine } from '../../medicines/medicines.model';
// import { Supplier } from '../../supplier/supplier.model';
// import { User } from '../../user/user.model';
// import { Generic } from '../../mGeneric/generic.model';
// import { Category } from '../../medicineCategory/mCategory.model';
// import { Types } from 'mongoose';

// describe('PurchaseReturnItem Service', () => {
//   let newPurchaseReturnItem: IPurchaseReturnItem;
//   let returnId: Types.ObjectId;
//   let purchaseItemId: Types.ObjectId;

//   beforeAll(async () => {
//     // you may need to connect to a test database
//     const supplier = await Supplier.create({ name: 'Test Supplier PRI', contactPerson: 'John PRI', phone: '1234567893', address: '123 PRI St' });
//     const user = await User.create({ uuid: 'test-user-pri', role: 'admin', email: 'pri@example.com', password: 'password' });
//     const purchase = await Purchase.create({ invoiceNo: 'INV-004', supplierId: supplier._id, purchaseDate: new Date(), totalAmount: 4000, paidAmount: 2000, status: 'partial', createdBy: user._id });
//     const purchaseReturn = await PurchaseReturn.create({ purchaseId: purchase._id, returnDate: new Date(), totalRefund: 100, reason: 'Defective', createdBy: user._id });
//     returnId = purchaseReturn._id;
//     const generic = await Generic.create({ name: 'Test Generic PRI' });
//     const category = await Category.create({ name: 'Test Category PRI' });
//     const medicine = await Medicine.create({ name: 'Test Medicine PRI', genericName: generic._id, category: category._id, unit: 'bottle', alertQty: 2 });
//     const purchaseItem = await PurchaseItem.create({ purchaseId: purchase._id, productId: medicine._id, quantity: 50, purchaseRate: 20, sellRate: 25, batchNo: 'BATCH-PRI-001', expiryDate: new Date() });
//     purchaseItemId = purchaseItem._id;
//   });

//   afterAll(async () => {
//     // you may need to disconnect from the test database
//     await PurchaseReturnItem.deleteMany({});
//     await PurchaseReturn.deleteMany({});
//     await PurchaseItem.deleteMany({});
//     await Purchase.deleteMany({});
//     await Medicine.deleteMany({});
//     await Supplier.deleteMany({});
//     await User.deleteMany({});
//     await Generic.deleteMany({});
//     await Category.deleteMany({});
//   });

//   it('should create a new purchase return item', async () => {
//     const purchaseReturnItemData: IPurchaseReturnItem = {
//       returnId: returnId,
//       purchaseItemId: purchaseItemId,
//       quantityReturned: 5,
//       refundAmount: 100,
//       comment: 'Returned 5 items',
//     };

//     const result = await PurchaseReturnItemService.createPurchaseReturnItem(purchaseReturnItemData);
//     expect(result).toHaveProperty('_id');
//     newPurchaseReturnItem = result;
//   });

//   it('should get all purchase return items', async () => {
//     const result = await PurchaseReturnItemService.getAllPurchaseReturnItems();
//     expect(Array.isArray(result)).toBe(true);
//     expect(result.length).toBeGreaterThan(0);
//   });

//   it('should get a single purchase return item', async () => {
//     const result = await PurchaseReturnItemService.getSinglePurchaseReturnItem(newPurchaseReturnItem._id.toString());
//     expect(result).toBeTruthy();
//     expect(result?.quantityReturned).toBe(newPurchaseReturnItem.quantityReturned);
//   });

//   it('should update a purchase return item', async () => {
//     const updatedData = { quantityReturned: 7 };
//     const result = await PurchaseReturnItemService.updatePurchaseReturnItem(newPurchaseReturnItem._id.toString(), updatedData);
//     expect(result).toBeTruthy();
//     expect(result?.quantityReturned).toBe(updatedData.quantityReturned);
//   });

//   it('should delete a purchase return item', async () => {
//     const result = await PurchaseReturnItemService.deletePurchaseReturnItem(newPurchaseReturnItem._id.toString());
//     expect(result).toBeTruthy();
//   });
// });
