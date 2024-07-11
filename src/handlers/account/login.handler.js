import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createClient } from "redis";
import express from "express";

// / 로그인 API /
const router = express.Router();

const loginHandler = router.post("/login", async (req, res, io) => {
  const { username, password } = req.body;

  {
    const client = createClient();
    client.on("error", (err) => console.log("Redis Client Error", err));
    await client.connect();

    await client.set(username, password); // 테스트용 코드 (key : value 형식)

    const user = await client.get(username);
    const saltRounds = await bcrypt.genSalt(10); // 테스트용 코드
    const hashedPassword = await bcrypt.hash(password, saltRounds); // 테스트용 코드
    if (!user)
      return res.status(401).json({ message: "존재하지 않는 계정입니다." });
    else if (!(await bcrypt.compare(password, hashedPassword)))
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    // bcrypt.compare 변경해야함 테스트용 코드

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
  }
});

export default loginHandler;

// 공용 redis 설정 예시. ex
// createClient({
//     url: 'redis://alice:foobared@awesome.redis.server:6380'
//   });
// 현재는 로컬 호스트 redis 사용중
