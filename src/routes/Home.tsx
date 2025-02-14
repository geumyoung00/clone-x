import styled from 'styled-components';
import PostTweetForm from '../components/post-tweet-form';

const Wrapper = styled.div`
  padding: 0 20px;
`;

export default function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
    </Wrapper>
  );
}
