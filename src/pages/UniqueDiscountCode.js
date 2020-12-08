import React, { useState, useEffect } from "react";

import { Card, CardBody } from "@windmill/react-ui";

import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
import { Input, Textarea, Label, Button, HelperText } from "@windmill/react-ui";
import firebase from "../firebase";
import { useFormik, Form, useField } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function arrayToCSV(objArray) {
  const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
  let str =
    `${Object.keys(array[0])
      .map((value) => `"${value}"`)
      .join(",")}` + "\r\n";

  return array.reduce((str, next) => {
    str +=
      `${Object.values(next)
        .map((value) => `"${value}"`)
        .join(",")}` + "\r\n";
    return str;
  }, str);
}

const downloadFile = (filename, str) => {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(str);
  var dlAnchorElem = document.getElementById("downloadAnchorElem");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `${filename}.csv`);
  dlAnchorElem.click();
};
const ErrorText = ({ error, touched }) => {
  return (
    <>{touched && error && <HelperText valid={false}>{error}</HelperText>}</>
  );
};
function formatDate(date) {
  console.log({ date });
  return new Date(date).toLocaleDateString();
}

const DiscountCodeSchema = Yup.object().shape({
  code: Yup.string()
    .required("Code is required")
    .min(3, "Minimum of 3 words")
    .max(12, "maximum of 12 words"),
  name: Yup.string()
    .required("Name is required")
    .min(3, "Minimum of 3 words")
    .max(12, "maximum of 12 words"),
  description: Yup.string()
    .required("Description is required")
    .min(3, "Minimum of 3 words")
    .max(200, "maximum of 200 words"),
  discount: Yup.number()
    .required("Discount is required")
    .min(5, "Minimum of 5 discount removed")
    .max(100, "maximum of 100 percent"),

  expiresAt: Yup.date().min(
    Yup.ref("startsAt"),
    ({ min }) => `Date needs to be before ${formatDate(min)}!!`
  ),
});
function DiscountCode() {
  useEffect(() => {
    (async () => {
      // try {
      //   let usersQuerys = await firebase
      //     .functions()
      //     .httpsCallable("createDiscountCode");
      //   let docs = await usersQuerys({
      //     omo: "yeah",
      //   }).then(({ data }) => data);
      //   console.log({ docs });
      // } catch (error) {
      //   console.log({ error });
      // }
    })();
  }, []);
  const {
    errors,
    values,
    handleBlur,
    handleChange,
    touched,
    handleSubmit,
    isSubmitting,
    validateForm,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: {
      code: "",
      name: "",
      description: "",
      discount: "",
      number: "",
      startsAt: new Date(),
      expiresAt: new Date(dayjs().add(30, "days").toDate()),
    },
    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));
      try {
        let data = { ...values, unique: true };
        data.startsAt = new Date(values.startsAt).toISOString();
        data.expiresAt = new Date(values.expiresAt).toISOString();
        console.log({data})
        return 
        let usersQuerys = await firebase
          .functions()
          .httpsCallable("createUniqueCode", data);
        let docs = await (await usersQuerys(values)).data;
        // .then(({ data }) => data);
        let vouchers = docs.data;
        downloadFile(values.name, arrayToCSV(vouchers));
      } catch (error) {
        console.log({ error });
      }
    },
    validationSchema: DiscountCodeSchema,
  });

  return (
    <>
      <PageTitle>Discount Code</PageTitle>
      <SectionTitle>Generate unique discount codes here</SectionTitle>
      <div>
        <Card>
          <CardBody>
            <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
              Discount Code Generator
            </p>
            <p className="text-gray-600 dark:text-gray-400"></p>
            <Label htmlFor="name">
              <span>Name</span>
            </Label>
            <Input
              placeholder="BWS_2020"
              className="mt-1"
              id="name"
              name="name"
              type="text"
              onChange={handleChange}
              value={values.name}
            />
            <ErrorText error={errors.name} touched={touched.name} />

            <Label htmlFor="code">
              <span>Code</span>
            </Label>
            <Input
              placeholder="BWS_2020"
              className="mt-1"
              id="code"
              name="code"
              type="text"
              onChange={handleChange}
              value={values.code}
            />
            <ErrorText error={errors.code} touched={touched.code} />

            <Label htmlFor="number">
              <span>Number of code to be generated</span>
            </Label>
            <Input
              placeholder="10"
              className="mt-1"
              id="number"
              name="number"
              type="text"
              onChange={handleChange}
              value={values.number}
            />
            <ErrorText error={errors.number} touched={touched.number} />

            <Label htmlFor="discount">
              <span>Discount</span>
            </Label>
            <Input
              placeholder="Percentage discount. e.g. 12%"
              className="mt-1"
              id="discount"
              name="discount"
              type="text"
              onChange={handleChange}
              value={values.discount}
            />
            <ErrorText error={errors.discount} touched={touched.discount} />

            <Label htmlFor="description">
              <span>Description</span>
            </Label>
            <Textarea
              className="mt-1"
              rows="3"
              className="mt-1"
              id="description"
              name="description"
              type="text"
              onChange={handleChange}
              value={values.description}
            />
            <ErrorText
              error={errors.description}
              touched={touched.description}
            />

            <Label htmlFor="startsAt">
              <span>Start Date</span>
            </Label>
            <DatePicker
              name="startsAt"
              selected={values.startsAt}
              onChange={(date) => setFieldValue("startsAt", date)}
              minDate={new Date()}
            />
            <ErrorText error={errors.startsAt} touched={touched.startsAt} />

            <Label htmlFor="expiresAt">
              <span>End Date</span>
            </Label>
            <DatePicker
              name="startsAt"
              selected={values.expiresAt}
              onChange={(date) => setFieldValue("expiresAt", date)}
              minDate={new Date()}
            />
            <ErrorText error={errors.expiresAt} touched={touched.expiresAt} />

            {/* <Label>
              <span>Amount</span>
              <Input placeholder={100} className="mt-1" />
            </Label>
            <Label>
              <span>Discount</span>
              <Input placeholder={100} className="mt-1" />
            </Label>
            <Label>
              <span>Times</span>
              <Input placeholder="2x" className="mt-1" />
            </Label> */}
            <div className="mx-auto my-5">
              <Button disabled={isSubmitting} onClick={handleSubmit} block>
                Create
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default DiscountCode;
