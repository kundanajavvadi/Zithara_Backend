import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // If there's no Authorization header or it's not in 'Bearer <token>' format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Authorization token is missing or invalid", success: false });
  }

  const token = authHeader.split(' ')[1]; // Extract the token part

  // If no token is found
  if (!token) {
    return res.status(401).json({ message: "Token is missing.", success: false });
  }

  // Verify the token using the JWT secret
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token", success: false });
    }
    console.log('Decoded Token:', decodedToken);
    // Assuming the JWT payload contains a 'userId'
    req.user = decodedToken;  // Attach the entire decoded token or just decodedToken.userId if needed
    next();  // Proceed to the next middleware or route handler
  });
};

export default isAuthenticated;
