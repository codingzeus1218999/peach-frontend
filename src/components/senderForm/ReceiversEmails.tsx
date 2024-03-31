import { ChangeEvent, FocusEvent, useEffect } from "react";
import { Box, Chip, TextField, Typography } from "@mui/material";
import {
  ErrorTooltip,
  StyledErrorContentWrapper,
  StyledErrorIcon,
  StyledFormLabel,
  StyledRecieversEmailWrapper,
  StyledRecieversEmails,
  StyledRecieversEmailsList,
} from "./senderForm.styles";
import { useCallback, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectReceiversField,
  setReceiversEmails,
  setReceiversEmailsAlertState,
  setReceiversEmailsValidity,
} from "@/store/slices/senderForm.slice";
import { useTranslation } from "next-i18next";
import { CheckEmail } from "@/common/utils/emailValidation";
import useTooltipProps from "@/common/hooks/useTooltipProps";

const ReceiversEmailsField: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { value: receivers, isAlertDisplayed } =
    useAppSelector(selectReceiversField);

  const { tooltipProps, forceHideAlert } = useTooltipProps({
    onHide: () => dispatch(setReceiversEmailsAlertState(false)),
    showOn: isAlertDisplayed,
  });

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [newMail, setNewMail] = useState("");

  const checkIfInputIsValid = (value: string) => {
    const inputMailList = value.split(/\,|\;/);
    const isThereAnyInvalidEmails = inputMailList.some((item) => {
      return !CheckEmail(item);
    });
    return { inputMailList, isThereAnyInvalidEmails };
  };

  const fillTheField = () => {
    if (newMail.length > 0) {
      const { inputMailList, isThereAnyInvalidEmails } =
        checkIfInputIsValid(newMail);
      if (isThereAnyInvalidEmails) {
        dispatch(setReceiversEmailsAlertState(true));
        dispatch(setReceiversEmailsValidity(false));
      } else {
        if (inputMailList.length > 1) {
          dispatch(
            setReceiversEmails([...new Set([...inputMailList, ...receivers])]),
          );
        } else {
          dispatch(setReceiversEmails([...new Set([newMail, ...receivers])]));
        }
        setNewMail("");
      }
    }
  };

  const mailInputOnEnterPressed = (keyCode: number) => {
    if (keyCode === 13) {
      fillTheField();
    }
  };

  const handleDelete = (email: string) => {
    const newList = receivers.filter((i) => i !== email);
    dispatch(setReceiversEmails([...newList]));
    if (inputRef.current !== null) inputRef.current.focus();
  };

  useEffect(()=>{
    if(receivers.length === 0){
      dispatch(setReceiversEmailsValidity(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[receivers])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      if (isAlertDisplayed) forceHideAlert();
      if (receivers.length > 0){
        dispatch(setReceiversEmailsValidity(true));
      }
    } else {
      const { isThereAnyInvalidEmails } = checkIfInputIsValid(e.target.value);
      if (!isThereAnyInvalidEmails) {
        dispatch(setReceiversEmailsValidity(true));
        if (isAlertDisplayed) forceHideAlert();
      } else {
        dispatch(setReceiversEmailsValidity(false));
      }
    }

    setNewMail(e.target.value.replace(/ /g, ""));
  };

  const openTheItems = () => {
    setIsMenuOpen(true);
  };

  const closeTheItems = () => {
    setIsMenuOpen(false);
    fillTheField();
  };

  const placeHolder = useMemo(() => {
    if (isMenuOpen == false && receivers.length > 0) return receivers[0];

    return t("landing.page.sender.form.receiversEmails.input.placeholder");
  }, [isMenuOpen, receivers, t]);

  const RenderedChips = useCallback(
    () =>
      receivers?.length > 0 ? (
        <StyledRecieversEmailsList
          $isMenuOpen={isMenuOpen}
          data-testid="dti-receiversEmailChips-container"
        >
          {receivers.map((item) => (
            <Chip
              key={item}
              label={item}
              onDelete={() => handleDelete(item)}
              size="small"
              data-flag="receiverEmailItem"
              data-testid={`dti-${item}`}
            />
          ))}
        </StyledRecieversEmailsList>
      ) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [receivers, isMenuOpen],
  );

  const SumEndingAdornment = useCallback(
    () => (
      <>
        {receivers?.length > 1 && !isMenuOpen && (
          <Chip
            label={t(
              "landing.page.sender.form.receiversEmails.extraMails.chip",
              { count: receivers.length - 1 },
            )}
            size="small"
            onClick={openTheItems}
          />
        )}
      </>
    ),
    [isMenuOpen, receivers.length, t],
  );

  return (
    <ErrorTooltip
      placement={"left"}
      arrow
      title={
        <StyledErrorContentWrapper data-testid="dti-ReceiversEmailsErrorTooltip">
          <StyledErrorIcon data-testid="dti-ReceiversEmailsErrorTooltip-icon" />
          <Typography variant="body4">
            {t("landing.page.sender.form.receiversEmails.invalid")}
          </Typography>
        </StyledErrorContentWrapper>
      }
      {...tooltipProps}
    >
      <Box>
        <StyledFormLabel>
          {t("landing.page.sender.form.receiversEmails.input.label")}
        </StyledFormLabel>
        <StyledRecieversEmailWrapper
          $isMenuOpen={isMenuOpen}
          onBlur={(e: FocusEvent<HTMLDivElement>) => {
            if (
              (e.relatedTarget as any)?.dataset["flag"] !== "receiverEmailItem"
            )
              closeTheItems();
          }}
          onFocus={openTheItems}
        >
          <StyledRecieversEmails
            disablePortal
            options={[]}
            onOpen={openTheItems}
            onClose={closeTheItems}
            popupIcon={null}
            $darkPlaceholder={receivers.length > 0 && !isMenuOpen}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  inputRef={inputRef}
                  placeholder={placeHolder}
                  size="small"
                  onKeyUp={(e) => mailInputOnEnterPressed(e.keyCode)}
                  type="email"
                  value={newMail}
                  onChange={handleInputChange}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: <SumEndingAdornment />,
                  }}
                  inputProps={{
                    ...params.inputProps,
                    value: newMail,
                    onBlur: () => {},
                    "data-testid": "dti-receivers-emails-input",
                  }}
                />
              );
            }}
            PopperComponent={RenderedChips}
          />
        </StyledRecieversEmailWrapper>
      </Box>
    </ErrorTooltip>
  );
};

export default ReceiversEmailsField;
