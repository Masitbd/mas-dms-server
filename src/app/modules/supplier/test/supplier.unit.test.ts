// import { SupplierService } from '../supplier.service';
// import { ISupplier } from '../supplier.interface';
// import { Supplier } from '../supplier.model';

// describe('Supplier Service', () => {
//   let newSupplier: ISupplier;

//   beforeAll(async () => {
//     // you may need to connect to a test database
//   });

//   afterAll(async () => {
//     // you may need to disconnect from the test database
//     await Supplier.deleteMany({});
//   });

//   it('should create a new supplier', async () => {
//     const supplierData: ISupplier = {
//       name: 'Test Supplier',
//       contactPerson: 'John Doe',
//       phone: '1234567890',
//       address: '123 Test Street',
//     };

//     const result = await SupplierService.createSupplier(supplierData);
//     expect(result).toHaveProperty('_id');
//     newSupplier = result;
//   });

//   it('should get all suppliers', async () => {
//     const result = await SupplierService.getAllSuppliers();
//     expect(Array.isArray(result)).toBe(true);
//     expect(result.length).toBeGreaterThan(0);
//   });

//   it('should get a single supplier', async () => {
//     const result = await SupplierService.getSingleSupplier(newSupplier._id.toString());
//     expect(result).toBeTruthy();
//     expect(result?.name).toBe(newSupplier.name);
//   });

//   it('should update a supplier', async () => {
//     const updatedData = { name: 'Updated Test Supplier' };
//     const result = await SupplierService.updateSupplier(newSupplier._id.toString(), updatedData);
//     expect(result).toBeTruthy();
//     expect(result?.name).toBe(updatedData.name);
//   });

//   it('should delete a supplier', async () => {
//     const result = await SupplierService.deleteSupplier(newSupplier._id.toString());
//     expect(result).toBeTruthy();
//   });
// });
