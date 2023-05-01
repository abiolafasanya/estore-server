import { Request, Response } from 'express';
import Auth from '../model/User';
// import generateAuthToken from '../utils/generate';
import jwt from 'jsonwebtoken';
import config from '../config/';
import { mailService } from '../utils/Email';

export default class AuthController {
  static signUp = async (req: Request, res: Response) => {

    const user = new Auth(req.body);

    await user
      .save()
      .then((user) => {
        res.status(200).json({
          success: true,
          message: 'User created successfully',
          data: user,
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  public static authenticate = async (req: Request, res: Response) => {
    let { username, email, password } = req.body;
    if (email == undefined && username == undefined)
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password',
      });
    if (password == undefined)
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password',
      });

    try {
      let user;
      if (username) user = await Auth.findOne({ username });

      if (email) user = await Auth.findOne({ email });

      if (user) {
        let isMatch = await user.comparePassword(password);
        if (isMatch) {
          // const token = await generateAuthToken(user);
          let payload = {
            id: user._id,
            email: user.email,
            username: user.username,
          };
          let accessToken = jwt.sign(payload, config.secret.jwt, {
            expiresIn: '15m',
          });
          let refreshToken = jwt.sign(payload, config.secret.refresh, {
            expiresIn: '1d',
          });

          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: false,
            // domain: config.client_redirect || 'http://localhost:5173',
          });

          const data = {id: user._id, email: user.email, username: user.username}
          console.log(data);
          
          return res.status(200).json({
            success: true,
            message: 'Login successful',
            data,
            accessToken: accessToken,
          });
          
        } else {
          return res.status(400).json({
            success: false,
            message: 'Incorrect username or password',
          });
        }
      }
      return res.status(400).json({ message: 'Invalid username or password' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  public static logout = async (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    console.log(req.session);
    req.session.destroy((err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Error logging out',
        });
      } else
        res.status(200).json({
          success: true,
          message: 'Logged out successfully',
        });
    });
  };

  public static verify = async (req: Request, res: Response) => {
    try {
      const verificationToken = req.params.id;
      console.log('Token received from server: ' + verificationToken);

      const auth = await Auth.findOne({ verificationToken });
      if (!auth) {
        return res.status(403).json('Invalid credentials');
      }
      auth.verified = true;
      auth.verificationToken = '';
      await auth.save();
      await mailService({
        email: auth.email,
        name: auth.username,
        subject: 'Account verified',
        link: config.verify_url,
        view: 'verify.ejs',
      });
      res.status(200).render('activated', { name: auth.username || 'User' });
      return;
    } catch (error: unknown) {
      console.log(error);
      throw new Error(error as any);
    }
  };
}
