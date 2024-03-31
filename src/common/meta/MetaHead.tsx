import Head from "next/head";

const MetaHead = (props: any) => {
  return (
    <Head>
      <meta charSet="UTF-8" key="charset" />
      <title key="title">{props.metaData.title || ""}</title>
      <meta
        name="description"
        content={props.metaData.description || ""}
        key="description"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
        key="viewport"
      />
      <meta property="og:title" content={props.metaData.title || ""} />
      <meta property="og:type" content="website" />
      <meta
        property="og:description"
        content={props.metaData.description || ""}
      />
      <meta property="og:url" content={props.metaData.ogUrl || ""} />
      <meta property="og:site_name" content="Peach Go" />
    </Head>
  );
};

export default MetaHead;
