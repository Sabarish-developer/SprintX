const generateOTP = ()=>{
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let otp = "";
    for(let i=0; i<6; i++){
        otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    //Expires is set for 5 minutes
    const expires = Date.now() + 1000 * 60 * 5;

    return {otp,expires};
};

export default generateOTP;