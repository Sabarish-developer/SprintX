//roleHandler to implement role based access
const roleHandler = (allowedRoles)=>{
    return (req,res,next)=>{
        try{
            if(!allowedRoles.includes(req.user.role)){
                return res.status(403).json({message: "Forbidden Access denied."});
            }
            next();
        }catch(e){
            console.log("Error in role handler block : ",e);
            return res.status(500).json({message: "Internal Server Error. Please try again later."});
        }
    }
}

export default roleHandler;