import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createClient } from "redis";
import express from "express";

// / 로그인 API /
const router = express.Router();

const loginHandler = router.post("/login", async (req, res, io) => {
  const { username, password } = req.body;

  try {
    const client = createClient({
      username: "default", // use your Redis user. More info https://redis.io/docs/latest/operate/oss_and_stack/management/security/acl/
      password: "1234", // use your password here
      socket: {
        host: "3.22.236.177",
        port: 6379,
      },
    });
    client.on("error", (err) => console.log("Redis Client Error", err));
    await client.connect();

    await client.set(username, password);

    const user = await client.get(username);
    if (!user)
      return res.status(401).json({ message: "존재하지 않는 계정입니다." });
    else if (!(await bcrypt.compare(password, user)))
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

    const token = jwt.sign(
      {
        type: "JWT",
        user_id: user.id,
      },
      "10",
      {
        expiresIn: "60m",
      },
    );

    console.log("로그인 성공\nuserData:", user);
    res.setHeader("authorization", `Bearer ${token}`);

    return res.status(200).json({ message: "로그인 성공", data: username });
  } catch (error) {
    console.error("로그인에 오류 발생!", error);
    return res.status(500).json("Server Error: 500");
  }
});

export default loginHandler;
