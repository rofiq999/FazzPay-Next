import React, { useEffect, useState } from "react";

//import css
import styles from "../../styles/Rumah.module.css";

//import components
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/sidebar/Sidebar";
import CardTransaction from "../../components/CardTransaction/index";
import Spinner from "react-bootstrap/Spinner";

//import image
import Image from "next/image";
import icon_grid from "../../assets/dashboard/icon_grid.png";
import icon_adobe from "../../assets/dashboard/icon_adobe.png";
import icon_arrow_up from "../../assets/dashboard/icon_arrow_up.png";
import icon_log_out from "../../assets/dashboard/icon_log_out.png";
import icon_user from "../../assets/dashboard/icon_user.png";
import icon_plus from "../../assets/dashboard/icon_plus.png";
import icon_netflix from "../../assets/dashboard/icon_netflix.png";
import icon_samuel from "../../assets/dashboard/icon_samuel.png";
import icon_christine from "../../assets/dashboard/icon_christine.png";
import icon_arrow_blue from "../../assets/dashboard/icon_arrow_blue.png";
import icon_plus_blue from "../../assets/dashboard/icon_plus_blue.png";
import icon_arrow_green from "../../assets/dashboard/icon_arrow_green.png";
import icon_arrow_red from "../../assets/dashboard/icon_arrow_red.png";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";

import authActions from "../../redux/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import Drawers from "../../components/SidebarToggle/Drawer";
import axios from "axios";
import Link from "next/link";
import Layout from "../../components/Layout";

// charts
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
);

