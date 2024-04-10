const bcrypt = require('bcryptjs')

const passwordHash = async(password) => {
    const salt = await bcrypt.genSalt(10)
    const hassPassword = await bcrypt.hash(password, salt)
    return hassPassword
}

const ComparePassword = async(Inputpassword, userPassword) => {
    const isMatch = await bcrypt.compare(Inputpassword, userPassword)
    return isMatch
}

module.exports = {
    passwordHash,
    ComparePassword
}