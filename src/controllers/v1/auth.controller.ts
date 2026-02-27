import type { NextFunction, Request, Response } from 'express';
import * as authService from '../../services/auth.service.js';
import AppError from '../../utils/appError.utils.js';
import { RegisterDto } from '../../interfaces/common.interface.js';

export const register = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const input = req.body as RegisterDto;        
        //check mismatch b/w password and retype password
        if(input.password !== input.retype_password) throw new AppError('password mismatch',400);
        //check of already any user exists with the same email or phone
        const emailOrPhoneUsed = await authService.isEmailOrPhoneUsed(input.email,input.phone);
        if(emailOrPhoneUsed) throw new AppError('credentials already in use',409);
        await authService.createUserAndAccount(input.name,input.email,input.phone,input.password);
        const loginData = await authService.login(input.email,input.password);
        return res.status(201).json({
            error:false,
            message:'user created',
            data:loginData
        });
    }catch(err){
        next(err);
    }
}

export const login = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);  
    return res.status(200).json({ error: false,message:'logged in', data: result });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    return res.status(200).json({ error: false, data: result });
  } catch (err: any) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return res.status(200).json({ error: false, message: 'Logged out' });
  } catch (err: any) {
    next(err);
  }
};