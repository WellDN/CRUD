import { PrismaClient, RefreshToken, User} from "@prisma/client"
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import express, { NextFunction, Request, Response } from 'express'
import uuid4 from "uuid4";

export type IToken = {
  accessToken: string;
  id: string;
  user: string;
  email: string;
  password: string;
  jti: string;
  refreshToken: string | RefreshToken;
  userId: string | undefined;
} | User

type Refresh = {
  jti: string;
  refreshToken: string;
  userId: string;
}

type EP = {
  existingUser: Promise<void>
} | User | null

type OptionalProperty = {
  password?: string;
} | null


export function Singup() {

const prisma = new PrismaClient();

function generateAccessToken(user: IToken) {
    return jwt.sign({ userId: user.id}, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: '5m',
    });
  }
  

  function generateRefreshToken(user: IToken, jti: string) {
    return jwt.sign({
      userId: user.id,
      jti
    }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: '8h',
    });
  }

  
  function generateTokens(user: IToken, jti: string) {
    
    const accessToken = generateAccessToken(user);
    
    const refreshToken = generateRefreshToken(user, jti);
  
    return {
      accessToken,
      refreshToken,
    };
  }


  function hashToken(token: crypto.BinaryLike) {
    return crypto.createHash('sha512').update(token).digest('hex');
  }

  function findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  
  function createUserByEmailAndPassword(user: IToken) {
    user.password = bcrypt.hashSync(user.password, 12);
    return prisma.user.create({
      data: user
    });
  }


  function findUserById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  function addRefreshTokenToWhitelist({ jti, refreshToken, userId}: Refresh) {
    return prisma.refreshToken.create({
      data: {
        id: jti,
        hashedToken: hashToken(refreshToken as string),
        userId
      },
    });
  }
  

  function findRefreshTokenById(id: string) {
    return prisma.refreshToken.findUnique({
      where: {
        id,
      },
    });
  }
  

  function deleteRefreshToken(id: string) {
    return prisma.refreshToken.update({
      where: {
      id,
      },
      data: {
        revoked: true
      }
    });
  }
  
  function revokeTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: {
        userId
      },
      data: {
        revoked: true
      }
    });
  }

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
      const { email, password }: IToken = req.body;
      if (!email || !password) {
        res.status(400);
        throw new Error('You must provide an email and a password.');
      }
  
      const existingUser = await findUserByEmail(email);
  
      if (existingUser) {
        res.status(400);
        throw new Error('Email already in use.');
      }
  
      const user: IToken = await createUserByEmailAndPassword({
        email, password,
        accessToken: "",
        id: "",
        user: "",
        jti: "",
        refreshToken: "",
        userId: ""
      });
      
      const jti = uuid4();
      
      const { accessToken, refreshToken } = generateTokens(user, jti);
      
      await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });
  
      res.json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  });

  router.use('/auth');

  router.post('/login', async (req, res, next) => {
    try {
      const { email, password }: IToken = req.body;
      if (!email || !password) {
        res.status(400);
        throw new Error('You must provide an email and a password.');
      }
  
      const existingUser: EP = await findUserByEmail(email);
  
      if (!existingUser) {
        res.status(403);
        throw new Error('Invalid login credentials.');
      }
  
      const validPassword = await bcrypt.compare(password, existingUser.password);
      if (!validPassword) {
        res.status(403);
        throw new Error('Invalid login credentials.');
      }
  
      const jti = uuid4(); //validation
      const { accessToken, refreshToken } = generateTokens(existingUser, jti);
      await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.id });
  
      res.json({
        accessToken,
        refreshToken
      });
    } catch (err) {
      next(err);
    }
  });


router.post('/refreshToken', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error('Missing refresh token.');
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
    //@ts-ignore
    const savedRefreshToken = await findRefreshTokenById(payload.jti);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    //@ts-ignore
    const user = await findUserById(payload.userId);
    if (!user) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = uuid4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    next(err);
  }
});


router.post('/revokeRefreshTokens', async (req, res, next) => {
  try {
    const { userId } = req.body;
    await revokeTokens(userId);
    res.json({ message: `Tokens revoked for user with id #${userId}` });
  } catch (err) {
    next(err);
  }
});

//protected routes

function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    const { authorization } = req.headers;
  
    if (!authorization) {
      res.status(401);
      throw new Error('🚫 Un-Authorized 🚫');
    }
  
    try {
      const token = authorization.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
      //@ts-ignore
      req.payload = payload;
    } catch (err) {
      res.status(401);
      if (err === 'TokenExpiredError') {
        throw new Error(err);
      }
      throw new Error('🚫 Un-Authorized 🚫');
    }

    return next();
  }

router.get('/profile', isAuthenticated, async (req, res, next) => {
  try {//@ts-ignore
    const { userId } = req.payload;
    const user: OptionalProperty = await findUserById(userId);
    if(user) {
    delete user.password;
  }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.use('/users');

/**/
 return
}