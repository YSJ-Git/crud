import Link from "next/link";

const Pagination = (page) => {
  //console.log("페이지: ", page.page);
  const maxPage = parseInt(page.page.pageCount / 10);
  const currentPage = page.page.page;
  let startPage = 1;
  let lastPage = 1;
  if (parseInt(currentPage % 10) === 0) {
    startPage = currentPage - 9;
    lastPage = currentPage;
  } else {
    startPage = parseInt(currentPage / 10) * 10 + 1;
    if (parseInt(currentPage / 10) === maxPage) {
      lastPage = page.page.pageCount;
    } else {
      lastPage = parseInt(currentPage / 10) * 10 + 10;
    }
  }

  let tmpStart = startPage;
  const pageArr = [];
  while (tmpStart <= lastPage) {
    pageArr.push(tmpStart);
    tmpStart++;
  }
  //console.log("배열: ", pageArr);
  return (
    <>
      <ul className="flex justify-center mt-6">
        {pageArr.map((arr) => (
          <li
            key={arr}
            className={
              arr === currentPage ? "current pagination" : "pagination"
            }
          >
            <Link href={`/crud?page=${arr}`}>
              <a className="text-lg text-white border-b m-1">{arr}</a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Pagination;
