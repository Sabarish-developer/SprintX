import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.EMAIL , 
        pass: process.env.APP_PASSWORD
    }
});

const sendOTPEmail = async(email,otp)=>{
    
    console.log(process.env.EMAIL,process.env.APP_PASSWORD);
    if(!process.env.EMAIL || !process.env.APP_PASSWORD){
        console.log("Email credentials are missing.");
        return;
    }
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Sprintx OTP Verification",
        text: `Your OTP for verification is ${otp}. It is valid for only 5 minutes`
    };

    try{
        await transporter.sendMail(mailOptions);
        console.log("Mail sent successfully");
    }catch(e){
        console.log("Error is sending email : ",e);
    }
};

export default sendOTPEmail;