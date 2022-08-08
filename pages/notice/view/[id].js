import baseApiUrl from "../../../utils/baseApiUrl";
import NoticeViewComp from "../../../components/Notice/NoticeView";

const NoticeView = ({ noticeView }) => {
  return (
    <>
      <NoticeViewComp {...noticeView} />
    </>
  );
};

export async function getServerSideProps(context) {
  //id에 맞는 공지사항 데이터 가져오기
  const { id } = context.query;
  const noticeRes = await fetch(`${baseApiUrl}/api/notices/${id}?populate=*`);
  const noticeData = await noticeRes.json();

  return {
    props: {
      noticeView: noticeData,
    },
  };
}

export default NoticeView;
