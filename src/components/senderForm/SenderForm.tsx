"use client";

import {
  Box,
  Button,
  Divider,
  Grow,
  IconButton,
  List,
  Slide,
  Typography,
} from "@mui/material";
import {
  ErrorTooltip,
  FilesListHeading,
  FilesListWrapper,
  FormAreaWrapper,
  FormHeading,
  FormViewWrapper,
  NoSelectedStateWrapper,
  SendButtonWrapper,
  StyledErrorContentWrapper,
  StyledErrorIcon,
  StyledFileListItem,
  StyledFileListItemIcon,
  StyledFileListItemText,
  StyledUploadBtn,
  VisualImg,
} from "./senderForm.styles";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectFilesList,
  selectSelectedFilesCount,
  selectIsAnyFilesSelected,
  setSelectedFiles,
  clearAllFiles,
  removeSingleFile,
  selectTotalFileSizesInGB,
  setError,
  selectReceiversField,
  selectSenderField,
  selectAllFileNames,
  setMessage,
  submitSenderForm,
  TSubmitSenderFormProps,
  selectMessage,
  selectSenderSubmissionState,
  selectFilesQCStatus,
  selectQCStatus,
  clearQCState,
  removeItemFromFileQcState,
  selectErrorStatus,
  selectErrorMessage,
} from "@/store/slices/senderForm.slice";
import { AddRounded, ClearRounded } from "@mui/icons-material";
import theme from "@/styles/theme";
import {
  BytesToGig,
  FileExtensionSelector,
  IconSelector,
  isAnySameFileNamseInFileList,
} from "./senderForm.utils";
import { SizeAndUnitCalc } from "@/common/utils/fileUtils";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { FileSetSessionStatus } from "@/common/constants/enums";
import useTooltipProps from "@/common/hooks/useTooltipProps";

const Message = dynamic(() => import("./Message"));
const ReceiversEmailsField = dynamic(() => import("./ReceiversEmails"));
const SenderEmailField = dynamic(() => import("./SenderEmail"));

