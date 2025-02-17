import styled from 'styled-components';
import { InterfaceTweet } from './timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 100px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin: auto 0 0;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  width: fit-content;
`;

export default function Tweet({ userName, photo, tweet, userId, id }: InterfaceTweet) {
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm(`Are you sure you want to DELETE this tweet?`);
    if (!ok || user?.uid !== userId) return;

    try {
      // firestore document 삭제
      await deleteDoc(doc(db, 'tweets', id));
      // 작성된 doc에 photo 정보가 있으면 storage에서 연결된 photo 데이터 삭제
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{userName}</Username>
        <Payload>{tweet}</Payload>

        {user?.uid === userId ? <DeleteButton onClick={onDelete}>Delete</DeleteButton> : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
