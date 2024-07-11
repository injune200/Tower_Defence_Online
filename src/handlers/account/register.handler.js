// import { addUser } from '../models/user.model.js';
// import { getUser } from './userData.handler.js';

const registerHandler = async (req, res, io) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: '유저 이름과 비밀번호를 입력해주세요.' });
        }

        // username을 key값으로 userData 불러오기
        // const existingUser = JSON.parse(await getUser(username));

        if (existingUser) {
            return res.status(400).json({ message: '이미 존재하는 사용자 이름입니다.' });
        }

        // const newUser = await addUser(username, password);

        res.status(201).json({
            message: '유저가 생성되었습니다',
            user: {
                uuid: newUser.uuid,
                username: newUser.username,
            },
        });
        io.emit('user-registered', { username: newUser.username, uuid: newUser.uuid });
    } catch (error) {
        console.log('회원 가입중 에러 발생', error);
        res.status(500).json({ message: '서버 오류 발생' });
    }
};

export default registerHandler;

