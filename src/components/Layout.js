import React from "react";
import Head from "next/head";

function Layout({ children, title = "FazzPay", isHeaderShown = false }) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {children}
        </>
    );
}

export default Layout;