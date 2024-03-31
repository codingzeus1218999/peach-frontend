"use client";

import { FC, ReactElement } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const BackgroundContainer = dynamic(
  () => import("./shared/BackgroundContainer"),
);
const Header = dynamic(() => import("./shared/Header"));
const PeachLogo = dynamic(() => import("./shared/PeachLogo"));
interface Props {
  children: ReactElement;
}

const Layout: FC<Props> = ({ children }) => {
  const { route } = useRouter();
  return (
    <BackgroundContainer>
      {!route.includes("/404") ? <Header /> : <></>}
      {children}
      {!route.includes("/404") ? <PeachLogo /> : <></>}
    </BackgroundContainer>
  );
};

export default Layout;

