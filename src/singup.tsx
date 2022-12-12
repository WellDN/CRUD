import { PrismaClient } from "@prisma/client"
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import express from 'express'
import * as axios from "axios";
import uuid4 from "uuid4";

type Token = {
  id: number | string;
  user: string;
  email: string;
  password: string;
  jti: string;
  refreshToken: Promise<void>;
  userId: string | undefined;
}

type AxiosClient = {
  options: string
  getCurrentAccessToken: string
  getCurrentRefreshToken: Promise<void>
  refreshTokenUrl: Promise<void>
  logout: Promise<void>
  setRefreshedTokens: boolean
}



export function Singup(user: Token, jti: string) {

const prisma = new PrismaClient();

function generateAccessToken() {
    return jwt.sign({ userId: user.id}, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: '5m',
    });
  }
  

  function generateRefreshToken() {
    return jwt.sign({
      userId: user.id,
      jti
    }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: '8h',
    });
  }
  
  function generateTokens(user: string, jti: string) {
    //@ts-ignore
    const accessToken = generateAccessToken(user);
    //@ts-ignore
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
  
  function createUserByEmailAndPassword(user: Token) {
    user.password = bcrypt.hashSync(user.password, 12);
    return prisma.user.create({
      //@ts-ignore
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

  function addRefreshTokenToWhitelist({ jti, refreshToken, userId}: Token) {
    return prisma.refreshToken.create({
      //@ts-ignore
      data: {
        id: jti,//@ts-ignore
        hashedToken: hashToken(refreshToken),
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
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400);
        throw new Error('You must provide an email and a password.');
      }
  
      const existingUser = await findUserByEmail(email);
  
      if (existingUser) {
        res.status(400);
        throw new Error('Email already in use.');
      }
  //@ts-ignore
      const user: string | any = await createUserByEmailAndPassword({ email, password });
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

  router.use('/auth', auth);

  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400);
        throw new Error('You must provide an email and a password.');
      }
  
      const existingUser = await findUserByEmail(email);
  
      if (!existingUser) {
        res.status(403);
        throw new Error('Invalid login credentials.');
      }
  
      const validPassword = await bcrypt.compare(password, existingUser.password);
      if (!validPassword) {
        res.status(403);
        throw new Error('Invalid login credentials.');
      }
  
      const jti = uuid4();
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

function isAuthenticated(req: { headers: { authorization: any; }; payload: string | jwt.JwtPayload; }, res: { status: (arg0: number) => void; }, next: () => any) {
    const { authorization } = req.headers;
  
    if (!authorization) {
      res.status(401);
      throw new Error('🚫 Un-Authorized 🚫');
    }
  
    try {
      const token = authorization.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
      req.payload = payload;
    } catch (err: Error | any) {
      res.status(401);
      if (err.name === 'TokenExpiredError') {
        throw new Error(err.name);
      }
      throw new Error('🚫 Un-Authorized 🚫');
    }
  
    return next();
  }

router.get('/profile', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.payload;
    const user = await findUserById(userId);
    delete user.password;
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.use('/users');

/**/



let failedQueue:[] = [];
let isRefreshing = false;

const processQueue = (error: Error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

 function createAxiosClient({
  options,
  getCurrentAccessToken,
  getCurrentRefreshToken,
  refreshTokenUrl,
  logout,
  setRefreshedTokens,
}: AxiosClient) {
  const client = axios.create(options);

  client.interceptors.request.use(
    (config: { authorization: boolean; headers: { Authorization: string; }; }) => {
      if (config.authorization !== false) {
        const token = getCurrentAccessToken();
        if (token) {
          config.headers.Authorization = "Bearer " + token;
        }
      }
      return config;
    },
    (error: Error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response: Promise<void>) => {

      return response;
    },
    (error: Error) => {
      const originalRequest = error.config;

      originalRequest.headers = JSON.parse(
        JSON.stringify(originalRequest.headers || {})
      );
      const refreshToken = getCurrentRefreshToken();

      
      const handleError = (error: Error) => {
        processQueue(error);
        logout();
        return Promise.reject(error);
      };

      
      if (
        refreshToken &&
        error.response?.status === 401 &&
        error.response.data.message === "TokenExpiredError" &&
        originalRequest?.url !== refreshTokenUrl &&
        originalRequest?._retry !== true
      ) {

        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            //@ts-ignore
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
        isRefreshing = true;
        originalRequest._retry = true;
        return client
          .post(refreshTokenUrl, {
            refreshToken: refreshToken,
          })
          .then((res: { data: { accessToken: string; refreshToken: Promise<void>; }; }) => {
            const tokens = {
              accessToken: res.data?.accessToken,
              refreshToken: res.data?.refreshToken,
            };
            setRefreshedTokens(tokens);
            processQueue(null);

            return client(originalRequest);
          }, handleError)
          .finally(() => {
            isRefreshing = false;
          });
      }

      
      if (
        error.response?.status === 401 &&
        error.response?.data?.message === "TokenExpiredError"
      ) {
        return handleError(error);
      }

     
     
      return Promise.reject(error);
    }
  );
  
  return client;
  }



 return({generateTokens})
}