import { useState } from 'react';
import { InterfaceTweet } from './timeline';
import styled from 'styled-components';

import {
  AttachFileButton,
  AttachFileInput,
  BtnWrapper,
  CancelButton,
  Column,
  DeleteButton,
  ModifyTextArea,
  Photo,
  SaveButton,
  Username,
} from './form-components';

import { auth, db, storage } from '../firebase';
import { deleteField, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

interface editTweet extends InterfaceTweet {
  setIsEdit: () => void;
}

const Form = styled.form`
  &:has(img) {
    display: grid;
    grid-template-columns: 4fr 100px;
    gap: 20px;
  }
`;

const AddPhotoLabel = styled(AttachFileButton)`
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
`;
const AddPhotoInput = styled(AttachFileInput)``;

export default function EditTweetForm({ userName, photo, tweet, id, setIsEdit }: editTweet) {
  const [newTweet, setNewTweet] = useState(tweet);
  const [newPhoto, setNewPhoto] = useState<string | undefined | File>(photo);
  const [thumbnail, setThumbnail] = useState<null | string>(null);
  const onChangeTweet = (e: React.ChangeEvent<HTMLTextAreaElement>) => setNewTweet(e.target.value);
  const user = auth.currentUser;

  // 작성된 트윗 수정

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    // 등록된 이미지 수정
    if (files && files.length === 1 && files[0].size < 1 * 1024 * 1024) {
      //썸네일만들기
      const previewUrl = URL.createObjectURL(files[0]);
      setThumbnail(previewUrl);
      setNewPhoto(files[0]);
    }
  };

  const handleDeleteFile = () => {
    const ok = confirm(`are you sure want to DELETE this Photo?`);
    if (ok) setNewPhoto(undefined);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const docRef = doc(db, 'tweets', id);
    const locationRef = ref(storage, `tweets/${user?.uid}/${id}`);
    const ok = confirm('Are you want to EDIT this tweet?');

    if ((tweet === newTweet && !photo) || (photo && photo === newPhoto && tweet === newTweet))
      alert('Did not EDIT this Tweet');

    if (!ok) return;

    try {
      if (!photo || tweet !== newTweet) {
        await updateDoc(docRef, { tweet: newTweet });
      }

      if (photo && !newPhoto) {
        //사진을 삭제한 경우
        await deleteObject(locationRef);
        await updateDoc(docRef, { photo: deleteField() });
      }

      if (photo && typeof newPhoto === 'object') {
        // 사진을 교체한 경우
        // 1. storage에 새로운 이미지를 등록 후 결과 URL 받아오기
        const result = await uploadBytes(locationRef, newPhoto);
        const url = await getDownloadURL(result.ref);

        // 2. 새로 등록된 이미지 주소로 tweet updated
        await updateDoc(docRef, { photo: url });
      }
    } catch (error) {
    } finally {
      setThumbnail(null);
      setIsEdit();
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Column>
        <Username>{userName}</Username>
        <ModifyTextArea name='editTweet' rows={5} maxLength={180} onChange={onChangeTweet} value={newTweet} required />
        <BtnWrapper>
          <SaveButton type='submit'>save</SaveButton>
          <CancelButton type='button' onClick={setIsEdit}>
            Cancel
          </CancelButton>
        </BtnWrapper>
      </Column>
      {newPhoto ? (
        <Column>
          {typeof newPhoto === 'string' && !thumbnail ? <Photo src={photo} /> : <Photo src={thumbnail!} />}
          <AddPhotoLabel htmlFor='addPhoto'>Edit Photo</AddPhotoLabel>
          <AddPhotoInput id='addPhoto' type='file' accept='image/*' onChange={onFileChange} />
          <DeleteButton type='button' onClick={handleDeleteFile}>
            Delete Photo
          </DeleteButton>
        </Column>
      ) : null}
    </Form>
  );
}
