module.exports ={
    loggedIn: function (req, res, next) {
        console.log(req.baseUrl)
        
        // validar usuario logeado
        if(!req.user){
            return res.redirect('/login');
        }
        next();
    }
}