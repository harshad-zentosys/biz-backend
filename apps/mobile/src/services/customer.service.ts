import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";
import { Customer } from "../../../shared/entities/customer.entity";
import { User } from "../../../shared/entities/user.entity";
import { USER_ROLES } from "../../../shared/constants/constants";
import { CustomerAddress } from "../../../shared/entities/customer-address.entity";
import { validateEmail, validateMobile } from "../../../shared/helper/validation";
@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(CustomerAddress)
        private readonly customerAddressRepository: Repository<CustomerAddress>,
    ) {}
    async updateCustomer(user: User, body: {
        partnerCode: string,
        address: string,
        country: string,
        state: string,
        city: string,
        pincode: string,
        telephone: string,
        website: string,
    }) {
        try {
            if(user.role != USER_ROLES.OWNER) {
                throw new UnauthorizedException("You are not authorized to perform this action");
            }

            const existingUser = await this.userRepository.findOne({ where: { id: user.id }, relations: ['customer'] });

            if(!existingUser?.customer) {
                throw new BadRequestException("Customer not found");
            }

            let customerAddress = await this.customerAddressRepository.findOneBy({ customer: { id: existingUser?.customer?.id } });
            if (!customerAddress) {
                customerAddress = new CustomerAddress();
            }

            customerAddress.address = body?.address || customerAddress.address;
            customerAddress.country = body?.country || customerAddress.country;
            customerAddress.state = body?.state || customerAddress.state;
            customerAddress.city = body?.city || customerAddress.city;
            customerAddress.pincode = body?.pincode || customerAddress.pincode;
            customerAddress.telephone = parseInt(body?.telephone) || customerAddress.telephone;
            customerAddress.website = body?.website || customerAddress.website;

            const updatedCustomerAddress = await this.customerAddressRepository.save(customerAddress);

            await this.customerRepository.update(existingUser?.customer?.id, {
                address: updatedCustomerAddress,
                partnerCode: body?.partnerCode || existingUser?.customer?.partnerCode,
            });

            return updatedCustomerAddress;
        } catch (error) {
            throw error;
        }
    }
    
    async addUser(user: User, body: {
        email: string,
        firstName: string,
        lastName: string,
        mobile: string,
    }) {
        try {
            if(!body.mobile || !validateMobile(body.mobile)) {
                throw new BadRequestException("Invalid mobile number");
            }

            if(body.email && !validateEmail(body.email)) {
                throw new BadRequestException("Invalid email");
            }

            let filter: FindOptionsWhere<User>[] = [];
            if(body.email) {
                filter = [
                    { email: body.email },
                    { mobile: parseInt(body.mobile) }
                ];
            } else {
                filter = [{ mobile: parseInt(body.mobile) }];
            }
            
            const existingUser = await this.userRepository.findOne({ 
                where: filter
            });
            if (existingUser) {
                throw new BadRequestException("User already exists with same mobile number or email");
            }

            const newUser = new User();
            newUser.email = body.email || null;
            newUser.firstName = body.firstName || null;
            newUser.lastName = body.lastName || null;
            newUser.mobile = parseInt(body.mobile);
            newUser.role = USER_ROLES.USER;
            newUser.customer = user.customer;
            const savedUser = await this.userRepository.save(newUser);
            return savedUser;
        } catch (error) {
            throw error;
        }
    }
}

