"use client";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useMemo, useState } from "react";
import { PercentWrapper, StyledVisualImg } from "./progress.styles";
import { useRouter } from "next/router";
import MetaHead from "@/common/meta/MetaHead";
import {
  clearUploadSubmissionData,
  getCancelQCRequest,
  getFileSetSessionStatus,
  requestQC,
  selectFilesList,
  selectFilesQCStatus,
  selectQCStatus,
} from "@/store/slices/senderForm.slice";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectSenderSubmissionState } from "@/store/slices/senderForm.slice";
import { FileSetSessionStatus } from "@/common/constants/enums";
import {
  Alert,
  File,
  FileContainer,
  FileList,
  FilesListWrapper,
  Header,
} from "./analyze.styles";
import { SizeAndUnitCalc } from "@/common/utils/fileUtils";
import { FileExtensionSelector } from "@/components/senderForm/senderForm.utils";

const FILESET_STATUS_POLLING_INTERVAL = 5000;

const AnalyzePage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const qcStatus = useAppSelector(selectQCStatus);
  const filesQCStatus = useAppSelector(selectFilesQCStatus);
  const selectedFiles = useAppSelector(selectFilesList);

  const [progress, setProgress] = useState(50);
  const { filesetSession, senderInfo } = useAppSelector(
    selectSenderSubmissionState,
  );

  useEffect(() => {
    const remainingProgress = 50;
    const fileCounts = Object.keys(filesQCStatus).length;
    const progressPerFile = remainingProgress / fileCounts;
    let actualProgress = 0;
    Object.keys(filesQCStatus).forEach((key) => {
      const fileStatus = filesQCStatus[key];
      if (fileStatus === FileSetSessionStatus.COMPLETE) {
        actualProgress += progressPerFile;
      }
    });
    setProgress(Math.round(remainingProgress + actualProgress));
  }, [filesQCStatus]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (
      qcStatus === FileSetSessionStatus.IN_PROGRESS &&
      senderInfo?.id &&
      filesetSession?.id
    ) {
      intervalId = setInterval(() => {
        dispatch(
          getFileSetSessionStatus({
            senderId: senderInfo.id,
            fileSetSessionId: filesetSession.id,
          }),
        );
      }, FILESET_STATUS_POLLING_INTERVAL);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [qcStatus, senderInfo, filesetSession, dispatch]);

  useEffect(() => {
    if (senderInfo?.id && filesetSession?.id) {
      dispatch(
        requestQC({
          senderId: senderInfo?.id,
          fileSetSessionId: filesetSession?.id,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setProgress(50);
  }, []);

  useEffect(() => {
    if (progress === 100 && qcStatus === FileSetSessionStatus.COMPLETE) {
      router.push("/success");
    }
  }, [progress, router, qcStatus]);

  const handleEditTransfer = () => {
    dispatch(clearUploadSubmissionData());
    router.push("/");
  };

  const handleCancelTransfer = () => {
    dispatch(
      getCancelQCRequest({
        senderId: senderInfo?.id as string,
        fileSetSessionId: filesetSession?.id as string,
      }),
    );
    handleEditTransfer();
  };

  const metaData = {
    title: "Peach Go | We are currently analyzing your files",
    description: `Peach go is analyzing your files, sit tight it won't take long.`,
    ogUrl: `https://go.peach.me/upload/analyze`,
  };

  const failedItemsList = useMemo(
    () =>
      selectedFiles.filter((file) => {
        if (filesQCStatus[file.name] === FileSetSessionStatus.FAILED) {
          return true;
        }
        return false;
      }),
    [filesQCStatus, selectedFiles],
  );

  const renderVirusScan = () => {
    return (
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
          <StyledVisualImg
            data-testid="dti-analyze-page-img"
            src="/img/analyze.svg"
            width={450}
            height={570}
            priority
            quality={100}
            alt=""
          />
        </Grid>
        <Grid container item justifyContent="space-around" spacing={3}>
          <Grid item xs>
            <Typography variant="displaySm">
              {t("analyzing.page.sender.heading")}
            </Typography>
            <Typography variant="h5">
              <Link
                component="button"
                underline="always"
                onClick={handleCancelTransfer}
              >
                {t("analyzing.page.sender.pauseOrEditTransfer")}
              </Link>
            </Typography>
          </Grid>
          <Grid item xs>
            <Box
              sx={{
                position: "relative",
                display: "inline-flex",
                marginTop: "50px",
              }}
            >
              <CircularProgress
                data-testid="dti-progress-indicator"
                variant="determinate"
                value={progress}
                size={80}
                thickness={2}
                sx={{ color: "#fff", zIndex: "9999", position: "absolute" }}
              />
              <CircularProgress
                variant="determinate"
                value={progress - 100}
                size={80}
                thickness={2}
              />

              <PercentWrapper>
                <Typography variant="body2" component="div" color="#fff">
                  {`${progress}%`}
                </Typography>
              </PercentWrapper>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderVirusDetect = () => {
    return (
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
          flexDirection="column"
        >
          <StyledVisualImg
            data-testid="dti-analyze-page-img"
            src="/img/virus.svg"
            width={140}
            height={140}
            priority
            quality={100}
            alt=""
          />
          <Typography
            variant="body1"
            component="div"
            textAlign="center"
            sx={{ padding: "32px 15px", width: "447px" }}
          >
            {t("analyzing.page.virus.detected", {
              count: failedItemsList.length,
            })}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            data-testid="dti-senderForm-submitBtn"
            onClick={handleEditTransfer}
          >
            {t("analyzing.page.virus.editTransferBtn")}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <FilesListWrapper>
            <Header>
              <Alert>!</Alert>
              <Typography variant="body3">
                {t("analyzing.page.virus.files.header")}
              </Typography>
            </Header>
            <FileList>
              {failedItemsList.map((file) => {
                return (
                  <File key={file.name}>
                    <FileContainer>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(0, 0,0, 0.87)" }}
                      >
                        {file.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(0, 0,0, 0.54)" }}
                      >
                        {`${SizeAndUnitCalc(file.size)} ${FileExtensionSelector(
                          file.name,
                        )}`}
                      </Typography>
                    </FileContainer>
                  </File>
                );
              })}
            </FileList>
          </FilesListWrapper>
        </Grid>
      </Grid>
    );
  };

  const renderPage = () => {
    if (
      qcStatus === FileSetSessionStatus.WAITING ||
      qcStatus === FileSetSessionStatus.IN_PROGRESS
    ) {
      return renderVirusScan();
    } else if (qcStatus === FileSetSessionStatus.FAILED) {
      return renderVirusDetect();
    }

    return null;
  };

  return (
    <main>
      <MetaHead metaData={metaData} />
      <Container maxWidth="xl">{renderPage()}</Container>
    </main>
  );
};

export default AnalyzePage;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}
