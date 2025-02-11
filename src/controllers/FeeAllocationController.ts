import {
    StudentFeeAllocation,
    StudentFeeAllocationAttributes,
    StudentFeeAllocationSchema,
} from '@/models/index.js'
import { StudentFeeAllocationService } from '@/services/feeAllocation.service.js'
import { ResponseUtil } from '@/utils/response.util.js'
import { Response, Request } from 'express'
export class StudentFeeAllocationController {
    public static async createStudentFeeAllocation(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const validatedData = StudentFeeAllocationSchema.parse(
                req.body,
            ) as StudentFeeAllocationAttributes
            const studentFeeAllocationInput: StudentFeeAllocationAttributes = {
                studentId: validatedData.studentId,
                academicYearId: validatedData.academicYearId,
                classId: validatedData.classId,
                totalFeeAmount: validatedData.totalFeeAmount,
                outstandingBalance: validatedData.outstandingBalance, // Consider if controller should set initial outstandingBalance or service.
            }
            const studentFeeAllocation =
                await StudentFeeAllocationService.createStudentFeeAllocation(
                    studentFeeAllocationInput,
                )
            const response = ResponseUtil.success<StudentFeeAllocation>(
                studentFeeAllocation,
                'Student fee allocation created successfully',
                201,
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error creating student fee allocation:', error)
            const genericMessage =
                'Student fee allocation creation failed. Please verify your input and try again.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    public static async getAllStudentFeeAllocations(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const studentFeeAllocations =
                await StudentFeeAllocationService.getAllStudentFeeAllocations()
            const response = ResponseUtil.success<StudentFeeAllocation[]>(
                studentFeeAllocations,
                'Student fee allocations retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error fetching all student fee allocations:', error)
            const genericMessage =
                'Failed to retrieve student fee allocations. Please try again later.'
            const response = ResponseUtil.error(genericMessage, 500)
            res.status(response.statusCode).json(response)
        }
    }

    public static async getStudentFeeAllocationById(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const studentFeeAllocationId = parseInt(id, 10)
            if (isNaN(studentFeeAllocationId))
                throw new Error('Invalid student fee allocation ID')

            const studentFeeAllocation =
                await StudentFeeAllocationService.getStudentFeeAllocationById(
                    studentFeeAllocationId,
                )
            const response = ResponseUtil.success<StudentFeeAllocation | null>(
                studentFeeAllocation,
                'Student fee allocation retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error fetching student fee allocation by ID:', error)
            const genericMessage =
                'Failed to retrieve student fee allocation. Please verify your request.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    public static async updateStudentFeeAllocation(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const studentFeeAllocationId = parseInt(id, 10)
            if (isNaN(studentFeeAllocationId))
                throw new Error('Invalid student fee allocation ID')

            const validatedData = StudentFeeAllocationSchema.parse(
                req.body,
            ) as StudentFeeAllocationAttributes
            const studentFeeAllocationInput: StudentFeeAllocationAttributes = {
                studentId: validatedData.studentId,
                academicYearId: validatedData.academicYearId,
                classId: validatedData.classId,
                totalFeeAmount: validatedData.totalFeeAmount,
                outstandingBalance: validatedData.outstandingBalance,
            }

            const updatedStudentFeeAllocation =
                await StudentFeeAllocationService.updateStudentFeeAllocation(
                    studentFeeAllocationId,
                    studentFeeAllocationInput,
                )
            const response = ResponseUtil.success<number[]>(
                updatedStudentFeeAllocation,
                'Student fee allocation updated successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error updating student fee allocation:', error)
            const genericMessage =
                'Student fee allocation update failed. Please ensure your input is correct and try again.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    public static async deleteStudentFeeAllocation(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params
            const studentFeeAllocationId = parseInt(id, 10)
            if (isNaN(studentFeeAllocationId))
                throw new Error('Invalid student fee allocation ID')

            const deletedStudentFeeAllocationCount =
                await StudentFeeAllocationService.deleteStudentFeeAllocation(
                    studentFeeAllocationId,
                )
            const response = ResponseUtil.success<number>(
                deletedStudentFeeAllocationCount,
                'Student fee allocation deleted successfully',
                204,
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error('Error deleting student fee allocation:', error)
            const genericMessage =
                'Student fee allocation deletion failed. Please try again later.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }

    public static async getStudentFeeAllocationByStudentAndYear(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { studentId, academicYearId } = req.params
            const student_Id = parseInt(studentId, 10)
            const academic_YearId = parseInt(academicYearId, 10)

            if (isNaN(student_Id)) throw new Error('Invalid student ID')
            if (isNaN(academic_YearId))
                throw new Error('Invalid academic year ID')

            const studentFeeAllocation =
                await StudentFeeAllocationService.getStudentFeeAllocationByStudentAndYear(
                    student_Id,
                    academic_YearId,
                )
            const response = ResponseUtil.success<StudentFeeAllocation | null>(
                studentFeeAllocation,
                'Student fee allocation retrieved successfully',
            )
            res.status(response.statusCode).json(response)
        } catch (error: unknown) {
            console.error(
                'Error fetching student fee allocation by student and year:',
                error,
            )
            const genericMessage =
                'Failed to retrieve student fee allocation. Please verify your request.'
            const response = ResponseUtil.error(genericMessage, 400)
            res.status(response.statusCode).json(response)
        }
    }
}
