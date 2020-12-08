import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageTitle from "../components/Typography/PageTitle";
import { CartIcon, ChatIcon, MoneyIcon, PeopleIcon } from "../icons";
import { Card, CardBody } from "@windmill/react-ui";
import RoundIcon from "../components/RoundIcon";
import InfoCard from "../components/Cards/InfoCard";
import firebase from "../firebase";
import _ from "lodash";

const firestore = firebase.firestore();
const userRef = firestore.collection("users");

function Mail() {
  const [loading, setLoading] = useState(true);
  const [newUsers, setUsers] = useState([]);
  const [paidUsers, setPaidUsers] = useState([]);
  const [cancelledUsers, setCancelledUsers] = useState([]);

  const downloadFile = (filename, jsons = []) => {
    let data = jsons.map(({ email, displayName }) => ({
      email,
      name: displayName,
    }));
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(data));
    var dlAnchorElem = document.getElementById("downloadAnchorElem");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${filename}.json`);
    dlAnchorElem.click();
  };
  const downloadUser = () => {
    downloadFile("users", newUsers);
  };
  const downloadPaid = () => {
    downloadFile("paidUsers", paidUsers);
  };
  const downloadCancelled = () => {
    downloadFile("cancelledUsers", cancelledUsers);
  };

  useEffect(() => {
    (async () => {
      try {
        let usersQuerys = await firebase.functions().httpsCallable("getUsers");
        let docs = await usersQuerys().then(({ data }) => data);
        console.log({ docs });

        const newUsers = _.filter(docs, (user) => {
          return (
            !user.hasOwnProperty("membership") && user.hasOwnProperty("email")
          );
        });
        const paidUsers = _.filter(docs, (user) => {
          return (
            user.hasOwnProperty("membership") && user.hasOwnProperty("email")
          );
        });
        const CancelledUsers = _.filter(docs, (user) => {
          return (
            user?.membership?.canceled == true && user.hasOwnProperty("email")
          );
        });

        setUsers(newUsers);
        setPaidUsers(paidUsers);
        setCancelledUsers(CancelledUsers);
        setLoading(false);
        console.log({ paidUsers, CancelledUsers, newUsers });
      } catch (error) {
        console.log("error:", error);
      }
      // let users = await usersQuerys();
      // console.log({ users, usersQuerys });
      // window.users = users;
      return;
      let usersQuery = await userRef.get();
      console.log(usersQuery.docs[0]);

      // usersQuery.docs.forEach((user) => {
      //   console.log({ user: user.data() });
      // });
      // console.log({ users: users.docs });
    })();
  }, []);
  return (
    <>
      <PageTitle>Mail Users</PageTitle>
      <a id="downloadAnchorElem" style={{ display: "none" }}></a>
      <div className="grid gap-6 mb-6 md:grid-cols-2 xl:grid-cols-3">
        <a
          onClick={() => downloadUser()}
          // className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
          // to="/app/mailuser"
        >
          <InfoCard title="New Users" value={newUsers.length}>
            <RoundIcon
              icon={CartIcon}
              iconColorClass="text-green-500 dark:text-green-100"
              bgColorClass="bg-green-100 dark:bg-green-500"
              className="mr-4"
            />
          </InfoCard>
        </a>

        <a
          onClick={() => downloadPaid()}
          // className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
          // to="/app/mailuser"
        >
          <InfoCard title="Paying Users" value={paidUsers.length}>
            <RoundIcon
              icon={MoneyIcon}
              iconColorClass="text-blue-500 dark:text-blue-100"
              bgColorClass="bg-blue-100 dark:bg-blue-500"
              className="mr-4"
            />
          </InfoCard>
        </a>
        <a
          onClick={() => downloadCancelled()}
          // className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
          // to="/app/mailuser"
        >
          <InfoCard title="Cancelled Users" value={cancelledUsers.length}>
            <RoundIcon
              icon={ChatIcon}
              iconColorClass="text-teal-500 dark:text-teal-100"
              bgColorClass="bg-teal-100 dark:bg-teal-500"
              className="mr-4"
            />
          </InfoCard>
        </a>
      </div>
    </>
  );
}

export default Mail;
