import { User, UserAttributes } from "@/models/User";
import { randomUUID } from "crypto";

export const mockStudents: Partial<UserAttributes>[] = [
  {
    firstName: "John",
    middleName: "David",
    lastName: "Smith",
    dateOfBirth: new Date("2005-03-15"),
    gender: "Male",
    placeOfBirth: "New York",
    nationality: "American",
    email: "john.smith@example.com",
    phoneNo: "1234567890",
    emergencyContactName: "Jane Smith",
    emergencyContactNumber: "0987654321",
    address: "123 Main St, Anytown",
    studentId: "S2024001",
    previousSchool: "Anytown High",
    previousGrade: "9th",
    previousMarks: "85%",
    isRegistered: true,
    guardianName: "Robert Smith",
    guardianCNIC: "1234567890123",
    guardianPhone: "1122334455",
    guardianEmail: "guardian@example.com",
    CNIC: "9876543210987",
    class: 10,
    enrollmentDate: new Date("2024-08-20"),
    uuid: randomUUID(),
    medicalConditions: "None",
    allergies: "None",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    dateOfBirth: new Date("2006-11-02"),
    gender: "Female",
    placeOfBirth: "Los Angeles",
    nationality: "American",
    email: "alice.johnson@example.com",
    phoneNo: "9876543210",
    emergencyContactName: "Michael Johnson",
    emergencyContactNumber: "1029384756",
    address: "456 Oak Ave, Anytown",
    studentId: "S2024002",
    previousSchool: "Another High",
    previousGrade: "8th",
    previousMarks: "92%",
    isRegistered: false,
    guardianName: "Linda Johnson",
    guardianCNIC: "5432109876543",
    guardianPhone: "6677889900",
    guardianEmail: "guardian2@example.com",
    CNIC: "0987654321098",
    class: 9,
    enrollmentDate: new Date("2024-08-15"),
    medicalConditions: "Asthma",
    allergies: "Pollen",
  },
  {
    firstName: "Bob",
    lastName: "Williams",
    dateOfBirth: new Date("2007-05-20"),
    gender: "Male",
    placeOfBirth: "Chicago",
    nationality: "American",
    email: "bob.williams@example.com",
    phoneNo: "5551234567",
    emergencyContactName: "David Williams",
    emergencyContactNumber: "7654321098",
    address: "789 Pine Ln, Anytown",
    studentId: "S2024003",
    previousSchool: "Central School",
    previousGrade: "7th",
    previousMarks: "78%",
    isRegistered: true,
    guardianName: "Susan Williams",
    guardianCNIC: "4321098765432",
    guardianPhone: "1199887766",
    guardianEmail: "guardian3@example.com",
    CNIC: "2109876543210",
    class: 8,
    enrollmentDate: new Date("2024-08-10"),
    medicalConditions: "None",
    allergies: "Cats",
  },
  {
    firstName: "Eva",
    lastName: "Garcia",
    dateOfBirth: new Date("2008-09-10"),
    gender: "Female",
    placeOfBirth: "Houston",
    nationality: "American",
    email: "eva.garcia@example.com",
    phoneNo: "1239874560",
    emergencyContactName: "Maria Garcia",
    emergencyContactNumber: "0984561237",
    address: "101 Elm St, Anytown",
    studentId: "S2024004",
    previousSchool: "Westside Elementary",
    previousGrade: "6th",
    previousMarks: "89%",
    isRegistered: false,
    guardianName: "Carlos Garcia",
    guardianCNIC: "7654321098765",
    guardianPhone: "3366992255",
    guardianEmail: "guardian4@example.com",
    CNIC: "5432109876543",
    class: 7,
    enrollmentDate: new Date("2024-08-05"),
    medicalConditions: "None",
    allergies: "None",
  },
  {
    firstName: "Michael",
    lastName: "Rodriguez",
    dateOfBirth: new Date("2009-02-28"),
    gender: "Male",
    placeOfBirth: "Phoenix",
    nationality: "American",
    email: "michael.rodriguez@example.com",
    phoneNo: "4567890123",
    emergencyContactName: "Jose Rodriguez",
    emergencyContactNumber: "3210987654",
    address: "222 Maple Dr, Anytown",
    studentId: "S2024005",
    previousSchool: "Northwood Middle",
    previousGrade: "5th",
    previousMarks: "75%",
    isRegistered: true,
    guardianName: "Isabel Rodriguez",
    guardianCNIC: "6543210987654",
    guardianPhone: "9988776655",
    guardianEmail: "guardian5@example.com",
    CNIC: "4321098765432",
    class: 6,
    enrollmentDate: new Date("2024-07-30"),
    medicalConditions: "ADHD",
    allergies: "None",
  },
];
