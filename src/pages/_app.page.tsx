/* global Lux */
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { ThemeProvider as MUIThemeProvider } from "@mui/material";
import store from "../store";
import theme from "../styles/theme";
import { appWithTranslation } from "next-i18next";
import Layout from "@/components/layout";
import { ThemeProvider } from "@emotion/react";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../common/utils/createEmotionCache";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { setAxiosBaseUrl } from "@/common/utils/setupAxios";

const clientSideEmotionCache = createEmotionCache();

export interface PeachGoAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

setAxiosBaseUrl();

function App(props: PeachGoAppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      LUX.init();
    };

    const handleRouteChangeEnd = () => {
      LUX.send();
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeEnd);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeEnd);
    };
  }, [router]);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Provider store={store}>
        <MUIThemeProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </MUIThemeProvider>
      </Provider>
    </CacheProvider>
  );
}
export default appWithTranslation(App);
