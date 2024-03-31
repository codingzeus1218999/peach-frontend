import ReceiverUserAPIs from "@/api/services/receiverUser.api";
import { IReceiverSessionInfoResponse } from "@/api/types/receiverUser.types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next/types";
import { useCallback, useEffect, useState } from "react";
import ReceiverSummeryView from "./summery.view";
import MetaHead from "@/common/meta/MetaHead";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  requestReceiverFiles,
  selectReceiverConfimationState,
  setReceiverSessionInfo,
  setReceiverUserConfimation,
} from "@/store/slices/receiver.slice";
import ReceiverFilesView from "./sessionFiles.view";

export interface IReceiversLandingProps {
  sessionInfo: IReceiverSessionInfoResponse;
  receiverId: string;
  fileSetSessionId: string;
}

const metaData = {
  title: "Peach Go | Success! Your files have been sent",
  description: `Peach go has successfully uploaded your files`,
  ogUrl: `https://go.peach.me/success`,
};

export default function ReceiversLanding(props: IReceiversLandingProps) {
  const { sessionInfo, receiverId, fileSetSessionId } = props;
  const dispatch = useAppDispatch();
  const isSessionConfirmed = useAppSelector(selectReceiverConfimationState);

  const onConfirm = () => {
    dispatch(setReceiverUserConfimation(true));
  };

  useEffect(() => {
    if (isSessionConfirmed){
      dispatch(requestReceiverFiles({ receiverId, fileSetSessionId }));
    }
  }, [isSessionConfirmed]);

  useEffect(() => {
    dispatch(setReceiverSessionInfo(sessionInfo));
  }, [dispatch, sessionInfo]);

  const DisplayComponent = useCallback(() => {
    if (!isSessionConfirmed)
      return <ReceiverSummeryView data={sessionInfo} setConfirm={onConfirm} />;

    if (isSessionConfirmed) return <ReceiverFilesView />;
  }, [isSessionConfirmed]);

  return (
    <main style={{ height: "100%", overflowY: "auto" }}>
      <MetaHead metaData={metaData} />
      {DisplayComponent()}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const paramList: any = (params as any)["receiver"];
  if (paramList)
    if (paramList[1] !== undefined && paramList[3] !== undefined) {
      const receiverId = paramList[1];
      const fileSetSessionId = paramList[3];
      try {
        const res = await ReceiverUserAPIs.RequestSessionInfo({
          receiverId,
          fileSetSessionId,
        });
        return {
          props: {
            ...(await serverSideTranslations(locale as string)),
            sessionInfo: res.data,
            receiverId,
            fileSetSessionId,
          },
        };
      } catch (err: any) {
        // fixme handling all the exceptions
        // if( notfound )

        // if( session expired )
        if(err?.response?.status === 410) {
          return {
            redirect: {
              permanent: true,
              destination: "/expired",
            },
          };
        }

        // if( server Error )

        // all of them should redirect the user to the correct page
        return {
          redirect: {
            permanent: true,
            destination: "/404",
          },
        };
      }
    }

  return {
    redirect: {
      permanent: true,
      destination: "/404",
    },
  };
};
