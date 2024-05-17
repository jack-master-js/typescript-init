import jwt from 'jsonwebtoken';
import { User } from '../entity/User';

export default async (req: any, res: any, next: any) => {
    // const token = req.headers.authorization
    const { token } = req.body;
    try {
        const decode: any = jwt.verify(token, process.env.TOKEN_SECRET);
        const { email } = decode;
        const user = await User.findOne({ email });

        if (user) {
            next();
        } else {
            throw Error('invalid token');
        }
    } catch (error) {
        res.error(error);
    }
};
