import jwt from 'jsonwebtoken'

const jwt_secret_key=process.env.secret_key

export const authMiddleware = (req, res,next) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        res.status(401).send('Access Denied')
    }

    try {
        const existingUser = jwt.verify(token,jwt_secret_key)
        req.user = existingUser
        next()
    }
    catch (e) {
        res.status(403).send('Invalid Token');
    }
}