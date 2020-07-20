import Head from "next/head";
import Header from "./header";

const Layout = (props: any) => {
  return (
    <div>
      <Head>
        <title>Code Compare</title>
      </Head>
      <Header />

      <main className={`m-16 mt-24`}>
        <div className="w-full">{props.children}</div>
      </main>
    </div>
  );
};

export default Layout;
