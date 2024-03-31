import { ENV_CONSTANTS } from "@/common/constants/env.const";
import MetaHead from "@/common/meta/MetaHead";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearUploadSubmissionData,
  selectFilesList,
  selectSenderSubmissionState,
  selectTotalFileSizesInGB,
} from "@/store/slices/senderForm.slice";
import styled from "@emotion/styled";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PercentWrapper } from "./progress.styles";
import SenderUserAPIs from "@/api/services/senderUser.api";

interface Queue {
  index: number;
}

const StyledVisualImg = styled(Image)`
  && {
    margin: auto;
  }
`;

const DEFAULT_MAX_ACTIVE_UPLOAD_COUNT = "4";

interface IProgress {
  [key: string]: {
    loaded: number;
    percent: number;
  };
}
const UploadPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const selectedFiles = useAppSelector(selectFilesList);
  const { filesetSession } = useAppSelector(selectSenderSubmissionState);
  const [progress, setProgress] = useState(0);
  const [targetUploadFiles, setTargetUploadFiles] = useState<null | any[]>(
    null,
  );
  const progressInfosRef = useRef<any>(null);
  const [progressInfos, setProgressInfos] = useState<IProgress>({});

  const allFilesTotalSize = useAppSelector(selectTotalFileSizesInGB);
  const router = useRouter();

  const [uploadQueue, setUploadQueue] = useState<Queue[]>([]);
  const [activeUploads, setActiveUploads] = useState(0);

  const abortController = useMemo(() => {
    return new AbortController();
  }, []);

  useEffect(() => {
    if (selectedFiles.length === 0) {
      router.push("/");
      return;
    }
    if (filesetSession !== null) {
      let temp = [];
      const fileArray = Array.from(selectedFiles);
      for (const item in fileArray) {
        temp.push({
          file: fileArray[item],
          url: filesetSession?.files.find(
            (i) => i.name === fileArray[item].name,
          )?.url,
        });
      }
      let ProgressItems: IProgress = {};
      for (const item in selectedFiles) {
        ProgressItems = {
          ...ProgressItems,
          [selectedFiles[item].name]: { loaded: 0, percent: 0 },
        };
      }
      progressInfosRef.current = ProgressItems;
      setTargetUploadFiles(temp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesetSession, selectedFiles]);

  const handleFileUpload = useCallback(
    async (uploadURL: string, file: File) => {
      let _progressInfos: IProgress = { ...progressInfosRef.current };
      try {
        await SenderUserAPIs.UploadFileToS3Bucket(
          uploadURL,
          file,
          (progressEvent) => {
            _progressInfos[file.name].loaded = progressEvent.loaded;
            _progressInfos[file.name].percent =
              (progressEvent.loaded * 100) / file.size;
            setProgressInfos({ ..._progressInfos });
          },
          abortController.signal,
        );
        setActiveUploads((prevActiveUploads) => prevActiveUploads - 1);
      } catch (e) {
      }
    },
    [abortController],
  );

  useEffect(() => {
    return ()=>{
      setProgress(0);
    }
  }, []);
  useEffect(() => {
    if (progress === 50) {
      router.push("/upload/analyze");
    }
  }, [progress, router]);

  useEffect(() => {
    if (allFilesTotalSize) {
      setProgress(
        Math.round(
          (Object.values(progressInfos).reduce((a, b) => a + b.loaded, 0) *
            100) /
            (allFilesTotalSize * 2),
        ),
      );
    }
  }, [progressInfos, allFilesTotalSize]);

  useEffect(() => {
    if (targetUploadFiles !== null)
      if (
        activeUploads <
        parseInt(
          ENV_CONSTANTS.MAXIMUM_ACTIVE_UPLOADS ||
            DEFAULT_MAX_ACTIVE_UPLOAD_COUNT,
        )
      ) {
        const queuedUpload = uploadQueue.shift();
        if (queuedUpload) {
          handleFileUpload(
            targetUploadFiles[queuedUpload.index].url,
            targetUploadFiles[queuedUpload.index].file,
          );
          setActiveUploads((prevActiveUploads) => prevActiveUploads + 1);
          setUploadQueue([...uploadQueue]);
        }
      }
  }, [activeUploads, uploadQueue, handleFileUpload, targetUploadFiles]);

  useEffect(() => {
    if (targetUploadFiles !== null) {
      let uploadCounts = 0;
      const queue = [] as Queue[];
      selectedFiles.forEach((_, index) => {
        if (
          uploadCounts >=
          parseInt(
            ENV_CONSTANTS.MAXIMUM_ACTIVE_UPLOADS ||
              DEFAULT_MAX_ACTIVE_UPLOAD_COUNT,
          )
        ) {
          queue.push({ index });
        } else {
          handleFileUpload(
            targetUploadFiles[index].url,
            targetUploadFiles[index].file,
          );
          uploadCounts++;
        }
      });
      setUploadQueue([...queue]);
      setActiveUploads(uploadCounts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUploadFiles]);

  const handleCancelTransfer = () => {
    setUploadQueue([]);
    setActiveUploads(0);
    dispatch(clearUploadSubmissionData());
    abortController.abort();
    router.push("/");
  };

  const metaData = {
    title: "Peach Go | We are currently uploading your files",
    description: `Peach go is uploading your files, sit tight it won't take long.`,
    ogUrl: `https://go.peach.me/upload`,
  };

  return (
    <main>
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
            <StyledVisualImg
              data-testid="dti-upload-page-img"
              src="/img/visual2.svg"
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
                {t("uploading.page.sender.heading")}
              </Typography>
              <Typography variant="h5">
                <Link
                  component="button"
                  underline="always"
                  onClick={handleCancelTransfer}
                >
                  {t("uploading.page.sender.pauseOrEditTransfer")}
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

                <PercentWrapper data-testid="dti-progress-percentage">
                  <Typography variant="body2" component="div" color="#fff">
                    {`${progress}%`}
                  </Typography>
                </PercentWrapper>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

export default UploadPage;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}
