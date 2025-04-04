import { AuthGuard } from "../guards/auth.guard";
import { CustomerGuard } from "../guards/customer.guard";
import { RequestWithUser } from "../interfaces/express.interface";
import { CustomerService } from "../services/customer.service";
import { Controller, Post, UseGuards, Req, Body, HttpCode, HttpStatus, Res } from "@nestjs/common";
import { Response } from 'express';

@Controller("customer")
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService, 
    ) {}

    @Post("update")
    @UseGuards(AuthGuard, CustomerGuard)
    async updateCustomer(@Req() req: RequestWithUser, @Body() body: {
        partnerCode: string,
        address: string,
        country: string,
        state: string,
        city: string,
        pincode: string,
        telephone: string,
        website: string,
    }, @Res() res: Response) {
        try {
            const customer = await this.customerService.updateCustomer(req.user, body);
            // return { message: "Customer updated successfully", customer, status: HttpStatus.OK };
            return res.status(HttpStatus.OK).json({
                message: "Customer updated successfully",
                customer,
                status: HttpStatus.OK
            })
        } catch (error) {
            const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error.message || "Internal Server Error !!!"
            return res.status(status).json({message, status})
        }
    }

    @Post("add-user")
    @UseGuards(AuthGuard, CustomerGuard)
    async addUser(@Req() req: RequestWithUser, @Body() body: {
        email: string,
        firstName: string,
        lastName: string,
        mobile: string,
    }, @Res() res: Response) {
        try {
            await this.customerService.addUser(req.user, body);
            return res.status(HttpStatus.OK).json({
                message: "User added successfully",
                status: HttpStatus.OK
            })
        } catch (error) {
            console.error(error);
            const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error.message || "Something went wrong during user addition"
            return res.status(status).json({message, status})
        }
    }
}
    
