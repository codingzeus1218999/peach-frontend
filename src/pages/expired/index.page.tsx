"use client";

import { Box, Container, Grid, Link, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import theme from "@/styles/theme";
import MetaHead from "@/common/meta/MetaHead";

const metaData = {
  title: "Peach Go | Expired",
  description: "",
  ogUrl: "",
};

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
              data-testid="dti-dart-board-img"
              src="/img/calendarCheck.svg"
              width={267}
              height={216}
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
              <Typography variant="displaySm">
                {t("expired.page.sender.heading")}
              </Typography>
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
                <Typography variant="body1" textAlign="center">
                  {t("expired.page.sender.description")}
                </Typography>
                <Link
                  href="/"
                  underline="always"
                  sx={{
                    "&&": {
                      marginTop: theme.spacing(3),
                    },
                  }}
                  rel="noopener noreferrer"
                >
                  <Typography variant="h4" fontSize={20}>
                    {t("expired.page.sender.sendFiles")}
                  </Typography>
                </Link>
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
