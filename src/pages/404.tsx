import React from "react";
import Link from "next/link";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60vh;
  padding: 20px;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  margin: 0;
  color: #ff9c00;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin: 20px 0;
  color: #333;
`;

const Text = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  max-width: 500px;
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Custom404: React.FC = () => {
  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <Title>Page Not Found</Title>
      <Text>
        Oops! It looks like this page has gone for a walk with the golden doodles. Let's help you find your way back!
      </Text>
      <ButtonGroup>
        <Link href="/" className="button">
          Go Home
        </Link>
        <Link href="/tools/json-editor" className="button secondary">
          Try JSON Editor
        </Link>
      </ButtonGroup>
    </Container>
  );
};

export default Custom404;
