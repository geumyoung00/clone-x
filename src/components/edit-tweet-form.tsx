import { useState } from 'react';
import { InterfaceTweet } from './timeline';
import styled from 'styled-components';
import {
  BtnWrapper,
  CancelButton,
  Column,
  DeleteButton,
  EditButton,
  ModifyTextArea,
  Photo,
  SaveButton,
  Username,
} from './tweet-form-components';

interface editTweet extends InterfaceTweet {
  setIsEdit: () => void;
}

export default function EditTweetForm({ userName, photo, tweet, userId, id, setIsEdit }: editTweet) {
  const [newTweet, setNewTweet] = useState(tweet);
  const onChangeTweet = (e: React.ChangeEvent<HTMLTextAreaElement>) => setNewTweet(e.target.value);

  // 작성된 트윗 수정
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    // 등록된 이미지 수정
    if (files && files.length === 1 && files[0].size < 1 * 1024 * 1024) {
      //썸네일만들기
      const previewUrl = URL.createObjectURL(files[0]);
    }
  };

  const handleDeleteFile = () => {
    const ok = confirm(`are you sure want to DELETE this Photo?`);
    // if (ok) setEditPhoto(undefined);
  };

  return (
    <>
      <Column>
        <Username>{userName}</Username>
        <ModifyTextArea rows={5} maxLength={180} onChange={onChangeTweet} value={newTweet} />
        <BtnWrapper>
          <SaveButton onClick={setIsEdit}>save</SaveButton>
          <CancelButton onClick={setIsEdit}>Cancel</CancelButton>
        </BtnWrapper>
      </Column>
      <Column>
        {photo ? <Photo src={photo} /> : null}
        <>
          <EditButton>Edit Photo</EditButton>
          <DeleteButton>Delete Photo</DeleteButton>
        </>
      </Column>
    </>
  );
}
