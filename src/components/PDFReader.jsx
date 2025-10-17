import React, { useState } from "react";
import Loader from "./Loader";
import { Document, Page, pdfjs } from "react-pdf";
import ControlPanel from "./ControlPanel";
import "../styles/global.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFReader({ src }) {
  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsLoading(false);
  }
  return (
    <div>
      <Loader isLoading={isLoading} />
      <div
        id="pdf-section"
        className="flex flex-col items-center justify-center p-2 mb-10"
      >
        {isLoading ? null : (
          <ControlPanel
            scale={scale}
            setScale={setScale}
            numPages={numPages}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            file={src}
          />
        )}
        <Document
          file={src}
          onLoadSuccess={onDocumentLoadSuccess}
          className="border-2 border-green-700"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            width={window.innerWidth > 768 ? null : window.innerWidth * 0.9}
          />
        </Document>
      </div>
    </div>
  );
}