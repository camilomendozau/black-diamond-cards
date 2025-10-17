import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import Loader from "./Loader";

// 👇 Importa el worker como URL (nota el `?url`)
import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

GlobalWorkerOptions.workerSrc = workerSrc;

export default function PDFViewer({ src }) {
  const canvasRef = useRef(null);
  const [isLoading,setIsLoading] = useState(true);
  useEffect(() => {
    const loadPdf = async () => {
      const loadingTask = getDocument(src);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      const screenWidth = window.innerWidth;

      const viewport = page.getViewport({ scale: 1 });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
    };

    loadPdf()
      .then(() => setIsLoading(false))
      .catch(console.error);
  }, [src]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Loader isLoading={isLoading} />
      <canvas ref={canvasRef}>
      </canvas>
    </div>
  );
}
