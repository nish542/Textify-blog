// Authentication helpers: Google ID-token verification + app JWT signing.
//
// Flow: the frontend obtains a Google ID token, we verify it here, then issue
// our own short-lived JWT that the client sends as `Authorization: Bearer` on
// protected routes.
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify a Google ID token (the credential from Google Sign-In) and return its
// payload: { sub, email, name, picture, ... }. Throws if the token is invalid
// or was not issued for our GOOGLE_CLIENT_ID.
async function verifyGoogleToken(credential) {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
}

// Issue an app session token for a user document.
function signToken(user) {
  return jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

// Verify an app session token and return its decoded payload ({ id }).
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { verifyGoogleToken, signToken, verifyToken };
