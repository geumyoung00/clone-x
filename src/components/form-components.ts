import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const AttachFileButton = styled.label`
  cursor: pointer;
  padding: 10px 0;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 16px;
`;

export const AttachFileInput = styled.input`
  display: none;
`;

export const SubmitBtn = styled.button`
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

export const TextArea = styled.textarea`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

export const Wrapper = styled.div`
  display: grid;
  align-items: center;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;

  &:has(img) {
    grid-template-columns: 4fr 100px;
    gap: 20px;
  }
  &:has(form) {
    grid-template-columns: auto;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

export const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

export const Payload = styled.p`
  margin: 10px 0 20px;
  font-size: 18px;
`;

export const BtnWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

export const Button = styled.button`
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
export const DeleteButton = styled(Button)`
  background-color: tomato;
`;
export const EditButton = styled(Button)`
  background-color: gray;
`;
export const SaveButton = styled(Button)`
  background-color: #1d9bf0;
`;
export const CancelButton = styled(Button)`
  background: whitesmoke;
  color: gray;
`;

export const ModifyTextArea = styled.textarea`
  background-color: transparent;
  resize: none;
  width: 100%;
  margin: 10px 0;
  border-radius: 7px;
  overflow-y: auto;
  color: white;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  padding: 5px;
`;
