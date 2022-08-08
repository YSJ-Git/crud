import Link from "next/link";
import ReactMarkdown from "react-markdown";
import fileDownload from "../../lib/fileDownload";
import "moment/locale/ko";
import moment from "moment";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import TopBar from "./TopBar";

const NoticeViewComp = (noticeData) => {
  console.log("??", noticeData);
  const noticeAttr = noticeData.noticeView.data.attributes;
  const date = moment(noticeAttr.createdAt).format("YYYY-MM-DD");
  const files = noticeAttr.file.data;
  return (
    <div className="crudView max-w-3xl mx-auto my-0 relative text-white">
      <TopBar />
      {/* 게시물 제목 */}
      <strong className="text-2xl bg-amber-300 block text-black p-2">
        {noticeAttr.title}
      </strong>
      {/* 게시물 내용 */}
      {noticeAttr.content && (
        <div className="bg-white p-2 text-black border-4 border-black border-t-0">
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                <img
                  style={{ maxWidth: "100%" }}
                  {...props}
                  src={node.properties.src}
                />
              ),
              u: ({ node, ...props }) => (
                <span style={{ textDecoration: "underline" }} {...props} />
              ),
            }}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {noticeAttr.content}
          </ReactMarkdown>
          {/* 게시물 첨부파일 */}
          <ul className="pt-2 border-t border-gray-300">
            {files &&
              files.map((fileList) => (
                <li key={fileList.id}>
                  <button
                    onClick={() =>
                      fileDownload(
                        fileList.attributes.url,
                        fileList.attributes.caption
                      )
                    }
                    className="flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>{fileList.attributes.name}</span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between py-1">
        {/* 게시물 작성자 */}
        {noticeAttr.writer && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline-block mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>{noticeAttr.writer}</span>
          </div>
        )}
        {/* 게시물 생성날짜 */}
        <p>{date}</p>
      </div>
      <div className="flex justify-center mt-4">
        <Link href={`/crud?page=${noticeData.page}`}>
          <a className="bg-pink-500 w-24 inline-block text-center py-2">목록</a>
        </Link>
      </div>
    </div>
  );
};

export default NoticeViewComp;
