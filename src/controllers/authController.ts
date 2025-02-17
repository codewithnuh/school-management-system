import { Request, Response } from 'express';
import { authService } from '@/services/auth.service.js';
import { z } from 'zod';
import { ResponseUtil } from '@/utils/response.util.js';
import { Admin, User,Teacher,Parent} from '@/models/index.js'
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  entityType: z.enum(['ADMIN', 'TEACHER', 'USER', 'PARENT']),
});

export const authController = {
  async login(req: Request, res: Response):Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password, entityType } = validatedData;
      
      let userModel;
      switch (entityType) {
        case 'ADMIN':
          userModel = Admin
          break;
        case 'TEACHER':
          userModel = Teacher
          break;
        case 'USER':
          userModel = User
          break;
        case 'PARENT':
          userModel = Parent
          break;
        default:
           res.status(400).json({ message: 'Invalid entity type' });
           return
      }
      
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;

      const { token } = await authService.login(email, password, entityType, userModel, userAgent, ipAddress);
  const response =ResponseUtil.success('Login successful');
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const response = ResponseUtil.error('Validation error', 400);
        res.status(400).json(response);
        console.log(error)

        return
      }
        if(error instanceof Error) {

          const reponse=ResponseUtil.error(error.message,400)
          res.status(500).json(reponse);
          console.log(error)
          return
        }
    }
  },
  async logout(req:Request,res:Response):Promise<void>{
    const token=req.query.token as string
    await authService.logout(token)
    const response=ResponseUtil.success('Logout successful')
    res.status(200).json(response)
  }
  }
