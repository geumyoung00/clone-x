import { addDoc, collection, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import styled from 'styled-components';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Form, TextArea } from './tweet-form-components';

const AttachFileButton = styled.label`
  cursor: pointer;
  padding: 10px 0;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 16px;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.button`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;

  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    // 파일의 크기가 100mb가 넘지 않도로 제한
    if (files && files.length === 1 && files[0].size < 1 * 1024 * 1024) setFile(files[0]);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === '' || tweet.length > 180) return;
    try {
      setIsLoading(true);
      const doc = await addDoc(
        // 저장할 document
        collection(db, 'tweets'),
        {
          // 저장할 내용 : 작성내용, 작성시간, 작성자
          tweet,
          createAt: Date.now(),
          userName: user.displayName || 'Anonymous',
          userId: user.uid,
        }
      );

      if (file) {
        // 업로드 file의 저장위치 지정
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, { photo: url });
      }

      setTweet('');
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea rows={5} maxLength={180} value={tweet} placeholder='What is happening?!' onChange={onChange} required />
      <AttachFileButton htmlFor='file'>{file ? 'Photo  added✅' : 'Add photo'}</AttachFileButton>
      <AttachFileInput onChange={onFileChange} type='file' id='file' accept='image/*' />
      <SubmitBtn type='submit'>{isLoading ? 'Posting...' : 'Post Tweet'}</SubmitBtn>
    </Form>
  );
}
