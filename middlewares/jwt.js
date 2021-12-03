import jwt from "express-jwt";

//const secret = process.env.JWT_SECRET;
const secret = "abcdefghijklmnopqrstuvwxyz1234567890";

const authenticate = jwt({
	secret: secret
});


export default authenticate;