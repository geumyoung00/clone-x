import { styled } from 'styled-components';
import { auth, db, storage } from '../firebase';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { InterfaceTweet } from '../components/timeline';
import Tweet from '../components/tweet';
import { Button } from '../components/form-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
  background-color: gray;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    height: 60px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const NameWrapper = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-right: -10px;
`;

const RenameButton = styled(Button)`
  width: 20px;
  height: 20px;
  margin: 0;
  padding: 0;
  border-radius: 0;
  background-color: transparent;

  svg {
    width: 100%;
    height: 100%;
  }

  &[type='submit'] {
    background: #1d9bf0;
    width: auto;
    height: auto;
    padding: 5px;
    border-radius: 3px;
  }
`;

const Form = styled.form`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
`;

const RenameInput = styled.input`
  height: 24px;
  background-color: transparent;
  border: none;
  font-size: 15px;
  padding: 3px;
  color: white;
  text-align: center;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<InterfaceTweet[]>([]);
  const [name, setName] = useState<string>('');
  const [isNameEdit, setIsNameEdit] = useState<boolean>(false);

  const avatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1) {
      const file = files[0];

      if (!user) return;

      // *storage 업로드 방식
      // 1. storage내 위치 설정 - ref
      const locationRef = ref(storage, `avatar/${user?.uid}`);
      // 2. ref에 저장 - uploadBytes
      const result = await uploadBytes(locationRef, file);
      // 3. 저장된 파일의 url 다운로드 - getDownloadURL
      const avatarUrl = await getDownloadURL(result.ref);
      // 4. 컴포넌트 내의 avatar url 업데이트 및 auth 유저 프로필 업데이트 - updatedProfile
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  const nameChange = async (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);

  const renameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    await updateProfile(user, { displayName: name });
    setIsNameEdit(false);
  };

  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, 'tweets'),
      where('userId', '==', user?.uid),
      orderBy('createAt', 'desc'),
      limit(25)
    );

    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createAt, userId, userName, photo } = doc.data();
      return {
        tweet,
        createAt,
        userId,
        userName,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };

  const fetchName = async () => {
    if (!user) return;
    if (user.displayName === null) setName('Anonymous');
    setName(user.displayName!);
  };

  useEffect(() => {
    fetchTweets();
    fetchName();
  }, []);

  return (
    <Wrapper>
      <AvatarUpload htmlFor='avatar'>
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg data-slot='icon' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
            <path d='M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z'></path>
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput id='avatar' type='file' accept='image/*' onChange={avatarChange} />
      <NameWrapper>
        {!isNameEdit ? (
          <>
            <Name>{name}</Name>
            <RenameButton id='rename' onClick={() => setIsNameEdit(true)}>
              <svg
                data-slot='icon'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path d='m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z'></path>
                <path d='M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z'></path>
              </svg>
            </RenameButton>
          </>
        ) : (
          <Form onSubmit={renameSubmit}>
            <RenameInput type='text' onChange={nameChange} value={name} />
            <RenameButton type='submit'>save</RenameButton>
          </Form>
        )}
      </NameWrapper>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
