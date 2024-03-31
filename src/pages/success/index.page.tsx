"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import theme from "@/styles/theme";
import { CheckRounded, ContentCopyRounded } from "@mui/icons-material";
import Image from "next/image";
import dynamic from "next/dynamic";
import MetaHead from "@/common/meta/MetaHead";
import { useAppSelector } from "@/store";
import { selectSenderSubmissionState } from "@/store/slices/senderForm.slice";
import { useEffect } from "react";
import { useRouter } from "next/router";

const AnimatedActionButton = dynamic(
  () => import("@/components/shared/AnimatedActionButton"),
);

const metaData = {
  title: "Peach Go | Success! Your files have been sent",
  description: `Peach go has successfully uploaded your files`,
  ogUrl: `https://go.peach.me/success`,
};

const SuccessPage: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { sessionInfo } = useAppSelector(selectSenderSubmissionState);
  useEffect(() => {
    if (sessionInfo.expirationDate === null) router.push("/");
  }, [router, sessionInfo]);
  return (
    <main data-testid="dti-reciever-page">
      <MetaHead metaData={metaData} />
      <Container maxWidth="xl">
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ height: "90vh", marginTop: 0, paddingTop: 8 }}
        >
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
          >
            <Grid item sm>
              <Typography variant="displaySm">
                {t("success.page.sender.heading")}
              </Typography>
              <Box
                sx={{
                  "&&": {
                    maxWidth: theme.spacing(56),
                    marginTop: theme.spacing(2),
                  },
                }}
              >
                <Typography variant="body1">
                  {t("success.page.sender.description")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    "&&": {
                      marginTop: theme.spacing(3),
                    },
                  }}
                >
                  {t("success.page.sender.expiration", {
                    expDate: sessionInfo.expirationDate,
                  })}
                </Typography>
              </Box>
              <AnimatedActionButton
                data-testid="dti-copyLinkBtn"
                sx={{
                  "&&": {
                    marginTop: theme.spacing(4),
                  },
                }}
                btnText={{
                  firstView: t("success.page.sender.copyLink"),
                  secondView: t("success.page.sender.linkCopied"),
                }}
                customStartIcon={{
                  firstView: <ContentCopyRounded />,
                  secondView: <CheckRounded />,
                }}
                onClickCallBack={() => {
                  navigator.clipboard.writeText(
                    sessionInfo.shortLink || "Peach Go Mocked Link!",
                  );
                }}
              />
            </Grid>
            <Grid item sm>
              <Image
                data-testid="dti-dart-board-img"
                src="/img/success.svg"
                width={513}
                height={468}
                priority
                quality={100}
                alt=""
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

export default SuccessPage;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}
