"use client";

import { Box, Container, Grid, Link, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import theme from "@/styles/theme";
import MetaHead from "@/common/meta/MetaHead";
import styled from "@emotion/styled";

const metaData = {
  title: "Peach Go | Expired",
  description: "",
  ogUrl: "",
};

const NotFoundTypography = styled(Typography)`
  color: ${(p) => p.theme.palette.secondary.main};
`;

const GoBackTypography = styled(NotFoundTypography)`
  color: ${(p) => p.theme.palette.secondary.main};
  border-bottom: 1px solid ${(p) => p.theme.palette.secondary.main + "50"};
`;

const GoBackLink = styled(Link)`
  padding: ${(p) => p.theme.spacing(0.5)} 0;
`;

const ExpiredPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main>
      <MetaHead metaData={metaData} />
      <Container maxWidth="xl">
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100vh", marginTop: 0 }}
        >
          <Grid
            item
            container
            xs={12}
            gap={6}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              data-testid="dti-seeking-eyes-img"
              src="/img/seeking-eyes.svg"
              width={211}
              height={111}
              priority
              quality={100}
              alt=""
            />
            <Grid
              item
              container
              sm
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <NotFoundTypography variant="displaySm">
                404
              </NotFoundTypography>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                  "&&": {
                    maxWidth: theme.spacing(56),
                    marginTop: theme.spacing(1),
                  },
                }}
              >
                <NotFoundTypography variant="body1" textAlign="center">
                  {t("notFound.page.sender.paragraph")}
                </NotFoundTypography>
                <GoBackLink
                  data-testid="dti-go-to-home"
                  href="/"
                  underline="none"
                  sx={{
                    "&&": {
                      marginTop: theme.spacing(3),
                    },
                  }}
                  rel="noopener noreferrer"
                >
                  <GoBackTypography variant="h4" fontSize={20} lineHeight={1}>
                    {t("notFound.page.sender.takeMeHome")}
                  </GoBackTypography>
                </GoBackLink>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

export default ExpiredPage;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}
