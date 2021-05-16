exports.get404Page = (req, res, next)=>
{
    res.render('error/404');
}