import baseApiUrl from "../../../utils/baseApiUrl";
import NoticeViewComp from "../../../components/Notice/NoticeView";

const NoticeView = ({ data }) => {
  return (
    <>
      <NoticeViewComp {...data} />
    </>
  );
};

export async function getServerSideProps(context) {
  //console.log("ctx:", context.query.page);
  //id에 맞는 공지사항 데이터 가져오기
  const { id } = context.query;
  const noticeRes = await fetch(`${baseApiUrl}/api/notices/${id}?populate=*`);
  const noticeData = await noticeRes.json();
  //console.log("!!", noticeData);

  return {
    props: {
      data: {
        noticeView: noticeData,
        page: context.query.page,
      },
    },
  };
}

export default NoticeView;
