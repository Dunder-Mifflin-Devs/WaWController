module.exports = {
    performLogout: (req, res) => {
        req.logout();
        res.clearCookie('oauth_token');
        res.redirect('/');
    }
}