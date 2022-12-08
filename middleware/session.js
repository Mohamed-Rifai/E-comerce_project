module.exports = {
    verifyLoginAdmin: (req, res, next) => {
      if (req.session.admin) {
        next();
      } else {
        res.redirect("/admin");
      }
    },
    verifyLoginUser: (req, res, next) => {
      if (req.session.user) {
        next();
      } else {
        res.redirect("/login");
      }
    },
  };