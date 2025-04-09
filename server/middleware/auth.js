import jwt from 'jsonwebtoken';

const auth = (req,res,next)=>{

    const token = req.headers.authorization;
    
    if(!token){
        return res.status(401).json({message: "Invalid user request."});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    }catch(e){
        if(e.name === "TokenExpiredError")
            return res.status(401).json({message: "Token expired error. Please login again."});
        else
            return res.status(401).json({message: "User not authorized."});
    }
}

export default auth;