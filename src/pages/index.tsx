import React from "react";
import Head from "next/head";
import Link from "next/link";
import styled from "@emotion/styled";

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%);
  border-radius: 15px;
  margin-bottom: 60px;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 20px;
  color: #333;

  span {
    color: #ff9c00;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  max-width: 800px;
  margin-bottom: 40px;
  color: #666;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.5rem;
  color: #333;

  span {
    color: #ff9c00;
  }
`;

const ToolCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ToolIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  color: #ff9c00;
`;

const ToolTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
`;

const ToolDescription = styled.p`
  flex-grow: 1;
  margin-bottom: 20px;
  color: #666;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 80px;
`;

const CallToAction = styled.section`
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%);
  border-radius: 15px;
  margin-bottom: 40px;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
`;

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>DoodleTechLabs - Free Web Tools for Developers</title>
        <meta
          name="description"
          content="Free, easy-to-use web tools for developers. JSON editor, GUID generator, and more to help you work smarter, not harder."
        />
        <meta name="keywords" content="web tools, developer tools, JSON editor, GUID generator, DoodleTechLabs" />
      </Head>

      <Hero>
        <HeroTitle>
          Welcome to Doodle<span>Tech</span>Labs
        </HeroTitle>
        <HeroSubtitle>
          Free, easy-to-use web tools for developers, inspired by our favorite golden doodles. Work smarter, not harder
          with our collection of helpful utilities.
        </HeroSubtitle>
        <ButtonGroup>
          <Link href="/tools/json-editor" className="button">
            Try JSON Editor
          </Link>
          <Link href="/about" className="button secondary">
            Learn More
          </Link>
        </ButtonGroup>
      </Hero>

      <SectionTitle>
        Our <span>Tools</span>
      </SectionTitle>

      <Grid>
        <ToolCard>
          <ToolIcon>🔍</ToolIcon>
          <ToolTitle>JSON Editor</ToolTitle>
          <ToolDescription>
            A powerful JSON editor with syntax highlighting, validation, formatting, and tree navigation. Edit,
            beautify, and explore your JSON data with ease.
          </ToolDescription>
          <Link href="/tools/json-editor" className="button">
            Open JSON Editor
          </Link>
        </ToolCard>

        <ToolCard>
          <ToolIcon>🆔</ToolIcon>
          <ToolTitle>GUID Generator</ToolTitle>
          <ToolDescription>
            Generate random GUIDs/UUIDs with a single click. Create multiple IDs at once and copy them to your clipboard
            instantly.
          </ToolDescription>
          <Link href="/tools/guid-generator" className="button">
            Generate GUIDs
          </Link>
        </ToolCard>

        <ToolCard>
          <ToolIcon>🔐</ToolIcon>
          <ToolTitle>Password Generator</ToolTitle>
          <ToolDescription>
            Create strong, secure passwords with customizable options. Generate passwords of any length with various
            character sets for better security.
          </ToolDescription>
          <Link href="/tools/password-generator" className="button">
            Create Passwords
          </Link>
        </ToolCard>

        <ToolCard>
          <ToolIcon>✨</ToolIcon>
          <ToolTitle>Coming Soon...</ToolTitle>
          <ToolDescription>
            We&apos;re constantly working on new tools to help make your developer life easier. Stay tuned for more useful
            utilities, coming soon!
          </ToolDescription>
          <Link href="/about" className="button secondary">
            Request a Tool
          </Link>
        </ToolCard>
      </Grid>

      <CallToAction>
        <CTATitle>Need a specific tool for your project?</CTATitle>
        <p>We love building useful tools for developers. Tell us what would help you most!</p>
        <Link href="/about" className="button">
          Contact Us
        </Link>
      </CallToAction>
    </>
  );
};

export default HomePage;
