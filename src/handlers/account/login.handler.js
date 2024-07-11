import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
// import { getUser } from './userData.handler.js';

// / 로그인 API /
const loginHandler = async (req, res) => {
    // 요청받은 데이터 accountId, accountPassword를 저장합니다.
    const { username, password } = req.body;

    try {
        // username을 key값으로 data 불러오기
        // const account = JSON.parse(await getUser(username));

        // 해당 계정id가 DB에 존재하지 않는 계정id라면, 해당 사실을 알립니다.
        if (!account) return res.status(401).json({ message: '존재하지 않는 계정입니다.' });
        // 입력받은 사용자의 비밀번호와 데이터베이스에 저장된 비밀번호를 비교합니다.
        else if (!(await bcrypt.compare(password, account.password)))
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        // jwt token 생성
        const token = jwt.sign(
            {
                type: 'JWT',
                user_id: account.uuid,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '60m', // 60분 후 만료
            },
        );
        console.log('로그인 성공\nuserData:', account);
        res.cookie('authorization', `Bearer ${token}`);
        //쿠키나, 로컬 스토리지를 사용
        return res.status(200).json({ message: '로그인 성공', account_id: account.account_id });
    } catch (error) {
        console.error('로그인에 오류 발생!', error);
        return res.status(500).json('Server Error: 500');
    }
};

export default loginHandler;
