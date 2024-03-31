import { useCallback } from "react";
import { Container } from "@mui/system";
import { useAppDispatch, useAppSelector } from "@/store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation, Trans } from "next-i18next";
import { Box, Grid, Slide, Typography } from "@mui/material";
import styled from "@emotion/styled";
import {
  selectIsAnyFilesSelected,
  selectTotalFileSizesInGB,
  setError,
  setSelectedFiles,
} from "@/store/slices/senderForm.slice";
import theme, { withTransientProps } from "@/styles/theme";
import { useDropzone } from "react-dropzone";
import { BytesToGig } from "@/components/senderForm/senderForm.utils";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";

const DropZone = dynamic(() => import("@/components/dropZone"));
const SenderForm = dynamic(() => import("@/components/senderForm/SenderForm"));
const PeachTermsToast = dynamic(
  () => import("@/components/shared/PeachTermsToast"),
);

const Message = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const StyledVisualImg = styled(Image)`
  && {
    position: fixed;
    bottom: -6%;
    top: auto;
    margin: auto;
    @media screen and (max-height: 780px) {
      max-width: 300px;
      bottom: -13%;
    }
    @media screen and (max-height: 680px) {
      bottom: -16%;
      left: 8%;
    }
  }
`;

type Props = {
  region: string;
  catFact: string;
  bordedActivity: string;
};

interface IParagraphProps {
  $removeLeftMargin?: boolean;
}

const Paragraph = styled(Typography, withTransientProps)<IParagraphProps>`
  margin: ${(p) => p.theme.spacing(1, 14, 0, p.$removeLeftMargin ? 0 : 14)};
`;

const SSR = (
  _props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const allFilesTotalSize = useAppSelector(selectTotalFileSizesInGB);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      const incomingFilesTotalSize: number =
        acceptedFiles !== null
          ? (Array.from(acceptedFiles).reduce(
              (acc, cur: any) => acc + cur.size,
              0,
            ) as number)
          : 0;
      if (
        incomingFilesTotalSize / BytesToGig > 2 ||
        (allFilesTotalSize + incomingFilesTotalSize) / BytesToGig > 2
      ) {
        dispatch(
          setError({
            status: "visible",
            message: "landing.page.sender.form.errors.fileSizeExceeds",
          }),
        );
      } else {
        dispatch(setSelectedFiles(acceptedFiles));
      }
    },
    [allFilesTotalSize, dispatch],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const isAnyFilesSelected = useAppSelector(selectIsAnyFilesSelected);

  return (
    <main {...getRootProps()}>
      <input {...getInputProps()} data-testid="drop-input" />
      <DropZone isDragActive={isDragActive} />
      <PeachTermsToast />
      <Container maxWidth="xl">
        <Grid
          container
          spacing={2}
          sx={{ height: "90vh", marginTop: 0, paddingTop: 8 }}
        >
          <Grid item xs={6}>
            <Message>
              <Box
                sx={{
                  "&&": {
                    height: isAnyFilesSelected ? theme.spacing(68) : "auto",
                  },
                }}
              >
                <Typography
                  variant="displayLg"
                  sx={{
                    "&&": {
                      textIndent: "1.2em",
                      display: !isAnyFilesSelected ? "block" : "none",
                    },
                  }}
                >
                  <Trans
                    i18nKey={"landing.page.sender.heading"}
                    components={{ 1: <br /> }}
                  />
                </Typography>
                <Typography
                  variant="displaySm"
                  sx={{
                    "&&": {
                      display: isAnyFilesSelected ? "block" : "none",
                    },
                  }}
                >
                  <Trans
                    i18nKey={"landing.page.sender.heading.swallowed"}
                    components={{ 1: <br /> }}
                  />
                </Typography>
                <Paragraph $removeLeftMargin={isAnyFilesSelected}>
                  {t("landing.page.sender.paragraph")}
                </Paragraph>
                <h3>AWS Region: {_props.region}</h3>
                <h3>Cat Fact: {_props.catFact}</h3>
                <h3>Activity: {_props.bordedActivity}</h3>
                <Slide
                  direction="up"
                  in={isAnyFilesSelected}
                  timeout={1000}
                  mountOnEnter
                  unmountOnExit
                >
                  <StyledVisualImg
                    src="/img/visual2.svg"
                    width={413}
                    height={421}
                    priority
                    quality={100}
                    alt=""
                  />
                </Slide>
              </Box>
            </Message>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                "&&": {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                },
              }}
            >
              <SenderForm />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  locale,
}) => {
  const response = await fetch(
    "https://d2zdg4swtsn98t.cloudfront.net/api/awsRegion",
  );
  const data = await response.json();
  const region: string = data.region || "";

  const catRes = await fetch("https://catfact.ninja/fact");

  const catData = await catRes.json();
  const catFact = catData.fact || "";

  const borded = await fetch("https://www.boredapi.com/api/activity");

  const bordedData = await borded.json();
  const bordedActivity = bordedData.activity || "";

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["translations"])),
      region,
      catFact,
      bordedActivity,
    },
  };
};

export default SSR;
