"use client";

import styled from "@emotion/styled";

export const FilesListWrapper = styled.div`
  && {
    min-width: 300px;
    position: fixed;
    bottom: 36px;
    left: 60px;
    margin: auto;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 16px;
  }
`;

export const Header = styled.div`
  && {
    display: flex;
    align-items: center;
    padding: 24px 24px 16px;
    border-radius: 16px 16px 0 0;
  }
`;

export const Alert = styled.div`
  && {
    background: #ff9565;
    border-radius: 64px;
    padding: 0 7px;
    margin-right: 16px;
    font-size: 14px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const FileList = styled.div`
  && {
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 10px 8px;
    background: #ff95651f;
    border-radius: 0 0 16px 16px;
  }
`;

export const File = styled.div`
  && {
    padding: 4px 8px 4px 16px;
    width: 100%;
  }
`;

export const FileContainer = styled.div`
  && {
    padding: 6px 0;
  }
`;
