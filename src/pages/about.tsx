import React from "react";
import Head from "next/head";
import styled from "@emotion/styled";

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
  text-align: center;

  span {
    color: #ff9c00;
  }
`;

const Section = styled.section`
  margin-bottom: 50px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #333;
  border-bottom: 2px solid #ff9c00;
  padding-bottom: 10px;
`;

const DoodleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin: 40px 0;
`;

const DoodleCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const DoodleImage = styled.div`
  height: 220px;
  background-color: #f0f0f0;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DoodleName = styled.h3`
  padding: 15px;
  margin: 0;
  text-align: center;
  font-size: 1.2rem;
  color: #333;
`;

const ContactForm = styled.form`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  min-height: 150px;
`;

const SubmitButton = styled.button`
  background-color: #ff9c00;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e68900;
  }
`;

const AboutPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>About DoodleTechLabs - Our Story</title>
        <meta
          name="description"
          content="Learn more about DoodleTechLabs, our mission, and the golden doodles that inspired our developer tools."
        />
      </Head>

      <AboutContainer>
        <PageTitle>
          About Doodle<span>Tech</span>Labs
        </PageTitle>

        <Section>
          <SectionTitle>Our Story</SectionTitle>
          <p>
            DoodleTechLabs was born from a love of two things: elegant software solutions and adorable golden doodles.
            As developers, we found ourselves constantly building small tools to make our daily work more efficient. We
            decided to share these tools with the wider developer community, packaging them in a friendly, accessible
            way - just like our beloved doodles.
          </p>
          <p>
            Our mission is simple: create reliable, easy-to-use web tools that solve common developer problems, all
            while paying homage to the furry friends that keep us company during those long coding sessions.
          </p>
        </Section>

        <Section>
          <SectionTitle>Meet the Doodles</SectionTitle>
          <p>
            The real inspiration behind DoodleTechLabs are our golden doodles. Their friendly, problem-solving nature
            perfectly represents what we aim to achieve with our tools.
          </p>

          <DoodleGrid>
            <DoodleCard>
              <DoodleImage>
                <img src="/images/placeholder-doodle1.jpg" alt="Charlie the Golden Doodle" />
              </DoodleImage>
              <DoodleName>Charlie</DoodleName>
            </DoodleCard>
            <DoodleCard>
              <DoodleImage>
                <img src="/images/placeholder-doodle2.jpg" alt="Luna the Golden Doodle" />
              </DoodleImage>
              <DoodleName>Luna</DoodleName>
            </DoodleCard>
            <DoodleCard>
              <DoodleImage>
                <img src="/images/placeholder-doodle3.jpg" alt="Cooper the Golden Doodle" />
              </DoodleImage>
              <DoodleName>Cooper</DoodleName>
            </DoodleCard>
          </DoodleGrid>

          <p>
            <em>
              Note: Please add your actual golden doodle photos to the /public/images/ directory and update the image
              paths above!
            </em>
          </p>
        </Section>

        <Section>
          <SectionTitle>Our Tools</SectionTitle>
          <p>We&apos;re constantly working to expand our suite of developer tools. Currently, we offer:</p>
          <ul>
            <li>
              <strong>JSON Editor</strong> - A feature-rich editor for working with JSON data
            </li>
            <li>
              <strong>GUID Generator</strong> - Quickly generate UUIDs for your projects
            </li>
          </ul>
          <p>Have a suggestion for a tool you&apos;d like to see? Let us know through the contact form below!</p>
        </Section>

        <Section>
          <SectionTitle>Contact Us</SectionTitle>
          <ContactForm onSubmit={(e) => e.preventDefault()}>
            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" name="name" required />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" required />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" required></Textarea>
            </FormGroup>
            <SubmitButton type="submit">Send Message</SubmitButton>
          </ContactForm>
        </Section>
      </AboutContainer>
    </>
  );
};

export default AboutPage;
