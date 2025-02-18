
import { User,Teacher,Admin,OTP, Parent} from '@/models/index.js'
import { sendOtp } from '@/services/email.service.js'
import { ResponseUtil } from '@/utils/response.util'
import bcrypt from 'bcryptjs'

class ForgotPassword{
    public static sendForgotPasswordOTP = async ({
        entityType,
        email,
    }: {
        email: string
        entityType: 'STUDENT' | 'ADMIN' | 'TEACHER' | 'PARENT'
    }) => {
        let entity = null
        switch (entityType) {
            case 'STUDENT':
                entity = await User.findOne({
                    where: {
                        email,
                    },
                })
                break
            case 'TEACHER':
                entity = await Teacher.findOne({
                    where: {
                        email,
                    },
                })
                break
            case 'PARENT':
            default:
                break
        }
        if (!entity) {
            throw new Error('No entity found')
        }
        await OTP.cleanPreviousOtps({ entityId: entity.id, entityType })
        const Otp = await OTP.createOTP(entity!.id, entityType)
    
        sendOtp({
            entityEmail: entity!.email,
            entityFirstName: entity!.firstName,
            entityType,
            OTP: Otp.otp,
        })
        return {
            OTP: Otp.otp,
            id: entity.id,
            entityType,
            email: entity.email,
            isUsed: Otp.isUsed,
        }
    }
    public static resetPassword=async(oneTimePassword:string,newPassword:string)=>{
      const validOtp = await OTP.findOne({
        where:{
             otp:oneTimePassword
        }
      })
      if(!validOtp) throw new Error('Invalid OTP');
      if(validOtp.isUsed) throw new Error('OTP already used');
      await validOtp.markAsUsed()
      if(validOtp){
        const personId=validOtp.entityId
        const entityType=validOtp.entityType
        if(!newPassword) throw new Error('Please provide new password')
        const hashedNewPassword=await bcrypt.hash(newPassword,10)
        switch(entityType){
          case 'ADMIN':
          const admin= await Admin.findByPk(personId)
          admin?.update({password:hashedNewPassword})
          return 'Password reset successfully'
         
        
          case 'TEACHER':
          const teacher= await Teacher.findByPk(personId)
          teacher?.update({password:hashedNewPassword})
          
          return 'Passoword reset successfully'
      
          case 'STUDENT':
          const student= await User.findByPk(personId)
          student?.update({password:hashedNewPassword})
          return 'Passoword reset successfully'
        
          case 'PARENT':
          const parent= await Parent.findByPk(personId)
          parent?.update({password:hashedNewPassword})
          return 'Passoword reset successfully'
          default:
          throw new Error('Invalid entity type')
            
      }
    }    
}

}