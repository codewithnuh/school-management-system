import { Request, Response } from "express";
import { User } from "@/models/User";
export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      placeOfBirth,
      nationality,
      email,
      phoneNo,
      emergencyContactName,
      emergencyContactNumber,
      address,
      studentId,
      previousSchool,
      previousGrade,
      previousMarks,
      isRegistered,
      guardianName,
      guardianCNIC,
      guardianPhone,
      guardianEmail,
      CNIC,
      class: userClass,
      enrollmentDate,
      uuid,
      medicalConditions,
      allergies,
      photo,
      transportation,
      extracurriculars,
      healthInsuranceInfo,
      doctorContact,
    } = req.body;
    console.log("before:body");
    console.log(req.body);
    const user = await User.create({
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      placeOfBirth,
      nationality,
      email,
      phoneNo,
      emergencyContactName,
      emergencyContactNumber,
      address,
      studentId,
      previousSchool,
      previousGrade,
      previousMarks,
      isRegistered,
      guardianName,
      guardianCNIC,
      guardianPhone,
      guardianEmail,
      CNIC,
      class: userClass,
      enrollmentDate,
      uuid,
      medicalConditions,
      allergies,
      photo,
      transportation,
      extracurriculars,
      healthInsuranceInfo,
      doctorContact,
    });

    res.json({
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  res.json({
    body: req.body,
  });
};
