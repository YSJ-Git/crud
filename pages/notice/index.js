import baseApiUrl from "../../utils/baseApiUrl";
import NoticeList from "../../components/Notice/NoticeList";

const NoticeData = ({ data }) => {
  return (
    <>
      <NoticeList data={data} />
    </>
  );
};

export async function getServerSideProps() {
  //Notice data
  const res = await fetch(`${baseApiUrl}/api/notices`);
  const data = await res.json();

  return {
    props: {
      data,
    },
  };
}

export default NoticeData;
