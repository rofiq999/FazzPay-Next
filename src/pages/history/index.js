import React, { useState, useEffect } from "react";
import Image from "next/image";
//import components
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/sidebar/Sidebar";
import CardTransaction from "../../components/CardTransaction/index";
import styles from "../../styles/History.module.css";
// import component
import Drawers from "../../components/SidebarToggle/Drawer";
import Cookies from "js-cookie";
import axios from "axios";
import Layout from "../../components/Layout";
import { useRouter, withRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";

function Index() {
  const router = useRouter();

  const query = router.query;

  const [data, setData] = useState([]);
  const [sort, setSort] = useState("filter=WEEK");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState("");
  const [limit, setLimit] = useState(6);
  const [pagination, setPagination] = useState([]);
  const [loading, setLoading] = useState(false);
  const sortHandler = (element) => {
    setSort(element.target.value);
    setPage(1);
    router.replace(
      `/history?page=${page}&limit=${limit}&${element.target.value}`
    );
  };

  useEffect(() => {
    setLoading(true);
    const getToken = Cookies.get("token");
    router.replace(`/history?page=${page}&limit=${limit}&${sort}`);
    axios
      .get(
        `https://fazzpay-rose.vercel.app/transaction/history?page=${page}&limit=${limit}&${sort}`,
        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      )
      .then((res) => {
        // console.log(res.data);
        setData(res.data.data);
        setPagination(res.data);
        setTotalPage(res.data.pagination.totalPage);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [page, limit, sort]);

  const rupiah = (number) => {
    if (number) {
      return `IDR ${number
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}`;
    }
  };

  // pagination
  const getData = () => {
    const getToken = Cookies.get("token");

    axios
      .get(
        `https://fazzpay-rose.vercel.app/transaction/history?page=${page}&limit=${limit}&${sort}`,

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
        setPage(res.data.data.pagination.page);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Layout title="History">
        <Header />
        <div className={`container-fluid ${styles.background_container}`}>
          <div className={`container d-flex gap-4 ${styles.content_inti}`}>
            <section className="col-sm-12 col-md-3 d-none d-sm-none d-lg-block ">
              <Sidebar page="home child" />
            </section>
            <div
              className={`px-0 col-lg-9 col-md-12 col-sm-12 mx-auto ${styles.content_right}`}
            >
              <section className={`${styles.hitory__bar}`}>
                <div
                  className={`${styles.title_bar} d-flex justify-content-between align-items-center`}
                >
                  <h1 className={styles.title}>Transaction History</h1>
                  <select
                    className={`${styles.select_filter}`}
                    aria-label="-- Select Filter --"
                    onChange={sortHandler}
                  >
                    <option selected value="filter=WEEK">
                      Weekly
                    </option>
                    <option value="filter=MONTH">Monthly</option>
                    <option value="filter=YEAR">Year</option>
                  </select>
                </div>
                {/* modal history */}
                <div className={styles.history__modal}>
                  {loading ? (
                    <div className="my-5 justify-content-center align-items-center py-5 d-flex">
                      <Spinner animation="border" />
                    </div>
                  ) : pagination.totalPage <= 0 ? (
                    <h1 className="d-none">data not found</h1>
                  ) : (
                    data.map((user) => (
                      <CardTransaction
                        key={user.id}
                        balance={rupiah(user.amount)}
                        fullName={user.fullName}
                        image={
                          user.image === null
                            ? `${process.env.CLOUDINARY_LINK}`
                            : `${process.env.CLOUD}${user.image}`
                        }
                        type={user.type}
                        status={user.status}
                      />
                    ))
                  )}
                </div>
              </section>
              <div className="d-flex justify-content-center align-items-center pt-3">
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
                  {data === [] ? setPage(0) : page} / {totalPage}
                </p>
                {page === totalPage ? (
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
        <Footer />
        <Drawers pages="home child" />
      </Layout>
    </>
  );
}

export default withRouter(Index);