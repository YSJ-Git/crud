import { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import { Formik, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import baseApiUrl from "../../utils/baseApiUrl";
import axios from "axios";
import Swal from "sweetalert2";
import TopBar from "./TopBar";

import "react-quill/dist/quill.snow.css";

const QuillWrapper = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return function comp({ forwardedRef, ...props }) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false }
);

const NoticePostComp = (noticeData) => {
  const router = useRouter();
  //console.log("!!", noticeData);
  const quillRef = useRef(null);
  const noticeAttr = noticeData.noticeView.data.attributes;
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

  const handleImage = () => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    document.body.appendChild(input);

    input.click();

    input.onchange = async (e) => {
      const [file] = input.files;

      //strapi 업로드 후 이미지 url 받아오기
      //console.log("file: ", e.target.files[0]);
      const formData = new FormData();
      formData.append("files", e.target.files[0]);
      const imgUrl = await axios
        .post(`${baseApiUrl}/api/upload/`, formData, {
          headers: { "content-type": "multipart/form-data" },
        })
        .then(function (response) {
          //console.log("리스펀스: ", response.data[0].url);
          return response.data[0].url;
        });
      //console.log("이미지url: ", imgUrl);

      // 현재 커서 위치에 이미지를 삽입하고 커서 위치를 +1 하기
      const range = quillRef.current.getEditor().getSelection();
      quillRef.current.getEditor().insertEmbed(range.index, "image", imgUrl);
      quillRef.current.getEditor().setSelection(range.index + 1);
      document.body.querySelector(":scope > input").remove();
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          [{ script: "sub" }, { script: "super" }],
          ["link", "image", "video"],
        ],
        clipboard: {
          // toggle to add extra line breaks when pasting HTML:
          matchVisual: false,
        },
        handlers: { image: handleImage },
      },
    }),
    []
  );
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

                // if (
                //   value.length &&
                //   (value.length === 0 || value.length === undefined)
                // ) {
                //   console.log("결과: ", value.size <= FILE_SIZE);
                //   return true;
                // } else {
                //   value.size <= FILE_SIZE;
                // }
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
                // if (
                //   (value.length && value.length === 0) ||
                //   value.length === undefined
                // ) {
                //   return true;
                // } else {
                //   value && SUPPORTED_FORMATS.includes(value.type);
                // }
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
            <Field name="content" {...formik.getFieldProps("content")}>
              {({ field }) => (
                <QuillWrapper
                  //value={field.value}
                  onChange={field.onChange(field.name)}
                  modules={modules}
                  forwardedRef={quillRef}
                  className="bg-white"
                />
              )}
            </Field>
            {/* <input
              id="content"
              name="content"
              type="text"
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
