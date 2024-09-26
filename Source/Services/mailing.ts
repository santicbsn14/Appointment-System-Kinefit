import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
import fs from 'fs'
// import Handlebars  from "handlebars";
import {resolve} from 'path';

const transport = nodemailer.createTransport({
    service:'gmail',
    port:587,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.KEY_MAIL
    }
})

const templatePath= resolve('source/Presentation/Templates/forgotpassword.hbs')
// const source = fs.readFileSync(templatePath).toString()
// const template = Handlebars.compile(source)
export const mailForConfirmAppointment = (userEmail: string) => {
    // const html = template({ userEmail, urlConfirmationToken });

    
    // transport.sendMail({
    //     from: 'Santiago Viale',
    //     to: userEmail,
    //     html: html,
    //     attachments: []
    // });
    transport.sendMail({
        from: 'Santiago Viale',
        to: userEmail,
        html:'<h2>Tu turno ha sido confirmado. Te esperamos en kinefit! </h2>'
    })
};


