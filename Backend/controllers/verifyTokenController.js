const jwt = require("jsonwebtoken");

const verifyToken = (req, res) => {
  const { token } = req.body;
  
  try{
    const decoded = jwt.verify(token, process.env.SECRET);
    res.send( { id: decoded.id, username: decoded.username});
  }catch(err){
    return res.status(403).json("Unauthorised access");
  }
};

module.exports = verifyToken;