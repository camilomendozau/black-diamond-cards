import analytics from "../scripts/analytics"

export default function DownloaderButton({src}){
  const [fileName, fileType] = src.split('/').pop().split('.');  
  const trackDownload = () => analytics.trackDownload(fileName, fileType);
    return(
        <a href={src} download={true} title="download" className="bg-amber-300 p-2 rounded-full bottom-1.5 download" onClick={trackDownload}>
          {/* <i className="fas fa-file-download clickable" /> */}
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download-icon lucide-download w-7 h-7"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
        </a>
    )
}