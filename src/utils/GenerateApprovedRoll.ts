// // import ApprovedStudent from "../modules/approvedStudent/approvedStudent.model";

// const findLastStudentRoll = async (batch: string) => {
//   return await ApprovedStudent.findOne({ batch }, { roll: 1, _id: 0 })
//     .sort({ roll: -1 }) // Sort by roll number descending
//     .lean();
// };

// const approvedRollGenerate = async (batch: string) => {
//   try {
//     const lastStudentRoll = await findLastStudentRoll(batch);
//     let currentRoll = "00000"; // Default if no student exists in the batch

//     if (lastStudentRoll) {
//       // Extract last 5 digits and increment
//       const lastRollNumber = Number(
//         lastStudentRoll?.roll?.substring(batch.length)
//       );
//       currentRoll = (lastRollNumber + 1).toString().padStart(5, "0");
//     } else {
//       // If no students exist in this batch, start from 00001
//       currentRoll = "00001";
//     }

//     // Generate new roll number
//     const newRoll = `${batch}${currentRoll}`;
//     return newRoll;
//   } catch (error) {
//     console.error("Error generating student roll:", error);
//     throw error;
//   }
// };

// export default approvedRollGenerate;
