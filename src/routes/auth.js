import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../pool';
import passport from 'passport';
const router = express.Router();

// router.get('/success', (req, res) => {
//   console.log('success');
//   return res.json({ status: 200, text: '로그인 성공' });
// });
// router.get('/fail', (req, res) => {
//   return res.json({ status: 409, text: '아이디 또는 비밀번호가 틀립니다.' });
// });

// router.post(
//   '/login',
//   passport.authenticate('local', {
//     successRedirect: '/auth/success',
//     failureRedirect: '/auth/fail',
//   })
// );
router.get('/', (req, res) => {
  const user = req.user || null;
  return res.json({ status: 200, user });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.json({
        status: 409,
        text: '아이디 또는 비밀번호가 틀립니다.',
      });
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/auth');
    });
  })(req, res, next);
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const [[existEamil]] = await pool.query(
    `SELECT EXISTS (SELECT * FROM users WHERE email='${email}') as exist`
  );
  if (existEamil.exist)
    return res.json({ status: 409, text: '아이디가 존재합니다' });
  const hash = await bcrypt.hash(password, 10);
  try {
    await pool.query(
      `INSERT INTO users(email, password) VALUES('${email}', '${hash}')`
    );
    return res.json({ status: 200, text: '회원가입을 축하합니다' });
  } catch (e) {
    console.error('register error', e);
  }
});

router.get('/logout', function (req, res) {
  req.logout();
  req.session.destroy();
  res.redirect('/auth');
});

export default router;
