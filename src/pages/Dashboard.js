import React, { useState, useEffect } from "react";

import CTA from "../components/CTA";
import InfoCard from "../components/Cards/InfoCard";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Line } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import PageTitle from "../components/Typography/PageTitle";
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from "../icons";
import RoundIcon from "../components/RoundIcon";
import response from "../utils/demo/tableData";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from "@windmill/react-ui";
import { LoadingIcon } from "../icons";
import firebase from "../firebase";
import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from "../utils/demo/chartsData";

function Dashboard() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotal] = useState(100);
  const [lastDoc, setLastDoc] = useState(null);

  // pagination setup
  const resultsPerPage = 100;
  // const totalResults = response.length;

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  const getData = async () => {
    let container = [];
    setLoading(true);
    let query = await firebase
      .firestore()
      .collection("vouchers")
      .limit(resultsPerPage)
      .get();
    if (query.empty) return;
    let docs = query.docs;
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      let data = element.data();
      let last = index + 1 == docs.length;
      if (last) setLastDoc(element);
      container.push(data);
    }
    setData(container);
    setLoading(false);
  };
  useEffect(() => {
    getData();
    // console.log("om");
    // setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [page]);

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      <CTA />
      {loading ? (
        <>
          <LoadingIcon />
        </>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Client</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Starting Date</TableCell>
                <TableCell>Expiry Date</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {data.map((voucher, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{voucher.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {voucher.code}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm"> {voucher.isFixed ? `$${voucher.discount / 100}`: `${voucher.discount}%`}</span>
                  </TableCell>
                  <TableCell>
                    <Badge type="primary">
                      {voucher.isFixed ? "Fixed" : "Unique"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(voucher.startsAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(voucher.expiresAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooter>
            {/* <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          /> */}
          </TableFooter>
        </TableContainer>
      )}{" "}
    </>
  );
}

export default Dashboard;
