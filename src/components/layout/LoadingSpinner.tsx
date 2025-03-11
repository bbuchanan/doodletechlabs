import React, { useEffect, useState, useRef } from "react";
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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const SpinnerOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  transition: opacity 0.25s ease, visibility 0.25s ease;
  animation: ${fadeIn} 0.3s ease-in;
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
  animation: ${spinAnimation} 0.8s linear infinite;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
`;

const SpinnerText = styled.div`
  color: #555;
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
`;

const LoadingSpinner: React.FC = () => {
  const { isLoading } = useLoading();
  const [shouldShow, setShouldShow] = useState(false);
  const showTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Safety timeout to ensure loading state doesn't get stuck
  useEffect(() => {
    if (isLoading) {
      // Clear any previous safety timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      // Set a safety timeout to ensure loading doesn't get stuck
      loadingTimeoutRef.current = setTimeout(() => {
        console.warn("Loading state has been active for too long - forcing reset");
        setShouldShow(false);
      }, 30000); // 30 seconds max loading time
    } else if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoading]);

  // Add a small delay before showing/hiding the spinner to prevent flicker
  useEffect(() => {
    // Clear any existing timers
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (isLoading) {
      // Small delay before showing loading
      showTimerRef.current = setTimeout(() => {
        setShouldShow(true);
      }, 300);
    } else {
      // Small delay before hiding to ensure transitions complete
      hideTimerRef.current = setTimeout(() => {
        setShouldShow(false);
      }, 100);
    }

    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isLoading]);

  return (
    <SpinnerOverlay isVisible={shouldShow}>
      <SpinnerContainer>
        <Spinner />
        <SpinnerText>Loading...</SpinnerText>
      </SpinnerContainer>
    </SpinnerOverlay>
  );
};

export default LoadingSpinner;
