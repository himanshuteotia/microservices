import axios from "axios";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Authorization header not found or invalid");
  }

  const token = authHeader.split(" ")[1];
  const action = req.method;

  axios
    .post("http://localhost:9000/authorize", { token, action })
    .then((response) => {
      if (response.status === 200) {
        next();
      } else {
        res.status(403).send("Access Denied");
      }
    })
    .catch((error) => {
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).send("Internal Server Error");
      }
    });
}
