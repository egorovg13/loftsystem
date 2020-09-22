const jwt = require('jsonwebtoken')

function createTokens(user, secret) {
    const accessToken = jwt.sign(
        {
            user: {id: user.id}
        },
        secret,
        {
            expiresIn: '3m'
        }
    )

    const refreshToken = jwt.sign(
        {
            user: {id: user.id}
        },
        secret,
        {
            expiresIn: '6m'
        }
    )

    const verifyAccess = jwt.verify(accessToken, secret)
    const verifyRefresh = jwt.verify(refreshToken, secret)

    return {
        accessToken,
        refreshToken,
        accessTokenExpiredAt: verifyAccess.exp * 1000,
        refreshTokenExpiredAt: verifyRefresh.exp * 1000
    }
}

function refreshTokens(refreshToken, secret) {
    try {
        var user = jwt.verify(refreshToken, secret).user
    } catch (error) {
        return {}
    }

    return createTokens(user, secret);
}

module.exports = {
    createTokens,
    refreshTokens
}