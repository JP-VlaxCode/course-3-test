const bcrypt = require('bcrypt');

// Función para validar una dirección de correo electrónico
function isValidEmail(email) {
   const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
   return emailRegex.test(email);
}

exports.subscribe = async function (req, res) {
   try {
      let message = '';
      let errorMessage = '';

      if (req.method === "POST") {
         const post = req.body;
         const name = post.name || null;
         const email = post.email;

         if (email && isValidEmail(email)) {

            const sql = "INSERT INTO `subscribers` (`name`, `email`) VALUES (?, ?)";
            await (await db).execute(sql, [name, email]);

            message = "Congratulations! Your email address " + email + " has been registered successfully to the Newsletter.";
         } else {
            errorMessage = "Invalid email or email is mandatory.";
         }
      }

      res.send(eta.render('subscribe', { message, errorMessage }));
   } catch (err) {
      console.error(err);
      const errorMessage = "An error occurred while processing your request.";
      res.send(eta.render('subscribe', { errorMessage }));
   }
};


