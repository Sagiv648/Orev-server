
export const privilegedAuth = (req,res,next) => {

    const test = req.data
    console.log("admin auth");
    if(test.privilege_ring == 2)
        return res.status(403).json({Error: "Access denied"})
    next()


}

export const privilegeRingOneAuth = (req,res,next) => {

    const test = req.data;

    console.log("admin auth - ring 1");

    if(test.privileged_token && test.privilege.privilege_ring <= 1)
    next()
    else
    res.status(403).json({Error: "Access denied"})

}
export const privilegeRingZeroAuth = (req,res,next) => {

    const test = req.data;

    console.log("admin auth - ring 0");
    if(test.privileged_token && test.privilege.privilege_ring == 0)
    next()
    else
    res.status(403).json({Error: "Access denied"})

}