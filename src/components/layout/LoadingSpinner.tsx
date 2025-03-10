import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useLoading } from "./LoadingContext";

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 156, 0, 0.3);
  border-radius: 50%;
  border-top: 4px solid #ff9c00;
  animation: ${spinAnimation} 1s linear infinite;
`;

const SpinnerText = styled.div`
  color: #666;
  font-size: 16px;
  font-weight: 500;
`;

const LoadingSpinner: React.FC = () => {
  const { isLoading } = useLoading();

  return (
    <SpinnerOverlay isVisible={isLoading}>
      <SpinnerContainer>
        <Spinner />
        <SpinnerText>Loading...</SpinnerText>
      </SpinnerContainer>
    </SpinnerOverlay>
  );
};

export default LoadingSpinner;
