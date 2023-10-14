import React from "react";
import "react-pdf/dist/esm/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";

// Configure the worker URL for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfUrl }) => {
  return (
    <div>
      <Document
        file={pdfUrl}
        options={{ workerSrc: pdfjs.GlobalWorkerOptions.workerSrc }}
      >
        <Page pageNumber={1} renderTextLayer={false} />
      </Document>
    </div>
  );
};

export default PDFViewer;
