"use client";

import { useAppSelector } from "@/store";
import { selectReceiverConfimationState } from "@/store/slices/receiver.slice";
import { withTransientProps } from "@/styles/theme";
import styled from "@emotion/styled";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo } from "react";

interface ILogoProps {
  $fixToRight: boolean;
}
const Logo = styled("a", withTransientProps)<ILogoProps>`
  && {
    position: fixed;
    bottom: 50px;
    z-index: 13;
    ${(p) =>
      p.$fixToRight
        ? `
        right: 0;
        transform: rotate(-180deg);
      `
        : `
        left: 0;
      `}
  }
`;

const PeachLogo = () => {
  const { asPath } = useRouter();
  const isReceiverUserConfirmed = useAppSelector(
    selectReceiverConfimationState,
  );

  const isLogoStickedToRight = useMemo(() => {
    if (asPath.includes("/user/receiver") && isReceiverUserConfirmed)
      return true;
    return false;
  }, [asPath, isReceiverUserConfirmed]);

  return (
    <Logo
      href="https://www.peach.me/"
      target="_blank"
      data-testid="peach-logo-link"
      $fixToRight={isLogoStickedToRight}
    >
      <Image
        src="/img/logoPeach.svg"
        width={46}
        height={92}
        alt="Peach Logo"
        priority
        quality={10}
        data-testid="peach-logo"
      />
    </Logo>
  );
};

export default PeachLogo;
