"use client";

import { useAppDispatch } from "@/store";
import { resetSenderForm } from "@/store/slices/senderForm.slice";
import { withTransientProps } from "@/styles/theme";
import styled from "@emotion/styled";
import Image from "next/image";
import { useRouter } from "next/router";

interface ILogoProps {
  $clickable: boolean
}
const Logo = styled("div", withTransientProps)<ILogoProps>`
  ${p=>p.$clickable && `
    cursor: pointer;
  `}
`;

const PeachGoLogo = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAwesomePage = router.route.includes("/success") || router.route.includes("/user/[...receiver]");

  const onLogoClick = () =>{
    if(isAwesomePage){
      dispatch(resetSenderForm())
      router.push('/')
    }
  }
  return (
    <Logo
      $clickable={isAwesomePage}
      onClick={onLogoClick}
    >
      <Image
        src="/img/peachGoLogo.svg"
        width={126}
        height={32}
        alt="Peach Go Logo"
        priority
        quality={10}
        data-testid="peach-go-logo"
      />
    </Logo>
  );
};

export default PeachGoLogo;
