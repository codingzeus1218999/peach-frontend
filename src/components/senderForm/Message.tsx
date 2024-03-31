import { FormLabel } from "@mui/material";
import { CharCount, FieldWrapper, StyledTextarea } from "./senderForm.styles";
import styled from "@emotion/styled";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectMessage } from "@/store/slices/senderForm.slice";
import { FC, useRef } from "react";

const TextAreaWrapper = styled.div`
  && {
    border: 1px solid rgb(208, 215, 222);
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    padding: 6px;
    &:hover {
      border: 1px solid #000;
    }
    &:focus-within {
      border: 2px solid #000;
    }
  }
`;

interface MessageProps {
  handleMessageChange: (message: string) => void;
}

const Message: FC<MessageProps> = ({ handleMessageChange }) => {
  const textMessage = useAppSelector(selectMessage);
  const dispatch = useAppDispatch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { t } = useTranslation();
  const charLimit = 500;

  const handleClick = () => {
    textareaRef!.current!.focus();
  };

  return (
    <FieldWrapper>
      <FormLabel>{t("landing.page.sender.form.message.label")}</FormLabel>
      <TextAreaWrapper
        onClick={handleClick}
        data-testid="dti-msg-textareaWrapper"
      >
        <StyledTextarea
          onChange={(e) => handleMessageChange(e.target.value)}
          value={textMessage}
          maxLength={charLimit}
          placeholder={t("landing.page.sender.form.message.placeholder") || ""}
          data-testid="dti-msg-textarea"
          ref={textareaRef}
        />
        <CharCount data-testid="char-count">
          {textMessage?.length}/{charLimit}
        </CharCount>
      </TextAreaWrapper>
    </FieldWrapper>
  );
};

export default Message;
