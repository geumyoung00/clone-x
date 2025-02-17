import { InterfaceTweet } from './timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';
import {
  BtnWrapper,
  Column,
  DeleteButton,
  EditButton,
  Payload,
  Photo,
  Username,
  Wrapper,
} from './tweet-form-components';
import EditTweetForm from './edit-tweet-form';

export default function Tweet({ userName, photo, tweet, userId, id, createAt }: InterfaceTweet) {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const props = { userName, photo, tweet, userId, id, createAt };
  const user = auth.currentUser;

  const onDelete = async () => {
    const ok = confirm(`Are you sure want to DELETE this tweet?`);
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
    }
  };

  const handleEdit = () => setIsEdit((prev) => !prev);

  return (
    <Wrapper>
      {!isEdit ? (
        <>
          <Column>
            <Username>{userName}</Username>
            <Payload>{tweet}</Payload>
            {user?.uid === userId ? (
              <BtnWrapper>
                <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                <EditButton onClick={handleEdit}>Edit</EditButton>
              </BtnWrapper>
            ) : null}
          </Column>
          <Column>{photo ? <Photo src={photo} /> : null}</Column>
        </>
      ) : (
        <>
          <EditTweetForm setIsEdit={handleEdit} {...props} />
        </>
      )}
    </Wrapper>
  );
}
