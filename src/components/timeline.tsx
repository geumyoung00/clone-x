import { collection, limit, onSnapshot, orderBy, query, Unsubscribe } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import Tweet from './tweet';

export interface InterfaceTweet {
  id: string;
  tweet: string;
  userId: string;
  userName: string;
  createAt: number;
  photo?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<InterfaceTweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchTweets = async () => {
      const tweetsQuery = query(
        //collection 호출
        collection(db, 'tweets'),
        // 등록일 기준으로 최신순 정렬
        orderBy('createAt', 'desc'),
        limit(25)
      );

      // 아래의 경우 DB 변화에 따른 호출이 되지 않음
      // const snapshot = await getDocs(tweetsQuery);
      // const tweets = snapshot.docs.map((doc) => {
      //   const { tweet, createAt, userId, userName, photo } = doc.data();
      //   return {tweet, createAt, userId,  userName, photo, id: doc.id, };
      // });

      unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
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
      });
    };

    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
