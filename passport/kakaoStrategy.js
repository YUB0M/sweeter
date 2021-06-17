const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
        profileFields: ['id', 'email', 'birthday']
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao' },
            });
            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email:profile._json && profile._json.kakao_account.email,
                    userid:profile.displayName,
                    snsId:profile.id,
                    provider:'kakao',
                    // birth_mm:profile._json && profile._json.kakao_account.birthday.substr(1,2),
                    // birth_dd:profile._json && profile._json.kakao_account.birthday.substr(3,4),
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};