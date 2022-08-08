import baseApiUrl from "../../utils/baseApiUrl";
import NoticeList from "../../components/Notice/NoticeList";
import Pagination from "../../components/Notice/Pagination";
import qs from "qs";

const NoticeData = ({ data }) => {
  return (
    <>
      <NoticeList data={data} page={data.meta.pagination} />
      <Pagination page={data.meta.pagination} />
    </>
  );
};

export async function getServerSideProps(ctx) {
  //console.log("쿼리??: ", ctx.query === false);
  let pageNum = 1;
  if (!ctx.query === false) {
    pageNum = ctx.query.page;
  }
  const query = qs.stringify(
    {
      pagination: {
        page: pageNum,
        pageSize: 10,
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
  //console.log("DATA: ",data);

  return {
    props: {
      data,
    },
  };
}

export default NoticeData;
