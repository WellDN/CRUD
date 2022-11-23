import express from 'express';
import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library';

const auth = express();
auth.set('views', 'src/views');
auth.set('view engine', 'pug');

const oauth2Client = new google.auth.OAuth2({
  clientId: 'Client id',
  clientSecret:'Client Secret',
  redirectUri: 'http://localhost:8080/auth/google/callback'
});