const SenderForm: React.FC = () => {
  const router = useRouter();
  const uploadFilesRef = useRef<HTMLInputElement>(null);
  const visualElRef = useRef<any>();
  const firstViewTitlesRef = useRef<any>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const selectedFiles = useAppSelector(selectFilesList);
  const isAnyFilesSelected = useAppSelector(selectIsAnyFilesSelected);
  const countOfSelectedFiles = useAppSelector(selectSelectedFilesCount);
  const allFilesTotalSize = useAppSelector(selectTotalFileSizesInGB);

  const receiversEmailField = useAppSelector(selectReceiversField);
  const senderEmailField = useAppSelector(selectSenderField);
  const allFileNames = useAppSelector(selectAllFileNames);
  const messageFieldValue = useAppSelector(selectMessage);

  const submissionData = useAppSelector(selectSenderSubmissionState);
  const qcStatus = useAppSelector(selectQCStatus);
  const fileQCStatus = useAppSelector(selectFilesQCStatus);
  const globalErrorStatus = useAppSelector(selectErrorStatus);
  const globalErrorMessage = useAppSelector(selectErrorMessage);

  const { tooltipProps, forceHideAlert } = useTooltipProps({
    onHide: () => dispatch(setError({ status: "hide", message: "" })),
    showOn: globalErrorStatus === "visible",
  });

  const isFormValidated = useMemo(() => {
    if (
      receiversEmailField.isValid === true &&
      senderEmailField.isValid === true &&
      qcStatus !== FileSetSessionStatus.FAILED
    )
      return true;

    return false;
  }, [qcStatus, receiversEmailField.isValid, senderEmailField.isValid]);

  const remainingSize = useMemo(
    () => SizeAndUnitCalc(2 * BytesToGig - allFilesTotalSize),
    [allFilesTotalSize],
  );

  const openFileSelector = () => {
    if (uploadFilesRef.current) uploadFilesRef.current.click();
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const incomingFilesArray = Array.from(e.target.files || []);
    const incomingFilesTotalSize =
      e.target.files !== null
        ? incomingFilesArray.reduce(
            (acc: any, cur: { size: any }) => acc + cur.size,
            0,
          )
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
      if (uploadFilesRef.current) uploadFilesRef.current.value = "";
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
      if (uploadFilesRef.current) uploadFilesRef.current.value = "";
      return;
    }

    dispatch(setSelectedFiles(e.target.files));
    if (uploadFilesRef.current) uploadFilesRef.current.value = "";
  };

  const doClearAllFiles = () => {
    dispatch(clearAllFiles());
    dispatch(clearQCState());
    if (uploadFilesRef.current) uploadFilesRef.current.value = "";
  };

  const removeFileFromFilesList = (index: any, fileName: string) => {
    if (uploadFilesRef.current) uploadFilesRef.current.value = "";
    if (qcStatus === FileSetSessionStatus.FAILED) {
      if (fileQCStatus[fileName] !== undefined) {
        dispatch(removeItemFromFileQcState(fileName));
      }
    }
    dispatch(removeSingleFile(index));
  };

  const submitForm = () => {
    const reqBody: TSubmitSenderFormProps = {
      senderEmail: senderEmailField.value,
      fileSetSessionData: {
        files: selectedFiles.map((item) => ({
          name: item.name,
          size: item.size,
        })),
        receivers: receiversEmailField.value,
        message: messageFieldValue,
        days_to_expire: 14,
      },
    };
    dispatch(submitSenderForm(reqBody));
    router.push("/upload");
  };

  const formViewRef = useRef<HTMLDivElement>();

  const handleMessageChange = (message: string) => {
    dispatch(setMessage(message));
    const scrollHeight = formViewRef!.current!.scrollHeight;
    formViewRef.current?.scrollTo({
      behavior: "smooth",
      top: scrollHeight,
    });
  };

  useEffect(() => {
    if (qcStatus === FileSetSessionStatus.FAILED) {
      dispatch(
        setError({
          status: "visible",
          message: "landing.page.sender.form.errors.virusDetected",
        }),
      );
    }
  }, [dispatch, qcStatus]);

  const firstItemQcFailed = useMemo(() => {
    let firstItemName: string = "";
    for (let [key] of Object.entries(fileQCStatus)) {
      if (firstItemName === "") firstItemName = key;
    }
    return firstItemName;
  }, [fileQCStatus]);

  const isFileItemAutoFocus = useCallback(
    (fileName: string) => {
      if (qcStatus !== FileSetSessionStatus.FAILED) return false;

      if (firstItemQcFailed === fileName) return true;

      return false;
    },
    [qcStatus, firstItemQcFailed],
  );

  const onFormViewScoll = useCallback(() => {
    if (qcStatus === FileSetSessionStatus.FAILED)
      if (globalErrorStatus === "visible") {
        forceHideAlert();
      }
  }, [forceHideAlert, globalErrorStatus, qcStatus]);

  return (
    <ErrorTooltip
      placement={isAnyFilesSelected ? "left-start" : "left"}
      arrow
      title={
        <StyledErrorContentWrapper data-testid="dti-ErrorTooltip">
          <StyledErrorIcon data-testid="dti-ErrorTooltip-icon" />
          <Typography variant="body4">{t(globalErrorMessage)}</Typography>
        </StyledErrorContentWrapper>
      }
      {...tooltipProps}
    >
      <FormAreaWrapper
        $maxFormHeight={isAnyFilesSelected}
        data-testid="dti-FormAreaWrapper"
      >
        <input
          type="file"
          hidden
          multiple
          ref={uploadFilesRef}
          onChange={onFileInputChange}
          data-testid="dti-fileInput"
        />
        <Box
          ref={visualElRef}
          sx={{
            "&&": {
              overflow: "hidden",
            },
          }}
        >
          <Slide
            in={!isAnyFilesSelected}
            mountOnEnter
            unmountOnExit
            timeout={1000}
            direction="up"
            container={visualElRef.current}
            appear={false}
          >
            <VisualImg
              src="/img/visual.svg"
              width={191}
              height={264}
              priority
              quality={100}
              alt=""
              $displayed={!isAnyFilesSelected}
            />
          </Slide>
        </Box>
        <Box
          sx={{
            "&&": {
              height: "100%",
              position: "relative",
            },
          }}
        >
          <FormViewWrapper
            $displayed={isAnyFilesSelected}
            data-testid={"dti-FormViewWrapper"}
            ref={formViewRef}
            onWheel={onFormViewScoll}
          >
            <Slide
              in={isAnyFilesSelected}
              mountOnEnter
              unmountOnExit
              timeout={1000}
              direction="down"
            >
              <FormHeading>
                <Box>
                  <Typography variant="h2">
                    {t("landing.page.sender.form.formHeading")}
                  </Typography>
                  <Typography variant="body3" color={theme.palette.grey[600]}>
                    {t("landing.page.sender.form.remainingSpace", {
                      size: remainingSize,
                    })}
                  </Typography>
                </Box>
                <StyledUploadBtn
                  sx={{ boxShadow: 0 }}
                  color="primary"
                  onClick={openFileSelector}
                  size="small"
                  data-testid="dti-smallSelectFileBtn"
                  aria-label="Open file selector"
                >
                  <AddRounded />
                </StyledUploadBtn>
              </FormHeading>
            </Slide>
            <Grow
              in={isAnyFilesSelected}
              mountOnEnter
              unmountOnExit
              timeout={2000}
            >
              <Box
                sx={{
                  "&&": {
                    marginBottom: 8,
                  },
                }}
              >
                <FilesListWrapper>
                  <FilesListHeading>
                    <Typography variant="labelLg">
                      {t("landing.page.sender.form.selectFiles", {
                        count: countOfSelectedFiles,
                      })}
                    </Typography>
                    <Button
                      onClick={doClearAllFiles}
                      variant="text"
                      size="small"
                    >
                      {t("landing.page.sender.form.btn.removeAllFiles")}
                    </Button>
                  </FilesListHeading>

                  <List
                    sx={{
                      "&&": {
                        overflow: "hidden",
                        borderRadius: theme.spacing(0, 0, 2, 2),
                      },
                    }}
                  >
                    {selectedFiles.map((item, key) => (
                      <Grow in timeout={1000} key={item.name + key}>
                        <StyledFileListItem
                          data-testid={`dti-FileItem-${item.name}`}
                          $hasError={
                            fileQCStatus[item.name] ===
                            FileSetSessionStatus.FAILED
                          }
                          disableRipple
                          autoFocus={isFileItemAutoFocus(item.name)}
                        >
                          <StyledFileListItemIcon>
                            {IconSelector(item.type)}
                          </StyledFileListItemIcon>
                          <StyledFileListItemText
                            primary={item.name}
                            secondary={`${SizeAndUnitCalc(
                              item.size,
                            )} ${FileExtensionSelector(item.name)}`}
                          />
                          <IconButton
                            size="small"
                            onClick={() =>
                              removeFileFromFilesList(key, item.name)
                            }
                            data-testid={`dti-removeFileItem-${item.name}`}
                          >
                            <ClearRounded fontSize="small" />
                          </IconButton>
                        </StyledFileListItem>
                      </Grow>
                    ))}
                  </List>
                </FilesListWrapper>
                <ReceiversEmailsField />
                <SenderEmailField />
                <Message handleMessageChange={handleMessageChange} />
              </Box>
            </Grow>
            <SendButtonWrapper>
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={!isFormValidated || submissionData.isLoading}
                sx={{
                  "&&": {
                    width: "100%",
                  },
                }}
                onClick={submitForm}
                data-testid="dti-senderForm-submitBtn"
              >
                {t("landing.page.sender.form.sendBtn")}
              </Button>
            </SendButtonWrapper>
          </FormViewWrapper>

          <NoSelectedStateWrapper
            sx={{
              display: !isAnyFilesSelected ? "block" : "none !important",
            }}
          >
            <Box
              ref={firstViewTitlesRef}
              sx={{
                "&&": {
                  overflow: "hidden",
                  textAlign: "center",
                },
              }}
            >
              <Slide
                in={!isAnyFilesSelected}
                mountOnEnter
                unmountOnExit
                timeout={1000}
                direction="up"
                container={firstViewTitlesRef.current}
              >
                <Typography variant="h2" sx={{ "&&": { paddingBottom: 0.5 } }}>
                  {t("landing.page.sender.form.heading")}
                </Typography>
              </Slide>
              <Slide
                in={!isAnyFilesSelected}
                mountOnEnter
                unmountOnExit
                timeout={1200}
                direction="up"
              >
                <Typography variant="labelLg" color={theme.palette.grey[600]}>
                  {t("landing.page.sender.form.maxUploadSize")}
                </Typography>
              </Slide>
            </Box>
            <Grow in={!isAnyFilesSelected} timeout={1500}>
              <StyledUploadBtn
                sx={{ boxShadow: 0 }}
                color="primary"
                onClick={openFileSelector}
                data-testid="dti-LargeSelectFileBtn"
                aria-label="Open file selector"
              >
                <AddRounded />
              </StyledUploadBtn>
            </Grow>
          </NoSelectedStateWrapper>
        </Box>
      </FormAreaWrapper>
    </ErrorTooltip>
  );
};

export default SenderForm;
