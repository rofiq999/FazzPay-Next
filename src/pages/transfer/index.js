import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// import css
import css from '../../styles/Transfer.module.css';

// import components
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';

import CardProfileTransfer from '../../components/card_profile_transfer/ProfileTransfer';
import Drawers from "../../components/SidebarToggle/Drawer";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Spinner from "react-bootstrap/Spinner";

function Transfer() {
  const router = useRouter();
  // const query = router.query;
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  console.log(router);
  const searchHandler = (e) => {
    // if (e) {
    //    // router.push({
    //    //    pathname: `/transfer/?search=${e.target.value}`,
    //    // });
    //    // console.log("do validate");
    // }
    console.log(search);
    setTimeout(() => {
      setSearch(e.target.value);
    }, 1000);
    setPage(1);
    console.log(search);

    if (e.target.value !== null) {
      router.replace(
        `/transfer/?page=${page}&limit=${limit}&search=${e.target.value}`
      );
    }
  };
  useEffect(() => {
    setLoading(true);
    const getToken = Cookies.get("token");
    if (search === "") {
      router.replace(`/transfer/?page=${page}&limit=${limit}`);
    }
    router.replace(`/transfer/?page=${page}&limit=${limit}&search=${search}`);

    axios
      .get(
        `https://fazzpay-rose.vercel.app/user?page=${page}&limit=${limit}&search=${search}`,

        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      )
      .then((res) => {
        // console.log(res.data);
        setData(res.data.data);
        setPagination(res.data.pagination);
        setLoading(false);

        // setPage(1);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [search, page]);

  const getData = () => {
    setLoading(true);

    const getToken = Cookies.get("token");
    if (search === "") {
      router.replace(
        `/transfer/?page=${page}&limit=${limit}&search=${search}`
      );
    }
    router.replace(`/transfer/?page=${page}&limit=${limit}&search=${search}`);
    axios
      .get(
        `https://fazzpay-rose.vercel.app/user?page=${page}&limit=${limit}&search=${search}`,

        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      )
      .then((res) => {
        // console.log(res.data);

        setData(res.data.data);
        setPagination(res.data.pagination);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <>
      <Layout title="Transfer">
        <Header />
        <div className={`container-fluid ${css.background_container}`}>
          <div className={`container d-flex gap-4 ${css.content_inti}`}>
            <section className="col-12 col-sm-12 col-md-3 d-none d-sm-none d-lg-block ">
              <Sidebar page="transfer" />
            </section>
            <div
              className={`col-lg-9 col-md-12 col-sm-12 ${css.content_right}`}
            >
              <div className={""}>
                <p className={css.search_receiver}>Search Receiver</p>
                {/* search box */}
                <div className={css.search_box}>
                  <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
                  <input
                    type="text"
                    name=""
                    placeholder="Search receiver here"
                    onChange={searchHandler}
                  />
                </div>
                {/* profile */}
                <div className={css.scroll_bar}>
                  <div className={css.scroll}>
                    {loading ? (
                      <div className="my-5 justify-content-center align-items-center py-5 d-flex">
                        <Spinner animation="border" />
                      </div>
                    ) : (
                      data.map((user) => (
                        <CardProfileTransfer
                          key={user.id}
                          idUser={user.id}
                          images={
                            user.image === null
                              ? `${process.env.CLOUDINARY_LINK}`
                              : `${process.env.CLOUD}${user.image}`
                          }
                          name={user.firstName}
                          noTelp={user.noTelp}
                        />
                      ))
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  {page <= 1 ? (
                    <button
                      disabled
                      className="btn btn-primary mx-2 fw-bold"
                      onClick={() => {
                        setPage(page - 1);
                        getData();
                      }}
                    >
                      prev
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary mx-2 fw-bold"
                      onClick={() => {
                        setPage(page - 1);
                        getData();
                      }}
                    >
                      prev
                    </button>
                  )}

                  <p>
                    {data === [] ? setPage(0) : page} /{" "}
                    {pagination.totalPage}
                  </p>
                  {page === pagination.totalPage ? (
                    <button
                      disabled
                      className="btn btn-primary mx-2 fw-bold"
                      onClick={() => {
                        setPage(page + 1);
                        getData();
                      }}
                    >
                      next
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary mx-2 fw-bold"
                      onClick={() => {
                        setPage(page + 1);
                        getData();
                      }}
                    >
                      next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Drawers pages="transfer" />
      </Layout>
    </>
  );
}

export default Transfer;
