import * as crypto from 'crypto';
import { ValueTransformer } from 'typeorm';

const generateOTP = () => {
    // const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otp = '2025';
    console.log("User OTP: ", otp);
    const hash = crypto.createHash('sha256').update(otp).digest('hex');
    return hash;
}

const FinancialYearsTransformer: ValueTransformer = {
  to: (years: string[]) => Array.from(new Set(years)).sort(),
  from: (years: string[]) => years,
};

export { generateOTP, FinancialYearsTransformer };
