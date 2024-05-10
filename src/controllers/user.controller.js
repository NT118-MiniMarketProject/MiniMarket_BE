const {StatusCodes} = require('http-status-codes')

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

module.exports = {
    showCurrentUser
}