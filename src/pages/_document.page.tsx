import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentProps,
  DocumentContext,
} from "next/document";
import { AppType } from "next/app";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "../common/utils/createEmotionCache";

import { PeachGoAppProps } from "./_app.page";
import Script from "next/script";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <Script
            id="speedcurveScript"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
          LUX=function(){function n(){return Date.now?Date.now():+new Date}var r,e=n(),t=window.performance||{},a=t.timing||{navigationStart:(null===(r=window.LUX)||void 0===r?void 0:r.ns)||e};function o(){return t.now?t.now():n()-a.navigationStart}LUX={ac:[],addData:function(n,r){return LUX.cmd(["addData",n,r])},cmd:function(n){return LUX.ac.push(n)},init:function(){return LUX.cmd(["init"])},mark:function(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];if(t.mark)return t.mark.apply(t,n);var e=n[0],a=n[1]||{};void 0===a.startTime&&(a.startTime=o());LUX.cmd(["mark",e,a])},markLoadTime:function(){return LUX.cmd(["markLoadTime",o()])},measure:function(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];if(t.measure)return t.measure.apply(t,n);var e,a=n[0],i=n[1],u=n[2];e="object"==typeof i?n[1]:{start:i,end:u};e.duration||e.end||(e.end=o());LUX.cmd(["measure",a,e])},send:function(){return LUX.cmd(["send"])},ns:e};var i=LUX;if(window.LUX_ae=[],window.addEventListener("error",(function(n){window.LUX_ae.push(n)})),window.LUX_al=[],"function"==typeof PerformanceObserver&&"function"==typeof PerformanceLongTaskTiming){var u=new PerformanceObserver((function(n){for(var r=n.getEntries(),e=0;e<r.length;e++)window.LUX_al.push(r[e])}));try{u.observe({type:"longtask"})}catch(n){}}return i}();
        `,
            }}
          />
          <Script
            strategy="beforeInteractive"
            src="https://cdn.speedcurve.com/js/lux.js?id=4409679765"
            async
            defer
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,500&display=swap"
            rel="stylesheet"
          />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon/favicon-16x16.png"
          />
          <link rel="manifest" href="/favicon/site.webmanifest" />
          <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="emotion-insertion-point" content="" />
          {(this.props as any).emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (
        App: React.ComponentType<
          React.ComponentProps<AppType> & PeachGoAppProps
        >,
      ) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
