import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectReceiverFileSetSession,
  selectReceiverSessionInfo,
} from "@/store/slices/receiver.slice";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  ReceiverFilesList,
  ReceiverFilesListItem,
  ReceiverFilesListItemExtension,
  ReceiverFilesViewLeftWrapper,
  ReceiverFilesViewRightWrapper,
  SenderCommentBox,
  SenderCommentBoxInnerWrapper,
} from "./receiver.style";
import theme from "@/styles/theme";
import { Trans, useTranslation } from "react-i18next";
import { SizeAndUnitCalc } from "@/common/utils/fileUtils";
import dayjs from "dayjs";
import AnimatedActionButton from "@/components/shared/AnimatedActionButton";
import {
  CheckRounded,
  CopyAllRounded,
  FileDownloadOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

const ReceiverFilesView: React.FC = () => {
  const { t } = useTranslation();
  const sessionInfo = useAppSelector(selectReceiverSessionInfo);
  const sessionFiles = useAppSelector(selectReceiverFileSetSession);
  const [isMsgBoxReachToEnd, setIsMsgBoxReachToEnd] = useState(false);
    
  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setIsMsgBoxReachToEnd(true);
    } else {
      if (isMsgBoxReachToEnd) setIsMsgBoxReachToEnd(false);
    }
  };

  if (sessionInfo !== null)
    return (
      <Container maxWidth={false} sx={{ "&&": { height: "inherit" } }} data-testid="dti-receivers-formView">
        <Grid
          container
          padding={theme.spacing(15, 3, 8, 3)}
          spacing={6}
          sx={{ "&&": { height: "inherit" } }}
        >
          <Grid item xs={2.5}>
            <ReceiverFilesViewLeftWrapper>
              <Box>
                <Typography variant="h1">
                  {t("landing.page.receiver.form.heading")}
                </Typography>

                <Typography variant="body2" paddingTop={2}>
                  <b style={{ textDecoration: "underline" }}>
                    {sessionInfo.senderEmail}
                  </b>
                  {t("landing.page.receiver.form.paragraph", {
                    count: sessionInfo.numberOfFiles,
                    size: SizeAndUnitCalc(sessionInfo.totalFilesize),
                    expiryDate: dayjs(sessionInfo.expirationDate).format(
                      "DD MMM YYYY",
                    ),
                  })}
                </Typography>
                <Box padding={theme.spacing(3, 0, 4, 0)}>
                  <AnimatedActionButton
                    data-testid="dti-downloadAllBtn"
                    btnText={{
                      firstView: t(
                        "landing.page.receiver.filesView.ButtonDownloadAll",
                      ),
                      secondView: t(
                        "landing.page.receiver.filesView.ButtonDownloadAll.Started",
                      ),
                    }}
                    customStartIcon={{
                      firstView: <FileDownloadOutlined />,
                      secondView: <CheckRounded />,
                    }}
                    buttonWidth={{
                      firstView: "142px",
                      secondView: "172px"
                    }}
                    onClickCallBack={() => {
                      // alert("coming soon");
                    }}
                  />
                </Box>
                <Typography variant="labelLg">
                  {t("landing.page.receiver.filesView.CopyLinkButton")}
                </Typography>
                <Button
                  startIcon={<CopyAllRounded />}
                  data-testid="dti-share-receiver-link-btn"
                  sx={{
                    "&&": {
                      backgroundColor: "#fff",
                      width: "100%",
                      maxWidth: "306px",
                      marginTop: "12px",
                      "&& div": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    },
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  <div>{window.location.href}</div>
                </Button>
              </Box>
              {sessionInfo.message && sessionInfo.message.length > 1 && (
                <SenderCommentBox data-testid="dti-receiver-formView-messageBox">
                  <SenderCommentBoxInnerWrapper
                    onScroll={handleScroll}
                    $showBottomLine={isMsgBoxReachToEnd}
                  >
                    <Typography variant="h6">
                      {t("landing.page.receiver.filesView.commentBoxTitle", {
                        name: sessionInfo.senderEmail.split("@")[0],
                      })}
                    </Typography>
                    <Typography variant="body3" paddingTop={1}>
                      {sessionInfo.message}
                    </Typography>
                  </SenderCommentBoxInnerWrapper>
                </SenderCommentBox>
              )}
            </ReceiverFilesViewLeftWrapper>
          </Grid>
          <Grid item xs={0.5}></Grid>
          <Grid item xs={9}>
            <ReceiverFilesViewRightWrapper>
              <Typography variant="h5" marginBottom={3.5}>
                {t(
                  sessionInfo.numberOfFiles > 1
                    ? "landing.page.receiver.filesView.SizeAndCounting"
                    : "landing.page.receiver.filesView.Size",
                  {
                    count: sessionInfo.numberOfFiles,
                    size: SizeAndUnitCalc(sessionInfo.totalFilesize),
                  },
                )}
              </Typography>
              <ReceiverFilesList>
                {sessionFiles !== null &&
                  sessionFiles.files.map((item, key) => (
                    <ReceiverFilesListItem
                      key={key}
                      secondaryAction={
                        <IconButton>
                          <FileDownloadOutlined
                            sx={{
                              "&&": {
                                color: "#000",
                              },
                            }}
                          />
                        </IconButton>
                      }
                    >
                      <ReceiverFilesListItemExtension>
                        <Typography variant="labelMd">
                          {item.fileName.substring(
                            item.fileName.lastIndexOf(".") + 1,
                          )}
                        </Typography>
                      </ReceiverFilesListItemExtension>
                      <ListItemText
                        primary={item.fileName}
                        secondary={SizeAndUnitCalc(item.fileSize)}
                        primaryTypographyProps={{
                          variant: "h6",
                        }}
                        secondaryTypographyProps={{
                          variant: "labelMd",
                          fontWeight: 400,
                        }}
                      />
                    </ReceiverFilesListItem>
                  ))}
              </ReceiverFilesList>
            </ReceiverFilesViewRightWrapper>
          </Grid>
        </Grid>
      </Container>
    );

  return <></>;
};

export default ReceiverFilesView;
