import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { User } from "../../../shared/entities/user.entity";
import { Customer } from "../../../shared/entities/customer.entity";
import { UserDevice } from "../../../shared/entities/user-device.entity";  
import { Payments } from "../../../shared/entities/payments.entity";
import { PAYMENT_STATUSES } from "../../../shared/constants/constants";

@Injectable()
export class DashboardService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
        @InjectRepository(UserDevice)
        private userDeviceRepository: Repository<UserDevice>,
        @InjectRepository(Payments)
        private paymentRepository: Repository<Payments>,
    ) {}
    
        async getDashboardData() {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const endOfMonth = new Date();
            endOfMonth.setDate(endOfMonth.getDate());
            endOfMonth.setHours(23, 59, 59, 999);

            const totalUsers = await this.userRepository.count({
                where: {
                    createdAt: Between(startOfMonth, endOfMonth)
                }
            });

            const totalCustomers = await this.customerRepository.count({
                where: {
                    createdAt: Between(startOfMonth, endOfMonth)
                }
            });

            const totalDevices = await this.userDeviceRepository.count({
                where: {
                    registeredOn: Between(startOfMonth, endOfMonth)
                }
            });
            
            const totalRevenue = await this.paymentRepository.createQueryBuilder('payment')
                .select([
                    'payment.status as status',
                    'SUM(payment.amount) as total'
                ])
                .where('payment.paymentDate BETWEEN :start AND :end', { start: startOfMonth, end: endOfMonth })
                .andWhere('payment.status IN (:...statuses)', { statuses: [PAYMENT_STATUSES.SUCCESS, PAYMENT_STATUSES.PENDING] })
                .groupBy('payment.status')
                .getRawMany();

            const mostPurchasedPlans = await this.paymentRepository
                .createQueryBuilder('payment')
                .select([
                    'payment.plan AS plan', 
                    'COUNT(payment.plan) AS purchaseCount', 
                    'SUM(payment.amount) AS totalRevenue' 
                ])
                .where('payment.paymentDate BETWEEN :start AND :end', { 
                    start: startOfMonth, 
                    end: endOfMonth 
                })
                .andWhere('payment.status IN (:...statuses)', { statuses: [PAYMENT_STATUSES.SUCCESS] })
                .groupBy('payment.plan')
                .orderBy('purchaseCount', 'DESC')
                .limit(5)
                .getRawMany();

            return {
                totalUsers,
                totalCustomers,
                totalDevices,
                totalRevenue,
                mostPurchasedPlans
            };
        }
    
}