function Index() {
   const router = useRouter();
   const dispatch = useDispatch();
   const profile = useSelector((state) => state.auth.profile);
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const seeAllHandler = () => {
      router.push("/history");
   };
   const transferHandler = () => {
      router.push("/transfer");
   };

   const [show, setShow] = useState(false);
   const handleClosemodal = () => setShowmodal(false);
   const handleShowmodal = () => setShowmodal(true);
   const handleShow = () => {
      console.log(show), setShow(false);
   };

   const handleclickshow = () => {
      console.log(show), setShow(true);
   };

   useEffect(() => {
      // if(getToken)
      const getToken = Cookies.get("token");
      const getId = Cookies.get(`id`);
      dispatch(authActions.userThunk(getToken, getId));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      setLoading(true);
      const getToken = Cookies.get("token");
      axios
         .get(
            "https://fazzpay-rose.vercel.app/transaction/history?page=1&limit=4&",
            {
               headers: {
                  Authorization: `Bearer ${getToken}`,
               },
            }
         )
         .then((res) => {
            setData(res.data.data);
            setLoading(false);
         })
         .catch((err) => {
            console.log(err);
            setLoading(false);
         });
   }, []);

   // update income expense
   const [chart, setChart] = useState([]);
   const [listExpense, setListExpense] = useState([]);
   const [listIncome, setListIncome] = useState([]);

   // console.log(listExpense);
   // console.log(listIncome);
   // console.log(chart);
   useEffect(() => {
      setLoading(true);

      const getToken = Cookies.get("token");
      const getId = Cookies.get(`id`);
      axios
         .get(`https://fazzpay-rose.vercel.app/dashboard/${getId}`, {
            headers: {
               Authorization: `Bearer ${getToken}`,
            },
         })
         .then((res) => {
            setChart(res.data.data);
            setListExpense(res.data.data.listExpense);
            setListIncome(res.data.data.listIncome);
            setLoading(false);
         })
         .catch((err) => {
            console.log(err);
            setLoading(false);
         });
   }, []);
   // topup
   const [amount, setAmount] = useState("");
   const [link, setLink] = useState("");
   const valuePrice = (e) => {
      if (e.target.value.length === 0) setAmount("");
      if (/[0-9]{1,12}/g.test(e.target.value[e.target.value.length - 1]))
         setAmount(e.target.value);
   };
   const handleTopup = () => {
      const getToken = Cookies.get("token");
      if (amount === "") {
         return toast.error("Please input Topup");
      }
      if (amount < 10000) {
         return toast.error("Top up minumum IDR. 10.000");
      }

      axios
         .post(
            `https://fazzpay-rose.vercel.app/transaction/top-up`,
            {
               amount: amount,
            },
            {
               headers: {
                  Authorization: `Bearer ${getToken}`,
               },
            }
         )
         .then(
            (res) => setLink(res.data.data.redirectUrl),
            setTimeout(() => {
               setShow(false);
            }, 7000)
         )
         .catch((err) => toast.error(err.response.data.msg));
   };

   const rupiah = (number) => {
      if (number) {
         return `IDR ${number
            .toString()
            .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}`;
      }
   };

   // grafik
   const labels = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
   ];
   const options = {
      responsive: true,
      plugins: {
         legend: {
            position: "top",
         },
         title: {
            display: true,
            text: "Chart Income / Expense",
         },
      },
   };
   const dataGrafik = {
      labels,
      datasets: [
         {
            label: "Income",
            data: listIncome.map((e) => e.total),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
         },
         {
            label: "Expense",
            data: listExpense.map((e) => e.total),
            backgroundColor: "rgba(53, 162, 235, 0.5)",
         },
      ],
   };

   return (
      <>
         <Layout title="Home">
            <Header />
            <main>
               <section className={styles["section-one"]}>
                  <div
                     className={`${styles["content-all"]} px-3 justify-content-center`}
                  >
                     <section className="col-12 col-sm-12 col-md-3 d-none d-sm-none d-lg-block ">
                        <Sidebar page="home" />
                     </section>
                     <div className={`${styles["content-right"]} h-100`}>
                        <div className={styles["content-one"]}>
                           <div className={styles["content-balance"]}>
                              <p className={styles["text-balance"]}>Balance</p>
                              <p className={styles["text-price"]}>
                                 {profile.balance
                                    ? rupiah(profile.balance)
                                    : "IDR. 0"}
                              </p>
                              <p className={styles["text-phone"]}>
                                 {profile.number
                                    ? profile.number
                                    : "Phone Number Empty"}
                              </p>
                           </div>
                           <div className={styles["content-tf"]}>
                              <div
                                 className={styles["border-tf"]}
                                 onClick={transferHandler}
                              >
                                 <Image
                                    src={icon_arrow_blue}
                                    alt="icon_arrow_blue"
                                 />
                                 <p className={styles["text-transfer"]}>
                                    Transfer
                                 </p>
                              </div>
                              <div
                                 className={styles["border-tf"]}
                                 onClick={handleclickshow}
                              >
                                 <Image
                                    src={icon_plus_blue}
                                    alt="icon_arrow_blue"
                                 />
                                 <p
                                    className={styles["text-transfer"]}
                                    onClick={() => setShow(true)}
                                 >
                                    Top Up
                                 </p>
                              </div>
                           </div>
                        </div>

                        {!show ? null : (
                           <section className={`${styles.box}`}>
                              <section className={styles.content_box}>
                                 <span
                                    className="d-flex justify-content-between"
                                    onClick={() => setShow(false)}
                                 >
                                    <h3 className={styles.title_modal}>
                                       Topup
                                    </h3>
                                    <div
                                       className={styles.cursor}
                                       onClick={handleShow}
                                    >
                                       <i className="fa-solid fa-xmark fs-2"></i>
                                    </div>
                                 </span>
                                 <p className={styles.desc_modal}>
                                    Enter the amount of money, and click <br />{" "}
                                    submit
                                 </p>
                                 <span className={styles.input_}>
                                    <input
                                       type="number"
                                       placeholder="IDR.0"
                                       className={styles.arrow}
                                       value={amount}
                                       onChange={valuePrice}
                                    />
                                 </span>
                                 <br />
                                 {link === "" ? null : (
                                    <Link href={link} target="_blank">
                                       Topup Payment Click Here
                                    </Link>
                                 )}
                                 <span className="d-flex justify-content-end align-items-center">
                                    <button
                                       className={styles.btn_submit}
                                       onClick={handleTopup}
                                    >
                                       Submit
                                    </button>
                                 </span>
                              </section>
                           </section>
                        )}

                        <div className={styles["content-grap"]}>
                           <div className={styles["content-grap-left"]}>
                              <div className={styles["grap-row"]}>
                                 <div className={styles["grap-column"]}>
                                    <Image
                                       src={icon_arrow_green}
                                       alt="icon_arrow_green"
                                    />
                                    <p className={styles["income"]}>Income</p>
                                    <p className={styles["income-price"]}>
                                       {rupiah(chart.totalIncome)}
                                    </p>
                                 </div>
                                 <div className={styles["grap-column"]}>
                                    <Image
                                       src={icon_arrow_red}
                                       alt="icon_arrow_red"
                                    />
                                    <p className={styles["income"]}>Expense</p>
                                    <p className={styles["income-price"]}>
                                       {rupiah(chart.totalExpense)}
                                    </p>
                                 </div>
                              </div>
                              {/* content grafik */}
                              <div className="px-3 w-100 h-auto">
                                 <Bar
                                    className="w-100 h-100"
                                    options={options}
                                    data={dataGrafik}
                                 />
                              </div>
                           </div>
                           <div className={styles["content-grap-right"]}>
                              <div className={styles["content-transaksi"]}>
                                 <p className={styles["text-trans"]}>
                                    Transaction History
                                 </p>
                                 <p
                                    className={styles["see-all"]}
                                    onClick={seeAllHandler}
                                 >
                                    See all
                                 </p>
                              </div>
                              {loading ? (
                                 <div className="my-5 justify-content-center align-items-center py-5 d-flex">
                                    <Spinner animation="border" />
                                 </div>
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
                        </div>
                     </div>
                  </div>
               </section>
            </main>
            <Footer />
            <Drawers pages="home child" />
            <ToastContainer
               position="top-center"
               autoClose={2000}
               hideProgressBar={false}
               closeOnClick={true}
               pauseOnHover={true}
               draggable={true}
               theme="light"
            />
         </Layout>
      </>
   );
}

export default Index;