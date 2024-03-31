"use client";

import { FormLabel, TextField, Typography } from "@mui/material";
import {
  ErrorTooltip,
  FieldWrapper,
  StyledErrorContentWrapper,
  StyledErrorIcon,
} from "./senderForm.styles";
import { ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectSenderField,
  setSenderEmail,
  setSenderEmailAlertState,
  setSenderEmailValidity,
} from "@/store/slices/senderForm.slice";
import { useTranslation } from "next-i18next";
import { CheckEmail } from "@/common/utils/emailValidation";
import useTooltipProps from "@/common/hooks/useTooltipProps";

const SenderEmailField: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { value, isAlertDisplayed } = useAppSelector(selectSenderField);
  const { tooltipProps, forceHideAlert } = useTooltipProps({
    onHide: () => dispatch(setSenderEmailAlertState(false)),
    showOn: isAlertDisplayed,
  });

  const checkEmailValidity = () => {
    if (value.length > 1) {
      if (!CheckEmail(value)) {
        dispatch(setSenderEmailAlertState(true));
      } else {
        dispatch(setSenderEmailAlertState(false));
      }
    }
  };

  const onInputValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      if (isAlertDisplayed) forceHideAlert();
    }
    dispatch(setSenderEmail(e.target.value.replace(/ /g, "")));
    if (CheckEmail(e.target.value)) {
      if (isAlertDisplayed) forceHideAlert();
      dispatch(setSenderEmailValidity(true));
    } else {
      dispatch(setSenderEmailValidity(false));
    }
  };

  return (
    <ErrorTooltip
      placement={"left"}
      arrow
      title={
        <StyledErrorContentWrapper data-testid="dti-SenderEmailErrorTooltip">
          <StyledErrorIcon data-testid="dti-SenderEmailErrorTooltip-icon" />
          <Typography variant="body4">
            {t("landing.page.sender.form.senderEmail.invalid")}
          </Typography>
        </StyledErrorContentWrapper>
      }
      {...tooltipProps}
    >
      <FieldWrapper>
        <FormLabel>
          {t("landing.page.sender.form.senderEmail.input.label")}
        </FormLabel>
        <TextField
          placeholder={`${t(
            "landing.page.sender.form.senderEmail.input.placeholder",
          )}`}
          variant="outlined"
          value={value}
          onChange={onInputValueChange}
          onBlur={checkEmailValidity}
          inputProps={{
            "data-testid": "dti-sender-email-input",
          }}
          autoComplete="email"
        />
      </FieldWrapper>
    </ErrorTooltip>
  );
};

export default SenderEmailField;
