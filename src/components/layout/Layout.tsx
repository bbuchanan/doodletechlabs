import React, { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "@emotion/styled";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #eaeaea;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 40px;
    margin-right: 12px;
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  span {
    color: #ff9c00;
  }
`;

const Nav = styled.nav`
  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin-left: 30px;
  }

  a {
    text-decoration: none;
    color: #666;
    font-weight: 500;
    transition: color 0.2s ease;
    position: relative;

    &:hover {
      color: #ff9c00;
    }

    &.active {
      color: #ff9c00;

      &:after {
        content: "";
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #ff9c00;
      }
    }
  }
`;

const Main = styled.main`
  padding: 40px 0;
  min-height: calc(100vh - 200px);
`;

const Footer = styled.footer`
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid #eaeaea;
  color: #666;
  font-size: 14px;
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  const isActive = (path: string): string => {
    return router.pathname === path ? "active" : "";
  };

  return (
    <>
      <Container>
        <Header>
          <Link href="/" passHref>
            <Logo>
              <img src="/images/doodle-logo.svg" alt="DoodleTechLabs Logo" />
              <h1>
                Doodle<span>Tech</span>Labs
              </h1>
            </Logo>
          </Link>
          <Nav>
            <ul>
              <li>
                <Link href="/" className={isActive("/")}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tools/json-editor" className={isActive("/tools/json-editor")}>
                  JSON Editor
                </Link>
              </li>
              <li>
                <Link href="/tools/guid-generator" className={isActive("/tools/guid-generator")}>
                  GUID Generator
                </Link>
              </li>
              <li>
                <Link href="/about" className={isActive("/about")}>
                  About
                </Link>
              </li>
            </ul>
          </Nav>
        </Header>

        <Main>{children}</Main>

        <Footer>
          <p>© {new Date().getFullYear()} DoodleTechLabs. Made with 💛 for golden doodles everywhere.</p>
        </Footer>
      </Container>
    </>
  );
};

export default Layout;
