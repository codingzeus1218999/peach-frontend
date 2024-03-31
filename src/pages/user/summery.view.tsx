import { IReceiverSessionInfoResponse } from "@/api/types/receiverUser.types";
import { Container } from "@mui/system";
import { Trans } from "next-i18next";
import { useTranslation } from "next-i18next";

import { Box, Button, Grid, Link, Typography } from "@mui/material";
import PeachTermsToast from "@/components/shared/PeachTermsToast";
import { MessageBox, StyledVisualImg, SummeryInfoBox } from "./receiver.style";
import { SizeAndUnitCalc } from "@/common/utils/fileUtils";
import dayjs from "dayjs";
import theme from "@/styles/theme";


interface IReceiverSummeryViewProps {
  data: IReceiverSessionInfoResponse;
  setConfirm: () => void;
}

const ReceiverSummeryView: React.FC<IReceiverSummeryViewProps> = (props) => {
  const { data, setConfirm } = props;
  const { t } = useTranslation();

  return (
    <>
      <PeachTermsToast />
      <Container maxWidth={"xl"}>
        <Grid container spacing={2} sx={{ height: "100vh", marginTop: 0 }}>
          <Grid item xs={6}>
            <MessageBox>
              <Box px={{ md: 5, lg: 10 }} mb={20}>
                <Typography variant="displayMd">
                  <Trans i18nKey={"landing.page.receiver.heading"} />
                </Typography>
                <Typography variant="body1" mt={1.5}>
                  {t("landing.page.receiver.paragraph")}
                </Typography>
                <Typography variant="body1" mt={3}>
                  {t("landing.page.receiver.sub.paragraph")}
                </Typography>
                <StyledVisualImg
                  src="/img/receiver-visual.svg"
                  width={600}
                  height={355}
                  priority
                  quality={100}
                  alt="receiver welcome page"
                />
              </Box>
            </MessageBox>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                "&&": {
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
            >
              <SummeryInfoBox>
                <Box
                  sx={{
                    "&&": {
                      flexDirection: "column",
                      alignItems: "flex-start",
                      display: "flex",
                      gap: "16px",
                    },
                  }}
                >
                  <Typography variant="h1">
                    {t("landing.page.receiver.form.heading")}
                  </Typography>
                  <Typography variant="body2">
                    <b>{data.senderEmail}</b>
                    {t("landing.page.receiver.form.paragraph", {
                      count: data.numberOfFiles,
                      size: SizeAndUnitCalc(data.totalFilesize),
                      expiryDate: dayjs(data.expirationDate).format(
                        "DD MMM YYYY",
                      ),
                    })}
                  </Typography>
                  <Typography
                    variant="body3"
                    sx={{
                      "&&": {
                        color: theme.palette.grey[600],
                      },
                    }}
                  >
                    <Trans>
                      landing.page.sender.terms.toast
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`/terms`}
                        style={{
                          textDecoration: "underline",
                          color: theme.palette.grey[600],
                        }}
                      >
                        link
                      </Link>
                    </Trans>
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    "&&": {
                      width: "100%",
                    },
                  }}
                  data-testid="dti-reciever-confirmationBtn"
                  onClick={() => setConfirm()}
                >
                  {t("landing.page.receiver.form.submitBtn")}
                </Button>
              </SummeryInfoBox>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ReceiverSummeryView;
