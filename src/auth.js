
import _ from 'lodash';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import logger from 'utils/logger';
import User from 'db/models/User';


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'tasmanianDevil' // Juan update
};

const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
    console.log('payload received', jwtPayload);

    const user = User.findOne({id: jwtPayload.id}).exec().then((user) => {
        next(null, user);
    }).catch(error => {
        next(null, false);
    });
});

const loginEndpoint = (req, res) => {

    const { email, password } = req.body;

    const user = User.findOne({email: email}).exec().then((user) => {

        if (user.isValidPassword(password)) {
            const payload = {id: user.id};
            const token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({message: "ok", token: token});
        }
        else {
            res.status(401).json({message:"passwords did not match"});
        }

    }).catch(error => {
        res.status(401).json({message:"no such user found"});
    });
}

const signupEndpoint = (req, res, next) => {

    const { email, password } = req.body;

    User.countDocuments({email: email}).exec().then((count) => {

        if (count > 0) {
            res.status(401).json({errors: {email: "A user is already registered with this email address."}});
        }
        else {

            const user = User.register({
                email: email,
                password: password
            }).then(user => {
                const payload = {id: user.id};
                const token = jwt.sign(payload, jwtOptions.secretOrKey);
                res.json({message: "ok", token: token});
            }).catch(validation => {

                const cleanedErrors = {};
                for (const field in validation.errors) {
                    cleanedErrors[field] = validation.errors[field].message;
                }

                logger.error(validation);
                logger.error(`Failed to register user ${email}: ${JSON.stringify(cleanedErrors)}`);
                res.status(401).json({errors: cleanedErrors});
            });
        }
    });
}

export const setupAuthentication = (app) => {
    passport.use(strategy);
    app.use(passport.initialize());
    app.post("/signup", signupEndpoint);
    app.post("/login", loginEndpoint);
}

export const authenticate = () => {
    return passport.authenticate('jwt', { session: false });
}