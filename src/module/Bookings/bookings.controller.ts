import { Request, Response } from "express";
import { bookingServices } from "./bookings.service";

const createBookings= async(req:Request,res:Response)=>{


    try {

        const result = await  bookingServices.createBookings(req.body);
        res.status(201).json({
            status:true,
            message: "Booking created successfully",
            data: result.rows
        })
        return result
    } catch (error:any) {
         res.status(404).json(
{
            success: false,
            message: error.message,
            errors: error.message
        }
        )
    }



}

const getBookingDetails= async (req:Request,res:Response) => {
    

    try{

        const result = await bookingServices.getBookingDetails();
        
        res.status(200).json({
            status: true,
            message:"Bookings retrieved successfully",
            data: result.rows
        })
    }catch(error:any){

            
        res.status(404).json({
            
            success: false,
            message: error.message,
            errors: error.message
        })
    }
}

const getSingleBookingDetails = async(req:Request,res:Response)=>{

    try {
        const result = await bookingServices.getSingleBookingDetails(req.params.id!)
        res.status(200).json({
            success: true,
            message:"Your bookings retrieved successfully",
            data: result.rows
        })
        return result
    } catch (error:any) {
        res.status(500).json({
            success:false,
            message: error.message,
            errors: error.message
        })
    }

}

const updateBookings= async (req:Request, res: Response)=>{

    const {status}= req.body

    try {
        const result = await bookingServices.updateBookings(req.params.id!,req.body)

        if(status==="cancelled"){
            res.status(200).json({
                success:true,
                message: "Booking cancelled successfully",
                data: result
            })

        }

        if(status==="returned"){
             res.status(200).json({
                success:true,
                message: "Booking marked as returned. Vehicle is now available",
                data: result
            }) 
        }
return result


    } catch(err:any){
        res.status(404).json(
{
            success: false,
            message: err.message,
            errors: err.message
        }
        )
    }


}

export const bookingControllers={
    createBookings,
    getBookingDetails,
    getSingleBookingDetails,
    updateBookings
}

