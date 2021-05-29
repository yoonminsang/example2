import passport from 'passport';
import Strategy from 'passport-local';
import pool from '../pool';
import bcrypt from 'bcrypt';
const LocalStrategy = Strategy.Strategy;
const PassportConfig = () => {
  passport.serializeUser((user, done) => {
    console.log('serialize', user, done);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const [[user]] = await pool.query(
      `SELECT id, email, grade FROM users WHERE id=${id}`
    );
    console.log('deserializeUser', id, user);
    done(null, user);
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        const [[user]] = await pool.query(
          `SELECT * FROM users WHERE email='${email}'`
        );
        if (user) {
          const match = await bcrypt.compare(password, user.password);
          if (match) return done(null, user);
          return done(null, false);
        }
        return done(null, false);
      }
    )
  );
  // local();
  // kakao();
};
export default PassportConfig;
