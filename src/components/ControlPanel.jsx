import React from "react";
// import PDFPrinter from './PDFPrinter';

export default function ControlPanel(props) {
  const { file, pageNumber, numPages, setPageNumber, scale, setScale } = props;

  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber === numPages;

  const firstPageClass = isFirstPage ? "disabled" : "clickable";
  const lastPageClass = isLastPage ? "disabled" : "clickable";

  const goToFirstPage = () => {
    if (!isFirstPage) setPageNumber(1);
  };
  const goToPreviousPage = () => {
    if (!isFirstPage) setPageNumber(pageNumber - 1);
  };
  const goToNextPage = () => {
    if (!isLastPage) {
      setPageNumber(pageNumber + 1);
    }
  };
  const goToLastPage = () => {
    if (!isLastPage) setPageNumber(numPages);
  };

  const onPageChange = (e) => {
    const { value } = e.target;
    setPageNumber(Number(value));
  };

  const isMinZoom = scale < 0.6;
  const isMaxZoom = scale >= 2.0;

  const zoomOutClass = isMinZoom ? "disabled" : "clickable";
  const zoomInClass = isMaxZoom ? "disabled" : "clickable";

  const zoomOut = () => {
    if (!isMinZoom) setScale(scale - 0.1);
  };

  const zoomIn = () => {
    if (!isMaxZoom) setScale(scale + 0.1);
  };

  return (
    <div className="w-full d-flex justify-content-between align-items-center p-2 bg-zinc-800 bg-opacity-75 border-b border-gray-300">
      <div className="flex flex-row justify-around m-2">
        <button
            type="button"
            onClick={goToPreviousPage}
            class="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 active:bg-green-700"
          >
            <svg
              class="w-7 h-7"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 5H1m0 0l4 4M1 5l4-4"
              />
            </svg>
            <span class="sr-only">Icon description</span>
          </button>
        <button
          type="button"
          onClick={goToNextPage} //hover:from-[#33af25] hover:via-[#47bd38] hover:to-green-600
          class="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 active:bg-green-700"
        >
          <svg
            class="w-7 h-7"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
          <span class="sr-only">Icon description</span>
        </button>
      </div>
      <div className="d-flex justify-content-between align-items-baseline">
        <div className="d-flex direction-row align-text-bottom text-amber-50">
          <span className="font-bold text-2xl">
            Pagina{" "}
            <input
              name="pageNumber"
              type="number"
              min={1}
              max={numPages || 1}
              className="p-0 pl-1 mx-2"
              value={pageNumber}
              onChange={onPageChange}
            />{" "}
            de {numPages}
          </span>
          <i
            className={`fas fa-forward mx-3 ${lastPageClass}`}
            onClick={goToNextPage}
          />
          <i
            className={`fas fa-fast-forward mx-3 ${lastPageClass}`}
            onClick={goToLastPage}
          />
        </div>
        {/* <div className="d-flex justify-content-between align-items-baseline">
          <i
            className={`fas fa-search-minus mx-3 ${zoomOutClass}`}
            onClick={zoomOut}
          />
          <span>{(scale * 100).toFixed()}%</span>
          <i
            className={`fas fa-search-plus mx-3 ${zoomInClass}`}
            onClick={zoomIn}
          />
        </div> */}
      </div>
      <div className="mx-3">
        <a href="/assets/docs/file-sample.pdf" download={true} title="download">
          <i className="fas fa-file-download clickable" />
        </a>
      </div>
      {/* <div className="mx-3">
        <PDFPrinter file={file} />
      </div> */}
    </div>
  );
}
