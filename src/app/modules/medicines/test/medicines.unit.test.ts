// import { MedicineService } from '../medicines.service';
// import { IMedicine } from '../medicines.interface';
// import { Medicine } from '../medicines.model';
// import { Generic } from '../../mGeneric/generic.model';
// import { Category } from '../../medicineCategory/mCategory.model';
// import { Types } from 'mongoose';

// describe('Medicine Service', () => {
//   let newMedicine: IMedicine;
//   let genericId: Types.ObjectId;
//   let categoryId: Types.ObjectId;

//   beforeAll(async () => {
//     // you may need to connect to a test database
//     const generic = await Generic.create({ name: 'Test Generic' });
//     genericId = generic._id;
//     const category = await Category.create({ name: 'Test Category' });
//     categoryId = category._id;
//   });

//   afterAll(async () => {
//     // you may need to disconnect from the test database
//     await Medicine.deleteMany({});
//     await Generic.deleteMany({});
//     await Category.deleteMany({});
//   });

//   it('should create a new medicine', async () => {
//     const medicineData: IMedicine = {
//       name: 'Test Medicine',
//       genericName: genericId,
//       category: categoryId,
//       unit: 'tablet',
//       alertQty: 10,
//     };

//     const result = await MedicineService.createMedicine(medicineData);
//     expect(result).toHaveProperty('_id');
//     newMedicine = result;
//   });

//   it('should get all medicines', async () => {
//     const result = await MedicineService.getAllMedicines();
//     expect(Array.isArray(result)).toBe(true);
//     expect(result.length).toBeGreaterThan(0);
//   });

//   it('should get a single medicine', async () => {
//     const result = await MedicineService.getSingleMedicine(newMedicine._id.toString());
//     expect(result).toBeTruthy();
//     expect(result?.name).toBe(newMedicine.name);
//   });

//   it('should update a medicine', async () => {
//     const updatedData = { name: 'Updated Test Medicine' };
//     const result = await MedicineService.updateMedicine(newMedicine._id.toString(), updatedData);
//     expect(result).toBeTruthy();
//     expect(result?.name).toBe(updatedData.name);
//   });

//   it('should delete a medicine', async () => {
//     const result = await MedicineService.deleteMedicine(newMedicine._id.toString());
//     expect(result).toBeTruthy();
//   });
// });
