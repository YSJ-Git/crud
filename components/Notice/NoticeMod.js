import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Formik, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import baseApiUrl from "../../utils/baseApiUrl";
import axios from "axios";
import Swal from "sweetalert2";
import TopBar from "./TopBar";
import MenuBar from "./MenuBar";

const NoticePostComp = (noticeData) => {
  const router = useRouter();
  //console.log("!!", noticeData);
  const noticeAttr = noticeData.noticeView.data.attributes;
  const [contentValue, setContentValue] = useState(noticeAttr.content);
  const files = noticeAttr.file.data;
  //console.log("파일: ", files);
  const FILE_SIZE = 1 * 1024 * 1024; //1mb
  // 가능한 확장자
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png",
  ];

  const contentChange = (content) => {
    setContentValue(content);
  };

  const putNotice = async (data) => {
    const formData = new FormData();
    const { file, ...rest } = data;
    formData.append("files.file", data.file);
    formData.append("data", JSON.stringify(rest));
    axios
      .put(
        `${baseApiUrl}/api/notices/${noticeData.noticeView.data.id}`,
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      )
      .then((res) => {
        Swal.fire({
          title: "수정이 완료되었습니다.",
          text: "Modify Success",
          icon: "success",
          confirmButtonText: "확인",
        });
        router.push(
          `/crud/view/${noticeData.noticeView.data.id}?page=${noticeData.page}`
        );
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  };

  return (
    <div className="relative max-w-3xl mx-auto my-0">
      <TopBar />
      <Formik
        enableReinitialize={true}
        initialValues={{
          title: `${noticeAttr.title}`,
          content: `${noticeAttr.content}`,
          writer: `${noticeAttr.writer}`,
          file: [],
        }}
        validationSchema={Yup.object({
          title: Yup.string()
            .max(30, "30자 이하로 입력해주세요.")
            .required("제목을 반드시 입력해주세요."),
          writer: Yup.string().max(30, "작성자는 30자 이하로 입력해주세요."),
          content: Yup.string().max(500, "500자 이하로 입력해주세요."),
          file: Yup.mixed()
            .nullable()
            .test(
              "fileSize",
              "파일크기는 1MB 이하로 업로드 해주세요.",
              // (value) => value && value.size <= FILE_SIZE
              (value) => {
                //console.log("VALUE: ", value);
                if (value && value.length) {
                  value.size <= FILE_SIZE;
                } else {
                  return true;
                }
              }
            )
            .test(
              "fileFormat",
              "이미지 확장자는 jpg, jpeg, gif, png 가능합니다.",
              (value) => {
                if (value && value.length) {
                  value && SUPPORTED_FORMATS.includes(value.type);
                } else {
                  return true;
                }
              }
            ),
        })}
        onSubmit={(values) => {
          putNotice(values);
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="title" className="hidden">
              제목
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="text-2xl bg-amber-300 block text-black p-2 w-full"
              {...formik.getFieldProps("title")}
            />
            <ErrorMessage name="title">
              {(msg) => <div className="bg-white text-red-600 p-2">{msg}</div>}
            </ErrorMessage>
            <label htmlFor="content" className="hidden">
              내용
            </label>
            <div className="tiptab bg-white p-2">
              <MenuBar content={contentValue} onChange={contentChange} />
            </div>
            <div className="field hidden">
              <Field
                id="content"
                name="content"
                value={formik.values.content}
                onChange={(formik.values.content = contentValue)}
                {...formik.getFieldProps("content")}
              ></Field>
            </div>
            {/* <input
              id="content"
              name="content"
              type="text"
              value={contentValue}
              {...formik.getFieldProps("content")}
            /> */}
            {formik.errors.content && (
              <div className="bg-white text-red-600 p-2">
                {formik.errors.content}
              </div>
            )}
            {/* <ErrorMessage name="content">
              {(msg) => <div className="bg-white text-red-600 p-2">{msg}</div>}
            </ErrorMessage>*/}
            <div className="py-4">
              <label htmlFor="file" className="pr-2 text-white">
                이미지 업로드
              </label>
              <input
                id="file"
                name="file"
                type="file"
                className="text-white"
                onChange={(event) => {
                  formik.setFieldValue("file", event.currentTarget.files[0]);
                }}
              />
              <ErrorMessage name="file">
                {(msg) => (
                  <div className="bg-white text-red-600 p-2 ml-2">{msg}</div>
                )}
              </ErrorMessage>
            </div>
            <label htmlFor="writer" className="hidden">
              작성자
            </label>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline-block mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#fff"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <input
                id="writer"
                name="writer"
                type="text"
                {...formik.getFieldProps("writer")}
              />
              <ErrorMessage name="writer">
                {(msg) => (
                  <div className="bg-white text-red-600 p-2 ml-2">{msg}</div>
                )}
              </ErrorMessage>
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="bg-pink-500 w-24 inline-block text-center py-2 text-white mr-2"
              >
                수정하기
              </button>
              <Link href="/crud/?page=1">
                <a className="bg-pink-500 w-24 inline-block text-center py-2 text-white">
                  취소
                </a>
              </Link>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default NoticePostComp;
