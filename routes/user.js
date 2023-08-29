const bcrypt = require('bcrypt');

exports.signup = async function (req, res) {
   try {
      if (req.method === "POST") {
         const post = req.body;
         const username = post.username;
         const password = post.password;
         const fname = post.first_name;
         const lname = post.last_name;
         const mobile = post.mobile;

         if (username && password) {
            const salt = bcrypt.genSaltSync(10);

            const hashedPassword = bcrypt.hashSync(password, salt);

            const sql = "INSERT INTO `users` (`first_name`, `last_name`, `mobile`, `username`, `password`) VALUES (?, ?, ?, ?, ?)";
            await (await db).execute(sql, [fname, lname, mobile, username, hashedPassword]);

            const message = "Your account has been created successfully.";
            res.send(eta.render('signup', { message: message }));
         } else {
            const message = "Username and password are mandatory fields.";
            res.send(eta.render('signup', { message: message }));
         }
      } else {
         res.send(eta.render('signup', { message: '' }));
      }
   } catch (err) {
      console.error(err);
      const message = "An error occurred while processing your request.";
      res.send(eta.render('signup', { message: message }));
   }
};

exports.login = async function (req, res) {
   try {
      if (req.method === "POST") {
         const post = req.body;
         const username = post.username;
         const password = post.password;

         const sql = "SELECT id, first_name, last_name, username, password FROM `users` WHERE `username` = ?";
         const results = await (await db).execute(sql, [username]);

         if (results.length && bcrypt.compareSync(password, results[0][0].password)) {
            req.session.userId = results[0][0].id;
            req.session.user = results[0][0];
            res.redirect('/home/dashboard');
         } else {
            const message = 'Invalid username or password.';
            res.send(eta.render('index', { message: message }));
         }
      } else {
         res.send(eta.render('index', { message: '' }));
      }
   } catch (err) {
      console.error(err);
      const message = "An error occurred while processing your request.";
      res.send(eta.render('index', { message: message }));
   }
};

exports.dashboard = async function (req, res, next) {
   try {
      const userId = req.session.userId;

      if (!userId) {
         res.redirect("/login");
         return;
      }

      const sql = "SELECT * FROM `users` WHERE `id` = ?";
      const results = await (await db).execute(sql, [userId]);

      res.send(eta.render('dashboard', {data: results[0] }));
   } catch (err) {
      console.error(err);
      res.redirect("/login");
   }
};

exports.profile = async function (req, res) {
   try {
      const userId = req.session.userId;

      if (!userId) {
         res.redirect("/login");
         return;
      }

      const sql = "SELECT * FROM `users` WHERE `id` = ?";
      const results = await (await db).execute(sql, [userId]);

      res.send(eta.render('profile', {data: results[0] }));
   } catch (err) {
      console.error(err);
      res.redirect("/login");
   }
};

exports.logout = function (req, res) {
   req.session.destroy(function (err) {
      if (err) {
         console.error(err);
      }
      res.redirect("/login");
   });
};