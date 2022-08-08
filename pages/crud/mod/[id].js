import NoticeModComp from "../../../components/Notice/NoticeMod";
import baseApiUrl from "../../../utils/baseApiUrl";

const NoticeMod = ({ data }) => {
  return (
    <>
      <NoticeModComp {...data} />
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
      data: {
        noticeView: noticeData,
        page: context.query.page,
      },
    },
  };
}

export default NoticeMod;
