import { User } from "../../../shared/entities/user.entity";
import { Customer } from "../../../shared/entities/customer.entity";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validateMobile } from "../../../shared/helper/validation";
import { generateOTP } from "../../../shared/helper/helper";
import * as jwt from 'jsonwebtoken';
import { UserDevice } from "../../../shared/entities/user-device.entity";
import * as crypto from 'crypto';
import { RedisService } from "../../../shared/services/redis.service";
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(UserDevice)
    private readonly userDeviceRepository: Repository<UserDevice>,
    private readonly redisService: RedisService,
  ) {}

  private generateJwtTokenForOTP(deviceId: string, mobile: number, expiresIn: jwt.SignOptions['expiresIn'] = '10m'): string {
    const mobileString = mobile.toString();
    return jwt.sign({ deviceId, mobile: mobileString }, process.env.JWT_SECRET as string, { expiresIn });
  }

  private generateJwtTokenForLogin(userId: string, mobile: number, expiresIn: jwt.SignOptions['expiresIn'] = '1d'): string {
    const mobileString = mobile.toString();
    return jwt.sign({ userId, mobile: mobileString }, process.env.JWT_SECRET as string, { expiresIn });
  }

  private async handleOtpForUser(otp: string, user: User): Promise<string> {
    const otpExpiry = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.isVerified = false;
    await this.userRepository.save(user);
    return otp;
  }

  private OTP_LIMIT = 3;    // 3 attempts
  private OTP_WINDOW = 300; // 5 minutes

  async sendOtp(mobile: string, ip: string): Promise<string> {
    const mobileKey = `otp:mobile:${mobile}`;
    const ipKey = `otp:ip:${ip}`;

    // ✅ Check Mobile Rate Limit
    const mobileRequests = await this.redisService.increment(mobileKey);
    if (mobileRequests === 1) {
      await this.redisService.set(mobileKey, 1, this.OTP_WINDOW);
    } else if (mobileRequests > this.OTP_LIMIT) {
      throw new BadRequestException('Too many OTP requests for this mobile number. Try again later.');
    }

    // ✅ Check IP Rate Limit
    const ipRequests = await this.redisService.increment(ipKey);
    if (ipRequests === 1) {
      await this.redisService.set(ipKey, 1, this.OTP_WINDOW);
    } else if (ipRequests > this.OTP_LIMIT) {
      throw new BadRequestException('Too many OTP requests from this IP. Try again later.');
    }

    const otp = generateOTP();

    // // ✅ Store OTP in Redis with a short expiry
    // await this.redisService.set(`otp:code:${mobile}`, otp, this.OTP_WINDOW);

    console.log(`OTP Sent: ${otp}`);
    return otp;
  }

  // Consolidated login-register logic
  async loginRegister(mobile: string, deviceInfo: any, ip: string) {
    try {
      if(!validateMobile(mobile)) {
        throw new BadRequestException('Invalid mobile number');
      }

      if(!deviceInfo.deviceId) {
        throw new BadRequestException('Invalid Device Id');
      }

      const mobileNumber = parseInt(mobile);
      let existingCustomer = await this.customerRepository.findOneBy({ mobile: mobileNumber });
      let existingUser = await this.userRepository.findOneBy({ mobile: mobileNumber });
      let existingDevice = await this.userDeviceRepository.findOne({ 
        where: { deviceId: deviceInfo.deviceId },
        relations: ['user']
      });

      // Ensure the same device is used for login
      if (existingCustomer && existingUser) {
        if (!existingDevice || existingDevice?.user?.id !== existingUser.id) {
          throw new UnauthorizedException("Unauthorized access: Trying to login with a different device.");
        }
      }

      // Prevent conflicting device registration
      if (!existingCustomer && !existingUser && existingDevice) {
        throw new BadRequestException('Unauthorized access: This device is already registered with another user.');
      }

      let otp = '';
      let otpExpiry = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes

      // If user exists and is not verified, issue an OTP
      if (existingCustomer && existingUser && existingDevice) {
        if (existingUser.otpExpiry > new Date() && existingUser.isVerified === false) {
          const token = this.generateJwtTokenForOTP(existingDevice.deviceId, existingUser.mobile);
          existingDevice.lastConnected = new Date();
          await this.userDeviceRepository.save(existingDevice);
          return token;
        } else {
          otp = await this.sendOtp(existingUser.mobile.toString(), ip);
          await this.handleOtpForUser(otp, existingUser);
          const token = this.generateJwtTokenForOTP(existingDevice.deviceId, existingUser.mobile);
          existingDevice.lastConnected = new Date();
          await this.userDeviceRepository.save(existingDevice);
          return token;
        }
      }

      // Create a new customer if not existing
      if (!existingCustomer) {
        const name = "LEAD_" + parseInt(mobile).toString();
        const customer = this.customerRepository.create({ name, mobile: mobileNumber });
        existingCustomer = await this.customerRepository.save(customer);
      }

      // Create a new user and associate with the customer
      otp = await this.sendOtp(mobileNumber.toString(), ip);
      const user = new User();
      user.mobile = mobileNumber;
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.isVerified = false;
      user.customer = existingCustomer;
      await this.userRepository.save(user);

      // Register device for the user if not already done
      if (!existingDevice) {
        const device = this.userDeviceRepository.create({ 
          deviceId: deviceInfo.deviceId,
          deviceOS: deviceInfo?.deviceOS,
          deviceModel: deviceInfo?.deviceModel,
          deviceType: deviceInfo?.deviceType,
          user: user, 
          customer: existingCustomer,
          registeredOn: new Date(),
          lastConnected: new Date(),
        });
        existingDevice = await this.userDeviceRepository.save(device);
      }

      // Generate JWT token for the user
      const token = this.generateJwtTokenForOTP(existingDevice.deviceId, user.mobile);
      return token;
    } catch (error) {
      throw error;
    }
  }

  // Consolidated OTP verification logic
  async verifyOtp(token: string, otp: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      if (!decoded || !decoded.deviceId || !decoded.mobile) {
        throw new BadRequestException('Invalid token');
      }

      const mobileNumber = parseInt(decoded.mobile);
      const user = await this.userRepository.findOneBy({ mobile: mobileNumber });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.isVerified) {
        throw new BadRequestException('User is already verified');
      }

      if (user.otpExpiry < new Date()) {
        throw new BadRequestException('OTP expired');
      }

      // Validate device
      const device = await this.userDeviceRepository.findOne({ where: { deviceId: decoded.deviceId }, relations: ['user'] });
      if (!device || device.user?.id !== user.id) {
        throw new BadRequestException('Unauthorized access: Trying to login with a different device.');
      }

      // Validate OTP
      const hash = await crypto.createHash('sha256').update(otp).digest('hex');
      if (user.otp !== hash) {   
        throw new BadRequestException('Invalid OTP');
      }

      user.isVerified = true;
      await this.userRepository.save(user);

      device.lastConnected = new Date();
      await this.userDeviceRepository.save(device);

      const _token = this.generateJwtTokenForLogin(user.id, user.mobile);
      return _token;
      
    } catch (error) {
      throw error;
    }
  }
}
