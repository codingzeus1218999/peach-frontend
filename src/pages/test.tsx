import Head from "next/head";
import { Container } from "@mui/system";
import { Button, Grid, Typography } from "@mui/material";
import { StyledUploadBtn } from "@/components/senderForm/senderForm.styles";
import { AddRounded } from "@mui/icons-material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import styled from "@emotion/styled";

const Item = styled.div`
  padding: ${(p) => p.theme.spacing(1, 0)};
`;

const Heading = styled(Typography)`
  padding: ${(p) => p.theme.spacing(2, 0)};
`;

const Main = styled("main")`
  padding-bottom: 40px;
`;

export default function TestDesignStuff() {
  return (
    <>
      <Head>
        <title>Peach Go - TestDesignStuff</title>
        <meta name="description" content="Peach Go - TestDesignStuff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <Container>
          <Heading variant="h1">Animations</Heading>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <Typography>Puls Animation</Typography>
            </Grid>
            <Grid item xs={5}>
              <StyledUploadBtn sx={{ boxShadow: 0, margin: 0 }} color="primary">
                <AddRounded />
              </StyledUploadBtn>
            </Grid>
          </Grid>

          <Heading variant="h1">Fonts</Heading>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Item>
                <Typography variant="h3">Variant</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="h3">Display</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">displayLg</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="displayLg">Display large</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">displayMd</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="displayMd">Display medium</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">displaySm</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="displaySm">Display small</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">h1</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="h1">Headline Large</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">h2</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="h2">Headline Medium</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">h3</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="h3">Headline Small</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">h4</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="h4">Title large</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">h5</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="h5">Title medium</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">h6</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="h6">Title Small</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">body1</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="body1">Body xLarge</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">body2</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="body2">Body large</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">body3</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="body3">Body medium</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">body3</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="body4">Body small</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">labelLg</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="labelLg">Label large</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">labelMd</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="labelMd">Label medium</Typography>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">labelSm</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Item>
                <Typography variant="labelSm">Label small</Typography>
              </Item>
            </Grid>
          </Grid>

          <Heading variant="h1">Buttons</Heading>
          <Heading variant="h2">Contained</Heading>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="contained" size="large">
                Large
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large icon left</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddBoxIcon />}
              >
                Large
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large icon right</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="contained" size="large" endIcon={<AddBoxIcon />}>
                Large
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large disabled</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="contained" disabled size="large">
                Large
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button medium</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="contained" size="medium">
                Medium
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button medium icon left</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button
                variant="contained"
                size="medium"
                startIcon={<AddBoxIcon />}
              >
                Medium
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">
                  Button medium icon right
                </Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button
                variant="contained"
                size="medium"
                endIcon={<AddBoxIcon />}
              >
                Medium
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button medium disabled</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="contained" disabled size="medium">
                Medium
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button small</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="contained" size="small">
                Small
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large icon left</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddBoxIcon />}
              >
                Small
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large icon right</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="contained" size="small" endIcon={<AddBoxIcon />}>
                Small
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button small disabled</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="contained" disabled size="small">
                Small
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button full width</Typography>
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" fullWidth size="large">
                Full width
              </Button>
            </Grid>
          </Grid>

          <Heading variant="h2">Outlined</Heading>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="outlined" size="large">
                Large
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large icon left</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<AddBoxIcon />}
              >
                Large
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large icon right</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="outlined" size="large" endIcon={<AddBoxIcon />}>
                Large
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large disabled</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="outlined" disabled size="large">
                Large
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button medium</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="outlined" size="medium">
                Medium
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button medium icon left</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button
                variant="outlined"
                size="medium"
                startIcon={<AddBoxIcon />}
              >
                Medium
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">
                  Button medium icon right
                </Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="outlined" size="medium" endIcon={<AddBoxIcon />}>
                Medium
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button medium disabled</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="outlined" disabled size="medium">
                Medium
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button small</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="outlined" size="small">
                Small
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large icon left</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddBoxIcon />}
              >
                Small
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large icon right</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="outlined" size="small" endIcon={<AddBoxIcon />}>
                Small
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button small disabled</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="outlined" disabled size="small">
                Small
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button full width</Typography>
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Button variant="outlined" fullWidth size="large">
                Full width
              </Button>
            </Grid>
          </Grid>

          <Heading variant="h2">Text</Heading>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="text" size="large">
                Large
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large icon left</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="text" size="large" startIcon={<AddBoxIcon />}>
                Large
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large icon right</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="text" size="large" endIcon={<AddBoxIcon />}>
                Large
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large disabled</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="text" disabled size="large">
                Large
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button medium</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="text" size="medium">
                Medium
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button medium icon left</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="text" size="medium" startIcon={<AddBoxIcon />}>
                Medium
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">
                  Button medium icon right
                </Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="text" size="medium" endIcon={<AddBoxIcon />}>
                Medium
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button medium disabled</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="text" disabled size="medium">
                Medium
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button small</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="text" size="small">
                Small
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large icon left</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="text" size="small" startIcon={<AddBoxIcon />}>
                Small
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button large icon right</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="text" size="small" endIcon={<AddBoxIcon />}>
                Small
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <Typography variant="body1">Button small disabled</Typography>
              </Item>
            </Grid>
            <Grid item xs={9}>
              <Button variant="text" disabled size="small">
                Small
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Main>
    </>
  );
}
