
exports.index = function (req, res) {
  res.send(eta.render('index', { message: "" }));
};
