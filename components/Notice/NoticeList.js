import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import baseApiUrl from "../../utils/baseApiUrl";
import Swal from "sweetalert2";
import TopBar from "./TopBar";
import Sticker from "./Stickers";

const NoticeList = ({ data, page }) => {
  const router = useRouter();
  const deletePost = (e, id) => {
    e.preventDefault();
    axios
      .delete(`${baseApiUrl}/api/notices/${id}`, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then(function (response) {
        Swal.fire({
          title: "삭제가 완료되었습니다.",
          text: "Delete Success",
          icon: "success",
          confirmButtonText: "확인",
        });
        router.push(`/crud?page=${page.page}`);
      })
      .catch(function (error) {
        console.log("ERROR:", error);
        alert("게시물 삭제 중 에러가 발생하였습니다.");
      });
  };
  return (
    <div>
      <TopBar />
      <div className="relative max-w-3xl mx-auto my-0">
        <Sticker />
        <ul className="flex justify-center flex-col max-w-3xl mx-auto my-0 bg-pink-500	p-8 pr-56 border-x-black border-4	border-b-black border-t-stone-100 z-20 relative">
          {data.data.length === 0 ? (
            <div>데이터가 없습니다.</div>
          ) : (
            data.data.map((dataList) => (
              <li
                key={dataList.id}
                className="mb-4 rounded flex justify-between px-4 bg-amber-300	"
              >
                <Link href={`/crud/view/${dataList.id}?page=${page.page}`}>
                  <a className="truncate max-w-xl grow py-4 font-medium">
                    {dataList.attributes.title}
                  </a>
                </Link>
                <div className="flex items-center">
                  <Link href={`/crud/mod/${dataList.id}?page=${page.page}`}>
                    <a className="hover:bg-white rounded-lg p-1 group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 group-hover:stroke-cyan-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#666"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </a>
                  </Link>
                  <Link href={`/crud/view/${dataList.id}?page=${page.page}`}>
                    <a
                      className="hover:bg-white rounded-lg p-1 group"
                      onClick={(e) => deletePost(e, dataList.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 group-hover:stroke-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#666"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </a>
                  </Link>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default NoticeList;
