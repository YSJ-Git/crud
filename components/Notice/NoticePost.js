import { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { Formik, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import baseApiUrl from "../../utils/baseApiUrl";
import axios from "axios";

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

const NoticePostComp = () => {
  const quillRef = useRef(null);
  const FILE_SIZE = 50 * 1024 * 1024; //50mb
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
      console.log("이미지url: ", imgUrl);

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

  const postNotice = async (data) => {
    const formData = new FormData();
    const { file, ...rest } = data;
    formData.append("files.file", data.file);
    formData.append("data", JSON.stringify(rest));
    axios.post(`${baseApiUrl}/api/notices`, formData, {
      headers: { "content-type": "multipart/form-data" },
    });
  };
  return (
    <>
      <Formik
        initialValues={{ title: "", content: "", writer: "", file: [] }}
        validationSchema={Yup.object({
          title: Yup.string()
            .max(30, "30자 이하로 입력해주세요.")
            .required("Required"),
          writer: Yup.string().max(30, "30자 이하로 입력해주세요."),
          content: Yup.string().max(500, "500자 이하로 입력해주세요."),
          file: Yup.mixed()
            .nullable()
            .test(
              "fileSize",
              "파일크기는 50MB 이하로 업로드 해주세요.",
              (value) => {
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

                // if (value.length === 0) {
                //   return true;
                // } else {
                //   value && SUPPORTED_FORMATS.includes(value.type);
                // }
              }
            ),
        })}
        onSubmit={(values) => {
          postNotice(values);
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="title">제목</label>
            <input
              id="title"
              name="title"
              type="text"
              {...formik.getFieldProps("title")}
            />
            <ErrorMessage name="title" />
            <label htmlFor="writer">작성자</label>
            <input
              id="writer"
              name="writer"
              type="text"
              {...formik.getFieldProps("writer")}
            />
            <ErrorMessage name="writer" />
            <label htmlFor="content">내용</label>
            <Field name="content" {...formik.getFieldProps("content")}>
            
              {({ field }) => (
                <QuillWrapper
                  //value={field.value}
                  onChange={field.onChange(field.name)}
                  modules={modules}
                  forwardedRef={quillRef}
                />
              )}
            </Field>
            {/* <input
              id="content"
              name="content"
              type="text"
              {...formik.getFieldProps("content")}
            /> */}
            <ErrorMessage name="content" />
            <label htmlFor="file">이미지 업로드</label>
            <input
              id="file"
              name="file"
              type="file"
              onChange={(event) => {
                formik.setFieldValue("file", event.currentTarget.files[0]);
              }}
            />
            <ErrorMessage name="file" />
            <button type="submit">글쓰기</button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default NoticePostComp;
