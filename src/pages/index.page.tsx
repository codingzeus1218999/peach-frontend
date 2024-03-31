import { useCallback } from "react";
import { Container } from "@mui/system";
import { useAppDispatch, useAppSelector } from "@/store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation, Trans } from "next-i18next";
import { Box, Grid, Slide, Typography } from "@mui/material";
import styled from "@emotion/styled";
import {
  selectAllFileNames,
  selectIsAnyFilesSelected,
  selectTotalFileSizesInGB,
  setError,
  setSelectedFiles,
} from "@/store/slices/senderForm.slice";
import Image from "next/image";
import theme, { withTransientProps } from "@/styles/theme";
import { useDropzone } from "react-dropzone";
import {
  BytesToGig,
  isAnySameFileNamseInFileList,
} from "@/components/senderForm/senderForm.utils";
import dynamic from "next/dynamic";
import MetaHead from "@/common/meta/MetaHead";
import SenderUserAPIs from "@/api/services/senderUser.api";

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

interface IParagraphProps {
  $removeLeftMargin?: boolean;
}

const Paragraph = styled(Typography, withTransientProps)<IParagraphProps>`
  margin: ${(p) => p.theme.spacing(1, 14, 0, p.$removeLeftMargin ? 0 : 14)};
`;

export default function Home() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const allFilesTotalSize = useAppSelector(selectTotalFileSizesInGB);
  const allFileNames = useAppSelector(selectAllFileNames);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      const incomingFilesArray = Array.from((acceptedFiles as File[]) || []);

      const incomingFilesTotalSize: number =
        acceptedFiles !== null
          ? (incomingFilesArray.reduce(
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
        return;
      }

      const combinedFileNames = [
        ...allFileNames,
        ...(incomingFilesArray.map((item) => item?.name?.toLocaleLowerCase()) ||
          []),
      ];
      if (isAnySameFileNamseInFileList(combinedFileNames)) {
        dispatch(
          setError({
            status: "visible",
            message: "landing.page.sender.form.errors.sameFileName",
          }),
        );
        return;
      }

      dispatch(setSelectedFiles(acceptedFiles));
    },
    [allFileNames, allFilesTotalSize, dispatch],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const isAnyFilesSelected = useAppSelector(selectIsAnyFilesSelected);

  const metaData = {
    title:
      "Peach Go | Fast, secure file transfer, built for advertising assets",
    description: `Powerfully simple file transfer — designed with and for advertising people. 
    We’re building a fast, precise and secure tool that will change how your campaigns go live.`,
    ogUrl: `https://go.peach.me`,
  };

  return (
    <main
      {...getRootProps()}
      data-testid="dti-landingArea"
      style={{ height: "100%" }}
    >
      <MetaHead metaData={metaData} />
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
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}
