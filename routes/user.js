exports.signup = function (req, res) {
   message = '';
   if (req.method == "POST") {
      var post = req.body;
      var username = post.username;
      var password = post.password;
      var fname = post.first_name;
      var lname = post.last_name;
      var mobile = post.mobile;
      if (username != '' && password != '') {
         var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mobile`,`username`, `password`) VALUES ('" + fname + "','" + lname + "','" + mobile + "','" + username + "','" + password + "')";

         db.query(sql).then(message => {
            message = "Your account has been created succesfully.";
            res.render('signup.ejs', { message: message });
         }).catch(err => console.log(err))
      } else {
         message = "Username and password is mandatory field.";
         res.render('signup.ejs', { message: message });
      }

   } else {
      res.render('signup');
   }
};

exports.login = function (req, res) {
   var message = '';

   if (req.method == "POST") {
      var post = req.body;
      var username = post.username;
      var password = post.password;

      var sql = "SELECT id, first_name, last_name, username FROM `users` WHERE `username`='" + username + "' and password = '" + password + "'";
      db.query(sql).then(results => {
         if (results.length) {
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/home/dashboard');
         }
         else {
            message = 'You have entered invalid username or password.';
            res.render('index.ejs', { message: message });
         }
      }).catch(err => {
         console.log(err);
         message = 'You have entered invalid username or password.';
         res.render('index.ejs', { message: message });

      })
   } else {
      res.render('index.ejs', { message: message });
   }

};


exports.dashboard = function (req, res, next) {

   var user = req.session.user,
      userId = req.session.userId;
   console.log('ddd=' + userId);
   if (userId == null) {
      res.redirect("/login");
      return;
   }

   var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
   db.query(sql).then(results => {
      res.render('dashboard.ejs', { data: results });
   }).catch(err => console.log(err))
};

exports.profile = function (req, res) {

   var userId = req.session.userId;
   if (userId == null) {
      res.redirect("/login");
      return;
   }

   var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
   db.query(sql).then(result => {
      res.render('profile.ejs', { data: result });
   }).catch(err => console.log(err))
};

exports.logout = function (req, res) {
   req.session.destroy(function (err) {
      res.redirect("/login");
   })
};