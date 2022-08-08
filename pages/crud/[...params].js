import baseApiUrl from "../../utils/baseApiUrl";
import NoticeList from "../../components/Notice/NoticeList";
import qs from "qs";
import { useRouter } from "next/router";

const NoticeDataParam = ({ data }) => {
  const router = useRouter();
  //console.log("라우터: ", router);
  return (
    <>
      <NoticeList data={data} />
    </>
  );
};

export async function getServerSideProps(ctx) {
  const query = qs.stringify(
    {
      pagination: {
        page: 1,
        pageSize: 5,
      },
      sort: ["createdAt:desc"],
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );

  //Notice data
  const res = await fetch(`${baseApiUrl}/api/notices?${query}`);
  const data = await res.json();

  return {
    props: {
      data,
    },
  };
}

export default NoticeDataParam;
